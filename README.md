# FreshKeeper (React + Vite + IndexedDB)

MVP pour suivre les dates de péremption : ajout de produits, OCR basique de la date (photo), intégration OpenFoodFacts, notifications web (fallback).

## Prérequis
- Node 18+
- npm ou pnpm

## Assets static (icônes, splash, manifest)
Placez vos fichiers statiques (icon-32x32.png, icon-16x16.png, apple-touch-icon.png, manifest.json, splash-*.png, sw.js, ...) dans le dossier `public/` à la racine du projet. Vite copie automatiquement `public/*` dans `dist/` lors du build, ce qui permet aux chemins `%BASE_URL%...` dans `index.html` de fonctionner correctement sur GitHub Pages (/Freshkeeper_App/).

Exemple :

```
Freshkeeper_app/
├─ public/
│  ├─ icon-32x32.png
│  ├─ icon-16x16.png
│  ├─ apple-touch-icon.png
│  ├─ manifest.json
│  ├─ splash-640x1136.png
│  └─ sw.js
├─ src/
└─ vite.config.ts
```

## Installation
```bash
npm i
npm run dev
```
Ouvre ensuite l'URL affichée (généralement http://localhost:5173).

## Fonctionnalités incluses
- **Base locale**: IndexedDB (Dexie)
- **Formulaire produit**: nom, marque, code-barres, lieu, date d'expiration
- **Liste**: tri par date d'expiration + indicateur "bientôt périmés"
- **OCR**: Tesseract.js (photo depuis la caméra du smartphone)
- **OpenFoodFacts**: recherche par code-barres (pré-remplissage possible)
- **Notifications**: Web Notifications (tab ouvert) + planification en DB

## Limites & TODO
- Web notifications ne se déclenchent que si l'onglet est ouvert (fallback). Pour **mobile app** avec notifications système, packager avec **Capacitor** + plugin Local Notifications.
- OCR Tesseract (web) = plus lent que ML Kit on-device. Pour une app mobile, préférer ML Kit via Capacitor.
- Pas de scan code-barres intégré (peut s'ajouter via quagga2 ou zxing pour web, ou ML Kit côté natif).

## Aller plus loin (Capacitor)
```bash
npm i @capacitor/core @capacitor/cli @capacitor/local-notifications
npx cap init freshkeeper com.example.freshkeeper
npm run build
npx cap add android
npx cap add ios
npx cap sync
```
Puis remplacer l'OCR Tesseract par ML Kit, et ajouter un scanner code-barres.

---

## Memo
- Dans le cas des aliments type fruit / legumes. La date doit être celle d'achat et non de peremption
- L'app doit pouvoir determiner le nom de jours que "dure" un F&L
Made with ❤️

## Test modif
