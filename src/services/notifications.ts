import { db } from '../db'
import type { Product, NotificationPlan, AppNotification } from '../types'
import { OFFSETS } from '../utils/date'
import dayjs from 'dayjs'

const supportsWebNotifications = 'Notification' in window

export async function ensurePermission() {
  if (!supportsWebNotifications) return
  if (Notification.permission === 'default') {
    try { await Notification.requestPermission() } catch {}
  }
}

export async function scheduleFor(product: Product) {
  const expiration = dayjs(product.expirationDate)
  const now = dayjs()

  const plans: NotificationPlan[] = []
  for (const d of OFFSETS) {
    const when = expiration.add(d, 'day').hour(9).minute(0).second(0)
    if (when.isAfter(now)) {
      plans.push({
        productId: product.id,
        offsetDays: d,
        scheduledAt: when.toISOString(),
        delivered: false
      })
    }
  }
  await db.plans.where('productId').equals(product.id).delete()
  if (plans.length) await db.plans.bulkAdd(plans)
}

/**
 * Crée une notification dans la base de données
 */
async function createAppNotification(
  product: Product,
  type: AppNotification['type'],
  message: string
) {
  const notification: AppNotification = {
    id: `${product.id}-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    type,
    message,
    createdAt: dayjs().toISOString(),
    read: false
  }
  await db.notifications.add(notification)
}

/**
 * Vérifie si un produit est passé en zone urgence et envoie une notification
 */
async function checkUrgentProducts() {
  const products = await db.products.toArray()
  const now = dayjs()

  for (const product of products) {
    const daysUntilExpiry = dayjs(product.expirationDate).diff(now, 'day')

    // Produit en zone urgence (moins de 3 jours)
    if (daysUntilExpiry >= 0 && daysUntilExpiry < 3) {
      // Vérifier si on a déjà créé une notification pour ce produit aujourd'hui
      const today = dayjs().format('YYYY-MM-DD')
      const existingNotification = await db.notifications
        .where('productId')
        .equals(product.id)
        .filter(n => dayjs(n.createdAt).format('YYYY-MM-DD') === today)
        .first()

      if (!existingNotification) {
        let title = ''
        let message = ''
        let type: AppNotification['type'] = 'urgent'

        if (daysUntilExpiry === 0) {
          title = '⚠️ Expire aujourd\'hui !'
          message = `${product.name} expire aujourd'hui`
          type = 'expiring-today'
        } else if (daysUntilExpiry === 1) {
          title = '⚠️ Expire demain !'
          message = `${product.name} expire demain`
          type = 'expiring-tomorrow'
        } else {
          title = '⚠️ Zone urgence !'
          message = `${product.name} expire dans ${daysUntilExpiry} jours`
          type = 'urgent'
        }

        // Créer la notification dans la base de données
        await createAppNotification(product, type, message)

        // Envoyer aussi la notification navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body: message,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: `urgent-${product.id}`,
            requireInteraction: false
          })
        }
      }
    }
  }
}

export function startInTabScheduler() {
  // Vérifier immédiatement au démarrage
  checkUrgentProducts()

  setInterval(async () => {
    const now = dayjs()
    const due = await db.plans.where('delivered').equals(0).toArray()
    for (const p of due) {
      if (dayjs(p.scheduledAt).isBefore(now)) {
        const prod = await db.products.get(p.productId)
        if (prod && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(
            p.offsetDays < 0 ? `Expire dans ${Math.abs(p.offsetDays)}j` : `Expire aujourd'hui`,
            { body: `${prod.name} – ${prod.expirationDate}` }
          )
        }
        await db.plans.update(p.id!, { delivered: true })
      }
    }

    // Vérifier les produits urgents toutes les heures
    checkUrgentProducts()
  }, 60_000) // Toutes les minutes, mais la vérification urgente se fait 1x/jour max
}
