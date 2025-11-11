import { useEffect, useState } from 'react'
import { ChevronRight, X, AlertCircle, Clock, Calendar } from 'lucide-react'
import { db } from '../db'
import type { AppNotification } from '../types'
import type { Screen } from '../App'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.locale('fr')

interface NotificationsScreenProps {
  setCurrentScreen: (screen: Screen) => void
}

export default function NotificationsScreen({ setCurrentScreen }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {
    const all = await db.notifications.toArray()
    // Trier par date décroissante (plus récent en premier)
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    setNotifications(all)
  }

  async function handleDismiss(id: string) {
    await db.notifications.delete(id)
    await loadNotifications()
  }

  async function handleDismissAll() {
    await db.notifications.clear()
    await loadNotifications()
  }

  function getNotificationIcon(type: AppNotification['type']) {
    switch (type) {
      case 'expiring-today':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'expiring-tomorrow':
        return <Clock className="w-5 h-5 text-orange-600" />
      case 'urgent':
        return <Calendar className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  function getNotificationColor(type: AppNotification['type']) {
    switch (type) {
      case 'expiring-today':
        return 'border-red-500 bg-red-50'
      case 'expiring-tomorrow':
        return 'border-orange-500 bg-orange-50'
      case 'urgent':
        return 'border-red-500 bg-red-50'
      default:
        return 'border-gray-300 bg-white'
    }
  }

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
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={handleDismissAll}
              className="text-sm text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Tout effacer
            </button>
          )}
          {notifications.length === 0 && <div className="w-20"></div>}
        </div>

        {/* Liste des notifications */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`rounded-xl p-4 border-l-4 shadow-sm relative ${getNotificationColor(notification.type)}`}
              >
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="absolute top-2 right-2 p-1.5 hover:bg-white/50 rounded-full transition-colors"
                  title="Fermer"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-start gap-3 pr-8">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">
                      {notification.productName}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dayjs(notification.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-semibold mb-2">Aucune notification</p>
            <p className="text-sm text-gray-400">
              Vous serez alerté quand un produit arrive à expiration
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
