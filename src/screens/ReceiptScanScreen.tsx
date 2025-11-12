import { useState } from 'react'
import { ChevronRight, Loader2, CheckCircle, Refrigerator, Snowflake, Package } from 'lucide-react'
import PdfUploader from '../components/PdfUploader'
import { extractProductsFromReceipt, DetectedProduct } from '../services/receiptOcr'
import { db } from '../db'
import { v4 as uuid } from 'uuid'
import type { Product, LocationKind, Screen } from '../types'
import { scheduleFor } from '../services/notifications'
import dayjs from 'dayjs'
import { calculateExpirationDate } from '../utils/shelfLife'

interface ReceiptScanScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

interface ProductWithDate extends DetectedProduct {
  id: string
  expirationDate: string
  selected: boolean
}

export default function ReceiptScanScreen({ setCurrentScreen }: ReceiptScanScreenProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [products, setProducts] = useState<ProductWithDate[]>([])
  const [error, setError] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<LocationKind>('fridge')

  async function handlePdfSelected(file: File) {
    setIsScanning(true)
    setError('')
    setProducts([])

    try {
      const detectedProducts = await extractProductsFromReceipt(file)

      if (detectedProducts.length === 0) {
        setError('Aucun produit détecté. Assurez-vous que le PDF contient bien une liste de produits.')
        setIsScanning(false)
        return
      }

      // Convertir en ProductWithDate avec dates de péremption par défaut
      const productsWithDates: ProductWithDate[] = detectedProducts.map(p => ({
        ...p,
        id: uuid(),
        expirationDate: dayjs().add(7, 'day').format('YYYY-MM-DD'), // Date par défaut : +7 jours
        selected: true
      }))

      setProducts(productsWithDates)
    } catch (err) {
      console.error('Erreur lors de l\'extraction du ticket:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse du ticket. Veuillez réessayer.')
    } finally {
      setIsScanning(false)
    }
  }

  function updateProductDate(id: string, newDate: string) {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, expirationDate: newDate } : p
    ))
  }

  function toggleProductSelection(id: string) {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, selected: !p.selected } : p
    ))
  }

  async function handleSaveAll() {
    const selectedProducts = products.filter(p => p.selected)

    if (selectedProducts.length === 0) {
      setError('Veuillez sélectionner au moins un produit.')
      return
    }

    try {
      const now = new Date().toISOString()

      // Ajouter tous les produits sélectionnés à la base de données
      for (const p of selectedProducts) {
        const product: Product = {
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          location: selectedLocation,
          expirationDate: p.expirationDate,
          createdAt: now,
          updatedAt: now
        }

        await db.products.add(product)
        await scheduleFor(product)
      }

      // Retourner à l'écran d'accueil
      setCurrentScreen('home')
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des produits:', err)
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.')
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-gray-700"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Importer un ticket PDF</h1>
          <div className="w-8"></div>
        </div>

        {/* Instructions */}
        {!isScanning && products.length === 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-purple-900 font-semibold mb-2">🎯 Comment ça marche ?</p>
            <ol className="text-xs text-purple-800 space-y-1 list-decimal list-inside">
              <li>Importez votre ticket de caisse au format PDF</li>
              <li>Les produits alimentaires seront automatiquement détectés</li>
              <li>Ajoutez les dates de péremption manuellement</li>
              <li>Enregistrez tous les produits en un clic</li>
            </ol>
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs text-purple-700">
                💡 <strong>Astuce :</strong> L'application reconnaît automatiquement les produits alimentaires (lait, pain, fruits, légumes, viandes, etc.)
              </p>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Uploader PDF */}
        {products.length === 0 && (
          <PdfUploader onPdfSelected={handlePdfSelected} />
        )}

        {/* Chargement */}
        {isScanning && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-blue-700 font-semibold">Extraction du PDF en cours...</p>
            <p className="text-sm text-blue-600 mt-2">Cela peut prendre quelques secondes</p>
          </div>
        )}

        {/* Liste des produits détectés */}
        {products.length > 0 && !isScanning && (
          <div className="space-y-4">
            {/* Sélection du lieu de stockage */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">📍 Lieu de stockage :</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedLocation('fridge')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                    selectedLocation === 'fridge'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  <Refrigerator className="w-5 h-5" />
                  <span className="text-xs font-semibold">Frigo</span>
                </button>

                <button
                  onClick={() => setSelectedLocation('freezer')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                    selectedLocation === 'freezer'
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  <Snowflake className="w-5 h-5" />
                  <span className="text-xs font-semibold">Congélo</span>
                </button>

                <button
                  onClick={() => setSelectedLocation('pantry')}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                    selectedLocation === 'pantry'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="text-xs font-semibold">Garde-manger</span>
                </button>
              </div>
            </div>

            {/* Titre */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {products.filter(p => p.selected).length} produit(s) détecté(s)
              </h2>
            </div>

            {/* Liste des produits */}
            <div className="space-y-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    product.selected
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={product.selected}
                      onChange={() => toggleProductSelection(product.id)}
                      className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />

                    <div className="flex-1">
                      {/* Nom du produit */}
                      <p className="font-semibold text-gray-900 mb-1">{product.name}</p>

                      {/* Quantité et prix */}
                      {(product.quantity || product.price) && (
                        <p className="text-sm text-gray-600 mb-2">
                          {product.quantity && `Qté: ${product.quantity}`}
                          {product.quantity && product.price && ' • '}
                          {product.price && `${product.price}€`}
                        </p>
                      )}

                      {/* Date de péremption */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Date de péremption :
                        </label>
                        <input
                          type="date"
                          value={product.expirationDate}
                          onChange={e => updateProductDate(product.id, e.target.value)}
                          disabled={!product.selected}
                          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton d'enregistrement */}
            <button
              onClick={handleSaveAll}
              disabled={products.filter(p => p.selected).length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Enregistrer {products.filter(p => p.selected).length} produit(s)
            </button>

            {/* Bouton recommencer */}
            <button
              onClick={() => setProducts([])}
              className="w-full bg-gray-500 text-white rounded-xl p-3 font-semibold hover:bg-gray-600 transition-colors"
            >
              Importer un autre ticket
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
