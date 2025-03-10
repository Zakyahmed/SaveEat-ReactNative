// context/FoodContext.js 
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Types pour TypeScript (ou documentation de structure)
/**
 * Structure d'un invendu
 * @typedef {Object} Invendu
 * @property {string} id - Identifiant unique
 * @property {string} restaurant - Nom du restaurant
 * @property {string} repas - Type de repas
 * @property {string} quantite - Quantité disponible
 * @property {string} description - Description détaillée
 * @property {string} limite - Date et heure limite
 * @property {string} status - Statut (pending, reserved, completed)
 * @property {string} [reservedBy] - ID de l'association ayant réservé
 */

/**
 * Structure d'une réservation
 * @typedef {Object} Reservation
 * @property {string} id - Identifiant unique
 * @property {string} invenduId - ID de l'invendu réservé
 * @property {string} userId - ID de l'utilisateur
 * @property {string} date - Date de réservation
 * @property {string} status - Statut de la réservation
 */

// Clés de stockage
const STORAGE_KEYS = {
  INVENDUS: '@saveeat:invendus:v1',
  RESERVATIONS: '@saveeat:reservations:v1',
};

// Contexte de gestion des invendus et réservations
const FoodContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood doit être utilisé dans un FoodProvider');
  }
  return context;
};

// Fournisseur du contexte
export const FoodProvider = ({ children }) => {
  // États principaux
  const [invendus, setInvendus] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données depuis le stockage local
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [storedInvendus, storedReservations] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.INVENDUS),
        AsyncStorage.getItem(STORAGE_KEYS.RESERVATIONS)
      ]);

      // Convertir les chaînes JSON en objets
      const parsedInvendus = storedInvendus ? JSON.parse(storedInvendus) : [];
      const parsedReservations = storedReservations ? JSON.parse(storedReservations) : [];

      setInvendus(parsedInvendus);
      setReservations(parsedReservations);
    } catch (err) {
      console.error('Erreur de chargement des données', err);
      setError('Impossible de charger les données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarder les données dans le stockage local
  const saveData = useCallback(async (newInvendus = null, newReservations = null) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.INVENDUS, 
          JSON.stringify(newInvendus || invendus)
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.RESERVATIONS, 
          JSON.stringify(newReservations || reservations)
        )
      ]);
    } catch (err) {
      console.error('Erreur de sauvegarde', err);
      throw err;
    }
  }, [invendus, reservations]);

  // Ajouter un nouvel invendu
  const addInvendu = useCallback(async (newInvendu) => {
    try {
      // Créer un invendu avec des métadonnées
      const invenduWithMetadata = {
        ...newInvendu,
        id: `inv_${Date.now()}`, // ID unique
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mettre à jour le state et sauvegarder
      const updatedInvendus = [...invendus, invenduWithMetadata];
      setInvendus(updatedInvendus);
      await saveData(updatedInvendus);

      return invenduWithMetadata;
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'un invendu', err);
      throw err;
    }
  }, [invendus, saveData]);

  // Mettre à jour un invendu existant
  const updateInvendu = useCallback(async (id, updates) => {
    try {
      const updatedInvendus = invendus.map(invendu => 
        invendu.id === id 
          ? { 
              ...invendu, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            }
          : invendu
      );

      setInvendus(updatedInvendus);
      await saveData(updatedInvendus);

      return updatedInvendus.find(inv => inv.id === id);
    } catch (err) {
      console.error('Erreur de mise à jour', err);
      throw err;
    }
  }, [invendus, saveData]);

  // Réserver un invendu
  const reserveInvendu = useCallback(async (invenduId, userId) => {
    try {
      // Vérifier si l'invendu existe et est disponible
      const invenduToReserve = invendus.find(inv => inv.id === invenduId);
      if (!invenduToReserve || invenduToReserve.status !== 'pending') {
        throw new Error('Invendu non disponible');
      }

      // Créer une nouvelle réservation
      const newReservation = {
        id: `res_${Date.now()}`,
        invenduId,
        userId,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      // Mettre à jour l'invendu et les réservations
      const updatedInvendus = invendus.map(inv => 
        inv.id === invenduId 
          ? { 
              ...inv, 
              status: 'reserved', 
              reservedBy: userId,
              updatedAt: new Date().toISOString()
            }
          : inv
      );

      const updatedReservations = [...reservations, newReservation];

      // Mettre à jour les states et sauvegarder
      setInvendus(updatedInvendus);
      setReservations(updatedReservations);
      await saveData(updatedInvendus, updatedReservations);

      return newReservation;
    } catch (err) {
      console.error('Erreur de réservation', err);
      throw err;
    }
  }, [invendus, reservations, saveData]);

  // Annuler une réservation
  const cancelReservation = useCallback(async (reservationId) => {
    try {
      // Trouver la réservation
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      // Mettre à jour l'invendu associé
      const updatedInvendus = invendus.map(inv => 
        inv.id === reservation.invenduId
          ? { 
              ...inv, 
              status: 'pending', 
              reservedBy: null,
              updatedAt: new Date().toISOString()
            }
          : inv
      );

      // Supprimer la réservation
      const updatedReservations = reservations.filter(r => r.id !== reservationId);

      // Mettre à jour les states et sauvegarder
      setInvendus(updatedInvendus);
      setReservations(updatedReservations);
      await saveData(updatedInvendus, updatedReservations);

      return true;
    } catch (err) {
      console.error('Erreur d\'annulation', err);
      throw err;
    }
  }, [invendus, reservations, saveData]);

  // Récupérer les invendus disponibles
  const getAvailableInvendus = useCallback(() => {
    return invendus.filter(inv => inv.status === 'pending');
  }, [invendus]);

  // Récupérer les réservations actives d'un utilisateur
  const getUserReservations = useCallback((userId) => {
    return reservations.filter(r => 
      r.userId === userId && r.status === 'active'
    );
  }, [reservations]);

  // Synchronisation potentielle avec un backend
  const syncWithServer = useCallback(async () => {
    try {
      // Vérifier la connexion réseau
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('Pas de connexion internet');
      }

      // Implémenter la synchronisation avec un backend réel
      // Exemple simplifié de ce qui pourrait être fait
      // const serverData = await apiCall.sync(invendus, reservations);
      // setInvendus(serverData.invendus);
      // setReservations(serverData.reservations);
      // await saveData();

      return { invendus, reservations };
    } catch (err) {
      console.error('Erreur de synchronisation', err);
      throw err;
    }
  }, [invendus, reservations, saveData]);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Valeur mémoïsée du contexte
  const contextValue = useMemo(() => ({
    // États
    invendus,
    reservations,
    isLoading,
    error,

    // Méthodes
    addInvendu,
    updateInvendu,
    reserveInvendu,
    cancelReservation,
    getAvailableInvendus,
    getUserReservations,
    syncWithServer,
    loadData,
  }), [
    invendus,
    reservations,
    isLoading,
    error,
    addInvendu,
    updateInvendu,
    reserveInvendu,
    cancelReservation,
    getAvailableInvendus,
    getUserReservations,
    syncWithServer,
    loadData
  ]);

  return (
    <FoodContext.Provider value={contextValue}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider;