import { jsx as _jsx } from "react/jsx-runtime";
import RecipeCard from './RecipeCard';
export default function RecipeList({ recipes, onRecipeClick }) {
    if (recipes.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: recipes.map((recipe) => (_jsx(RecipeCard, { recipe: recipe, onClick: () => onRecipeClick?.(recipe) }, recipe.id))) }));
}
