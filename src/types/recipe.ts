// Types pour l'API Spoonacular

export interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  imageType: string
  usedIngredientCount?: number
  missedIngredientCount?: number
  missedIngredients?: SpoonacularIngredient[]
  usedIngredients?: SpoonacularIngredient[]
  unusedIngredients?: SpoonacularIngredient[]
  likes?: number
}

export interface SpoonacularIngredient {
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

export interface SpoonacularRecipeDetails {
  id: number
  title: string
  image: string
  servings: number
  readyInMinutes: number
  sourceUrl: string
  sourceName?: string
  summary: string
  instructions: string
  extendedIngredients: SpoonacularDetailedIngredient[]
  healthScore?: number
  pricePerServing?: number
  cheap?: boolean
  vegan?: boolean
  vegetarian?: boolean
  glutenFree?: boolean
  dairyFree?: boolean
}

export interface SpoonacularDetailedIngredient {
  id: number
  name: string
  original: string
  amount: number
  unit: string
  measures: {
    metric: {
      amount: number
      unitShort: string
      unitLong: string
    }
    us: {
      amount: number
      unitShort: string
      unitLong: string
    }
  }
}
