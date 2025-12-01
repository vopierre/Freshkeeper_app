import * as pdfjsLib from 'pdfjs-dist'

// Configuration du worker PDF.js
// Utiliser le worker depuis node_modules pour éviter les problèmes de CORS
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export interface DetectedProduct {
  name: string
  quantity?: string
  price?: string
  confidence: number
}

// Liste de mots-clés courants dans les produits alimentaires
const FOOD_KEYWORDS = [
  // Produits laitiers
  'lait', 'yaourt', 'yogurt', 'yoghourt', 'fromage', 'beurre', 'beure', 'crème', 'creme', 'cream', 'cheese', 'milk', 'butter',
  'emmental', 'cheddar', 'mozzarella', 'camembert', 'gruyère', 'gruyere', 'parmesan',
  // Viandes et poissons
  'poulet', 'boeuf', 'bœuf', 'porc', 'jambon', 'saucisse', 'viande', 'poisson', 'saumon', 'thon', 'merguez',
  'chicken', 'beef', 'pork', 'ham', 'meat', 'fish', 'salmon', 'tuna', 'steak', 'escalope',
  // Fruits et légumes
  'pomme', 'banane', 'orange', 'tomate', 'salade', 'carotte', 'pomme de terre', 'patate', 'oignon',
  'apple', 'banana', 'orange', 'tomato', 'lettuce', 'carrot', 'potato', 'onion',
  'fraise', 'framboise', 'raisin', 'poire', 'pêche', 'peche', 'abricot', 'melon', 'pastèque', 'pasteque',
  'courgette', 'aubergine', 'poivron', 'concombre', 'haricot',
  // Féculents et pain/pâtisserie
  'pain', 'pâtes', 'pates', 'riz', 'farine', 'céréales', 'cereales', 'bread', 'pasta', 'rice', 'flour', 'cereal',
  'baguette', 'brioche', 'croissant', 'penne', 'spaghetti', 'tagliatelle',
  'gâche', 'gache', 'gaché', 'gachée', 'gachee', 'tranché', 'tranche', 'tranchee', 'tranchée', 'tranchés',
  'viennoiserie', 'pain de mie', 'pain complet', 'pain blanc', 'biscotte',
  // Boissons
  'eau', 'jus', 'coca', 'soda', 'bière', 'biere', 'vin', 'café', 'cafe', 'thé', 'the', 'limonade', 'sprite', 'fanta',
  'water', 'juice', 'cola', 'beer', 'wine', 'coffee', 'tea', 'mineral', 'gazéifiée', 'gazeifiee',
  // Condiments et conserves
  'huile', 'sel', 'poivre', 'sauce', 'ketchup', 'mayonnaise', 'moutarde', 'confiture', 'miel',
  'oil', 'salt', 'pepper', 'sauce', 'jam', 'honey', 'vinegar', 'vinaigre',
  // Surgelés et conserves
  'surgelé', 'surgele', 'congelé', 'congele', 'conserve', 'frozen', 'glace', 'ice cream', 'sorbet',
  // Snacks et desserts
  'chips', 'biscuit', 'cookie', 'gâteau', 'gateau', 'chocolat', 'chocolate', 'bonbon', 'candy',
  'cake', 'tarte', 'crêpe', 'crepe', 'pancake',
  // Autres
  'œuf', 'oeuf', 'egg', 'sucre', 'sugar', 'fécule', 'fecule', 'levure', 'yeast',
  // Marques connues (pour améliorer la détection)
  'danone', 'président', 'president', 'yoplait', 'nestlé', 'nestle', 'herta', 'fleury', 'charal',
  'bio', 'organic', 'frais', 'fresh',
  // Mots descriptifs communs
  'pur', 'pure', 'nature', 'naturel', 'complet', 'entier', 'demi'
]

/**
 * Extrait les produits d'un ticket de caisse PDF
 */
