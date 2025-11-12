import { useState, useRef, TouchEvent } from 'react'
import { Check, Trash2, Clock, Refrigerator, Snowflake, Package } from 'lucide-react'
import type { Product } from '../types'
import { formatHuman } from '../utils/date'
import dayjs from 'dayjs'

interface SwipeableProductCardProps {
  product: Product
  urgencyLevel: 'urgent' | 'warning' | 'ok'
  urgencyLabel: string
  onDelete: (id: string) => void
  onConsume: (id: string) => void
  onPostpone: (id: string) => void
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

export default function SwipeableProductCard({
  product,
  urgencyLevel,
  urgencyLabel,
  onDelete,
  onConsume,
  onPostpone
}: SwipeableProductCardProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const startX = useRef(0)
  const currentX = useRef(0)

  const locationBadge = getLocationBadge(product.location)
  const LocationIcon = locationBadge.icon

  const borderColor = urgencyLevel === 'urgent' ? 'border-red-500' : urgencyLevel === 'warning' ? 'border-orange-500' : ''
  const urgencyBgColor = urgencyLevel === 'urgent' ? 'bg-red-100 text-red-700' : urgencyLevel === 'warning' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsSwiping(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return
    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current
    // Limiter le swipe entre -150 et 150px
    const boundedDiff = Math.max(-150, Math.min(150, diff))
    setTranslateX(boundedDiff)
  }

  const handleTouchEnd = () => {
    setIsSwiping(false)

    // Swipe droite (> 80px) = Consommé
    if (translateX > 80) {
      onConsume(product.id)
    }
    // Swipe gauche (< -80px) = Jeté
    else if (translateX < -80) {
      onDelete(product.id)
    }

    // Reset position
    setTranslateX(0)
  }

  // Calculer l'opacité des indicateurs selon la distance de swipe
  const rightOpacity = Math.min(translateX / 80, 1)
  const leftOpacity = Math.min(Math.abs(translateX) / 80, 1)

  return (
    <div className="relative overflow-hidden rounded-xl mb-3">
      {/* Indicateurs de fond */}
      <div className="absolute inset-0 flex justify-between items-center px-6">
        {/* Indicateur gauche (jeté) */}
        <div
          className="flex items-center gap-2 text-red-600"
          style={{ opacity: leftOpacity }}
        >
          <Trash2 className="w-6 h-6" />
          <span className="font-bold">Jeté</span>
        </div>

        {/* Indicateur droite (consommé) */}
        <div
          className="flex items-center gap-2 text-green-600"
          style={{ opacity: rightOpacity }}
        >
          <span className="font-bold">Consommé</span>
          <Check className="w-6 h-6" />
        </div>
      </div>

      {/* Carte principale */}
      <div
        className={`bg-white rounded-xl p-4 shadow-sm relative ${borderColor ? `border-l-4 ${borderColor}` : ''}`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <p className={`${urgencyLevel === 'urgent' ? 'font-bold' : 'font-semibold'} text-gray-900 mb-1`}>
              {product.name}
            </p>
            {(product.brand || (product.quantity && product.quantity !== '1')) && (
              <p className="text-sm text-gray-600">
                {product.brand}
                {product.brand && product.quantity && product.quantity !== '1' && ' - '}
                {product.quantity !== '1' && product.quantity}
              </p>
            )}
          </div>
          {urgencyLevel !== 'ok' && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${urgencyBgColor}`}>
              {urgencyLabel}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {urgencyLevel === 'ok' ? `${urgencyLabel}` : `Expire le ${formatHuman(product.expirationDate)}`}
          </p>
          <span className={`inline-flex items-center gap-1 ${locationBadge.color} text-xs font-semibold px-2 py-0.5 rounded-full`}>
            <LocationIcon className="w-3 h-3" />
            <span>{locationBadge.label}</span>
          </span>
        </div>

        {/* Bouton Reporter (pour les produits urgents) */}
        {urgencyLevel === 'urgent' && (
          <button
            onClick={() => onPostpone(product.id)}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Clock className="w-4 h-4" />
            Reporter de 2 jours
          </button>
        )}
      </div>
    </div>
  )
}
