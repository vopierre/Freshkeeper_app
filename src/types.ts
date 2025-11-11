export type LocationKind = 'fridge' | 'freezer' | 'pantry'
export type Screen = 'home' | 'scan' | 'add' | 'list' | 'ideas' | 'notifications'

export interface AppNotification {
  id: string
  productId: string
  productName: string
  type: 'urgent' | 'expiring-today' | 'expiring-tomorrow'
  message: string
  createdAt: string
  read: boolean
}

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

// Recipe-related types for Spoonacular integration
export interface RecipeIngredient {
  id: number
  amount: number
  unit: string
  unitLong: string
  unitShort: string
  aisle: string
  name: string
  original: string
  originalName: string
  meta: string[]
  image: string
}

export interface Recipe {
  id: number
  title: string
  image: string
  imageType?: string
  usedIngredientCount?: number
  missedIngredientCount?: number
  missedIngredients?: RecipeIngredient[]
  usedIngredients?: RecipeIngredient[]
  unusedIngredients?: RecipeIngredient[]
  likes?: number
  readyInMinutes?: number
  servings?: number
  sourceUrl?: string
  summary?: string
  cuisines?: string[]
  dishTypes?: string[]
  diets?: string[]
  instructions?: string
  spoonacularScore?: number
  healthScore?: number
}
