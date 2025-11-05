import { db } from '../db';
import { OFFSETS } from '../utils/date';
import dayjs from 'dayjs';
const supportsWebNotifications = 'Notification' in window;
export async function ensurePermission() {
    if (!supportsWebNotifications)
        return;
    if (Notification.permission === 'default') {
        try {
            await Notification.requestPermission();
        }
        catch { }
    }
}
export async function scheduleFor(product) {
    const expiration = dayjs(product.expirationDate);
    const now = dayjs();
    const plans = [];
    for (const d of OFFSETS) {
        const when = expiration.add(d, 'day').hour(9).minute(0).second(0);
        if (when.isAfter(now)) {
            plans.push({
                productId: product.id,
                offsetDays: d,
                scheduledAt: when.toISOString(),
                delivered: false
            });
        }
    }
    await db.plans.where('productId').equals(product.id).delete();
    if (plans.length)
        await db.plans.bulkAdd(plans);
}
export function startInTabScheduler() {
    setInterval(async () => {
        const now = dayjs();
        const due = await db.plans.where('delivered').equals(0).toArray();
        for (const p of due) {
            if (dayjs(p.scheduledAt).isBefore(now)) {
                const prod = await db.products.get(p.productId);
                if (prod && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification(p.offsetDays < 0 ? `Expire dans ${Math.abs(p.offsetDays)}j` : `Expire aujourd'hui`, { body: `${prod.name} – ${prod.expirationDate}` });
                }
                await db.plans.update(p.id, { delivered: true });
            }
        }
    }, 60000);
}
