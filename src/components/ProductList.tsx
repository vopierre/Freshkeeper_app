import { useEffect, useState } from 'react'
import { db } from '../db'
import { formatHuman } from '../utils/date'
import type { Product } from '../types'
import dayjs from 'dayjs'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const all = await db.products.toArray()
      all.sort((a,b)=> a.expirationDate.localeCompare(b.expirationDate))
      if (mounted) setProducts(all)
    }
    load()
    const id = setInterval(load, 2000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

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
              <td style={{ padding: '8px' }}>{p.name}</td>
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
