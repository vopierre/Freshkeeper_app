import dayjs from 'dayjs'

export const OFFSETS = [-7, -3, -1, 0] as const

export function toISODate(d: Date): string {
  return dayjs(d).format('YYYY-MM-DD')
}

export function formatHuman(iso: string): string {
  return dayjs(iso).format('DD/MM/YYYY')
}
