import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { db } from '../db';
import { searchRecipesByIngredients } from '../services/spoonacular';
import RecipeList from '../components/RecipeList';
import { ChefHat, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
export default function RecipeIdeasScreen({ setCurrentScreen }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        loadProducts();
    }, []);
    async function loadProducts() {
        try {
            const allProducts = await db.products.toArray();
            setProducts(allProducts);
            // Automatically load recipes when products are loaded
            if (allProducts.length > 0) {
                await loadRecipes(allProducts);
            }
        }
        catch (err) {
            console.error('Error loading products:', err);
            setError('Erreur lors du chargement des produits');
        }
    }
    async function loadRecipes(productList) {
        setLoading(true);
        setError(null);
        try {
            const availableProducts = productList || products;
            if (availableProducts.length === 0) {
                setError('Ajoutez des aliments à votre inventaire pour obtenir des suggestions de recettes');
                setLoading(false);
                return;
            }
            // Extract ingredient names from products
            const ingredientNames = availableProducts.map(p => p.name.toLowerCase().trim());
            // Remove duplicates
            const uniqueIngredients = Array.from(new Set(ingredientNames));
            console.log('Searching recipes with ingredients:', uniqueIngredients);
            // Search for recipes
            const spoonacularRecipes = await searchRecipesByIngredients(uniqueIngredients, 20, // Get more recipes
            1, // Ranking: 1 = minimize missing ingredients
            true // Ignore pantry items
            );
            // Convert Spoonacular recipes to our Recipe type
            const convertedRecipes = spoonacularRecipes.map((r) => ({
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
            }));
            setRecipes(convertedRecipes);
            if (convertedRecipes.length === 0) {
                setError('Aucune recette trouvée avec vos ingrédients. Essayez d\'ajouter plus d\'aliments à votre inventaire.');
            }
        }
        catch (err) {
            console.error('Error loading recipes:', err);
            if (err instanceof Error) {
                if (err.message.includes('API key not configured')) {
                    setError('Configuration requise : Veuillez ajouter votre clé API Spoonacular dans le fichier .env.local');
                }
                else if (err.message.includes('quota exceeded')) {
                    setError('Quota API dépassé. Le plan gratuit permet 50 recherches par jour. Réessayez demain.');
                }
                else {
                    setError(`Erreur : ${err.message}`);
                }
            }
            else {
                setError('Erreur lors de la recherche de recettes');
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleRefresh = () => {
        loadRecipes();
    };
    return (_jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen pb-24", children: [_jsx("div", { className: "bg-white shadow-sm border-b border-purple-100", children: _jsx("div", { className: "max-w-4xl mx-auto px-6 py-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl", children: _jsx(ChefHat, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Id\u00E9es recettes" }), _jsxs("p", { className: "text-sm text-gray-600", children: [products.length, " ingr\u00E9dient", products.length > 1 ? 's' : '', " disponible", products.length > 1 ? 's' : ''] })] })] }), _jsxs("button", { onClick: handleRefresh, disabled: loading || products.length === 0, className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${loading ? 'animate-spin' : ''}` }), _jsx("span", { className: "hidden sm:inline", children: "Actualiser" })] })] }) }) }), _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-6", children: [products.length === 0 && !loading && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm p-8 text-center", children: [_jsx("div", { className: "bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Sparkles, { className: "w-8 h-8 text-purple-600" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Commencez par ajouter des aliments" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Ajoutez des produits \u00E0 votre inventaire pour obtenir des suggestions de recettes personnalis\u00E9es" }), _jsx("button", { onClick: () => setCurrentScreen('add'), className: "px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium", children: "Ajouter un aliment" })] })), loading && (_jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx(RefreshCw, { className: "w-12 h-12 text-purple-600 animate-spin mb-4" }), _jsx("p", { className: "text-gray-600 text-lg", children: "Recherche de recettes..." }), _jsxs("p", { className: "text-gray-500 text-sm mt-2", children: ["Analyse de vos ", products.length, " ingr\u00E9dients disponibles"] })] })), error && !loading && (_jsxs("div", { className: "bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-4", children: [_jsx(AlertCircle, { className: "w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-red-900 mb-1", children: "Erreur" }), _jsx("p", { className: "text-red-700 text-sm", children: error }), error.includes('API key') && (_jsxs("div", { className: "mt-3 p-3 bg-white rounded-lg text-sm", children: [_jsx("p", { className: "font-medium text-gray-900 mb-2", children: "Configuration requise :" }), _jsxs("ol", { className: "list-decimal list-inside space-y-1 text-gray-700", children: [_jsxs("li", { children: ["Cr\u00E9ez un compte gratuit sur ", _jsx("a", { href: "https://spoonacular.com/food-api/console#Dashboard", target: "_blank", rel: "noopener noreferrer", className: "text-purple-600 hover:underline", children: "spoonacular.com" })] }), _jsx("li", { children: "Copiez votre cl\u00E9 API" }), _jsxs("li", { children: ["Ajoutez-la dans le fichier ", _jsx("code", { className: "bg-gray-100 px-1 py-0.5 rounded", children: ".env.local" })] }), _jsx("li", { children: "Red\u00E9marrez le serveur de d\u00E9veloppement" })] })] }))] })] })), !loading && !error && recipes.length > 0 && (_jsxs("div", { children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold text-purple-600", children: recipes.length }), " recette", recipes.length > 1 ? 's' : '', " trouv\u00E9e", recipes.length > 1 ? 's' : ''] }), _jsx("p", { className: "text-sm text-gray-500", children: "Tri\u00E9es par correspondance avec vos ingr\u00E9dients" })] }), _jsx(RecipeList, { recipes: recipes })] }))] })] }));
}
