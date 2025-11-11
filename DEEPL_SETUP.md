# 🌐 Configuration DeepL pour la traduction des recettes

## Pourquoi DeepL ?

**DeepL** est considéré comme le meilleur service de traduction automatique, particulièrement pour le français :
- ✅ **Qualité supérieure** à Google Translate
- ✅ **Traductions naturelles** et contextuelles
- ✅ **Plan gratuit généreux** : 500 000 caractères/mois
- ✅ **Parfait pour les recettes** : comprend le contexte culinaire

## 📝 Instructions d'installation (5 minutes)

### Étape 1 : Créer un compte DeepL gratuit

1. Allez sur : **https://www.deepl.com/pro-api**
2. Cliquez sur **"Sign up for free"** (S'inscrire gratuitement)
3. Remplissez le formulaire :
   - Email
   - Mot de passe
   - Nom
4. **Vérifiez votre email** et confirmez votre compte

### Étape 2 : Obtenir votre clé API

1. Une fois connecté, allez dans **"Account"** (Compte)
2. Cliquez sur **"Account"** → **"API Keys"**
3. Créez une nouvelle clé API (bouton **"Create Key"**)
4. **Copiez la clé** (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx`)

### Étape 3 : Configurer FreshKeeper

1. Ouvrez le fichier **`.env.local`** à la racine du projet
2. Ajoutez votre clé DeepL :

```env
VITE_DEEPL_API_KEY=votre-cle-deepl-ici:fx
```

3. **Sauvegardez** le fichier

### Étape 4 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C dans le terminal)
# Puis relancez :
npm run dev
```

## ✅ Vérification

### Dans la console du navigateur (F12), vous devriez voir :

```
✅ DeepL: "Grilled Chicken with Tomatoes" → "Poulet grillé aux tomates"
```

### Si vous voyez plutôt :

```
⚠️ LibreTranslate: "..." → "..."
```

**→ La clé DeepL n'est pas configurée**. Vérifiez :
1. Le format de la clé (doit finir par `:fx`)
2. Que vous avez bien sauvegardé `.env.local`
3. Que vous avez redémarré le serveur

## 📊 Plan gratuit DeepL

**Quota mensuel** : 500 000 caractères
- Environ **10 000 traductions** de titres de recettes
- **Largement suffisant** pour un usage personnel

**Exemple d'utilisation** :
- 20 recettes × 50 caractères/titre = 1 000 caractères
- Vous pouvez charger **500 fois** 20 recettes par mois !

## 🔄 Système de fallback intelligent

Si DeepL échoue ou n'est pas configuré :

```
1. DeepL (meilleure qualité) ← Essaie en premier
   ↓ si erreur
2. LibreTranslate (gratuit, qualité moyenne)
   ↓ si erreur
3. Dictionnaire culinaire basique
```

**→ L'application fonctionne TOUJOURS**, même sans clé DeepL !

## 🆚 Comparaison des traductions

### Sans DeepL (LibreTranslate) :
```
"Grilled Chicken with Tomatoes and Basil"
→ "Poulet grillé avec tomates et basilic"
```
✅ Correct mais un peu robotique

### Avec DeepL :
```
"Grilled Chicken with Tomatoes and Basil"
→ "Poulet grillé aux tomates et au basilic"
```
✅ Naturel et idiomatique

## 🔒 Sécurité

- ✅ La clé API est **locale** (fichier `.env.local`)
- ✅ **Pas commitée** sur Git (`.env.local` est dans `.gitignore`)
- ✅ **Pas partagée** avec les utilisateurs de l'app
- ⚠️ **Ne jamais pusher** `.env.local` sur GitHub

## ❓ FAQ

### Que se passe-t-il si je dépasse le quota ?

DeepL retourne une erreur, et le système bascule automatiquement sur LibreTranslate. Aucun crash !

### Puis-je utiliser la clé API gratuite en production ?

**Oui !** Le plan gratuit DeepL permet :
- Usage commercial ✅
- Applications web ✅
- Pas de limite de temps ✅

### Où voir ma consommation ?

Dashboard DeepL : https://www.deepl.com/pro-account/usage

## 🎯 Résultat final

Avec DeepL configuré :
- ✅ Titres de recettes **parfaitement traduits**
- ✅ Traductions **naturelles** et **contextuelles**
- ✅ Expérience utilisateur **professionnelle**

**Temps total d'installation** : **5 minutes** ⏱️

---

**Besoin d'aide ?** Consultez la documentation officielle : https://www.deepl.com/docs-api