export async function extractProductsFromReceipt(file: File): Promise<DetectedProduct[]> {
  console.log('Démarrage de l\'extraction PDF...')

  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let allLines: string[] = []

    // Extraire le texte de toutes les pages avec position
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Grouper les items par ligne en fonction de leur position Y
      const itemsByLine: Map<number, any[]> = new Map()

      for (const item of textContent.items) {
        const y = Math.round((item as any).transform[5]) // Position Y
        if (!itemsByLine.has(y)) {
          itemsByLine.set(y, [])
        }
        itemsByLine.get(y)!.push(item)
      }

      // Trier par position Y (du haut vers le bas) puis X (gauche à droite)
      const sortedYPositions = Array.from(itemsByLine.keys()).sort((a, b) => b - a)

      for (const y of sortedYPositions) {
        const items = itemsByLine.get(y)!
        // Trier les items de la ligne par position X
        items.sort((a, b) => (a as any).transform[4] - (b as any).transform[4])
        const lineText = items.map((item: any) => item.str).join(' ')
        if (lineText.trim()) {
          allLines.push(lineText.trim())
        }
      }
    }

    const fullText = allLines.join('\n')
    console.log('Texte PDF extrait:', fullText)
    console.log('Nombre de lignes:', allLines.length)

    return parseReceiptText(fullText)
  } catch (error) {
    console.error('Erreur lors de l\'extraction du PDF:', error)
    throw new Error('Impossible de lire le fichier PDF. Assurez-vous qu\'il s\'agit d\'un PDF valide.')
  }
}

/**
 * Parse le texte d'un ticket pour extraire les produits
 */
function parseReceiptText(text: string): DetectedProduct[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  const products: DetectedProduct[] = []

  // Mots-clés de fin de ticket (arrêter l'analyse après ces mots)
  const endKeywords = ['total', 'sous-total', 'subtotal']

  // Mots-clés à ignorer (en-têtes, etc.)
  const ignoreKeywords = [
    'tva', 'vat', 'tax',
    'carte', 'especes', 'cash', 'card', 'ticket', 'facture',
    'merci', 'thank', 'bienvenue', 'welcome', 'date', 'heure',
    'caisse', 'cashier', 'siret', 'tel', 'adresse', 'address'
  ]

  // Patterns pour détecter les prix
  // Format standard: prix à la fin (ex: "Lait 2.50€")
  const pricePatternEnd = /(\d+[.,]\d{2})\s*€?$|€\s*(\d+[.,]\d{2})$/

  // Format Magasins U: prix suivi du code type (ex: "Lait 2.50 11")
  // Le code 11 indique un produit alimentaire
  const pricePatternWithCode = /(\d+[.,]\d{2})\s*€?\s+(\d{1,2})$/

  for (const line of lines) {
    const lowerLine = line.toLowerCase()

    // Arrêter l'analyse si on rencontre une ligne de total
    if (endKeywords.some(keyword => lowerLine.includes(keyword))) {
      console.log(`Arrêt de l'analyse après la ligne: "${line}"`)
      break
    }

    // Ignorer les lignes contenant des mots-clés à exclure
    if (ignoreKeywords.some(keyword => lowerLine.includes(keyword))) {
      continue
    }

    // Ignorer les lignes trop courtes (probablement pas des produits)
    if (line.length < 3) {
      continue
    }

    // Ignorer les lignes qui sont uniquement des nombres
    if (/^\d+$/.test(line)) {
      continue
    }

    // Vérifier d'abord le format Magasins U (prix + code type)
    let priceMatch = line.match(pricePatternWithCode)
    let productName = line
    let price: string | undefined
    let isFoodByCode = false

    if (priceMatch) {
      price = priceMatch[1]
      const typeCode = priceMatch[2]

      // Le code 11 indique un produit alimentaire dans les magasins U
      if (typeCode === '11') {
        isFoodByCode = true
      }

      // Retirer le prix et le code type de la ligne pour obtenir le nom du produit
      productName = line.replace(pricePatternWithCode, '').trim()
    } else {
      // Sinon, vérifier le format standard (prix à la fin)
      priceMatch = line.match(pricePatternEnd)

      if (priceMatch) {
        price = priceMatch[1] || priceMatch[2]
        // Retirer le prix de la ligne pour obtenir le nom du produit
        productName = line.replace(pricePatternEnd, '').trim()
      } else {
        // Format alternatif : prix n'importe où dans la ligne (pour Auchan, Carrefour, etc.)
        // Chercher un prix n'importe où : 2.50€ ou €2.50 ou 2,50
        const priceAnywherePattern = /(\d+[.,]\d{2})\s*€?|€\s*(\d+[.,]\d{2})/
        const anyPriceMatch = line.match(priceAnywherePattern)

        if (anyPriceMatch) {
          price = anyPriceMatch[1] || anyPriceMatch[2]
          // Retirer le prix de la ligne
          productName = line.replace(priceAnywherePattern, '').trim()
        }

        // Si pas de prix du tout, garder le nom complet
        // On filtrera ensuite par mots-clés alimentaires
      }
    }

    // Essayer d'extraire la quantité (ex: 2x, x3, 3 unités)
    const quantityPattern = /(\d+)\s*x|x\s*(\d+)|(\d+)\s+unit[ée]s?/i
    const quantityMatch = productName.match(quantityPattern)
    let quantity: string | undefined

    if (quantityMatch) {
      quantity = quantityMatch[1] || quantityMatch[2] || quantityMatch[3]
      productName = productName.replace(quantityPattern, '').trim()
    }

    // Nettoyer le nom du produit
    productName = cleanProductName(productName)

    // Ne garder que les lignes qui ressemblent à des produits
    if (productName.length >= 3 && !(/^[^a-zA-Z]+$/.test(productName))) {
      const confidence = calculateConfidence(productName, price, isFoodByCode)

      products.push({
        name: productName,
        quantity,
        price,
        confidence,
        // Stocker si c'est un aliment confirmé par le code type (Magasins U)
        isFoodByCode
      } as DetectedProduct & { isFoodByCode: boolean })
    }
  }

  console.log('Tous les produits détectés:', products)

  // Filtrer pour ne garder QUE les produits alimentaires
  // Accepter les produits avec code type 11 (Magasins U) OU qui contiennent des mots-clés alimentaires
  const foodProducts = products.filter((p: any) =>
    p.isFoodByCode || isFoodProduct(p.name)
  )

  console.log('Produits alimentaires détectés:', foodProducts)

  // Retourner uniquement les produits alimentaires
  return foodProducts
}

