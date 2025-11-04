import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { extractDateFromImage } from '../services/ocr';
export default function ScanExpiry({ onPick }) {
    const [status, setStatus] = useState('');
    const [preview, setPreview] = useState(undefined);
    const [suggestion, setSuggestion] = useState(null);
    async function onFile(e) {
        const f = e.target.files?.[0];
        if (!f)
            return;
        setPreview(URL.createObjectURL(f));
        setStatus('OCR en cours...');
        try {
            const res = await extractDateFromImage(f);
            if (res.iso) {
                setSuggestion({ iso: res.iso, raw: res.raw, confidence: res.confidence });
                setStatus('');
            }
            else {
                setStatus('Aucune date détectée.');
            }
        }
        catch (err) {
            console.error(err);
            setStatus('Erreur OCR');
        }
    }
    return (_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Scanner une date de p\u00E9remption" }), _jsx("input", { type: "file", accept: "image/*", capture: "environment", onChange: onFile }), preview && _jsx("img", { src: preview, style: { maxWidth: '100%', marginTop: 12, borderRadius: 8 } }), status && _jsx("p", { children: status }), suggestion && (_jsxs("div", { style: { marginTop: 8 }, children: [_jsxs("p", { children: ["Proposition : ", _jsx("b", { children: suggestion.iso }), " ", suggestion.raw ? `(extrait: ${suggestion.raw})` : ''] }), _jsx("button", { onClick: () => onPick(suggestion.iso), children: "Utiliser cette date" })] }))] }));
}
