export type LocationKind = 'fridge' | 'freezer' | 'pantry'

export interface Product {
  id: string
  barcode?: string
  name: string
  brand?: string
  quantity?: string
  location: LocationKind
  expirationDate: string // ISO
  openedAt?: string
  photoDataUrl?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface NotificationPlan {
  id?: number
  productId: string
  offsetDays: number // -7, -3, -1, 0
  scheduledAt: string // ISO
  delivered: boolean
}

export type ExpirationKind = 'DLC' | 'DDM' | 'UNKNOWN'

export interface OcrDateResult {
  iso?: string
  kind?: ExpirationKind
  raw?: string
  confidence?: number
}
