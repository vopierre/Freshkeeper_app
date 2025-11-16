import { useEffect, useState } from 'react'
import { db } from '../db'
import { formatHuman } from '../utils/date'
import type { Product } from '../types'
import dayjs from 'dayjs'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string>('')

  useEffect(() => {
    let mounted = true
    async function load() {
      const all = await db.products.toArray()
      all.sort((a,b)=> a.expirationDate.localeCompare(b.expirationDate))
      if (mounted) setProducts(all)
    }
    load()
    // Ne pas rafraîchir pendant l'édition
    const id = setInterval(() => {
      if (!editingId) {
        load()
      }
    }, 2000)
    return () => { mounted = false; clearInterval(id) }
  }, [editingId])

  // Démarrer l'édition du nom
  function startEditing(product: Product) {
    setEditingId(product.id)
    setEditingName(product.name)
  }

  // Sauvegarder le nouveau nom
  async function saveName(productId: string) {
    if (editingName.trim() && editingName !== '') {
      await db.products.update(productId, { name: editingName.trim() })
    }
    setEditingId(null)
    setEditingName('')
  }

  // Annuler l'édition
  function cancelEditing() {
    setEditingId(null)
    setEditingName('')
  }

  // Détermine la couleur selon la date de péremption
  function getRowColor(expirationDate: string): string {
    const daysUntilExpiry = dayjs(expirationDate).diff(dayjs(), 'day')

    if (daysUntilExpiry < 3) return '#ffcccc' // Rouge
    if (daysUntilExpiry < 15) return '#ffe0b3' // Orange
    return '#ccffcc' // Vert
  }

  if (!products.length) return <p>Aucun produit pour le moment.</p>

  const soon = products.filter(p => dayjs(p.expirationDate).diff(dayjs(), 'day') <= 7)

  return (
    <div className="card">
      <h3>Résultats (triés par péremption)</h3>
      <p>{soon.length} bientôt périmé(s) (&lt;= 7 jours)</p>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nom</th><th>Marque</th><th>Lieu</th><th>Expire le</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr
              key={p.id}
              style={{
                backgroundColor: getRowColor(p.expirationDate),
                transition: 'background-color 0.3s'
              }}
            >
              <td style={{ padding: '8px', minWidth: '200px' }}>
                {editingId === p.id ? (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          saveName(p.id)
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          cancelEditing()
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        border: '2px solid #10b981',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        minWidth: '150px'
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        saveName(p.id)
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                    >
                      ✓
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        cancelEditing()
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditing(p)
                    }}
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textDecorationColor: '#9ca3af',
                      display: 'inline-block',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    title="✏️ Cliquez pour renommer"
                  >
                    {p.name}
                  </span>
                )}
              </td>
              <td style={{ padding: '8px' }}>{p.brand ?? '-'}</td>
              <td style={{ padding: '8px' }}>{p.location}</td>
              <td style={{ padding: '8px' }}>{formatHuman(p.expirationDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
