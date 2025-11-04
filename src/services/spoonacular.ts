/**
 * Spoonacular API Integration
 * Documentation: https://spoonacular.com/food-api/docs
 * Free tier: 50 requests per day
 */

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
const BASE_URL = 'https://api.spoonacular.com'

export interface SpoonacularRecipe {
  id: number
  title: string
  image: string
  imageType?: string
  usedIngredientCount?: number
  missedIngredientCount?: number
  missedIngredients?: Array<{
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
  }>
  usedIngredients?: Array<{
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
  }>
  unusedIngredients?: any[]
  likes?: number
}

export interface RecipeDetails extends SpoonacularRecipe {
  readyInMinutes?: number
  servings?: number
  sourceUrl?: string
  summary?: string
  cuisines?: string[]
  dishTypes?: string[]
  diets?: string[]
  occasions?: string[]
  instructions?: string
  analyzedInstructions?: Array<{
    name: string
    steps: Array<{
      number: number
      step: string
      ingredients: Array<{
        id: number
        name: string
        localizedName: string
        image: string
      }>
      equipment: Array<{
        id: number
        name: string
        localizedName: string
        image: string
      }>
    }>
  }>
  extendedIngredients?: Array<{
    id: number
    aisle: string
    image: string
    consistency: string
    name: string
    nameClean: string
    original: string
    originalName: string
    amount: number
    unit: string
    meta: string[]
    measures: {
      us: {
        amount: number
        unitShort: string
        unitLong: string
      }
      metric: {
        amount: number
        unitShort: string
        unitLong: string
      }
    }
  }>
  spoonacularScore?: number
  healthScore?: number
  pricePerServing?: number
}

/**
 * Search for recipes based on available ingredients
 * Endpoint: GET /recipes/findByIngredients
 *
 * @param ingredients - Array of ingredient names from user's inventory
 * @param number - Number of recipes to return (default: 10, max: 100)
 * @param ranking - How to rank results: 1 (minimize missing ingredients) or 2 (maximize used ingredients)
 * @param ignorePantry - Whether to ignore typical pantry items (default: true)
 * @returns Array of recipes with ingredient match information
 */
export async function searchRecipesByIngredients(
  ingredients: string[],
  number: number = 10,
  ranking: 1 | 2 = 1,
  ignorePantry: boolean = true
): Promise<SpoonacularRecipe[]> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('Spoonacular API key not configured')
    throw new Error('API key not configured. Please add your Spoonacular API key to .env.local')
  }

  if (ingredients.length === 0) {
    return []
  }

  try {
    const ingredientsParam = ingredients.join(',')
    const url = new URL(`${BASE_URL}/recipes/findByIngredients`)
    url.searchParams.append('apiKey', API_KEY)
    url.searchParams.append('ingredients', ingredientsParam)
    url.searchParams.append('number', number.toString())
    url.searchParams.append('ranking', ranking.toString())
    url.searchParams.append('ignorePantry', ignorePantry.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key')
      } else if (response.status === 402) {
        throw new Error('API quota exceeded. Free tier allows 50 requests per day.')
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as SpoonacularRecipe[]
  } catch (error) {
    console.error('Error fetching recipes from Spoonacular:', error)
    throw error
  }
}

/**
 * Get detailed information about a specific recipe
 * Endpoint: GET /recipes/{id}/information
 *
 * @param recipeId - The Spoonacular recipe ID
 * @param includeNutrition - Whether to include nutrition data (default: false)
 * @returns Detailed recipe information
 */
export async function getRecipeDetails(
  recipeId: number,
  includeNutrition: boolean = false
): Promise<RecipeDetails> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('API key not configured. Please add your Spoonacular API key to .env.local')
  }

  try {
    const url = new URL(`${BASE_URL}/recipes/${recipeId}/information`)
    url.searchParams.append('apiKey', API_KEY)
    url.searchParams.append('includeNutrition', includeNutrition.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key')
      } else if (response.status === 402) {
        throw new Error('API quota exceeded')
      } else if (response.status === 404) {
        throw new Error('Recipe not found')
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data as RecipeDetails
  } catch (error) {
    console.error(`Error fetching recipe ${recipeId}:`, error)
    throw error
  }
}

/**
 * Search recipes with complex query
 * Endpoint: GET /recipes/complexSearch
 *
 * @param query - Natural language search query
 * @param number - Number of results (default: 10)
 * @returns Search results with recipes
 */
export async function searchRecipes(
  query: string,
  number: number = 10,
  cuisine?: string,
  diet?: string,
  intolerances?: string,
  includeIngredients?: string[]
): Promise<{ results: RecipeDetails[]; offset: number; number: number; totalResults: number }> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('API key not configured')
  }

  try {
    const url = new URL(`${BASE_URL}/recipes/complexSearch`)
    url.searchParams.append('apiKey', API_KEY)
    url.searchParams.append('query', query)
    url.searchParams.append('number', number.toString())
    url.searchParams.append('addRecipeInformation', 'true')

    if (cuisine) url.searchParams.append('cuisine', cuisine)
    if (diet) url.searchParams.append('diet', diet)
    if (intolerances) url.searchParams.append('intolerances', intolerances)
    if (includeIngredients && includeIngredients.length > 0) {
      url.searchParams.append('includeIngredients', includeIngredients.join(','))
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching recipes:', error)
    throw error
  }
}
