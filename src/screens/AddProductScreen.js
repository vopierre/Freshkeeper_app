import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { db } from '../db';
import { scheduleFor } from '../services/notifications';
import { fetchOFF } from '../services/openfoodfacts';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
export default function AddProductScreen({ setCurrentScreen, scannedBarcode }) {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [barcode, setBarcode] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [expirationDate, setExpirationDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [productDetected, setProductDetected] = useState(false);
    // Auto-remplissage depuis le scan
    useEffect(() => {
        if (scannedBarcode) {
            setBarcode(scannedBarcode);
            autoFillFromBarcode(scannedBarcode);
        }
    }, [scannedBarcode]);
    async function autoFillFromBarcode(code) {
        setLoading(true);
        try {
            const product = await fetchOFF(code);
            if (product) {
                setProductDetected(true);
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
    async function handleSave() {
        if (!name || !expirationDate)
            return;
        const now = new Date().toISOString();
        const product = {
            id: uuid(),
            barcode: barcode || undefined,
            name,
            brand: brand || undefined,
            quantity: quantity || undefined,
            location: 'fridge',
            expirationDate,
            createdAt: now,
            updatedAt: now
        };
        await db.products.add(product);
        await scheduleFor(product);
        // Réinitialiser et retourner à l'accueil
        setName('');
        setBrand('');
        setBarcode('');
        setQuantity('1');
        setExpirationDate('');
        setProductDetected(false);
        setCurrentScreen('home');
    }
    const daysUntilExpiry = expirationDate ? dayjs(expirationDate).diff(dayjs(), 'day') : null;
    return (_jsx("div", { className: "bg-white min-h-screen pb-24", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("button", { onClick: () => setCurrentScreen('home'), className: "flex items-center gap-2 text-gray-700", children: _jsx(ChevronRight, { className: "w-6 h-6 rotate-180" }) }), _jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Ajouter un produit" }), _jsx("div", { className: "w-8" })] }), productDetected && (_jsxs("div", { className: "bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6", children: [_jsx("p", { className: "text-sm text-green-700 font-semibold mb-1", children: "\u2713 Produit reconnu" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: name }), brand && _jsxs("p", { className: "text-sm text-gray-600", children: [brand, " - ", quantity] })] })), loading && (_jsx("div", { className: "bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 text-center", children: _jsx("p", { className: "text-blue-700 font-semibold", children: "Chargement des informations..." }) })), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-2", children: "Nom du produit" }), _jsx("input", { type: "text", value: name, onChange: e => setName(e.target.value), placeholder: "Yaourt nature", className: "w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-2", children: "Marque" }), _jsx("input", { type: "text", value: brand, onChange: e => setBrand(e.target.value), placeholder: "Danone", className: "w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-3", children: "Date de p\u00E9remption *" }), _jsx("input", { type: "date", value: expirationDate, onChange: e => setExpirationDate(e.target.value), className: "w-full text-2xl font-bold text-center p-6 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" }), daysUntilExpiry !== null && (_jsxs("p", { className: "text-center text-sm text-gray-500 mt-2", children: ["Dans ", daysUntilExpiry, " jour", daysUntilExpiry > 1 ? 's' : ''] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900 mb-2", children: "Quantit\u00E9" }), _jsx("input", { type: "text", value: quantity, onChange: e => setQuantity(e.target.value), placeholder: "1", className: "w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none" })] })] }), _jsx("button", { onClick: handleSave, disabled: !name || !expirationDate, className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-5 font-bold text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed", children: "Ajouter au frigo" })] }) }));
}
