import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { db } from '../db'
import type { Screen } from '../App'

interface BellIconProps {
  setCurrentScreen: (screen: Screen) => void
}

export default function BellIcon({ setCurrentScreen }: BellIconProps) {
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    loadNotificationCount()
    // Actualiser le compteur toutes les 2 secondes
    const interval = setInterval(loadNotificationCount, 2000)
    return () => clearInterval(interval)
  }, [])

  async function loadNotificationCount() {
    const count = await db.notifications.count()
    setNotificationCount(count)
  }

  return (
    <button
      onClick={() => setCurrentScreen('notifications')}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <Bell className="w-6 h-6 text-gray-700" />
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {notificationCount > 9 ? '9+' : notificationCount}
        </span>
      )}
    </button>
  )
}
