import { useState, useEffect } from 'react'
import { db } from '../db'
import type { Product } from '../types'
import { scheduleFor } from '../services/notifications'
import { v4 as uuid } from 'uuid'
import { fetchOFF } from '../services/openfoodfacts'

interface ProductFormProps {
  onSaved?: () => void
  scannedBarcode?: string
}

export default function ProductForm({ onSaved, scannedBarcode }: ProductFormProps) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [barcode, setBarcode] = useState('')
  const [location, setLocation] = useState<'fridge'|'freezer'|'pantry'>('fridge')
  const [expirationDate, setExpirationDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)

  // Gérer le code-barres scanné
  useEffect(() => {
    if (scannedBarcode) {
      setBarcode(scannedBarcode)
    }
  }, [scannedBarcode])

  // Auto-remplissage quand le code-barres change
  useEffect(() => {
    if (barcode.length >= 8) {
      autoFillFromBarcode(barcode)
    }
  }, [barcode])

  async function autoFillFromBarcode(code: string) {
    setLoading(true)
    try {
      const product = await fetchOFF(code)
      if (product) {
        if (product.product_name) setName(product.product_name)
        if (product.brands) setBrand(product.brands)
        if (product.quantity) setQuantity(product.quantity)
      }
    } catch (error) {
      console.error('Erreur OpenFoodFacts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!name || !expirationDate) return
    const now = new Date().toISOString()
    const product: Product = {
      id: uuid(),
      barcode: barcode || undefined,
      name,
      brand: brand || undefined,
      quantity: quantity || undefined,
      location,
      expirationDate,
      createdAt: now,
      updatedAt: now
    }
    await db.products.add(product)
    await scheduleFor(product)
    setName(''); setBrand(''); setBarcode(''); setQuantity(''); setExpirationDate('')
    onSaved?.()
  }

  return (
    <div className="card">
      <h3>Ajouter un produit</h3>
      <div className="row">
        <label>Nom</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Yaourt nature"/>
      </div>
      <div className="row">
        <label>Marque</label>
        <input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="Yoplait"/>
      </div>
      <div className="row">
        <label>Code-barres</label>
        <input value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="3274080005003"/>
      </div>
      <div className="row">
        <label>Quantité</label>
        <input value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="4x125g"/>
      </div>
      <div className="row">
        <label>Lieu</label>
        <select value={location} onChange={e=>setLocation(e.target.value as any)}>
          <option value="fridge">Frigo</option>
          <option value="freezer">Congélo</option>
          <option value="pantry">Placard</option>
        </select>
      </div>
      <div className="row">
        <label>Expiration</label>
        <input type="date" value={expirationDate} onChange={e=>setExpirationDate(e.target.value)}/>
      </div>
      <button onClick={save} disabled={loading || !name || !expirationDate}>
        {loading ? 'Chargement...' : 'Ajouter'}
      </button>
    </div>
  )
}