/**
 * Nettoie le nom d'un produit
 */
function cleanProductName(name: string): string {
  return name
    .replace(/[*]+/g, '') // Retirer les astérisques
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .trim()
}

/**
 * Vérifie si un nom de produit contient des mots-clés alimentaires
 * Amélioration: vérifie chaque mot individuellement avec des règles strictes
 */
function isFoodProduct(name: string): boolean {
  const lowerName = name.toLowerCase()
  const words = lowerName.split(/\s+/)

  // Vérifier si au moins un mot correspond à un mot-clé
  for (const word of words) {
    // Ignorer les mots trop courts (moins de 3 caractères) pour éviter les faux positifs
    if (word.length < 3) continue

    for (const keyword of FOOD_KEYWORDS) {
      // Ignorer les mots-clés trop courts pour la correspondance partielle
      if (keyword.length < 3) continue

      // Règles de correspondance :
      // 1. Correspondance exacte (le mot entier correspond au mot-clé)
      if (word === keyword) {
        console.log(`Mot-clé trouvé (exact): "${word}" = "${keyword}" dans "${name}"`)
        return true
      }

      // 2. Le mot contient le mot-clé (mais seulement si le mot-clé fait au moins 4 caractères)
      if (keyword.length >= 4 && word.includes(keyword)) {
        console.log(`Mot-clé trouvé (contient): "${word}" contient "${keyword}" dans "${name}"`)
        return true
      }

      // 3. Le mot-clé contient le mot (mais seulement si le mot fait au moins 4 caractères)
      if (word.length >= 4 && keyword.includes(word)) {
        console.log(`Mot-clé trouvé (contenu dans): "${word}" est dans "${keyword}" dans "${name}"`)
        return true
      }
    }
  }

  return false
}

/**
 * Calcule un score de confiance pour un produit détecté
 */
function calculateConfidence(name: string, price?: string, isFoodByCode?: boolean): number {
  let confidence = 0.3

  // Bonus maximal si confirmé par le code type (Magasins U code 11)
  if (isFoodByCode) {
    confidence += 0.6
  }
  // Sinon, bonus si c'est un produit alimentaire reconnu par mots-clés
  else if (isFoodProduct(name)) {
    confidence += 0.5  // Augmenté de 0.4 à 0.5
  }

  // Plus de confiance si on a un prix
  if (price) {
    confidence += 0.15
  }

  // Plus de confiance si le nom contient plusieurs mots (probablement un vrai produit)
  if (name.split(' ').length >= 2) {
    confidence += 0.1
  }

  // Plus de confiance si le nom contient des lettres minuscules (pas tout en majuscules)
  if (/[a-z]/.test(name)) {
    confidence += 0.05
  }

  return Math.min(confidence, 1)
}
