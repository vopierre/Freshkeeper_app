import Tesseract from 'tesseract.js';
const DATE_PATTERNS = [
    /\b([0-2]\d|3[0-1])[\/\.\-](0\d|1[0-2])[\/\.\-]((19|20)\d{2}|\d{2})\b/g,
    /\b(20\d{2}|19\d{2})[\/\.\-](0\d|1[0-2])[\/\.\-]([0-2]\d|3[0-1])\b/g
];
const DLC_HINTS = ['dlc', 'à consommer jusqu', 'use by', 'verbrauchsdatum', 'scad'];
const DDM_HINTS = ['ddm', 'à consommer de préférence avant', 'best before', 'preferibilmente'];
export async function extractDateFromImage(file) {
    const { data } = await Tesseract.recognize(file, 'fra+eng', { logger: _m => { } });
    const text = (data.text || '').toLowerCase();
    const cands = [];
    const hintScore = (DLC_HINTS.some(h => text.includes(h)) ? 2 : 0) + (DDM_HINTS.some(h => text.includes(h)) ? 1 : 0);
    const kind = DLC_HINTS.some(h => text.includes(h)) ? 'DLC' :
        DDM_HINTS.some(h => text.includes(h)) ? 'DDM' : 'UNKNOWN';
    for (const re of DATE_PATTERNS) {
        re.lastIndex = 0;
        const matches = [...text.matchAll(re)];
        for (const m of matches) {
            const norm = normalizeDate(m[0]);
            if (!norm)
                continue;
            const ts = Date.parse(norm);
            if (isNaN(ts))
                continue;
            const futureBonus = (ts > Date.now() && ts < new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 2) ? 1 : 0;
            cands.push({ iso: norm, kind, score: 10 + hintScore + futureBonus, ts, raw: m[0] });
        }
    }
    if (!cands.length)
        return {};
    cands.sort((a, b) => (b.score - a.score) || (a.ts - b.ts));
    const best = cands[0];
    const confidence = Math.min(1, 0.6 + (best.kind !== 'UNKNOWN' ? 0.2 : 0) + (best.ts > Date.now() ? 0.1 : 0));
    return { iso: best.iso, kind: best.kind, raw: best.raw, confidence };
}
function normalizeDate(raw) {
    const t = raw.trim().replace(/\s+/g, '');
    let m = t.match(/^([0-2]\d|3[0-1])[\/\.\-](0\d|1[0-2])[\/\.\-]((19|20)\d{2}|\d{2})$/);
    if (m) {
        let dd = m[1], mm = m[2], yyyy = m[3];
        if (yyyy.length === 2) {
            const yr = parseInt(yyyy, 10);
            yyyy = (yr <= 79 ? 2000 + yr : 1900 + yr).toString();
        }
        const iso = `${yyyy}-${mm}-${dd}`;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? null : iso;
    }
    m = t.match(/^(20\d{2}|19\d{2})[\/\.\-](0\d|1[0-2])[\/\.\-]([0-2]\d|3[0-1])$/);
    if (m) {
        const yyyy = m[1], mm = m[2], dd = m[3];
        const iso = `${yyyy}-${mm}-${dd}`;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? null : iso;
    }
    return null;
}
