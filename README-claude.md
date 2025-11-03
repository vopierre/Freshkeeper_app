
### 🧠 README-CLAUDE.md

# 🎯 Projet : **FreshKeeper**
Application mobile & PWA pour **gérer les dates de péremption des produits alimentaires**, éviter le gaspillage et proposer des recettes anti-gaspillage.

---

## 📱 Objectif global

Créer une application **cross-platform** (React Web → ensuite Capacitor Android/iOS) qui :

1. Permet d’ajouter des produits alimentaires (nom, marque, lieu, date de péremption…)
2. Lit automatiquement les informations produit via **OpenFoodFacts**
3. Peut **scanner la date de péremption avec la caméra** (OCR)
4. **Alerte** l’utilisateur avant l’expiration (J-7, J-3, J-1, J0)
5. À terme : suggère des **recettes anti-gaspillage** basées sur les produits proches de la date.

---

## 🧩 Stack actuelle

| Domaine | Choix |
|----------|-------|
| Framework | React + Vite + TypeScript |
| Base locale | Dexie (IndexedDB) |
| OCR | Tesseract.js (web, remplacera ML Kit mobile) |
| Notifications | Web Notifications (fallback) |
| API produits | OpenFoodFacts (`/api/v2/product/{barcode}.json`) |
| Build mobile futur | Capacitor + ML Kit + Local Notifications |

---

## ✅ Déjà implémenté

- [x] **Formulaire produit** (`ProductForm.tsx`) : ajout + planification J-7/J-3/J-1/J0
- [x] **Liste** (`ProductList.tsx`) : tri par date d’expiration
- [x] **OCR** (`ScanExpiry.tsx`) : photo → extraction de date
- [x] **Base Dexie** (`db.ts`)
- [x] **Notifications** (fallback Web)
- [x] **Test OpenFoodFacts** (requête par code-barres)

---

## 🧭 Tâches prioritaires

### Itération 1 : compléter le MVP
1. **Scanner code-barres (web)** : intégrer `@zxing/browser` (ou `quagga2`) dans un composant `BarcodeScanner.tsx`.
   - Lire EAN-13 depuis la caméra.
   - Au succès : `fetchOFF(barcode)` → pré-remplir le formulaire (nom, marque, quantité, image).
2. **Préremplissage OFF → formulaire** : passer les valeurs au `ProductForm` via props/context.
3. **Suppression produit** : bouton 🗑️ dans `ProductList`, suppression des notifications associées.
4. **Filtres/liste** : onglets ou chips — `Bientôt périmés` (≤7j), `Périmés`, `Tous`.
5. **Export/Import JSON** : utilitaire Dexie → sauvegarde/restauration de toute la base.

### Itération 2 : mobile Capacitor
1. Ajouter Capacitor + `@capacitor/local-notifications` (vraies notifs système, même app fermée).
2. Remplacer Tesseract.js par **ML Kit** (OCR on-device, plus rapide).
3. Packager Android (puis iOS).

### Itération 3 : Recettes anti-gaspillage
- Écran “Recettes” : proposer des idées en fonction des produits les plus urgents.
- MVP : règles locales simples (ex. pâtes + tomate → “pâtes sauce tomate”).
- V2 : API de recettes avec filtres par ingrédients.

---

## 📂 Structure
```
freshkeeper-react/
├─ src/
│  ├─ components/
│  │  ├─ ProductForm.tsx
│  │  ├─ ProductList.tsx
│  │  └─ ScanExpiry.tsx
│  ├─ services/
│  │  ├─ openfoodfacts.ts
│  │  ├─ notifications.ts
│  │  └─ ocr.ts
│  ├─ utils/date.ts
│  ├─ db.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
├─ package.json
├─ vite.config.ts
├─ README.md
└─ README-claude.md   👈 (ce fichier)
```

---

## 🧑‍💻 Instructions pour Claude Code

Claude, tu es l’assistant technique du projet **FreshKeeper**.  
Ton rôle :

- Garder en tête les **use cases clés** : ajout, scan, notification, anti-gaspillage.
- Produire du **code React propre, typé, modulaire**.
- Utiliser **Dexie** pour le stockage local.
- Documenter les choix dans des commentaires concis ou `*.md`.
- Prioriser les **petites itérations livrables** (PRs courtes).

### Commandes utiles
- Démarrer : `npm i && npm run dev`
- Build : `npm run build`

### Points d’attention
- Les **notifications web** ne fonctionnent que si l’onglet est ouvert : objectif futur = Capacitor Local Notifications.
- L’**OCR Tesseract** peut être lent : migrer vers ML Kit pour la version mobile.
- Respecter la locale **FR** pour le parsing/affichage des dates (format `DD/MM/YYYY` côté UI).

---

## ✅ Critères d’acceptation (itération 1)
- [ ] Scanner code-barres (web) fonctionnel et stable sur smartphone.
- [ ] Préremplissage automatique OFF → formulaire.
- [ ] Suppression produit + planifications associées.
- [ ] Filtres de liste opérationnels (≤7j, périmés, tous).
- [ ] Export/Import JSON opérationnel.
