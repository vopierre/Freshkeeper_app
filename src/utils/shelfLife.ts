/**
 * Shelf Life Database for Fresh Produce and Food Items
 * Durée de conservation des aliments frais
 */

import type { LocationKind } from '../types'

export type FoodCategory =
  | 'fruit'
  | 'vegetable'
  | 'dairy'
  | 'meat'
  | 'fish'
  | 'bakery'
  | 'packaged'
  | 'other'

export interface ShelfLifeData {
  fridge: number    // Days in fridge
  freezer: number   // Days in freezer
  pantry: number    // Days at room temperature
}

/**
 * Base de données de durée de conservation (en jours)
 * Source: USDA FoodKeeper App et guides de conservation alimentaire
 */
export const SHELF_LIFE_DATABASE: Record<string, { category: FoodCategory; shelfLife: ShelfLifeData }> = {
  // FRUITS
  'pomme': { category: 'fruit', shelfLife: { fridge: 30, freezer: 365, pantry: 7 } },
  'pommes': { category: 'fruit', shelfLife: { fridge: 30, freezer: 365, pantry: 7 } },
  'banane': { category: 'fruit', shelfLife: { fridge: 7, freezer: 90, pantry: 5 } },
  'bananes': { category: 'fruit', shelfLife: { fridge: 7, freezer: 90, pantry: 5 } },
  'orange': { category: 'fruit', shelfLife: { fridge: 21, freezer: 180, pantry: 10 } },
  'oranges': { category: 'fruit', shelfLife: { fridge: 21, freezer: 180, pantry: 10 } },
  'fraise': { category: 'fruit', shelfLife: { fridge: 5, freezer: 365, pantry: 1 } },
  'fraises': { category: 'fruit', shelfLife: { fridge: 5, freezer: 365, pantry: 1 } },
  'raisin': { category: 'fruit', shelfLife: { fridge: 7, freezer: 365, pantry: 3 } },
  'raisins': { category: 'fruit', shelfLife: { fridge: 7, freezer: 365, pantry: 3 } },
  'kiwi': { category: 'fruit', shelfLife: { fridge: 14, freezer: 180, pantry: 5 } },
  'kiwis': { category: 'fruit', shelfLife: { fridge: 14, freezer: 180, pantry: 5 } },
  'poire': { category: 'fruit', shelfLife: { fridge: 7, freezer: 180, pantry: 5 } },
  'poires': { category: 'fruit', shelfLife: { fridge: 7, freezer: 180, pantry: 5 } },
  'pêche': { category: 'fruit', shelfLife: { fridge: 5, freezer: 180, pantry: 3 } },
  'pêches': { category: 'fruit', shelfLife: { fridge: 5, freezer: 180, pantry: 3 } },
  'avocat': { category: 'fruit', shelfLife: { fridge: 5, freezer: 120, pantry: 3 } },
  'avocats': { category: 'fruit', shelfLife: { fridge: 5, freezer: 120, pantry: 3 } },
  'mangue': { category: 'fruit', shelfLife: { fridge: 7, freezer: 180, pantry: 5 } },
  'mangues': { category: 'fruit', shelfLife: { fridge: 7, freezer: 180, pantry: 5 } },
  'ananas': { category: 'fruit', shelfLife: { fridge: 5, freezer: 180, pantry: 3 } },
  'citron': { category: 'fruit', shelfLife: { fridge: 30, freezer: 180, pantry: 7 } },
  'citrons': { category: 'fruit', shelfLife: { fridge: 30, freezer: 180, pantry: 7 } },
  'melon': { category: 'fruit', shelfLife: { fridge: 7, freezer: 180, pantry: 5 } },

  // LÉGUMES
  'tomate': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 90, pantry: 5 } },
  'tomates': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 90, pantry: 5 } },
  'carotte': { category: 'vegetable', shelfLife: { fridge: 30, freezer: 365, pantry: 3 } },
  'carottes': { category: 'vegetable', shelfLife: { fridge: 30, freezer: 365, pantry: 3 } },
  'salade': { category: 'vegetable', shelfLife: { fridge: 5, freezer: 0, pantry: 1 } },
  'laitue': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 0, pantry: 1 } },
  'concombre': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 90, pantry: 3 } },
  'concombres': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 90, pantry: 3 } },
  'poivron': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 180, pantry: 3 } },
  'poivrons': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 180, pantry: 3 } },
  'courgette': { category: 'vegetable', shelfLife: { fridge: 5, freezer: 90, pantry: 3 } },
  'courgettes': { category: 'vegetable', shelfLife: { fridge: 5, freezer: 90, pantry: 3 } },
  'aubergine': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 180, pantry: 3 } },
  'aubergines': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 180, pantry: 3 } },
  'brocoli': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 365, pantry: 1 } },
  'chou-fleur': { category: 'vegetable', shelfLife: { fridge: 7, freezer: 365, pantry: 2 } },
  'épinard': { category: 'vegetable', shelfLife: { fridge: 5, freezer: 365, pantry: 1 } },
  'épinards': { category: 'vegetable', shelfLife: { fridge: 5, freezer: 365, pantry: 1 } },
  'champignon': { category: 'vegetable', shelfLife: { fridge: 5, freezer: 90, pantry: 1 } },
  'champignons': { category: 'vegetable', shelfLife: { fridge: 5, freezer: 90, pantry: 1 } },
  'oignon': { category: 'vegetable', shelfLife: { fridge: 60, freezer: 180, pantry: 30 } },
  'oignons': { category: 'vegetable', shelfLife: { fridge: 60, freezer: 180, pantry: 30 } },
  'ail': { category: 'vegetable', shelfLife: { fridge: 90, freezer: 365, pantry: 60 } },
  'pomme de terre': { category: 'vegetable', shelfLife: { fridge: 60, freezer: 0, pantry: 60 } },
  'pommes de terre': { category: 'vegetable', shelfLife: { fridge: 60, freezer: 0, pantry: 60 } },

  // PRODUITS LAITIERS
  'lait': { category: 'dairy', shelfLife: { fridge: 7, freezer: 90, pantry: 0 } },
  'yaourt': { category: 'dairy', shelfLife: { fridge: 14, freezer: 60, pantry: 0 } },
  'yogourt': { category: 'dairy', shelfLife: { fridge: 14, freezer: 60, pantry: 0 } },
  'fromage': { category: 'dairy', shelfLife: { fridge: 30, freezer: 180, pantry: 0 } },
  'mozzarella': { category: 'dairy', shelfLife: { fridge: 7, freezer: 90, pantry: 0 } },
  'mozarella': { category: 'dairy', shelfLife: { fridge: 7, freezer: 90, pantry: 0 } },
  'parmesan': { category: 'dairy', shelfLife: { fridge: 60, freezer: 180, pantry: 0 } },
  'beurre': { category: 'dairy', shelfLife: { fridge: 90, freezer: 365, pantry: 0 } },
  'crème': { category: 'dairy', shelfLife: { fridge: 7, freezer: 60, pantry: 0 } },
  'œuf': { category: 'dairy', shelfLife: { fridge: 35, freezer: 0, pantry: 0 } },
  'œufs': { category: 'dairy', shelfLife: { fridge: 35, freezer: 0, pantry: 0 } },

  // VIANDES
  'poulet': { category: 'meat', shelfLife: { fridge: 2, freezer: 270, pantry: 0 } },
  'bœuf': { category: 'meat', shelfLife: { fridge: 3, freezer: 365, pantry: 0 } },
  'porc': { category: 'meat', shelfLife: { fridge: 3, freezer: 180, pantry: 0 } },
  'agneau': { category: 'meat', shelfLife: { fridge: 3, freezer: 270, pantry: 0 } },
  'viande hachée': { category: 'meat', shelfLife: { fridge: 2, freezer: 120, pantry: 0 } },
  'jambon': { category: 'meat', shelfLife: { fridge: 7, freezer: 60, pantry: 0 } },
  'saucisse': { category: 'meat', shelfLife: { fridge: 7, freezer: 60, pantry: 0 } },
  'saucisses': { category: 'meat', shelfLife: { fridge: 7, freezer: 60, pantry: 0 } },

  // POISSONS
  'saumon': { category: 'fish', shelfLife: { fridge: 2, freezer: 90, pantry: 0 } },
  'thon': { category: 'fish', shelfLife: { fridge: 2, freezer: 90, pantry: 0 } },
  'crevette': { category: 'fish', shelfLife: { fridge: 2, freezer: 180, pantry: 0 } },
  'crevettes': { category: 'fish', shelfLife: { fridge: 2, freezer: 180, pantry: 0 } },
  'poisson': { category: 'fish', shelfLife: { fridge: 2, freezer: 90, pantry: 0 } },

  // BOULANGERIE
  'pain': { category: 'bakery', shelfLife: { fridge: 7, freezer: 90, pantry: 3 } },
  'baguette': { category: 'bakery', shelfLife: { fridge: 2, freezer: 30, pantry: 1 } },
  'croissant': { category: 'bakery', shelfLife: { fridge: 2, freezer: 60, pantry: 1 } },
  'croissants': { category: 'bakery', shelfLife: { fridge: 2, freezer: 60, pantry: 1 } },
}

