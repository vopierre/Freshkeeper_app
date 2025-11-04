import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
export default function BarcodeScanner({ onDetected }) {
    const videoRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const streamRef = useRef(null);
    // Fonction de nettoyage pour arrêter le stream
    const cleanup = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };
    useEffect(() => {
        return () => {
            // Cleanup on unmount
            cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function startScan() {
        setError('');
        setIsScanning(true);
        try {
            // Obtenir le stream de la caméra
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Préférer la caméra arrière
            });
            streamRef.current = stream;
            // Attacher le stream à la vidéo
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            // Créer le reader et démarrer le scan
            const reader = new BrowserMultiFormatReader();
            // Scanner en continu
            reader.decodeFromVideoElement(videoRef.current, (result, error) => {
                if (result) {
                    const barcode = result.getText();
                    console.log('Code-barres détecté:', barcode);
                    onDetected(barcode);
                    stopScan();
                }
                // Ignorer les erreurs de scan (pas de code trouvé)
            });
        }
        catch (err) {
            console.error('Erreur scanner:', err);
            setError('Erreur lors de l\'accès à la caméra');
            setIsScanning(false);
        }
    }
    function stopScan() {
        // Arrêter le stream vidéo
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        // Arrêter la vidéo
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    }
    return (_jsxs("div", { className: "flex flex-col items-center", children: [error && (_jsx("div", { className: "bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 w-full", children: _jsx("p", { className: "text-red-700 font-semibold text-center", children: error }) })), isScanning ? (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "relative", children: [_jsx("video", { ref: videoRef, className: "w-full max-w-md border-4 border-green-400 rounded-2xl shadow-xl", autoPlay: true, playsInline: true }), _jsx("div", { className: "absolute top-1/2 left-0 w-full h-0.5 bg-green-400 animate-pulse" })] }), _jsx("button", { onClick: stopScan, className: "mt-4 w-full bg-red-500 text-white rounded-xl p-4 font-semibold hover:bg-red-600 transition-colors", children: "Arr\u00EAter le scan" })] })) : (_jsx("button", { onClick: startScan, className: "w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 font-semibold hover:shadow-lg transition-shadow", children: "D\u00E9marrer le scan" }))] }));
}
