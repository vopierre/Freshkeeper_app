import { useState } from 'react'
import { extractDateFromImage } from '../services/ocr'

export default function ScanExpiry({ onPick }: { onPick: (iso: string) => void }) {
  const [status, setStatus] = useState<string>('')
  const [preview, setPreview] = useState<string|undefined>(undefined)
  const [suggestion, setSuggestion] = useState<{iso:string, raw?:string, confidence?:number}|null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
    setStatus('OCR en cours...')
    try {
      const res = await extractDateFromImage(f)
      if (res.iso) {
        setSuggestion({ iso: res.iso, raw: res.raw, confidence: res.confidence })
        setStatus('')
      } else {
        setStatus('Aucune date détectée.')
      }
    } catch (err:any) {
      console.error(err)
      setStatus('Erreur OCR')
    }
  }

  return (
    <div className="card">
      <h3>Scanner une date de péremption</h3>
      <input type="file" accept="image/*" capture="environment" onChange={onFile} />
      {preview && <img src={preview} style={{maxWidth:'100%', marginTop:12, borderRadius:8}}/>}
      {status && <p>{status}</p>}
      {suggestion && (
        <div style={{marginTop:8}}>
          <p>Proposition : <b>{suggestion.iso}</b> {suggestion.raw ? `(extrait: ${suggestion.raw})` : ''}</p>
          <button onClick={()=> onPick(suggestion.iso)}>Utiliser cette date</button>
        </div>
      )}
    </div>
  )
}
