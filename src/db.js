import Dexie from 'dexie';
class FreshDB extends Dexie {
    constructor() {
        super('freshkeeper');
        Object.defineProperty(this, "products", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plans", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.version(1).stores({
            products: 'id, barcode, expirationDate, location, createdAt',
            plans: '++id, productId, scheduledAt, delivered'
        });
    }
}
export const db = new FreshDB();
// Fonction utilitaire pour réinitialiser la base de données
export async function resetDatabase() {
    try {
        await db.delete();
        console.log('Base de données supprimée');
        // Recréer la base
        location.reload();
    }
    catch (error) {
        console.error('Erreur lors de la réinitialisation de la DB:', error);
    }
}
