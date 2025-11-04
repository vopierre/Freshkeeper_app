import type { Recipe } from '../types'
import RecipeCard from './RecipeCard'

interface RecipeListProps {
  recipes: Recipe[]
  onRecipeClick?: (recipe: Recipe) => void
}

export default function RecipeList({ recipes, onRecipeClick }: RecipeListProps) {
  if (recipes.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onRecipeClick?.(recipe)}
        />
      ))}
    </div>
  )
}
