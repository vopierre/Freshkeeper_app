import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { db } from '../db';
import { scheduleFor } from '../services/notifications';
import { v4 as uuid } from 'uuid';
import { fetchOFF } from '../services/openfoodfacts';
export default function ProductForm({ onSaved, scannedBarcode }) {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [barcode, setBarcode] = useState('');
    const [location, setLocation] = useState('fridge');
    const [expirationDate, setExpirationDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    // Gérer le code-barres scanné
    useEffect(() => {
        if (scannedBarcode) {
            setBarcode(scannedBarcode);
        }
    }, [scannedBarcode]);
    // Auto-remplissage quand le code-barres change
    useEffect(() => {
        if (barcode.length >= 8) {
            autoFillFromBarcode(barcode);
        }
    }, [barcode]);
    async function autoFillFromBarcode(code) {
        setLoading(true);
        try {
            const product = await fetchOFF(code);
            if (product) {
                if (product.product_name)
                    setName(product.product_name);
                if (product.brands)
                    setBrand(product.brands);
                if (product.quantity)
                    setQuantity(product.quantity);
            }
        }
        catch (error) {
            console.error('Erreur OpenFoodFacts:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function save() {
        if (!name || !expirationDate)
            return;
        const now = new Date().toISOString();
        const product = {
            id: uuid(),
            barcode: barcode || undefined,
            name,
            brand: brand || undefined,
            quantity: quantity || undefined,
            location,
            expirationDate,
            createdAt: now,
            updatedAt: now
        };
        await db.products.add(product);
        await scheduleFor(product);
        setName('');
        setBrand('');
        setBarcode('');
        setQuantity('');
        setExpirationDate('');
        onSaved?.();
    }
    return (_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Ajouter un produit" }), _jsxs("div", { className: "row", children: [_jsx("label", { children: "Nom" }), _jsx("input", { value: name, onChange: e => setName(e.target.value), placeholder: "Yaourt nature" })] }), _jsxs("div", { className: "row", children: [_jsx("label", { children: "Marque" }), _jsx("input", { value: brand, onChange: e => setBrand(e.target.value), placeholder: "Yoplait" })] }), _jsxs("div", { className: "row", children: [_jsx("label", { children: "Code-barres" }), _jsx("input", { value: barcode, onChange: e => setBarcode(e.target.value), placeholder: "3274080005003" })] }), _jsxs("div", { className: "row", children: [_jsx("label", { children: "Quantit\u00E9" }), _jsx("input", { value: quantity, onChange: e => setQuantity(e.target.value), placeholder: "4x125g" })] }), _jsxs("div", { className: "row", children: [_jsx("label", { children: "Lieu" }), _jsxs("select", { value: location, onChange: e => setLocation(e.target.value), children: [_jsx("option", { value: "fridge", children: "Frigo" }), _jsx("option", { value: "freezer", children: "Cong\u00E9lo" }), _jsx("option", { value: "pantry", children: "Placard" })] })] }), _jsxs("div", { className: "row", children: [_jsx("label", { children: "Expiration" }), _jsx("input", { type: "date", value: expirationDate, onChange: e => setExpirationDate(e.target.value) })] }), _jsx("button", { onClick: save, disabled: loading || !name || !expirationDate, children: loading ? 'Chargement...' : 'Ajouter' })] }));
}
