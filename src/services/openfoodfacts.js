export async function fetchOFF(barcode) {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
    const res = await fetch(url);
    if (!res.ok)
        return null;
    const data = await res.json();
    if (data.status !== 1)
        return null;
    return data.product;
}
