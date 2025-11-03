import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { db } from '../db'
import type { Product } from '../types'
import { scheduleFor } from '../services/notifications'
import { fetchOFF } from '../services/openfoodfacts'
import { v4 as uuid } from 'uuid'
import type { Screen } from '../App'
import dayjs from 'dayjs'

interface AddProductScreenProps {
  setCurrentScreen: (screen: Screen) => void
  scannedBarcode?: string
}

export default function AddProductScreen({ setCurrentScreen, scannedBarcode }: AddProductScreenProps) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [barcode, setBarcode] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [expirationDate, setExpirationDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [productDetected, setProductDetected] = useState(false)

  // Auto-remplissage depuis le scan
  useEffect(() => {
    if (scannedBarcode) {
      setBarcode(scannedBarcode)
      autoFillFromBarcode(scannedBarcode)
    }
  }, [scannedBarcode])

  async function autoFillFromBarcode(code: string) {
    setLoading(true)
    try {
      const product = await fetchOFF(code)
      if (product) {
        setProductDetected(true)
        if (product.product_name) setName(product.product_name)
        if (product.brands) setBrand(product.brands)
        if (product.quantity) setQuantity(product.quantity)
      }
    } catch (error) {
      console.error('Erreur OpenFoodFacts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!name || !expirationDate) return

    const now = new Date().toISOString()
    const product: Product = {
      id: uuid(),
      barcode: barcode || undefined,
      name,
      brand: brand || undefined,
      quantity: quantity || undefined,
      location: 'fridge',
      expirationDate,
      createdAt: now,
      updatedAt: now
    }

    await db.products.add(product)
    await scheduleFor(product)

    // Réinitialiser et retourner à l'accueil
    setName('')
    setBrand('')
    setBarcode('')
    setQuantity('1')
    setExpirationDate('')
    setProductDetected(false)
    setCurrentScreen('home')
  }

  const daysUntilExpiry = expirationDate ? dayjs(expirationDate).diff(dayjs(), 'day') : null

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-gray-700"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Ajouter un produit</h1>
          <div className="w-8"></div>
        </div>

        {/* Produit détecté */}
        {productDetected && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700 font-semibold mb-1">✓ Produit reconnu</p>
            <p className="text-lg font-bold text-gray-900">{name}</p>
            {brand && <p className="text-sm text-gray-600">{brand} - {quantity}</p>}
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-blue-700 font-semibold">Chargement des informations...</p>
          </div>
        )}

        {/* Formulaire */}
        <div className="space-y-4 mb-6">
          {/* Nom */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Nom du produit</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Yaourt nature"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Marque */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Marque</label>
            <input
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder="Danone"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Date de péremption - Focus principal */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Date de péremption *
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
              className="w-full text-2xl font-bold text-center p-6 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
            {daysUntilExpiry !== null && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Dans {daysUntilExpiry} jour{daysUntilExpiry > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Quantité</label>
            <input
              type="text"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="1"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bouton principal */}
        <button
          onClick={handleSave}
          disabled={!name || !expirationDate}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-5 font-bold text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter au frigo
        </button>
      </div>
    </div>
  )
}
