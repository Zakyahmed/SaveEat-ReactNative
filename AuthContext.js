// context/AuthContext.js 
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Création du contexte
const AuthContext = createContext(null);

// Clés pour le stockage
const STORAGE_KEYS = {
  USER: 'user',
  USER_TYPE: 'userType',
  AUTH_TOKEN: 'authToken'
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Fournisseur du contexte d'authentification
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger l'utilisateur depuis le stockage local au démarrage 
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Utiliser Promise.all pour charger les données en parallèle
        const [storedUser, storedUserType] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.USER_TYPE)
        ]);
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          if (storedUserType) {
            setUserType(storedUserType);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadUser();
  }, []);

  // Fonction de connexion 
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      
      // Dans une implémentation réelle, appel API ici
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simuler un utilisateur
      const fakeUser = { 
        id: '1', 
        name: 'Utilisateur Test', 
        email 
      };
      
      // Stockage des informations utilisateur 
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(fakeUser)]
      ]);
      
      setUser(fakeUser);
      return { success: true, user: fakeUser };
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      return { 
        success: false, 
        error: 'Identifiants invalides' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour définir le type d'utilisateur 
  const setUserRole = useCallback(async (type) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TYPE, type);
      setUserType(type);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la définition du type d\'utilisateur', error);
      return { 
        success: false, 
        error: 'Impossible de définir le type d\'utilisateur' 
      };
    }
  }, []);

  // Fonction de déconnexion 
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER, 
        STORAGE_KEYS.USER_TYPE,
        STORAGE_KEYS.AUTH_TOKEN
      ]);
      
      setUser(null);
      setUserType(null);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      return { 
        success: false, 
        error: 'Impossible de déconnecter l\'utilisateur' 
      };
    }
  }, []);

  // Fonction d'inscription 
  const register = useCallback(async (name, email, password) => {
    try {
      setIsLoading(true);
      
      // Délai réduit pour une meilleure réactivité
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Création d'un nouvel utilisateur
      const newUser = { 
        id: Date.now().toString(), 
        name, 
        email 
      };
      
      // Stockage des informations utilisateur
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erreur lors de l\'inscription', error);
      return { 
        success: false, 
        error: 'Impossible de créer un compte' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Valeur à fournir au contexte 
  const value = useMemo(() => ({
    user,
    userType,
    isLoading,
    isInitialized,
    login,
    logout,
    register,
    setUserRole
  }), [user, userType, isLoading, isInitialized, login, logout, register, setUserRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;