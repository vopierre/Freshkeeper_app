import React, { useState } from 'react';
import { Camera, Bell, Calendar, ChevronRight, AlertCircle, Clock, Sparkles, Plus, Search, Filter, Home, List, Zap } from 'lucide-react';

export default function FreshKeepApp() {
  const [currentScreen, setCurrentScreen] = useState('home');

  // Logo FreshKeep Component
  const FreshKeepLogo = () => (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Icône frigo stylisé */}
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <div className="relative">
            {/* Forme de frigo */}
            <div className="w-7 h-8 bg-white rounded-sm relative">
              {/* Porte du haut */}
              <div className="absolute top-0 left-0 right-0 h-3 border-b border-green-200"></div>
              {/* Poignée haut */}
              <div className="absolute top-1 right-1 w-0.5 h-1.5 bg-green-400 rounded-full"></div>
              {/* Poignée bas */}
              <div className="absolute bottom-1 right-1 w-0.5 h-2 bg-green-400 rounded-full"></div>
              {/* Élément frais */}
              <div className="absolute top-1 left-1.5 w-1 h-1 bg-green-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        {/* Badge "fresh" */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 leading-none">FreshKeep</h1>
        <p className="text-xs text-emerald-600 font-semibold">Zéro gaspillage</p>
      </div>
    </div>
  );

  // Écran d'accueil
  const HomeScreen = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen pb-24">
      {/* Header avec logo */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-8">
          <FreshKeepLogo />
          <button className="p-2 bg-white rounded-full shadow-sm relative">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
          </button>
        </div>

        {/* Urgences - Données critiques en premier */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">À traiter en priorité</h2>
            <span className="text-3xl font-bold text-red-600">5</span>
          </div>
          
          <div className="space-y-3">
            {/* J-1 - Rouge */}
            <div className="flex items-center justify-between bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900">Aujourd'hui / Demain</p>
                  <p className="text-xs text-gray-600">Consommer rapidement</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">2</span>
            </div>

            {/* J-3 - Orange */}
            <div className="flex items-center justify-between bg-orange-50 border-l-4 border-orange-500 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">Dans 2-3 jours</p>
                  <p className="text-xs text-gray-600">Planifier utilisation</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600">3</span>
            </div>

            {/* J-7 - Jaune */}
            <div className="flex items-center justify-between bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-900">Cette semaine</p>
                  <p className="text-xs text-gray-600">À surveiller</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">8</span>
            </div>
          </div>
        </div>

        {/* Action principale - Scan */}
        <button 
          onClick={() => setCurrentScreen('scan')}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl mb-4 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-center gap-3">
            <Camera className="w-8 h-8" />
            <span className="text-xl font-bold">Scanner un produit</span>
          </div>
          <p className="text-sm text-green-100 mt-2">Ajoutez rapidement vos courses</p>
        </button>

        {/* Actions secondaires */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setCurrentScreen('liste')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <Filter className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">Mes produits</span>
            </div>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('idees')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-purple-100 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">Idées recettes</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Écran de scan
  const ScanScreen = () => (
    <div className="bg-gray-900 min-h-screen relative pb-24">
      {/* Zone de scan simulée */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-64 h-64 border-4 border-green-400 rounded-2xl"></div>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-400 animate-pulse"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <button 
          onClick={() => setCurrentScreen('home')}
          className="text-white flex items-center gap-2"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
          <span>Retour</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-0 right-0 bg-white rounded-t-3xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Scannez le code-barres</h2>
        <p className="text-gray-600 mb-4">Positionnez le code dans le cadre vert</p>
        
        <button 
          onClick={() => setCurrentScreen('ajout')}
          className="w-full bg-gray-100 text-gray-700 rounded-xl p-4 font-semibold hover:bg-gray-200 transition-colors"
        >
          Saisir manuellement
        </button>
      </div>
    </div>
  );

  // Écran d'ajout après scan
  const AjoutScreen = () => (
    <div className="bg-white min-h-screen pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-gray-700"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Ajouter un produit</h1>
          <div className="w-8"></div>
        </div>

        {/* Produit détecté */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-700 font-semibold mb-1">✓ Produit reconnu</p>
          <p className="text-lg font-bold text-gray-900">Yaourt nature Bio</p>
          <p className="text-sm text-gray-600">Danone - Lot 250g × 4</p>
        </div>

        {/* Focus sur la date - 1 action principale */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Date de péremption
          </label>
          <input 
            type="date" 
            className="w-full text-2xl font-bold text-center p-6 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            defaultValue="2025-11-10"
          />
          <p className="text-center text-sm text-gray-500 mt-2">Dans 7 jours</p>
        </div>

        {/* Quantité (secondaire) */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Quantité
          </label>
          <div className="flex items-center justify-center gap-4">
            <button className="w-12 h-12 bg-gray-100 rounded-full font-bold text-xl hover:bg-gray-200">−</button>
            <span className="text-3xl font-bold text-gray-900 w-16 text-center">4</span>
            <button className="w-12 h-12 bg-gray-100 rounded-full font-bold text-xl hover:bg-gray-200">+</button>
          </div>
        </div>

        {/* Bouton principal */}
        <button 
          onClick={() => setCurrentScreen('home')}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-5 font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          Ajouter au frigo
        </button>
      </div>
    </div>
  );

  // Liste des produits
  const ListeScreen = () => (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-gray-700"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Mes produits</h1>
          <Search className="w-6 h-6 text-gray-400" />
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <p className="text-sm text-gray-600">Total des produits</p>
          <p className="text-3xl font-bold text-gray-900">24 articles</p>
        </div>

        {/* Liste urgences */}
        <h2 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wide">Urgences</h2>
        <div className="space-y-3 mb-6">
          <div className="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-900">Fromage râpé</p>
                <p className="text-sm text-gray-600">Emmental 200g</p>
              </div>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">Demain</span>
            </div>
            <button className="text-sm text-green-600 font-semibold hover:text-green-700">
              → Voir idées recettes
            </button>
          </div>

          <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-900">Lait demi-écrémé</p>
                <p className="text-sm text-gray-600">1L Bio</p>
              </div>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">3 jours</span>
            </div>
            <button className="text-sm text-green-600 font-semibold hover:text-green-700">
              → Voir idées recettes
            </button>
          </div>
        </div>

        {/* Reste du frigo */}
        <h2 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Reste du frigo</h2>
        <div className="space-y-2">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Carottes Bio</p>
                <p className="text-sm text-gray-600">500g</p>
              </div>
              <span className="text-sm text-gray-500">Dans 12 jours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Idées recettes
  const IdeesScreen = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen pb-24">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 text-gray-700"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Idées anti-gaspi</h1>
          <Sparkles className="w-6 h-6 text-purple-500" />
        </div>

        {/* Message encourageant */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            🌱 Avec vos produits urgents
          </p>
          <p className="text-gray-600">
            Voici des recettes rapides pour utiliser ce qui arrive à péremption
          </p>
        </div>

        {/* Recettes suggérées */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="h-32 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
              <span className="text-6xl">🥗</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">15 min</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Facile</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Salade complète express</h3>
              <p className="text-sm text-gray-600 mb-3">
                Utilise : fromage râpé, carottes
              </p>
              <button className="text-purple-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Voir la recette <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="h-32 bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
              <span className="text-6xl">🥞</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">20 min</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Facile</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Crêpes au lait</h3>
              <p className="text-sm text-gray-600 mb-3">
                Utilise : lait demi-écrémé
              </p>
              <button className="text-purple-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Voir la recette <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation entre écrans
  const screens = {
    home: <HomeScreen />,
    scan: <ScanScreen />,
    ajout: <AjoutScreen />,
    liste: <ListeScreen />,
    idees: <IdeesScreen />
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl relative" style={{ height: '844px' }}>
      {screens[currentScreen]}
      
      {/* Menu de navigation en bas - style v2 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center px-4 py-3">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'home' 
                ? 'bg-emerald-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <Home className={`w-6 h-6 ${currentScreen === 'home' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${currentScreen === 'home' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Accueil
            </span>
          </button>

          <button 
            onClick={() => setCurrentScreen('liste')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'liste' 
                ? 'bg-emerald-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <List className={`w-6 h-6 ${currentScreen === 'liste' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${currentScreen === 'liste' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Liste
            </span>
          </button>

          <button 
            onClick={() => setCurrentScreen('scan')}
            className="relative -mt-8"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-xl">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>

          <button 
            onClick={() => setCurrentScreen('idees')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'idees' 
                ? 'bg-emerald-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <Sparkles className={`w-6 h-6 ${currentScreen === 'idees' ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${currentScreen === 'idees' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Recettes
            </span>
          </button>

          <button 
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
          >
            <Zap className="w-6 h-6 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500">
              Plus
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}