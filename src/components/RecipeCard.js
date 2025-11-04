import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, Users, ChefHat, ExternalLink } from 'lucide-react';
export default function RecipeCard({ recipe, onClick }) {
    const usedCount = recipe.usedIngredientCount || 0;
    const missedCount = recipe.missedIngredientCount || 0;
    const totalCount = usedCount + missedCount;
    const matchPercentage = totalCount > 0 ? Math.round((usedCount / totalCount) * 100) : 0;
    // Determine color based on match percentage
    const getMatchColor = () => {
        if (matchPercentage >= 80)
            return 'text-emerald-600 bg-emerald-50';
        if (matchPercentage >= 50)
            return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };
    const getMatchBorderColor = () => {
        if (matchPercentage >= 80)
            return 'border-emerald-200';
        if (matchPercentage >= 50)
            return 'border-orange-200';
        return 'border-red-200';
    };
    return (_jsxs("div", { className: `bg-white rounded-xl shadow-sm border-2 ${getMatchBorderColor()} overflow-hidden hover:shadow-md transition-shadow cursor-pointer`, onClick: onClick, children: [_jsxs("div", { className: "relative h-48 bg-gray-100", children: [recipe.image ? (_jsx("img", { src: recipe.image, alt: recipe.title, className: "w-full h-full object-cover", loading: "lazy" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsx(ChefHat, { className: "w-16 h-16 text-gray-300" }) })), _jsxs("div", { className: `absolute top-3 right-3 ${getMatchColor()} px-3 py-1.5 rounded-full font-semibold text-sm shadow-sm`, children: [matchPercentage, "% match"] })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-gray-900 text-lg mb-2 line-clamp-2", children: recipe.title }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600 mb-3", children: [recipe.readyInMinutes && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: [recipe.readyInMinutes, " min"] })] })), recipe.servings && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "w-4 h-4" }), _jsxs("span", { children: [recipe.servings, " pers."] })] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "flex items-center justify-between text-sm", children: _jsxs("span", { className: "text-emerald-600 font-medium", children: ["\u2713 ", usedCount, " ingr\u00E9dient", usedCount > 1 ? 's' : '', " disponible", usedCount > 1 ? 's' : ''] }) }), missedCount > 0 && (_jsx("div", { className: "flex items-center justify-between text-sm", children: _jsxs("span", { className: "text-gray-500", children: ["\u2022 ", missedCount, " ingr\u00E9dient", missedCount > 1 ? 's' : '', " manquant", missedCount > 1 ? 's' : ''] }) }))] }), recipe.sourceUrl && (_jsxs("a", { href: recipe.sourceUrl, target: "_blank", rel: "noopener noreferrer", className: "mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium", onClick: (e) => e.stopPropagation(), children: [_jsx("span", { children: "Voir la recette" }), _jsx(ExternalLink, { className: "w-4 h-4" })] }))] })] }));
}
