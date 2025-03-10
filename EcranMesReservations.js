// ecrans/EcranMesReservations.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../constantes/couleurs';

const EcranMesReservations = ({ navigation }) => {
  // Données fictives pour les réservations
  const [reservations, setReservations] = useState([
    { 
      id: '1', 
      restaurant: 'Boulangerie du Parc',
      adresse: '15 rue du Parc, 1200 Genève',
      coordonnees: '46.2044,6.1432', // Format: latitude,longitude
      repas: 'Pains et viennoiseries', 
      quantite: '12 pièces', 
      dateReservation: '15/02/2024',
      heureReservation: '17:30',
      heureCollecte: '18h-19h',
      statut: 'pending' // pending, collected, cancelled
    },
    { 
      id: '2', 
      restaurant: 'Bistro Central',
      adresse: '23 rue des Fleurs, 1205 Genève',
      coordonnees: '46.2000,6.1500',
      repas: 'Salades variées', 
      quantite: '5 portions', 
      dateReservation: '15/02/2024',
      heureReservation: '14:15',
      heureCollecte: 'Aujourd\'hui avant 21h',
      statut: 'pending'
    },
    { 
      id: '3', 
      restaurant: 'Pizza Express',
      adresse: '8 avenue de la Gare, 1201 Genève',
      coordonnees: '46.2100,6.1422',
      repas: 'Pizzas assorties', 
      quantite: '3 pizzas', 
      dateReservation: '14/02/2024',
      heureReservation: '19:30',
      heureCollecte: '14/02/2024 21h30-22h',
      statut: 'collected'
    },
    { 
      id: '4', 
      restaurant: 'Sushi Time',
      adresse: '45 rue du Mont-Blanc, 1201 Genève',
      coordonnees: '46.2080,6.1470',
      repas: 'Plateau de sushis', 
      quantite: '24 pièces', 
      dateReservation: '13/02/2024',
      heureReservation: '16:00',
      heureCollecte: '13/02/2024 18h-19h',
      statut: 'cancelled'
    }
  ]);

  // Fonction pour annuler une réservation
  const annulerReservation = (id) => {
    setReservations(
      reservations.map(reservation => 
        reservation.id === id 
          ? {...reservation, statut: 'cancelled'} 
          : reservation
      )
    );
  };

  // Fonction pour confirmer la collecte
  const confirmerCollecte = (id) => {
    setReservations(
      reservations.map(reservation => 
        reservation.id === id 
          ? {...reservation, statut: 'collected'} 
          : reservation
      )
    );
  };

  // Fonction pour ouvrir l'itinéraire dans Google Maps
  const ouvrirItineraire = (coordonnees) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordonnees}`;
    Linking.openURL(url);
  };

  // Rendu du statut avec couleur correspondante
  const renderStatut = (statut) => {
    switch(statut) {
      case 'pending':
        return <Text style={styles.statutPending}>À récupérer</Text>;
      case 'collected':
        return <Text style={styles.statutCollected}>Collecté</Text>;
      case 'cancelled':
        return <Text style={styles.statutCancelled}>Annulé</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes réservations</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Vous n'avez pas encore de réservations</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('AssociationHome')}
            >
              <Text style={styles.browseButtonText}>Parcourir les offres disponibles</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>À récupérer</Text>
            
            {reservations.filter(r => r.statut === 'pending').map((reservation) => (
              <View key={reservation.id} style={styles.reservationCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.restaurantName}>{reservation.restaurant}</Text>
                  {renderStatut(reservation.statut)}
                </View>
                
                <Text style={styles.repasName}>{reservation.repas}</Text>
                <Text style={styles.quantite}>{reservation.quantite}</Text>
                
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Adresse:</Text>
                  <Text style={styles.infoValue}>{reservation.adresse}</Text>
                  
                  <Text style={styles.infoLabel}>Horaire de collecte:</Text>
                  <Text style={styles.infoValue}>{reservation.heureCollecte}</Text>
                  
                  <Text style={styles.infoLabel}>Réservé le:</Text>
                  <Text style={styles.infoValue}>{reservation.dateReservation} à {reservation.heureReservation}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.mapButton}
                    onPress={() => ouvrirItineraire(reservation.coordonnees)}
                  >
                    <Text style={styles.mapButtonText}>Voir l'itinéraire</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.collectButton}
                    onPress={() => confirmerCollecte(reservation.id)}
                  >
                    <Text style={styles.collectButtonText}>Confirmer la collecte</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => annulerReservation(reservation.id)}
                  >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Historique</Text>
            
            {reservations.filter(r => r.statut !== 'pending').map((reservation) => (
              <View key={reservation.id} style={[styles.reservationCard, styles.historicCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.restaurantName}>{reservation.restaurant}</Text>
                  {renderStatut(reservation.statut)}
                </View>
                
                <Text style={styles.repasName}>{reservation.repas}</Text>
                <Text style={styles.quantite}>{reservation.quantite}</Text>
                
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Adresse:</Text>
                  <Text style={styles.infoValue}>{reservation.adresse}</Text>
                  
                  <Text style={styles.infoLabel}>Horaire de collecte:</Text>
                  <Text style={styles.infoValue}>{reservation.heureCollecte}</Text>
                  
                  <Text style={styles.infoLabel}>Réservé le:</Text>
                  <Text style={styles.infoValue}>{reservation.dateReservation} à {reservation.heureReservation}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.green,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historicCard: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  repasName: {
    fontSize: 15,
    marginBottom: 5,
  },
  quantite: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  infoSection: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  statutPending: {
    color: colors.green,
    fontWeight: '500',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statutCollected: {
    color: '#1565C0',
    fontWeight: '500',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statutCancelled: {
    color: '#C62828',
    fontWeight: '500',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionButtons: {
    marginTop: 10,
  },
  mapButton: {
    backgroundColor: colors.orange,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  collectButton: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  collectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#777',
  },
});

export default EcranMesReservations;