import { useEffect, useState, useCallback, memo } from 'react'
import { Bell } from 'lucide-react'
import { db } from '../db'
import type { Screen } from '../App'

interface BellIconProps {
  setCurrentScreen: (screen: Screen) => void
}

function BellIcon({ setCurrentScreen }: BellIconProps) {
  const [notificationCount, setNotificationCount] = useState(0)

  const loadNotificationCount = useCallback(async () => {
    const count = await db.notifications.count()
    setNotificationCount(count)
  }, [])

  useEffect(() => {
    loadNotificationCount()
    // Actualiser le compteur toutes les 5 secondes (au lieu de 2)
    const interval = setInterval(loadNotificationCount, 5000)
    return () => clearInterval(interval)
  }, [loadNotificationCount])

  const handleClick = useCallback(() => {
    setCurrentScreen('notifications')
  }, [setCurrentScreen])

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={`Notifications (${notificationCount})`}
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

export default memo(BellIcon)
