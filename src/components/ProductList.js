import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { db } from '../db';
import { formatHuman } from '../utils/date';
import dayjs from 'dayjs';
export default function ProductList() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        let mounted = true;
        async function load() {
            const all = await db.products.toArray();
            all.sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));
            if (mounted)
                setProducts(all);
        }
        load();
        const id = setInterval(load, 2000);
        return () => { mounted = false; clearInterval(id); };
    }, []);
    // Détermine la couleur selon la date de péremption
    function getRowColor(expirationDate) {
        const daysUntilExpiry = dayjs(expirationDate).diff(dayjs(), 'day');
        if (daysUntilExpiry < 3)
            return '#ffcccc'; // Rouge
        if (daysUntilExpiry < 15)
            return '#ffe0b3'; // Orange
        return '#ccffcc'; // Vert
    }
    if (!products.length)
        return _jsx("p", { children: "Aucun produit pour le moment." });
    const soon = products.filter(p => dayjs(p.expirationDate).diff(dayjs(), 'day') <= 7);
    return (_jsxs("div", { className: "card", children: [_jsx("h3", { children: "R\u00E9sultats (tri\u00E9s par p\u00E9remption)" }), _jsxs("p", { children: [soon.length, " bient\u00F4t p\u00E9rim\u00E9(s) (<= 7 jours)"] }), _jsxs("table", { className: "table", style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Nom" }), _jsx("th", { children: "Marque" }), _jsx("th", { children: "Lieu" }), _jsx("th", { children: "Expire le" })] }) }), _jsx("tbody", { children: products.map(p => (_jsxs("tr", { style: {
                                backgroundColor: getRowColor(p.expirationDate),
                                transition: 'background-color 0.3s'
                            }, children: [_jsx("td", { style: { padding: '8px' }, children: p.name }), _jsx("td", { style: { padding: '8px' }, children: p.brand ?? '-' }), _jsx("td", { style: { padding: '8px' }, children: p.location }), _jsx("td", { style: { padding: '8px' }, children: formatHuman(p.expirationDate) })] }, p.id))) })] })] }));
}
