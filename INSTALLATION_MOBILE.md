# 📱 Installation de FreshKeeper sur Mobile

Ce guide vous explique comment installer FreshKeeper comme une application native sur votre smartphone (iOS ou Android).

## 🎯 Prérequis

- Un smartphone iOS (Safari) ou Android (Chrome)
- Une connexion internet
- L'application doit être hébergée sur un serveur HTTPS

---

## 📦 Étape 1 : Générer les icônes

1. Ouvrez le fichier `scripts/generate-icons.html` dans votre navigateur
2. Les icônes sont générées automatiquement
3. Cliquez sur **"Télécharger toutes les icônes"**
4. Placez tous les fichiers PNG téléchargés dans le dossier `/public` de votre projet

Les icônes générées :
- `icon-16x16.png`
- `icon-32x32.png`
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `apple-touch-icon.png` (180x180)
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

---

## 🏗️ Étape 2 : Build de production

### Option A : Hébergement local (pour tests)

1. Installez les dépendances (si pas déjà fait) :
   ```bash
   npm install
   ```

2. Lancez le serveur de développement accessible sur le réseau :
   ```bash
   npm run dev
   ```

3. Notez l'adresse réseau affichée dans le terminal, par exemple :
   ```
   Network: http://192.168.1.100:5173
   ```

4. Ouvrez cette URL sur votre smartphone (connecté au même réseau Wi-Fi)

### Option B : Build pour production

1. Compilez l'application :
   ```bash
   npm run build
   ```

2. Testez le build localement :
   ```bash
   npm run preview
   ```

3. Les fichiers de production sont dans le dossier `/dist`

---

## 🌐 Étape 3 : Héberger l'application

Pour installer l'app sur mobile, elle doit être accessible via HTTPS. Voici plusieurs options :

### Option 1 : Netlify (Gratuit et recommandé)

