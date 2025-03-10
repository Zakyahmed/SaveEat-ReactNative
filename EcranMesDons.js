// ecrans/EcranMesDons.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../constantes/couleurs';

const EcranMesDons = ({ navigation }) => {
  // Données fictives pour les dons
  const [dons, setDons] = useState([
    { 
      id: '1', 
      titre: 'Salades variées', 
      quantite: '5 portions', 
      dateAjout: '15/02/2024',
      limite: 'Aujourd\'hui 21h',
      statut: 'reserved',
      reservation: {
        association: 'Association Solidarité',
        contact: 'contact@solidarite.org',
        dateReservation: '15/02/2024 - 15:45'
      }
    },
    { 
      id: '2', 
      titre: 'Sandwichs et desserts', 
      quantite: '8 pièces', 
      dateAjout: '15/02/2024',
      limite: 'Aujourd\'hui 20h',
      statut: 'pending'
    },
    { 
      id: '3', 
      titre: 'Soupes du jour', 
      quantite: '3 litres', 
      dateAjout: '14/02/2024',
      limite: 'Hier 21h',
      statut: 'expired'
    },
    { 
      id: '4', 
      titre: 'Pâtisseries assorties', 
      quantite: '12 pièces', 
      dateAjout: '13/02/2024',
      limite: '13/02/2024 - 18h',
      statut: 'completed',
      reservation: {
        association: 'Les Restos du Cœur',
        contact: 'geneve@restosducoeur.org',
        dateReservation: '13/02/2024 - 14:30'
      }
    }
  ]);

  // Fonction pour supprimer un don
  const supprimerDon = (id) => {
    setDons(dons.filter(don => don.id !== id));
  };

  // Fonction pour modifier un don
  const modifierDon = (id) => {
    // Navigation vers l'écran de modification avec les détails du don
    const donAModifier = dons.find(don => don.id === id);
    navigation.navigate('ModifierDon', { don: donAModifier });
  };

  // Rendu du statut avec couleur correspondante
  const renderStatut = (statut) => {
    switch(statut) {
      case 'pending':
        return <Text style={styles.statutPending}>En attente de réservation</Text>;
      case 'reserved':
        return <Text style={styles.statutReserved}>Réservé</Text>;
      case 'completed':
        return <Text style={styles.statutCompleted}>Don effectué</Text>;
      case 'expired':
        return <Text style={styles.statutExpired}>Expiré</Text>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes dons</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {dons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Vous n'avez pas encore ajouté de dons</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddMeal')}
            >
              <Text style={styles.addButtonText}>+ Ajouter des invendus</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddMeal')}
            >
              <Text style={styles.addButtonText}>+ Ajouter des invendus</Text>
            </TouchableOpacity>
            
            <Text style={styles.sectionTitle}>Historique de vos dons</Text>
            
            {dons.map((don) => (
              <View key={don.id} style={styles.donCard}>
                <View style={styles.donHeader}>
                  <Text style={styles.donTitle}>{don.titre}</Text>
                  <Text style={styles.donQuantity}>{don.quantite}</Text>
                </View>
                
                <View style={styles.donInfo}>
                  <Text style={styles.donDate}>Ajouté le: {don.dateAjout}</Text>
                  <Text style={styles.donLimite}>Limite: {don.limite}</Text>
                  {renderStatut(don.statut)}
                </View>
                
                {don.statut === 'reserved' && (
                  <View style={styles.reservationInfo}>
                    <Text style={styles.reservationTitle}>Réservé par:</Text>
                    <Text style={styles.reservationAssociation}>{don.reservation.association}</Text>
                    <Text style={styles.reservationContact}>{don.reservation.contact}</Text>
                    <Text style={styles.reservationDate}>Réservé le: {don.reservation.dateReservation}</Text>
                  </View>
                )}
                
                {don.statut === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => modifierDon(don.id)}
                    >
                      <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => supprimerDon(don.id)}
                    >
                      <Text style={styles.deleteButtonText}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  addButton: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  donCard: {
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
  donHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  donTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  donQuantity: {
    fontSize: 14,
    color: '#666',
  },
  donInfo: {
    marginBottom: 15,
  },
  donDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  donLimite: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statutPending: {
    color: colors.green,
    fontWeight: '500',
  },
  statutReserved: {
    color: colors.orange,
    fontWeight: '500',
  },
  statutCompleted: {
    color: '#1565C0',
    fontWeight: '500',
  },
  statutExpired: {
    color: '#777',
    fontWeight: '500',
  },
  reservationInfo: {
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  reservationTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reservationAssociation: {
    fontWeight: '500',
  },
  reservationContact: {
    color: '#666',
    marginBottom: 5,
  },
  reservationDate: {
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#1565C0',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#C62828',
    fontWeight: '500',
  },
});

export default EcranMesDons;