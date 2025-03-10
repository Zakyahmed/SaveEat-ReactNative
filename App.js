// App.js - Optimisé
import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import Navigation from './Navigation';
import AuthProvider from './context/AuthContext';
import FoodProvider from './context/FoodContext'; // Corrected import
import { colors } from './constantes/couleurs';

// Empêcher SplashScreen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // Préchargement des ressources nécessaires
  const preloadAssets = async () => {
    try {
      // Précharger les images
      const imageAssets = [
        require('./assets/Fichier1.png'),
        // Ajoutez ici d'autres ressources à précharger
      ];
      
      // Précharger les fonts (si nécessaire)
      const fontAssets = [
        // ex: { 'open-sans': require('./assets/fonts/OpenSans-Regular.ttf') }
      ];
      
      // Chargement parallèle des ressources
      const imagePromises = imageAssets.map(image => Asset.fromModule(image).downloadAsync());
      const fontPromises = Object.entries(fontAssets).map(([name, source]) => 
        Font.loadAsync({ [name]: source })
      );
      
      // Attendre que tout soit chargé
      await Promise.all([...imagePromises, ...fontPromises]);
    } catch (e) {
      console.warn('Erreur lors du préchargement des ressources:', e);
    } finally {
      setAppIsReady(true);
    }
  };
  
  // Charger les ressources au démarrage
  useEffect(() => {
    preloadAssets();
  }, []);
  
  // Gérer la transition après le chargement
  useEffect(() => {
    if (appIsReady) {
      // Un timer pour montrer le splash un peu plus longtemps
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
        setShowSplash(false);
      }, 1000); // 1 seconde de délai pour une expérience plus fluide
      
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);
  
  // Splash screen personnalisé pendant le chargement
  if (!appIsReady || showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('./assets/Fichier1.png')} 
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <Text style={styles.splashText}>
          <Text style={{ color: colors.orange }}>Save</Text>
          <Text style={{ color: colors.green }}>Eat</Text>
        </Text>
        <Text style={styles.splashTagline}>
          Ensemble contre le gaspillage alimentaire
        </Text>
      </View>
    );
  }
  
  return (
    <AuthProvider>
      <FoodProvider>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Navigation />
      </FoodProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.beige,
  },
  splashLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  splashTagline: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;