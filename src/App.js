import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Camera, Sparkles, Home, List, Zap } from 'lucide-react';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import AddProductScreen from './screens/AddProductScreen';
import ProductListScreen from './screens/ProductListScreen';
import RecipeIdeasScreen from './screens/RecipeIdeasScreen';
export default function App() {
    const [currentScreen, setCurrentScreen] = useState('home');
    const [scannedBarcode, setScannedBarcode] = useState('');
    function handleBarcodeDetected(barcode) {
        setScannedBarcode(barcode);
        setCurrentScreen('add');
    }
    // Logo FreshKeep Component
    const FreshKeepLogo = () => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg", children: _jsx("div", { className: "relative", children: _jsxs("div", { className: "w-7 h-8 bg-white rounded-sm relative", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-3 border-b border-green-200" }), _jsx("div", { className: "absolute top-1 right-1 w-0.5 h-1.5 bg-green-400 rounded-full" }), _jsx("div", { className: "absolute bottom-1 right-1 w-0.5 h-2 bg-green-400 rounded-full" }), _jsx("div", { className: "absolute top-1 left-1.5 w-1 h-1 bg-green-300 rounded-full animate-pulse" })] }) }) }), _jsx("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center", children: _jsx(Sparkles, { className: "w-2.5 h-2.5 text-white" }) })] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 leading-none", children: "FreshKeep" }), _jsx("p", { className: "text-xs text-emerald-600 font-semibold", children: "Z\u00E9ro gaspillage" })] })] }));
    const screens = {
        home: _jsx(HomeScreen, { setCurrentScreen: setCurrentScreen, logo: _jsx(FreshKeepLogo, {}) }),
        scan: _jsx(ScanScreen, { setCurrentScreen: setCurrentScreen, onBarcodeDetected: handleBarcodeDetected }),
        add: _jsx(AddProductScreen, { setCurrentScreen: setCurrentScreen, scannedBarcode: scannedBarcode }),
        list: _jsx(ProductListScreen, { setCurrentScreen: setCurrentScreen }),
        ideas: _jsx(RecipeIdeasScreen, { setCurrentScreen: setCurrentScreen })
    };
    return (_jsxs("div", { className: "max-w-md mx-auto bg-white shadow-2xl relative min-h-screen", children: [screens[currentScreen], _jsx("div", { className: "fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg z-50", children: _jsxs("div", { className: "flex justify-around items-center px-4 py-3", children: [_jsxs("button", { onClick: () => setCurrentScreen('home'), className: `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${currentScreen === 'home'
                                ? 'bg-emerald-50'
                                : 'hover:bg-gray-50'}`, children: [_jsx(Home, { className: `w-6 h-6 ${currentScreen === 'home' ? 'text-emerald-600' : 'text-gray-400'}` }), _jsx("span", { className: `text-xs font-semibold ${currentScreen === 'home' ? 'text-emerald-600' : 'text-gray-500'}`, children: "Accueil" })] }), _jsxs("button", { onClick: () => setCurrentScreen('list'), className: `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${currentScreen === 'list'
                                ? 'bg-emerald-50'
                                : 'hover:bg-gray-50'}`, children: [_jsx(List, { className: `w-6 h-6 ${currentScreen === 'list' ? 'text-emerald-600' : 'text-gray-400'}` }), _jsx("span", { className: `text-xs font-semibold ${currentScreen === 'list' ? 'text-emerald-600' : 'text-gray-500'}`, children: "Liste" })] }), _jsx("button", { onClick: () => setCurrentScreen('scan'), className: "relative -mt-8", children: _jsx("div", { className: "bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-xl", children: _jsx(Camera, { className: "w-8 h-8 text-white" }) }) }), _jsxs("button", { onClick: () => setCurrentScreen('ideas'), className: `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${currentScreen === 'ideas'
                                ? 'bg-emerald-50'
                                : 'hover:bg-gray-50'}`, children: [_jsx(Sparkles, { className: `w-6 h-6 ${currentScreen === 'ideas' ? 'text-emerald-600' : 'text-gray-400'}` }), _jsx("span", { className: `text-xs font-semibold ${currentScreen === 'ideas' ? 'text-emerald-600' : 'text-gray-500'}`, children: "Recettes" })] }), _jsxs("button", { className: "flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all", children: [_jsx(Zap, { className: "w-6 h-6 text-gray-400" }), _jsx("span", { className: "text-xs font-semibold text-gray-500", children: "Plus" })] })] }) })] }));
}