1. Créez un compte sur [Netlify](https://www.netlify.com/)
2. Glissez-déposez le dossier `/dist` sur Netlify
3. Votre app est maintenant en ligne avec HTTPS automatique !
4. Notez l'URL donnée (ex: `https://freshkeeper-xyz.netlify.app`)

### Option 2 : Vercel (Gratuit)

1. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```

2. Déployez :
   ```bash
   vercel --prod
   ```

3. Suivez les instructions et notez l'URL de déploiement

### Option 3 : GitHub Pages

1. Ajoutez dans `package.json` :
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

2. Installez gh-pages :
   ```bash
   npm install --save-dev gh-pages
   ```

3. Déployez :
   ```bash
   npm run deploy
   ```

### Option 4 : Serveur personnel avec HTTPS

Si vous avez un serveur avec un domaine et un certificat SSL :
1. Uploadez le contenu du dossier `/dist` vers votre serveur
2. Configurez NGINX/Apache pour servir les fichiers
3. Assurez-vous que HTTPS est actif

---

## 📲 Étape 4 : Installation sur iOS (Safari)

1. Ouvrez l'URL de votre application dans **Safari**
2. Appuyez sur le bouton **Partager** (icône avec flèche vers le haut)
3. Faites défiler et sélectionnez **"Sur l'écran d'accueil"**
4. Personnalisez le nom si nécessaire
5. Appuyez sur **"Ajouter"**

✅ L'icône FreshKeeper apparaît maintenant sur votre écran d'accueil !

### Notes iOS :
- Safari est le seul navigateur qui supporte pleinement les PWA sur iOS
- L'app se lance en plein écran sans la barre d'adresse
- Les données sont stockées localement avec IndexedDB

---

## 📲 Étape 5 : Installation sur Android (Chrome)

### Méthode automatique :

1. Ouvrez l'URL de votre application dans **Chrome**
2. Une bannière apparaîtra automatiquement : **"Installer l'application"**
3. Appuyez sur **"Installer"**
4. Confirmez l'installation

### Méthode manuelle (si la bannière n'apparaît pas) :

1. Ouvrez l'URL dans Chrome
2. Appuyez sur le menu **⋮** (trois points en haut à droite)
3. Sélectionnez **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**
4. Confirmez l'installation

✅ FreshKeeper est maintenant installée comme une app native !

### Notes Android :
- Chrome, Edge, et Firefox supportent les PWA sur Android
- L'app apparaît dans le tiroir d'applications
- Vous pouvez la désinstaller comme n'importe quelle app

---

## 🔍 Vérifier que la PWA fonctionne

### Avant l'installation :

1. Ouvrez les DevTools de votre navigateur (F12)
2. Allez dans l'onglet **Application** (Chrome) ou **Stockage** (Firefox)
3. Vérifiez :
   - ✅ **Manifest** : Le fichier manifest.json est chargé
   - ✅ **Service Worker** : Le SW est enregistré et actif
   - ✅ **Icônes** : Les icônes sont disponibles

### Après l'installation :

1. Ouvrez l'app depuis l'écran d'accueil
2. Vérifiez que l'app se lance en **plein écran** (sans barre d'adresse)
3. Testez le **mode hors ligne** :
   - Activez le mode avion
   - Ouvrez l'app
   - Les données locales doivent être accessibles

---

## 🚀 Fonctionnalités PWA de FreshKeeper

✅ **Installation sur l'écran d'accueil**
✅ **Fonctionnement hors ligne** (données locales)
✅ **Icône personnalisée**
✅ **Écran de démarrage** (splash screen)
✅ **Mode plein écran** (standalone)
✅ **Thème couleur** (barre d'état verte)
✅ **Raccourcis d'app** (Scanner, Ajouter, Recettes)
✅ **Cache intelligent** pour performance optimale

---

## ⚙️ Configuration avancée

### Personnaliser le thème

Modifiez la couleur du thème dans `manifest.json` :
```json
"theme_color": "#10b981"
```

### Ajouter des raccourcis personnalisés

Éditez la section `shortcuts` dans `manifest.json` :
```json
"shortcuts": [
  {
    "name": "Votre raccourci",
    "url": "/?screen=custom",
    "icons": [...]
  }
]
```

### Modifier la stratégie de cache

Éditez `public/sw.js` pour personnaliser le comportement du cache.

---

## 🐛 Dépannage

### L'app ne s'installe pas

**iOS :**
- Vérifiez que vous utilisez Safari (pas Chrome ou Firefox)
- Assurez-vous que l'URL est en HTTPS
- Vérifiez que le manifest.json est accessible

**Android :**
- Videz le cache de Chrome : Paramètres > Confidentialité > Effacer les données
- Vérifiez que HTTPS est actif
- Réessayez après avoir rechargé la page

### Les icônes ne s'affichent pas

1. Vérifiez que tous les fichiers PNG sont dans `/public`
2. Vérifiez que les chemins dans `manifest.json` sont corrects
3. Videz le cache et réinstallez l'app

### Le Service Worker ne fonctionne pas

1. Ouvrez les DevTools > Console
2. Cherchez les erreurs liées au Service Worker
3. Assurez-vous que l'app est servie en HTTPS (localhost exception)
4. Désenregistrez l'ancien SW : DevTools > Application > Service Workers > Unregister

### Les données disparaissent

- IndexedDB peut être effacé par le système si l'espace est faible
- Sur iOS, les données PWA peuvent être supprimées après 7 jours d'inactivité
- Solution : Utilisez l'app régulièrement

---

## 📊 Tester sur différents appareils

### Tester localement (même réseau Wi-Fi) :

1. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Notez l'adresse réseau (ex: `http://192.168.1.100:5173`)

3. Ouvrez cette adresse sur votre mobile

4. Ajoutez à l'écran d'accueil pour tester

**Note :** En HTTP (non HTTPS), certaines fonctionnalités PWA ne fonctionneront pas complètement.

---

## 🔐 Sécurité et vie privée

- ✅ Toutes les données sont stockées localement sur votre appareil
- ✅ Pas de tracking ou d'analytics
- ✅ La clé API Spoonacular est incluse côté client (considérez un backend pour la production)
- ✅ Les photos et codes-barres restent sur votre appareil

---

## 📝 Checklist finale

Avant de déployer en production :

- [ ] Toutes les icônes sont générées et placées dans `/public`
- [ ] Le fichier `manifest.json` est correctement configuré
- [ ] Le Service Worker est fonctionnel
- [ ] L'application fonctionne en HTTPS
- [ ] Les meta tags PWA sont présents dans `index.html`
- [ ] La clé API Spoonacular est configurée dans `.env.local`
- [ ] Le build de production fonctionne (`npm run build`)
- [ ] L'application a été testée sur iOS et Android
- [ ] Le mode hors ligne fonctionne correctement

---

## 🎉 C'est terminé !

Votre application FreshKeeper est maintenant installable sur mobile !

Pour toute question ou problème, référez-vous à :
- Documentation PWA : https://web.dev/progressive-web-apps/
- Vite PWA Plugin : https://vite-pwa-org.netlify.app/
