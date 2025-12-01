import Dexie, { Table } from 'dexie'
import type { Product, NotificationPlan, AppNotification, ProductNameMapping } from './types'

class FreshDB extends Dexie {
  products!: Table<Product, string>
  plans!: Table<NotificationPlan, number>
  notifications!: Table<AppNotification, string>
  nameMappings!: Table<ProductNameMapping, number>

  constructor() {
    super('freshkeeper')
    this.version(1).stores({
      products: 'id, barcode, expirationDate, location, createdAt',
      plans: '++id, productId, scheduledAt, delivered'
    })
    this.version(2).stores({
      products: 'id, barcode, expirationDate, location, createdAt',
      plans: '++id, productId, scheduledAt, delivered',
      notifications: 'id, productId, createdAt, read'
    })
    this.version(3).stores({
      products: 'id, barcode, expirationDate, location, createdAt',
      plans: '++id, productId, scheduledAt, delivered',
      notifications: 'id, productId, createdAt, read',
      nameMappings: '++id, originalName, createdAt'
    })
  }
}

export const db = new FreshDB()

// Fonction utilitaire pour réinitialiser la base de données
export async function resetDatabase() {
  try {
    await db.delete()
    console.log('Base de données supprimée')
    // Recréer la base
    location.reload()
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la DB:', error)
  }
}
