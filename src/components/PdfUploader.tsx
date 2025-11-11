import { useRef, useState } from 'react'
import { FileText, Upload } from 'lucide-react'

interface PdfUploaderProps {
  onPdfSelected: (file: File) => void
}

export default function PdfUploader({ onPdfSelected }: PdfUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier que c'est bien un PDF
    if (file.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF')
      return
    }

    setSelectedFileName(file.name)
    onPdfSelected(file)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {selectedFileName ? (
        <div className="w-full">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-4 border-blue-400 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <FileText className="w-16 h-16 text-blue-600" />
              <p className="text-sm font-semibold text-blue-900 text-center break-all">
                {selectedFileName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedFileName(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            className="mt-4 w-full bg-gray-500 text-white rounded-xl p-3 font-semibold hover:bg-gray-600 transition-colors"
          >
            Changer de fichier
          </button>
        </div>
      ) : (
        <div className="w-full space-y-3">
          {/* Bouton Importer un PDF */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Importer un ticket PDF
          </button>

          {/* Input caché pour le fichier PDF */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 w-full">
        <p className="text-sm text-blue-800 font-semibold mb-2">💡 Conseils pour un bon import :</p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Assurez-vous que le PDF est bien un ticket de caisse</li>
          <li>• Le PDF doit contenir du texte (pas seulement une image)</li>
          <li>• Les produits doivent être clairement listés</li>
          <li>• Les formats de supermarché sont généralement bien supportés</li>
        </ul>
      </div>
    </div>
  )
}
