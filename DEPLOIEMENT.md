# 🚀 Guide de déploiement rapide - FreshKeeper

Ce guide vous explique comment déployer rapidement FreshKeeper pour pouvoir l'installer sur mobile.

## 🎯 Méthode la plus simple : Netlify (Recommandé)

### Étape 1 : Préparer les icônes

1. Ouvrez `scripts/generate-icons.html` dans votre navigateur
2. Cliquez sur "Télécharger toutes les icônes"
3. Déplacez tous les fichiers PNG dans le dossier `/public`

### Étape 2 : Build du projet

```bash
npm install
npm run build
```

Le dossier `/dist` contient maintenant votre application prête pour le déploiement.

### Étape 3 : Déployer sur Netlify

#### Option A : Glisser-déposer (le plus simple)

1. Allez sur [netlify.com](https://www.netlify.com/)
2. Créez un compte (gratuit)
3. Glissez le dossier `/dist` sur la zone de dépôt
4. Attendez quelques secondes
5. ✅ Votre app est en ligne avec HTTPS !

#### Option B : Via CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Étape 4 : Configurer les variables d'environnement

Sur Netlify, allez dans :
1. **Site settings** > **Build & deploy** > **Environment variables**
2. Ajoutez : `VITE_SPOONACULAR_API_KEY` avec votre clé API

### Étape 5 : Installer sur mobile

Ouvrez l'URL Netlify sur votre smartphone et suivez les instructions dans `INSTALLATION_MOBILE.md`.

---

## 🌐 Alternative : Vercel

```bash
npm install -g vercel
vercel --prod
```

Suivez les instructions à l'écran. Vercel fournit aussi HTTPS automatiquement.

---

## 📱 Alternative : GitHub Pages

1. Installez gh-pages :
```bash
npm install --save-dev gh-pages
```

2. Ajoutez dans `package.json` :
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Déployez :
```bash
npm run deploy
```

4. Activez GitHub Pages dans les settings du repo
5. Votre app sera disponible à : `https://votre-username.github.io/freshkeeper`

---

## 🔒 Important : Sécurité de la clé API

⚠️ **La clé API Spoonacular est exposée côté client dans cette version.**

Pour la production, considérez :
1. Créer un backend proxy pour les appels API
2. Utiliser des services comme Netlify Functions ou Vercel Serverless
3. Implémenter un rate limiting

Exemple de Netlify Function (`netlify/functions/recipes.js`) :

```javascript
const fetch = require('node-fetch')

exports.handler = async (event) => {
  const API_KEY = process.env.SPOONACULAR_API_KEY
  const ingredients = event.queryStringParameters.ingredients

  const response = await fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}`
  )

  return {
    statusCode: 200,
    body: await response.text()
  }
}
```

---

## 🧪 Tester localement avant déploiement

### Sur votre ordinateur :
```bash
npm run dev
```

### Sur votre réseau local (pour tester sur mobile) :
```bash
npm run dev -- --host
```

Notez l'adresse réseau affichée (ex: `http://192.168.1.100:5173`) et ouvrez-la sur votre mobile.

---

## ✅ Checklist avant déploiement

- [ ] Icônes générées et placées dans `/public`
- [ ] Build réussi (`npm run build`)
- [ ] Clé API Spoonacular configurée
- [ ] Variables d'environnement configurées sur la plateforme d'hébergement
- [ ] Testé en local
- [ ] `manifest.json` correctement configuré
- [ ] Service Worker fonctionnel

---

## 🎉 Voilà !

Votre application est maintenant accessible en ligne et installable sur mobile !

URL de votre app → Ouvrir sur mobile → Ajouter à l'écran d'accueil → Profiter de FreshKeeper !
