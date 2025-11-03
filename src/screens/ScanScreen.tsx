import { ChevronRight } from 'lucide-react'
import BarcodeScanner from '../components/BarcodeScanner'
import type { Screen } from '../App'

interface ScanScreenProps {
  setCurrentScreen: (screen: Screen) => void
  onBarcodeDetected: (barcode: string) => void
}

export default function ScanScreen({ setCurrentScreen, onBarcodeDetected }: ScanScreenProps) {
  return (
    <div className="bg-gray-900 min-h-screen relative pb-24">
      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => setCurrentScreen('home')}
          className="text-white flex items-center gap-2"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
          <span>Retour</span>
        </button>
      </div>

      {/* Scanner intégré */}
      <div className="px-6">
        <BarcodeScanner onDetected={onBarcodeDetected} />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-0 right-0 bg-white rounded-t-3xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Scannez le code-barres</h2>
        <p className="text-gray-600 mb-4">Positionnez le code dans le cadre</p>

        <button
          onClick={() => setCurrentScreen('add')}
          className="w-full bg-gray-100 text-gray-700 rounded-xl p-4 font-semibold hover:bg-gray-200 transition-colors"
        >
          Saisir manuellement
        </button>
      </div>
    </div>
  )
}
