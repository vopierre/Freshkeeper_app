import { useState, useRef, TouchEvent } from 'react'
import { Check, Trash2, Clock, Refrigerator, Snowflake, Package, Edit2, ThumbsUp } from 'lucide-react'
import type { Product, LocationKind } from '../types'
import { formatHuman } from '../utils/date'
import { db } from '../db'

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
  const [isEditing, setIsEditing] = useState(false)
  const [editingName, setEditingName] = useState(product.name)
  const [showLocationMenu, setShowLocationMenu] = useState(false)
  const startX = useRef(0)
  const currentX = useRef(0)

  const locationBadge = getLocationBadge(product.location)
  const LocationIcon = locationBadge.icon

  const borderColor = urgencyLevel === 'urgent' ? 'border-red-500' : urgencyLevel === 'warning' ? 'border-orange-500' : ''
  const urgencyBgColor = urgencyLevel === 'urgent' ? 'bg-red-100 text-red-700' : urgencyLevel === 'warning' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'

  const handleTouchStart = (e: TouchEvent) => {
    if (isEditing) return // Ne pas swiper pendant l'édition
    startX.current = e.touches[0].clientX
    setIsSwiping(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping || isEditing) return
    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current
    // Limiter le swipe entre -150 et 150px
    const boundedDiff = Math.max(-150, Math.min(150, diff))
    setTranslateX(boundedDiff)
  }

  const handleTouchEnd = () => {
    if (isEditing) return
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

  const handleStartEditing = () => {
    setIsEditing(true)
    setEditingName(product.name)
  }

  const handleSaveName = async () => {
    if (editingName.trim() && editingName.trim() !== product.name) {
      await db.products.update(product.id, { name: editingName.trim() })
    }
    setIsEditing(false)
  }

  const handleCancelEditing = () => {
    setIsEditing(false)
    setEditingName(product.name)
  }

  const handleChangeLocation = async (newLocation: LocationKind) => {
    await db.products.update(product.id, { location: newLocation })
    setShowLocationMenu(false)
  }

  const toggleLocationMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowLocationMenu(!showLocationMenu)
  }

  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleOpenDatePicker = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Ouvrir directement le calendrier natif
    dateInputRef.current?.showPicker()
  }

  const handleDateChange = async (newDate: string) => {
    if (newDate && newDate !== product.expirationDate) {
      await db.products.update(product.id, { expirationDate: newDate })
    }
  }

  // Calculer l'opacité des indicateurs selon la distance de swipe
  // Quand la carte glisse vers la droite (translateX positif), on voit l'indicateur gauche "Jeté"
  const leftOpacity = Math.max(0, Math.min(translateX / 80, 1))
  // Quand la carte glisse vers la gauche (translateX négatif), on voit l'indicateur droite "Mangé"
  const rightOpacity = Math.max(0, Math.min(-translateX / 80, 1))

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

        {/* Indicateur droite (mangé) */}
        <div
          className="flex items-center gap-2 text-green-600"
          style={{ opacity: rightOpacity }}
        >
          <span className="font-bold">Mangé</span>
          <ThumbsUp className="w-6 h-6" />
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
        {/* Menu de sélection du lieu - Pleine largeur */}
        {showLocationMenu && (
          <>
            {/* Overlay pour fermer le menu en cliquant ailleurs */}
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation()
                setShowLocationMenu(false)
              }}
            />

            {/* Menu pleine largeur qui slide de droite à gauche */}
            <div className="absolute inset-0 bg-white rounded-xl shadow-2xl border-2 border-blue-400 p-4 z-50 flex items-center justify-around animate-slide-left">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeLocation('fridge')
                }}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all flex-1 mx-1 ${
                  product.location === 'fridge'
                    ? 'bg-blue-500 text-white scale-110 shadow-lg'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Refrigerator className="w-7 h-7" />
                <span>Frigo</span>
                {product.location === 'fridge' && <Check className="w-4 h-4 absolute top-2 right-2" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeLocation('freezer')
                }}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all flex-1 mx-1 ${
                  product.location === 'freezer'
                    ? 'bg-cyan-500 text-white scale-110 shadow-lg'
                    : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                }`}
              >
                <Snowflake className="w-7 h-7" />
                <span>Congélateur</span>
                {product.location === 'freezer' && <Check className="w-4 h-4 absolute top-2 right-2" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeLocation('pantry')
                }}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all flex-1 mx-1 ${
                  product.location === 'pantry'
                    ? 'bg-amber-500 text-white scale-110 shadow-lg'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Package className="w-7 h-7" />
                <span>Garde-manger</span>
                {product.location === 'pantry' && <Check className="w-4 h-4 absolute top-2 right-2" />}
              </button>
            </div>
          </>
        )}

        {/* Input date caché pour le calendrier natif */}
        <input
          ref={dateInputRef}
          type="date"
          value={product.expirationDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="hidden"
        />

        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSaveName()
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      handleCancelEditing()
                    }
                  }}
                  autoFocus
                  className="flex-1 px-2 py-1 border-2 border-green-500 rounded text-sm font-semibold focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveName()
                  }}
                  className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelEditing()
                  }}
                  className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <p
                  className={`${urgencyLevel === 'urgent' ? 'font-bold' : 'font-semibold'} text-gray-900 cursor-pointer hover:text-green-600 transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartEditing()
                  }}
                >
                  {product.name}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartEditing()
                  }}
                  className="text-gray-400 hover:text-green-600 transition-colors p-1"
                  title="Renommer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {(product.brand || (product.quantity && product.quantity !== '1')) && (
              <p className="text-sm text-gray-600">
                {product.brand}
                {product.brand && product.quantity && product.quantity !== '1' && ' - '}
                {product.quantity !== '1' && product.quantity}
              </p>
            )}
          </div>
          {urgencyLevel !== 'ok' && (
            <button
              onClick={handleOpenDatePicker}
              className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${urgencyBgColor} cursor-pointer hover:opacity-80 transition-opacity`}
              title="Modifier la date de péremption"
            >
              {urgencyLabel}
            </button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {urgencyLevel === 'ok' ? `${urgencyLabel}` : `Expire le ${formatHuman(product.expirationDate)}`}
          </p>
          <button
            onClick={toggleLocationMenu}
            className={`inline-flex items-center gap-1 ${locationBadge.color} text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity`}
            title="Changer le lieu de conservation"
          >
            <LocationIcon className="w-3 h-3" />
            <span>{locationBadge.label}</span>
          </button>
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
