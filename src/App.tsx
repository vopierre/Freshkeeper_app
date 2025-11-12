import { useState, useEffect } from 'react'
import { Camera, Sparkles, Home, List, Receipt } from 'lucide-react'
import HomeScreen from './screens/HomeScreen'
import ScanScreen from './screens/ScanScreen'
import AddProductScreen from './screens/AddProductScreen'
import ProductListScreen from './screens/ProductListScreen'
import RecipeIdeasScreen from './screens/RecipeIdeasScreen'
import ReceiptScanScreen from './screens/ReceiptScanScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import { ensurePermission, startInTabScheduler } from './services/notifications'

export type Screen = 'home' | 'scan' | 'add' | 'list' | 'ideas' | 'receipt' | 'notifications'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [scannedBarcode, setScannedBarcode] = useState<string>('')

  // Initialiser les notifications au démarrage
  useEffect(() => {
    ensurePermission()
    startInTabScheduler()
  }, [])

  function handleBarcodeDetected(barcode: string) {
    setScannedBarcode(barcode)
    setCurrentScreen('add')
  }

  // Logo FreshKeep Component
  const FreshKeepLogo = () => (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <div className="relative">
            <div className="w-7 h-8 bg-white rounded-sm relative">
              <div className="absolute top-0 left-0 right-0 h-3 border-b border-green-200"></div>
              <div className="absolute top-1 right-1 w-0.5 h-1.5 bg-green-400 rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-0.5 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute top-1 left-1.5 w-1 h-1 bg-green-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 leading-none">FreshKeep</h1>
        <p className="text-xs text-emerald-600 font-semibold">Zéro gaspillage</p>
      </div>
    </div>
  )

  const screens = {
    home: <HomeScreen setCurrentScreen={setCurrentScreen} logo={<FreshKeepLogo />} />,
    scan: <ScanScreen setCurrentScreen={setCurrentScreen} onBarcodeDetected={handleBarcodeDetected} />,
    add: <AddProductScreen setCurrentScreen={setCurrentScreen} scannedBarcode={scannedBarcode} />,
    list: <ProductListScreen setCurrentScreen={setCurrentScreen} />,
    ideas: <RecipeIdeasScreen setCurrentScreen={setCurrentScreen} />,
    receipt: <ReceiptScanScreen setCurrentScreen={setCurrentScreen} />,
    notifications: <NotificationsScreen setCurrentScreen={setCurrentScreen} />
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl relative min-h-screen">
      {screens[currentScreen]}

      {/* Menu de navigation en bas */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center px-4 py-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'home'
                ? 'bg-emerald-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <Home className={`w-6 h-6 ${currentScreen === 'home' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${currentScreen === 'home' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Accueil
            </span>
          </button>

          <button
            onClick={() => setCurrentScreen('list')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'list'
                ? 'bg-emerald-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <List className={`w-6 h-6 ${currentScreen === 'list' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${currentScreen === 'list' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Liste
            </span>
          </button>

          <button
            onClick={() => setCurrentScreen('scan')}
            className="relative -mt-8"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-xl">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('ideas')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'ideas'
                ? 'bg-emerald-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <Sparkles className={`w-6 h-6 ${currentScreen === 'ideas' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${currentScreen === 'ideas' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Recettes
            </span>
          </button>

          <button
            onClick={() => setCurrentScreen('receipt')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'receipt'
                ? 'bg-emerald-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <Receipt className={`w-6 h-6 ${currentScreen === 'receipt' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${currentScreen === 'receipt' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Ticket
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
