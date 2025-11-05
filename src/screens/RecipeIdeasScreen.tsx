import { useEffect, useState } from 'react'
import { db } from '../db'
import type { Recipe, Product, Screen } from '../types'
import { searchRecipesByIngredients, type SpoonacularRecipe } from '../services/spoonacular'
import RecipeList from '../components/RecipeList'
import RecipeDetailView from '../components/RecipeDetailView'
import { ChefHat, RefreshCw, AlertCircle, Sparkles } from 'lucide-react'

interface RecipeIdeasScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export default function RecipeIdeasScreen({ setCurrentScreen }: RecipeIdeasScreenProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const allProducts = await db.products.toArray()
      setProducts(allProducts)

      // Automatically load recipes when products are loaded
      if (allProducts.length > 0) {
        await loadRecipes(allProducts)
      }
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Erreur lors du chargement des produits')
    }
  }

  async function loadRecipes(productList?: Product[]) {
    setLoading(true)
    setError(null)

    try {
      const availableProducts = productList || products

      if (availableProducts.length === 0) {
        setError('Ajoutez des aliments à votre inventaire pour obtenir des suggestions de recettes')
        setLoading(false)
        return
      }

      // Extract ingredient names from products
      const ingredientNames = availableProducts.map(p => p.name.toLowerCase().trim())

      // Remove duplicates
      const uniqueIngredients = Array.from(new Set(ingredientNames))

      console.log('Searching recipes with ingredients:', uniqueIngredients)

      // Search for recipes
      const spoonacularRecipes = await searchRecipesByIngredients(
        uniqueIngredients,
        20, // Get more recipes
        1,  // Ranking: 1 = minimize missing ingredients
        true // Ignore pantry items
      )

      // Convert Spoonacular recipes to our Recipe type
      const convertedRecipes: Recipe[] = spoonacularRecipes.map((r: SpoonacularRecipe) => ({
        id: r.id,
        title: r.title,
        image: r.image,
        imageType: r.imageType,
        usedIngredientCount: r.usedIngredientCount,
        missedIngredientCount: r.missedIngredientCount,
        missedIngredients: r.missedIngredients,
        usedIngredients: r.usedIngredients,
        unusedIngredients: r.unusedIngredients,
        likes: r.likes
      }))

      setRecipes(convertedRecipes)

      if (convertedRecipes.length === 0) {
        setError('Aucune recette trouvée avec vos ingrédients. Essayez d\'ajouter plus d\'aliments à votre inventaire.')
      }
    } catch (err) {
      console.error('Error loading recipes:', err)
      if (err instanceof Error) {
        if (err.message.includes('API key not configured')) {
          setError('Configuration requise : Veuillez ajouter votre clé API Spoonacular dans le fichier .env.local')
        } else if (err.message.includes('quota exceeded')) {
          setError('Quota API dépassé. Le plan gratuit permet 50 recherches par jour. Réessayez demain.')
        } else {
          setError(`Erreur : ${err.message}`)
        }
      } else {
        setError('Erreur lors de la recherche de recettes')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadRecipes()
  }

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleCloseDetail = () => {
    setSelectedRecipe(null)
  }

  // Show detail view if a recipe is selected
  if (selectedRecipe) {
    return <RecipeDetailView recipe={selectedRecipe} onClose={handleCloseDetail} />
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Idées recettes</h1>
                <p className="text-sm text-gray-600">
                  {products.length} ingrédient{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading || products.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* No products message */}
        {products.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Commencez par ajouter des aliments
            </h2>
            <p className="text-gray-600 mb-6">
              Ajoutez des produits à votre inventaire pour obtenir des suggestions de recettes personnalisées
            </p>
            <button
              onClick={() => setCurrentScreen('add')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Ajouter un aliment
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Recherche de recettes...</p>
            <p className="text-gray-500 text-sm mt-2">
              Analyse de vos {products.length} ingrédients disponibles
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Erreur</h3>
              <p className="text-red-700 text-sm">{error}</p>
              {error.includes('API key') && (
                <div className="mt-3 p-3 bg-white rounded-lg text-sm">
                  <p className="font-medium text-gray-900 mb-2">Configuration requise :</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Créez un compte gratuit sur <a href="https://spoonacular.com/food-api/console#Dashboard" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">spoonacular.com</a></li>
                    <li>Copiez votre clé API</li>
                    <li>Ajoutez-la dans le fichier <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code></li>
                    <li>Redémarrez le serveur de développement</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipes list */}
        {!loading && !error && recipes.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-700">
                <span className="font-semibold text-purple-600">{recipes.length}</span> recette{recipes.length > 1 ? 's' : ''} trouvée{recipes.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-500">
                Triées par correspondance avec vos ingrédients
              </p>
            </div>
            <RecipeList recipes={recipes} onRecipeClick={handleRecipeClick} />
          </div>
        )}
      </div>
    </div>
  )
}
