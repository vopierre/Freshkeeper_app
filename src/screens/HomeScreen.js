import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Bell, Camera, Filter, Sparkles, AlertCircle, Clock, Calendar } from 'lucide-react';
import { db } from '../db';
import dayjs from 'dayjs';
export default function HomeScreen({ setCurrentScreen, logo }) {
    const [products, setProducts] = useState([]);
    const [urgentCount, setUrgentCount] = useState({ today: 0, threeDays: 0, week: 0 });
    useEffect(() => {
        loadProducts();
        const interval = setInterval(loadProducts, 2000);
        return () => clearInterval(interval);
    }, []);
    async function loadProducts() {
        const all = await db.products.toArray();
        setProducts(all);
        // Calculer les urgences
        const now = dayjs();
        const today = all.filter(p => dayjs(p.expirationDate).diff(now, 'day') < 3).length;
        const threeDays = all.filter(p => {
            const days = dayjs(p.expirationDate).diff(now, 'day');
            return days >= 3 && days < 15;
        }).length;
        const week = all.filter(p => {
            const days = dayjs(p.expirationDate).diff(now, 'day');
            return days >= 15;
        }).length;
        setUrgentCount({ today, threeDays, week });
    }
    const totalUrgent = urgentCount.today + urgentCount.threeDays + urgentCount.week;
    return (_jsx("div", { className: "bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen pb-24", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-8", children: [logo, _jsxs("button", { className: "p-2 bg-white rounded-full shadow-sm relative", children: [_jsx(Bell, { className: "w-6 h-6 text-gray-700" }), urgentCount.today > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold", children: urgentCount.today }))] })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-lg p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: "\u00C0 traiter en priorit\u00E9" }), _jsx("span", { className: "text-3xl font-bold text-red-600", children: totalUrgent })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between bg-red-50 border-l-4 border-red-500 p-3 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Aujourd'hui / Demain" }), _jsx("p", { className: "text-xs text-gray-600", children: "Consommer rapidement" })] })] }), _jsx("span", { className: "text-2xl font-bold text-red-600", children: urgentCount.today })] }), _jsxs("div", { className: "flex items-center justify-between bg-orange-50 border-l-4 border-orange-500 p-3 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { className: "w-5 h-5 text-orange-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "3-15 jours" }), _jsx("p", { className: "text-xs text-gray-600", children: "Planifier utilisation" })] })] }), _jsx("span", { className: "text-2xl font-bold text-orange-600", children: urgentCount.threeDays })] }), _jsxs("div", { className: "flex items-center justify-between bg-green-50 border-l-4 border-green-500 p-3 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Calendar, { className: "w-5 h-5 text-green-600" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Plus de 15 jours" }), _jsx("p", { className: "text-xs text-gray-600", children: "Bien conserv\u00E9" })] })] }), _jsx("span", { className: "text-2xl font-bold text-green-600", children: urgentCount.week })] })] })] }), _jsxs("button", { onClick: () => setCurrentScreen('scan'), className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl mb-4 hover:shadow-2xl transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-center gap-3", children: [_jsx(Camera, { className: "w-8 h-8" }), _jsx("span", { className: "text-xl font-bold", children: "Scanner un produit" })] }), _jsx("p", { className: "text-sm text-green-100 mt-2", children: "Ajoutez rapidement vos courses" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("button", { onClick: () => setCurrentScreen('list'), className: "bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "bg-blue-100 p-3 rounded-full", children: _jsx(Filter, { className: "w-6 h-6 text-blue-600" }) }), _jsx("span", { className: "font-semibold text-gray-900 text-sm", children: "Mes produits" })] }) }), _jsx("button", { onClick: () => setCurrentScreen('ideas'), className: "bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "bg-purple-100 p-3 rounded-full", children: _jsx(Sparkles, { className: "w-6 h-6 text-purple-600" }) }), _jsx("span", { className: "font-semibold text-gray-900 text-sm", children: "Id\u00E9es recettes" })] }) })] })] }) }));
}
