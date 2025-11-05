import { useState, useEffect } from 'react'
import type { Recipe, RecipeIngredient } from '../types'
import { getRecipeDetails, type RecipeDetails } from '../services/spoonacular'
import { X, Clock, Users, ChefHat, ExternalLink, Loader2, CheckCircle2, Circle } from 'lucide-react'

interface RecipeDetailViewProps {
  recipe: Recipe
  onClose: () => void
}

export default function RecipeDetailView({ recipe, onClose }: RecipeDetailViewProps) {
  const [details, setDetails] = useState<RecipeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRecipeDetails()
  }, [recipe.id])

  async function loadRecipeDetails() {
    setLoading(true)
    setError(null)

    try {
      const recipeDetails = await getRecipeDetails(recipe.id, false)
      setDetails(recipeDetails)
    } catch (err) {
      console.error('Error loading recipe details:', err)
      setError('Impossible de charger les détails de la recette')
    } finally {
      setLoading(false)
    }
  }

  // Remove HTML tags from summary
  const cleanSummary = (html?: string) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  }

  const usedIngredients = recipe.usedIngredients || []
  const missedIngredients = recipe.missedIngredients || []

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 flex-1 mx-4 line-clamp-1">
            {recipe.title}
          </h2>
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-purple-600" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto pb-8">
        {/* Hero Image */}
        {recipe.image && (
          <div className="relative h-64 bg-gray-100">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="px-6">
          {/* Title & Stats */}
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {recipe.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-gray-600">
              {recipe.readyInMinutes && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{recipe.readyInMinutes} minutes</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{recipe.servings} personnes</span>
                </div>
              )}
              {details?.healthScore && (
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Score santé: {Math.round(details.healthScore)}/100</span>
                </div>
              )}
            </div>

            {/* Diet Tags */}
            {details?.diets && details.diets.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {details.diets.map((diet) => (
                  <span
                    key={diet}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Chargement des détails...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Summary */}
          {details?.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {cleanSummary(details.summary)}
              </p>
            </div>
          )}

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingrédients</h2>

            {/* Ingredients you have */}
            {usedIngredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Vous avez ({usedIngredients.length})
                </h3>
                <div className="space-y-2">
                  {usedIngredients.map((ing: RecipeIngredient) => (
                    <div
                      key={ing.id}
                      className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{ing.name}</p>
                        <p className="text-sm text-gray-600">{ing.original}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients you need */}
            {missedIngredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
                  <Circle className="w-5 h-5" />
                  À acheter ({missedIngredients.length})
                </h3>
                <div className="space-y-2">
                  {missedIngredients.map((ing: RecipeIngredient) => (
                    <div
                      key={ing.id}
                      className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"
                    >
                      <Circle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{ing.name}</p>
                        <p className="text-sm text-gray-600">{ing.original}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All ingredients from details */}
            {details?.extendedIngredients && details.extendedIngredients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Liste complète
                </h3>
                <div className="space-y-2">
                  {details.extendedIngredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium capitalize">{ing.name}</p>
                        <p className="text-sm text-gray-600">{ing.original}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {details?.analyzedInstructions && details.analyzedInstructions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
              {details.analyzedInstructions.map((instruction, idx) => (
                <div key={idx} className="space-y-4">
                  {instruction.name && (
                    <h3 className="text-xl font-semibold text-gray-800">{instruction.name}</h3>
                  )}
                  <ol className="space-y-4">
                    {instruction.steps.map((step) => (
                      <li key={step.number} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                          {step.number}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-gray-700 leading-relaxed">{step.step}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {/* Instructions as text (fallback) */}
          {details?.instructions && !details?.analyzedInstructions && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {cleanSummary(details.instructions)}
                </p>
              </div>
            </div>
          )}

          {/* External Link Button */}
          {recipe.sourceUrl && (
            <div className="mt-8 text-center">
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                Voir la recette complète
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
