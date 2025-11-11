import { useState, useEffect } from 'react'
import { ChevronRight, ChefHat, Clock, Users, ExternalLink, AlertCircle } from 'lucide-react'
import type { Screen } from '../App'
import { db } from '../db'
import { searchRecipesByIngredients, getRecipeDetails, type SpoonacularRecipe, type RecipeDetails } from '../services/spoonacular'

interface RecipesScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export default function RecipesScreen({ setCurrentScreen }: RecipesScreenProps) {
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([])

  useEffect(() => {
    loadIngredientsAndRecipes()
  }, [])

  async function loadIngredientsAndRecipes() {
    setLoading(true)
    setError('')

    try {
      // Récupérer tous les produits disponibles
      const products = await db.products.toArray()

      if (products.length === 0) {
        setError('Aucun produit dans votre frigo. Ajoutez des produits pour voir des suggestions de recettes !')
        setLoading(false)
        return
      }

      // Extraire les noms des produits comme ingrédients
      const ingredients = products.map(p => p.name)
      setAvailableIngredients(ingredients)

      // Rechercher des recettes
      const foundRecipes = await searchRecipesByIngredients(ingredients, 20)
      setRecipes(foundRecipes)

      if (foundRecipes.length === 0) {
        setError('Aucune recette trouvée avec vos ingrédients. Essayez d\'ajouter plus de produits !')
      }
    } catch (err) {
      console.error('Erreur:', err)
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          setError('Clé API non configurée. Ajoutez votre clé Spoonacular dans les paramètres.')
        } else if (err.message.includes('quota')) {
          setError('Quota API dépassé. Limite gratuite : 50 requêtes/jour.')
        } else {
          setError('Erreur lors de la recherche de recettes. Vérifiez votre connexion.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleRecipeClick(recipeId: number) {
    setLoading(true)
    try {
      const details = await getRecipeDetails(recipeId)
      setSelectedRecipe(details)
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err)
      setError('Impossible de charger les détails de la recette')
    } finally {
      setLoading(false)
    }
  }

  function handleBackToList() {
    setSelectedRecipe(null)
  }

  // Vue détails d'une recette
  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
            <span>Retour aux recettes</span>
          </button>

          <h1 className="text-2xl font-bold">{selectedRecipe.title}</h1>
        </div>

        {/* Image */}
        {selectedRecipe.image && (
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            className="w-full h-64 object-cover"
          />
        )}

        {/* Infos rapides */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex justify-around">
            {selectedRecipe.readyInMinutes && (
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                <p className="text-sm font-semibold">{selectedRecipe.readyInMinutes} min</p>
              </div>
            )}
            {selectedRecipe.servings && (
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto text-orange-500 mb-1" />
                <p className="text-sm font-semibold">{selectedRecipe.servings} portions</p>
              </div>
            )}
            {selectedRecipe.healthScore && (
              <div className="text-center">
                <div className="w-6 h-6 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">
                  {Math.round(selectedRecipe.healthScore)}
                </div>
                <p className="text-sm font-semibold">Score santé</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Ingrédients */}
          {selectedRecipe.extendedIngredients && selectedRecipe.extendedIngredients.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Ingrédients ({selectedRecipe.extendedIngredients.length})</h2>
              <ul className="space-y-2">
                {selectedRecipe.extendedIngredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-gray-700">{ing.original}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {selectedRecipe.instructions && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Instructions</h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
              />
            </div>
          )}

          {/* Instructions étape par étape si disponibles */}
          {selectedRecipe.analyzedInstructions && selectedRecipe.analyzedInstructions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Étapes</h2>
              <ol className="space-y-4">
                {selectedRecipe.analyzedInstructions[0].steps.map((step) => (
                  <li key={step.number} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <p className="text-gray-700 pt-1">{step.step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Lien vers la recette originale */}
          {selectedRecipe.sourceUrl && (
            <a
              href={selectedRecipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white rounded-xl p-4 font-semibold hover:bg-orange-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Voir la recette complète
            </a>
          )}
        </div>
      </div>
    )
  }

  // Vue liste des recettes
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 mb-4"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
          <span>Retour</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <ChefHat className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Recettes suggérées</h1>
        </div>
        <p className="text-sm opacity-90">
          Basées sur vos {availableIngredients.length} ingrédients disponibles
        </p>
      </div>

      <div className="p-6">
        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Erreur</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Recherche de recettes...</p>
          </div>
        )}

        {/* Liste des recettes */}
        {!loading && recipes.length > 0 && (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe.id)}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-32 h-32 object-cover flex-shrink-0"
                    />
                  )}

                  {/* Contenu */}
                  <div className="flex-1 p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {recipe.title}
                    </h3>

                    <div className="space-y-1 text-sm">
                      {recipe.usedIngredientCount !== undefined && (
                        <p className="text-green-600 font-semibold">
                          ✓ {recipe.usedIngredientCount} ingrédients disponibles
                        </p>
                      )}
                      {recipe.missedIngredientCount !== undefined && recipe.missedIngredientCount > 0 && (
                        <p className="text-gray-600">
                          + {recipe.missedIngredientCount} ingrédient{recipe.missedIngredientCount > 1 ? 's' : ''} manquant{recipe.missedIngredientCount > 1 ? 's' : ''}
                        </p>
                      )}
                      {recipe.likes !== undefined && recipe.likes > 0 && (
                        <p className="text-gray-500">
                          ❤️ {recipe.likes} j'aime
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Icône flèche */}
                  <div className="flex items-center pr-4">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton rafraîchir */}
        {!loading && recipes.length > 0 && (
          <button
            onClick={loadIngredientsAndRecipes}
            className="w-full mt-6 bg-white text-orange-600 border-2 border-orange-500 rounded-xl p-4 font-semibold hover:bg-orange-50 transition-colors"
          >
            🔄 Actualiser les suggestions
          </button>
        )}
      </div>
    </div>
  )
}
