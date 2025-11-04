import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { db } from '../db';
import dayjs from 'dayjs';
import { formatHuman } from '../utils/date';
export default function ProductListScreen({ setCurrentScreen }) {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        loadProducts();
        const interval = setInterval(loadProducts, 2000);
        return () => clearInterval(interval);
    }, []);
    async function loadProducts() {
        const all = await db.products.toArray();
        all.sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));
        setProducts(all);
    }
    function getUrgencyLevel(expirationDate) {
        const days = dayjs(expirationDate).diff(dayjs(), 'day');
        if (days < 3)
            return 'urgent';
        if (days < 15)
            return 'warning';
        return 'ok';
    }
    function getUrgencyLabel(expirationDate) {
        const days = dayjs(expirationDate).diff(dayjs(), 'day');
        if (days < 0)
            return 'Périmé';
        if (days === 0)
            return 'Aujourd\'hui';
        if (days === 1)
            return 'Demain';
        if (days < 7)
            return `${days} jours`;
        return `${days} jours`;
    }
    const urgentProducts = products.filter(p => getUrgencyLevel(p.expirationDate) === 'urgent');
    const warningProducts = products.filter(p => getUrgencyLevel(p.expirationDate) === 'warning');
    const okProducts = products.filter(p => getUrgencyLevel(p.expirationDate) === 'ok');
    return (_jsx("div", { className: "bg-gray-50 min-h-screen pb-24", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("button", { onClick: () => setCurrentScreen('home'), className: "flex items-center gap-2 text-gray-700", children: _jsx(ChevronRight, { className: "w-6 h-6 rotate-180" }) }), _jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Mes produits" }), _jsx(Search, { className: "w-6 h-6 text-gray-400" })] }), _jsxs("div", { className: "bg-white rounded-xl p-4 mb-4 shadow-sm", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total des produits" }), _jsxs("p", { className: "text-3xl font-bold text-gray-900", children: [products.length, " articles"] })] }), urgentProducts.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-sm font-bold text-red-600 mb-3 uppercase tracking-wide", children: "Urgences" }), _jsx("div", { className: "space-y-3 mb-6", children: urgentProducts.map(product => (_jsxs("div", { className: "bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: product.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [product.brand || 'Sans marque', " ", product.quantity && `- ${product.quantity}`] })] }), _jsx("span", { className: "bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full", children: getUrgencyLabel(product.expirationDate) })] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Expire le ", formatHuman(product.expirationDate)] })] }, product.id))) })] })), warningProducts.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-sm font-bold text-orange-600 mb-3 uppercase tracking-wide", children: "\u00C0 surveiller" }), _jsx("div", { className: "space-y-3 mb-6", children: warningProducts.map(product => (_jsxs("div", { className: "bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: product.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [product.brand || 'Sans marque', " ", product.quantity && `- ${product.quantity}`] })] }), _jsx("span", { className: "bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full", children: getUrgencyLabel(product.expirationDate) })] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Expire le ", formatHuman(product.expirationDate)] })] }, product.id))) })] })), okProducts.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide", children: "Reste du frigo" }), _jsx("div", { className: "space-y-2", children: okProducts.map(product => (_jsx("div", { className: "bg-white rounded-xl p-4 shadow-sm", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: product.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [product.brand || 'Sans marque', " ", product.quantity && `- ${product.quantity}`] })] }), _jsx("span", { className: "text-sm text-gray-500", children: getUrgencyLabel(product.expirationDate) })] }) }, product.id))) })] })), products.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-500", children: "Aucun produit pour le moment" }), _jsx("button", { onClick: () => setCurrentScreen('scan'), className: "mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold", children: "Scanner un produit" })] }))] }) }));
}
