import { useEffect, useState, useCallback, useMemo } from 'react'
import { ChevronRight, Search, X, Package } from 'lucide-react'
import { db } from '../db'
import type { Product } from '../types'
import type { Screen } from '../App'
import dayjs from 'dayjs'
import BellIcon from '../components/BellIcon'
import SwipeableProductCard from '../components/SwipeableProductCard'

interface ProductListScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

function getUrgencyLevel(expirationDate: string): 'urgent' | 'warning' | 'ok' {
  const days = dayjs(expirationDate).diff(dayjs(), 'day')
  if (days < 3) return 'urgent'
  if (days < 15) return 'warning'
  return 'ok'
}

function getUrgencyLabel(expirationDate: string): string {
  const days = dayjs(expirationDate).diff(dayjs(), 'day')
  if (days < 0) return 'Périmé'
  if (days === 0) return 'Aujourd\'hui'
  if (days === 1) return 'Demain'
  if (days < 7) return `${days} jours`
  return `${days} jours`
}

export default function ProductListScreen({ setCurrentScreen }: ProductListScreenProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const loadProducts = useCallback(async () => {
    const all = await db.products.toArray()
    all.sort((a, b) => a.expirationDate.localeCompare(b.expirationDate))
    setProducts(all)
  }, [])

  useEffect(() => {
    loadProducts()
    // Augmenter l'intervalle à 5 secondes au lieu de 2
    const interval = setInterval(loadProducts, 5000)
    return () => clearInterval(interval)
  }, [loadProducts])

  const handleDelete = useCallback(async (id: string) => {
    await db.products.delete(id)
    await loadProducts()
  }, [loadProducts])

  const handleConsume = useCallback(async (id: string) => {
    // Animation de succès, puis suppression
    await db.products.delete(id)
    await loadProducts()
  }, [loadProducts])

  const handlePostpone = useCallback(async (id: string) => {
    const product = await db.products.get(id)
    if (product) {
      // Reporter de 2 jours
      const newDate = dayjs(product.expirationDate).add(2, 'day').format('YYYY-MM-DD')
      await db.products.update(id, { expirationDate: newDate })
      await loadProducts()
    }
  }, [loadProducts])

  // Filtrer les produits selon la recherche
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const query = searchQuery.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      p.location.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  const { urgentProducts, warningProducts, okProducts } = useMemo(() => ({
    urgentProducts: filteredProducts.filter(p => getUrgencyLevel(p.expirationDate) === 'urgent'),
    warningProducts: filteredProducts.filter(p => getUrgencyLevel(p.expirationDate) === 'warning'),
    okProducts: filteredProducts.filter(p => getUrgencyLevel(p.expirationDate) === 'ok')
  }), [filteredProducts])

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-gray-700"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Mes produits</h1>
          <BellIcon setCurrentScreen={setCurrentScreen} />
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Total - Version 2 : Minimaliste avec bordure */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {searchQuery ? filteredProducts.length : products.length}
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {searchQuery ? 'Résultats' : 'Produits'}
                </p>
                <p className="text-xs text-gray-500">
                  en stock
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                {urgentProducts.length} urgent{urgentProducts.length > 1 ? 's' : ''}
              </div>
              <div className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                {warningProducts.length} à venir
              </div>
            </div>
          </div>
        </div>

        {/* Liste urgences */}
        {urgentProducts.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wide flex items-center gap-2">
              Urgences
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                Swipe → ✅ / ← 🗑️
              </span>
            </h2>
            <div className="mb-6">
              {urgentProducts.map(product => (
                <SwipeableProductCard
                  key={product.id}
                  product={product}
                  urgencyLevel="urgent"
                  urgencyLabel={getUrgencyLabel(product.expirationDate)}
                  onDelete={handleDelete}
                  onConsume={handleConsume}
                  onPostpone={handlePostpone}
                />
              ))}
            </div>
          </>
        )}

        {/* Liste avertissements */}
        {warningProducts.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-orange-600 mb-3 uppercase tracking-wide">À surveiller</h2>
            <div className="mb-6">
              {warningProducts.map(product => (
                <SwipeableProductCard
                  key={product.id}
                  product={product}
                  urgencyLevel="warning"
                  urgencyLabel={getUrgencyLabel(product.expirationDate)}
                  onDelete={handleDelete}
                  onConsume={handleConsume}
                  onPostpone={handlePostpone}
                />
              ))}
            </div>
          </>
        )}

        {/* Reste du frigo */}
        {okProducts.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Reste du frigo</h2>
            <div>
              {okProducts.map(product => (
                <SwipeableProductCard
                  key={product.id}
                  product={product}
                  urgencyLevel="ok"
                  urgencyLabel={getUrgencyLabel(product.expirationDate)}
                  onDelete={handleDelete}
                  onConsume={handleConsume}
                  onPostpone={handlePostpone}
                />
              ))}
            </div>
          </>
        )}

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit pour le moment</p>
            <button
              onClick={() => setCurrentScreen('scan')}
              className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Scanner un produit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
