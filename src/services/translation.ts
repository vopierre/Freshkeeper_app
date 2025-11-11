/**
 * Service de traduction pour les recettes
 * Utilise LibreTranslate (gratuit, sans inscription)
 */

/**
 * Traduction basique anglais → français pour les termes culinaires
 * Utilisé comme fallback si l'API échoue
 */
const culinaryTranslations: Record<string, string> = {
  // Méthodes de cuisson
  'bake': 'cuire au four',
  'baked': 'cuit au four',
  'boil': 'bouillir',
  'boiled': 'bouilli',
  'fry': 'frire',
  'fried': 'frit',
  'grill': 'griller',
  'grilled': 'grillé',
  'roast': 'rôtir',
  'roasted': 'rôti',
  'steam': 'cuire à la vapeur',
  'steamed': 'cuit à la vapeur',
  'sauté': 'sauter',
  'sautéed': 'sauté',
  'simmer': 'mijoter',
  'simmered': 'mijoté',

  // Viandes
  'chicken': 'poulet',
  'beef': 'boeuf',
  'pork': 'porc',
  'lamb': 'agneau',
  'turkey': 'dinde',
  'duck': 'canard',
  'fish': 'poisson',
  'salmon': 'saumon',
  'tuna': 'thon',
  'shrimp': 'crevette',
  'prawns': 'crevettes',

  // Légumes
  'tomato': 'tomate',
  'tomatoes': 'tomates',
  'potato': 'pomme de terre',
  'potatoes': 'pommes de terre',
  'onion': 'oignon',
  'onions': 'oignons',
  'garlic': 'ail',
  'carrot': 'carotte',
  'carrots': 'carottes',
  'pepper': 'poivron',
  'peppers': 'poivrons',
  'mushroom': 'champignon',
  'mushrooms': 'champignons',
  'spinach': 'épinards',
  'lettuce': 'laitue',
  'cucumber': 'concombre',

  // Mots courants
  'with': 'avec',
  'and': 'et',
  'sauce': 'sauce',
  'salad': 'salade',
  'soup': 'soupe',
  'stew': 'ragoût',
  'recipe': 'recette',
  'easy': 'facile',
  'quick': 'rapide',
  'simple': 'simple',
  'healthy': 'sain',
  'delicious': 'délicieux',
}

/**
 * Traduction basique d'un titre de recette
 * Note : Cette fonction est limitée et ne remplace pas une vraie traduction
 */
export function translateRecipeTitle(englishTitle: string): string {
  let translatedTitle = englishTitle.toLowerCase()

  // Remplacer les mots connus
  Object.entries(culinaryTranslations).forEach(([en, fr]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi')
    translatedTitle = translatedTitle.replace(regex, fr)
  })

  // Capitaliser la première lettre
  translatedTitle = translatedTitle.charAt(0).toUpperCase() + translatedTitle.slice(1)

  return translatedTitle
}

/**
 * Traduction via LibreTranslate (gratuit, sans inscription)
 */
async function translateWithLibreTranslate(
  text: string,
  from: string = 'en',
  to: string = 'fr'
): Promise<string> {
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: from,
      target: to,
      format: 'text'
    })
  })

  if (!response.ok) {
    throw new Error('LibreTranslate API error')
  }

  const data = await response.json()
  return data.translatedText || text
}

/**
 * Traduction principale avec fallback
 * 1. LibreTranslate (gratuit, sans inscription)
 * 2. Dictionnaire culinaire basique (si LibreTranslate échoue)
 */
export async function translateText(
  text: string,
  from: string = 'en',
  to: string = 'fr'
): Promise<string> {
  // Ne pas traduire si le texte est vide
  if (!text || text.trim().length === 0) {
    return text
  }

  // Essayer LibreTranslate
  try {
    const translated = await translateWithLibreTranslate(text, from, to)
    console.log(`✅ LibreTranslate: "${text}" → "${translated}"`)
    return translated
  } catch (error) {
    console.warn('LibreTranslate failed, using basic dictionary...', error)
  }

  // Fallback : dictionnaire basique
  const translated = translateRecipeTitle(text)
  console.log(`⚠️ Basic dictionary: "${text}" → "${translated}"`)
  return translated
}

/**
 * Traduction des instructions HTML
 */
export async function translateInstructions(htmlInstructions: string): Promise<string> {
  // Extraire le texte du HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlInstructions
  const textContent = tempDiv.textContent || tempDiv.innerText || ''

  // Traduire le texte
  const translatedText = await translateText(textContent)

  // Remettre dans un format HTML simple
  return `<p>${translatedText}</p>`
}
