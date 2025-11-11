import { useEffect, useState } from 'react'
import { ChevronRight, X, Refrigerator, Snowflake, Package } from 'lucide-react'
import { db } from '../db'
import type { Product } from '../types'
import type { Screen } from '../App'
import dayjs from 'dayjs'
import { formatHuman } from '../utils/date'
import BellIcon from '../components/BellIcon'

interface ProductListScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export default function ProductListScreen({ setCurrentScreen }: ProductListScreenProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    loadProducts()
    const interval = setInterval(loadProducts, 2000)
    return () => clearInterval(interval)
  }, [])

  async function loadProducts() {
    const all = await db.products.toArray()
    all.sort((a, b) => a.expirationDate.localeCompare(b.expirationDate))
    setProducts(all)
  }

  async function handleDelete(id: string) {
    await db.products.delete(id)
    await loadProducts()
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

  function getLocationBadge(location: string) {
    switch (location) {
      case 'fridge':
        return { icon: Refrigerator, label: 'Frigo', color: 'bg-blue-100 text-blue-700' }
      case 'freezer':
        return { icon: Snowflake, label: 'Congélo', color: 'bg-cyan-100 text-cyan-700' }
      case 'pantry':
        return { icon: Package, label: 'Garde-manger', color: 'bg-amber-100 text-amber-700' }
      default:
        return { icon: Package, label: 'Autre', color: 'bg-gray-100 text-gray-700' }
    }
  }

  const urgentProducts = products.filter(p => getUrgencyLevel(p.expirationDate) === 'urgent')
  const warningProducts = products.filter(p => getUrgencyLevel(p.expirationDate) === 'warning')
  const okProducts = products.filter(p => getUrgencyLevel(p.expirationDate) === 'ok')

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-gray-700"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Mes produits</h1>
          <BellIcon setCurrentScreen={setCurrentScreen} />
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <p className="text-sm text-gray-600">Total des produits</p>
          <p className="text-3xl font-bold text-gray-900">{products.length} articles</p>
        </div>

        {/* Liste urgences */}
        {urgentProducts.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wide">Urgences</h2>
            <div className="space-y-3 mb-6">
              {urgentProducts.map(product => {
                const locationBadge = getLocationBadge(product.location)
                const LocationIcon = locationBadge.icon
                return (
                  <div key={product.id} className="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-sm relative">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="absolute top-2 right-2 p-1.5 hover:bg-red-100 rounded-full transition-colors"
                      title="Supprimer"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <span className={`inline-flex items-center gap-1 ${locationBadge.color} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                            <LocationIcon className="w-3 h-3" />
                            <span>{locationBadge.label}</span>
                          </span>
                        </div>
                        {(product.brand || (product.quantity && product.quantity !== '1')) && (
                          <p className="text-sm text-gray-600">
                            {product.brand}
                            {product.brand && product.quantity && product.quantity !== '1' && ' - '}
                            {product.quantity !== '1' && product.quantity}
                          </p>
                        )}
                      </div>
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {getUrgencyLabel(product.expirationDate)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Expire le {formatHuman(product.expirationDate)}</p>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Liste avertissements */}
        {warningProducts.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-orange-600 mb-3 uppercase tracking-wide">À surveiller</h2>
            <div className="space-y-3 mb-6">
              {warningProducts.map(product => {
                const locationBadge = getLocationBadge(product.location)
                const LocationIcon = locationBadge.icon
                return (
                  <div key={product.id} className="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-sm relative">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="absolute top-2 right-2 p-1.5 hover:bg-red-100 rounded-full transition-colors"
                      title="Supprimer"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <span className={`inline-flex items-center gap-1 ${locationBadge.color} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                            <LocationIcon className="w-3 h-3" />
                            <span>{locationBadge.label}</span>
                          </span>
                        </div>
                        {(product.brand || (product.quantity && product.quantity !== '1')) && (
                          <p className="text-sm text-gray-600">
                            {product.brand}
                            {product.brand && product.quantity && product.quantity !== '1' && ' - '}
                            {product.quantity !== '1' && product.quantity}
                          </p>
                        )}
                      </div>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {getUrgencyLabel(product.expirationDate)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Expire le {formatHuman(product.expirationDate)}</p>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Reste du frigo */}
        {okProducts.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Reste du frigo</h2>
            <div className="space-y-2">
              {okProducts.map(product => {
                const locationBadge = getLocationBadge(product.location)
                const LocationIcon = locationBadge.icon
                return (
                  <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm relative">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="absolute top-2 right-2 p-1.5 hover:bg-red-100 rounded-full transition-colors"
                      title="Supprimer"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                    <div className="flex justify-between items-center pr-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <span className={`inline-flex items-center gap-1 ${locationBadge.color} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                            <LocationIcon className="w-3 h-3" />
                            <span>{locationBadge.label}</span>
                          </span>
                        </div>
                        {(product.brand || (product.quantity && product.quantity !== '1')) && (
                          <p className="text-sm text-gray-600">
                            {product.brand}
                            {product.brand && product.quantity && product.quantity !== '1' && ' - '}
                            {product.quantity !== '1' && product.quantity}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{getUrgencyLabel(product.expirationDate)}</span>
                    </div>
                  </div>
                )
              })}
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
