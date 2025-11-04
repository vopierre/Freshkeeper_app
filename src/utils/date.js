import dayjs from 'dayjs';
export const OFFSETS = [-7, -3, -1, 0];
export function toISODate(d) {
    return dayjs(d).format('YYYY-MM-DD');
}
export function formatHuman(iso) {
    return dayjs(iso).format('DD/MM/YYYY');
}
