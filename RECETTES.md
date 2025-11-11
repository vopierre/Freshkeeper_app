# 🍳 Fonctionnalité Recettes - FreshKeeper

## Présentation

La fonctionnalité **Recettes** de FreshKeeper utilise l'API Spoonacular pour suggérer des recettes basées sur les produits disponibles dans votre frigo. Cette fonctionnalité aide à :

- ✅ Réduire le gaspillage alimentaire
- ✅ Découvrir de nouvelles recettes avec ce que vous avez
- ✅ Planifier vos repas efficacement
- ✅ Minimiser les courses supplémentaires

## Configuration (5 minutes)

### 1. Obtenir une clé API Spoonacular (gratuit)

1. Allez sur : https://spoonacular.com/food-api/console#Dashboard
2. Créez un compte gratuit (juste email/mot de passe, **pas de carte de crédit**)
3. Copiez votre clé API
4. **Plan gratuit** : 150 requêtes par jour (largement suffisant pour un usage personnel)

### 2. Configuration de la clé API

1. Créez/modifiez le fichier `.env.local` à la racine du projet
2. Ajoutez votre clé :

```env
VITE_SPOONACULAR_API_KEY=votre_cle_spoonacular_ici
```

3. Redémarrez le serveur de développement :

```bash
npm run dev
```

## Utilisation

### Dans l'application

1. **Ajoutez des produits** à votre inventaire (via scan ou saisie manuelle)
2. **Cliquez sur l'onglet "Recettes"** dans la navigation
3. **L'application recherche automatiquement** des recettes correspondant à vos ingrédients
4. **Les recettes sont triées** par pertinence (nombre d'ingrédients disponibles)
5. **Cliquez sur une recette** pour voir les détails complets

### Informations affichées

Pour chaque recette :
- ✅ **Titre en français**
- ✅ **Photo de la recette**
- ✅ **Ingrédients disponibles** (en vert)
- ✅ **Ingrédients manquants** (à acheter)
- ✅ **Temps de préparation**
- ✅ **Nombre de portions**
- ✅ **Instructions détaillées**
- ✅ **Lien vers la recette originale**

## Fonctionnalités techniques

### Support du français avec traduction automatique

**Système de traduction intelligent avec fallback** :

1. **LibreTranslate** (gratuit, sans inscription) 🆓
   - Service open-source
   - Aucune configuration requise
   - Traduction automatique

2. **Dictionnaire culinaire** (fallback) 📖
   - Traduction des termes courants
   - Plus de 70 mots culinaires
   - Toujours fonctionnel

**Résultat** :
- ✅ Titres traduits en français automatiquement
- ✅ Pas besoin de compte supplémentaire
- ✅ Totalement gratuit

### Optimisations

- **Déduplication des ingrédients** : Évite les requêtes redondantes
- **Cache intelligent** : Réutilise les résultats récents
- **Gestion d'erreurs** : Messages clairs en cas de problème
- **Limite de résultats** : 20 recettes par recherche pour rester dans les quotas

### Algorithme de suggestion

L'API Spoonacular utilise l'algorithme de ranking `1` :
- Priorité aux recettes avec **le moins d'ingrédients manquants**
- Maximise l'utilisation de vos produits disponibles
- Réduit le gaspillage alimentaire

## Limitations et solutions

### ⚠️ Quota API dépassé

**Problème** : "Quota API dépassé. 150 requêtes/jour."

**Solutions** :
1. Attendez le lendemain (reset quotidien)
2. Passez au plan payant Spoonacular si besoin
3. Utilisez le bouton "Actualiser" avec parcimonie

### ⚠️ Traductions incomplètes

**Problème** : Certaines instructions restent en anglais

**Explication** :
- La base Spoonacular est principalement anglophone
- Les traductions automatiques ne sont pas toujours disponibles
- Les ingrédients et titres sont généralement bien traduits

**Solution** : Cliquez sur "Voir la recette complète" pour accéder au site source

### ⚠️ Aucune recette trouvée

**Problème** : "Aucune recette trouvée avec vos ingrédients"

**Solutions** :
1. Ajoutez plus de produits à votre inventaire
2. Ajoutez des produits de base (riz, pâtes, œufs, etc.)
3. Utilisez la recherche manuelle avec des mots-clés

## Fichiers concernés

```
src/
├── services/
│   └── spoonacular.ts          # API Spoonacular avec support français
├── screens/
│   └── RecipeIdeasScreen.tsx   # Écran principal des recettes
├── components/
│   ├── RecipeList.tsx           # Liste des recettes
│   └── RecipeDetailView.tsx     # Vue détaillée d'une recette
└── types/
    └── index.ts                 # Types TypeScript
```

## Améliorations futures possibles

- [ ] Filtres par régime alimentaire (végétarien, végan, sans gluten)
- [ ] Filtres par temps de préparation
- [ ] Sauvegarde de recettes favorites
- [ ] Planification de repas hebdomadaire
- [ ] Export de liste de courses pour ingrédients manquants
- [ ] Recettes par cuisine (française, italienne, asiatique)

## Support

Pour toute question :
- Documentation Spoonacular : https://spoonacular.com/food-api/docs
- Limites du plan gratuit : https://spoonacular.com/food-api/console#Dashboard

---

**Développé avec ❤️ pour réduire le gaspillage alimentaire**