/**
 * Detect food category from product name
 */
export function detectFoodCategory(productName: string): { category: FoodCategory; shelfLife: ShelfLifeData } | null {
  const normalizedName = productName.toLowerCase().trim()

  // Exact match
  if (SHELF_LIFE_DATABASE[normalizedName]) {
    return SHELF_LIFE_DATABASE[normalizedName]
  }

  // Partial match (contains)
  for (const [key, value] of Object.entries(SHELF_LIFE_DATABASE)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value
    }
  }

  return null
}

/**
 * Calculate expiration date based on purchase date and storage location
 */
export function calculateExpirationDate(
  purchaseDate: string,
  productName: string,
  location: LocationKind
): string | null {
  const foodData = detectFoodCategory(productName)

  if (!foodData) {
    return null
  }

  const shelfLifeDays = foodData.shelfLife[location]

  if (shelfLifeDays === 0) {
    // This food shouldn't be stored in this location
    return null
  }

  const purchase = new Date(purchaseDate)
  const expiration = new Date(purchase)
  expiration.setDate(expiration.getDate() + shelfLifeDays)

  return expiration.toISOString().split('T')[0]
}

/**
 * Check if a product should use purchase date instead of expiration date
 */
export function shouldUsePurchaseDate(productName: string): boolean {
  const foodData = detectFoodCategory(productName)
  if (!foodData) return false

  // Fresh produce should use purchase date
  return foodData.category === 'fruit' ||
         foodData.category === 'vegetable' ||
         foodData.category === 'meat' ||
         foodData.category === 'fish' ||
         foodData.category === 'dairy' ||
         foodData.category === 'bakery'
}

/**
 * Get recommended storage location for a product
 */
export function getRecommendedLocation(productName: string): LocationKind | null {
  const foodData = detectFoodCategory(productName)
  if (!foodData) return null

  const { fridge, freezer, pantry } = foodData.shelfLife

  // Return location with longest shelf life
  if (fridge >= freezer && fridge >= pantry && fridge > 0) return 'fridge'
  if (freezer >= fridge && freezer >= pantry && freezer > 0) return 'freezer'
  if (pantry > 0) return 'pantry'

  return 'fridge' // Default
}

/**
 * Get shelf life information for display
 */
export function getShelfLifeInfo(productName: string, location: LocationKind): string | null {
  const foodData = detectFoodCategory(productName)
  if (!foodData) return null

  const days = foodData.shelfLife[location]

  if (days === 0) {
    return 'Non recommandé pour ce lieu'
  }

  if (days >= 365) {
    return `Environ ${Math.round(days / 365)} an(s)`
  }

  if (days >= 30) {
    return `Environ ${Math.round(days / 30)} mois`
  }

  return `${days} jour(s)`
}
