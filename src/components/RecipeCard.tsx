import type { Recipe } from '../types'
import { Clock, Users, ChefHat, ExternalLink } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const usedCount = recipe.usedIngredientCount || 0
  const missedCount = recipe.missedIngredientCount || 0
  const totalCount = usedCount + missedCount

  const matchPercentage = totalCount > 0 ? Math.round((usedCount / totalCount) * 100) : 0

  // Determine color based on match percentage
  const getMatchColor = () => {
    if (matchPercentage >= 80) return 'text-emerald-600 bg-emerald-50'
    if (matchPercentage >= 50) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getMatchBorderColor = () => {
    if (matchPercentage >= 80) return 'border-emerald-200'
    if (matchPercentage >= 50) return 'border-orange-200'
    return 'border-red-200'
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 ${getMatchBorderColor()} overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      {/* Recipe Image */}
      <div className="relative h-48 bg-gray-100">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Match Badge */}
        <div className={`absolute top-3 right-3 ${getMatchColor()} px-3 py-1.5 rounded-full font-semibold text-sm shadow-sm`}>
          {matchPercentage}% match
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          {recipe.readyInMinutes && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.readyInMinutes} min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} pers.</span>
            </div>
          )}
        </div>

        {/* Ingredients Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-600 font-medium">
              ✓ {usedCount} ingrédient{usedCount > 1 ? 's' : ''} disponible{usedCount > 1 ? 's' : ''}
            </span>
          </div>
          {missedCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                • {missedCount} ingrédient{missedCount > 1 ? 's' : ''} manquant{missedCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* View Recipe Link */}
        {recipe.sourceUrl && (
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Voir la recette</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}
