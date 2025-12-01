import { useState } from 'react'
import { Camera, Bell, Sparkles, ChevronRight, X, Receipt, Edit2, ThumbsUp } from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

const slides = [
  {
    icon: Receipt,
    title: 'Importez vos tickets',
    description: 'Scannez vos tickets de caisse PDF pour ajouter automatiquement tous vos produits alimentaires',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Camera,
    title: 'Ou scannez un produit',
    description: 'Utilisez le scan code-barres pour ajouter rapidement un produit individuel',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Edit2,
    title: 'Personnalisez vos noms',
    description: 'Renommez vos produits : l\'application retiendra le changement pour les prochains imports',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Bell,
    title: 'Recevez des alertes',
    description: 'Soyez notifié quand un produit arrive à expiration pour ne plus rien gaspiller',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: ThumbsUp,
    title: 'Gérez facilement',
    description: 'Swipe → pour marquer "Mangé", ← pour "Jeté". Cliquez sur les badges pour modifier lieu et date',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Sparkles,
    title: 'Découvrez des recettes',
    description: 'Trouvez des idées pour cuisiner avec vos produits qui vont bientôt expirer',
    color: 'from-pink-500 to-rose-500'
  }
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-emerald-50 z-50 flex flex-col">
      {/* Skip button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSkip}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-semibold"
        >
          <span>Passer</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Icon */}
        <div className={`bg-gradient-to-br ${slide.color} w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-lg`}>
          <Icon className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {slide.title}
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 text-center max-w-md mb-12">
          {slide.description}
        </p>

        {/* Dots indicator */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-emerald-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next button */}
      <div className="p-8">
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
        >
          {currentSlide < slides.length - 1 ? 'Suivant' : 'Commencer'}
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
