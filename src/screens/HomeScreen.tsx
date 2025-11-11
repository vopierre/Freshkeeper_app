import { useEffect, useState } from 'react'
import { Camera, Filter, Sparkles, AlertCircle, Clock, Calendar } from 'lucide-react'
import { db } from '../db'
import type { Product } from '../types'
import type { Screen } from '../App'
import dayjs from 'dayjs'
import BellIcon from '../components/BellIcon'

interface HomeScreenProps {
  setCurrentScreen: (screen: Screen) => void
  logo: React.ReactNode
}

export default function HomeScreen({ setCurrentScreen, logo }: HomeScreenProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [urgentCount, setUrgentCount] = useState({ today: 0, threeDays: 0, week: 0 })

  useEffect(() => {
    loadProducts()
    const interval = setInterval(loadProducts, 2000)
    return () => clearInterval(interval)
  }, [])

  async function loadProducts() {
    const all = await db.products.toArray()
    setProducts(all)

    // Calculer les urgences
    const now = dayjs()
    const today = all.filter(p => dayjs(p.expirationDate).diff(now, 'day') < 3).length
    const threeDays = all.filter(p => {
      const days = dayjs(p.expirationDate).diff(now, 'day')
      return days >= 3 && days < 15
    }).length
    const week = all.filter(p => {
      const days = dayjs(p.expirationDate).diff(now, 'day')
      return days >= 15
    }).length

    setUrgentCount({ today, threeDays, week })
  }

  const totalUrgent = urgentCount.today + urgentCount.threeDays + urgentCount.week

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen pb-24">
      <div className="p-6">
        {/* Header avec logo */}
        <div className="flex justify-between items-start mb-8">
          {logo}
          <div className="bg-white rounded-full shadow-sm">
            <BellIcon setCurrentScreen={setCurrentScreen} />
          </div>
        </div>

        {/* Urgences - Données critiques en premier */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">À traiter en priorité</h2>
            <span className="text-3xl font-bold text-red-600">{totalUrgent}</span>
          </div>

          <div className="space-y-3">
            {/* J-1 - Rouge */}
            <div className="flex items-center justify-between bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900">Aujourd'hui / Demain</p>
                  <p className="text-xs text-gray-600">Consommer rapidement</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">{urgentCount.today}</span>
            </div>

            {/* J-3 à J-15 - Orange */}
            <div className="flex items-center justify-between bg-orange-50 border-l-4 border-orange-500 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">3-15 jours</p>
                  <p className="text-xs text-gray-600">Planifier utilisation</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600">{urgentCount.threeDays}</span>
            </div>

            {/* > J-15 - Vert */}
            <div className="flex items-center justify-between bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Plus de 15 jours</p>
                  <p className="text-xs text-gray-600">Bien conservé</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">{urgentCount.week}</span>
            </div>
          </div>
        </div>

        {/* Action principale - Scan */}
        <button
          onClick={() => setCurrentScreen('scan')}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl mb-4 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-center gap-3">
            <Camera className="w-8 h-8" />
            <span className="text-xl font-bold">Scanner un produit</span>
          </div>
          <p className="text-sm text-green-100 mt-2">Ajoutez rapidement vos courses</p>
        </button>

        {/* Actions secondaires */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentScreen('list')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <Filter className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">Mes produits</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('ideas')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-purple-100 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">Idées recettes</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
