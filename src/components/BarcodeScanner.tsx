import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import type { Result } from '@zxing/library'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
}

export default function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>('')
  const streamRef = useRef<MediaStream | null>(null)

  // Fonction de nettoyage pour arrêter le stream
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startScan() {
    setError('')
    setIsScanning(true)

    try {
      // Obtenir le stream de la caméra
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Préférer la caméra arrière
      })

      streamRef.current = stream

      // Attacher le stream à la vidéo
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Créer le reader et démarrer le scan
      const reader = new BrowserMultiFormatReader()

      // Scanner en continu
      reader.decodeFromVideoElement(
        videoRef.current!,
        (result: Result | null, error?: Error) => {
          if (result) {
            const barcode = result.getText()
            console.log('Code-barres détecté:', barcode)
            onDetected(barcode)
            stopScan()
          }
          // Ignorer les erreurs de scan (pas de code trouvé)
        }
      )
    } catch (err) {
      console.error('Erreur scanner:', err)
      setError('Erreur lors de l\'accès à la caméra')
      setIsScanning(false)
    }
  }

  function stopScan() {
    // Arrêter le stream vidéo
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Arrêter la vidéo
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 w-full">
          <p className="text-red-700 font-semibold text-center">{error}</p>
        </div>
      )}

      {isScanning ? (
        <div className="w-full">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full max-w-md border-4 border-green-400 rounded-2xl shadow-xl"
              autoPlay
              playsInline
            />
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-400 animate-pulse"></div>
          </div>
          <button
            onClick={stopScan}
            className="mt-4 w-full bg-red-500 text-white rounded-xl p-4 font-semibold hover:bg-red-600 transition-colors"
          >
            Arrêter le scan
          </button>
        </div>
      ) : (
        <button
          onClick={startScan}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-shadow"
        >
          Démarrer le scan
        </button>
      )}
    </div>
  )
}
