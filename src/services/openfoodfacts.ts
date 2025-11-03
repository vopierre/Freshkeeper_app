export interface OFFProduct {
  product_name?: string
  brands?: string
  quantity?: string
  image_front_url?: string
  categories?: string
}

export async function fetchOFF(barcode: string): Promise<OFFProduct | null> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  if (data.status !== 1) return null
  return data.product as OFFProduct
}
