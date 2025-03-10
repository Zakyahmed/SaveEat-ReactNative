// ecrans/EcranRestaurant.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../constantes/couleurs';

const EcranRestaurant = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SaveEat</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.greeting}>Bonjour, Restaurant!</Text>
        <Text style={styles.subtitle}>Partagez vos invendus avec ceux qui en ont besoin</Text>
        
        <View style={styles.card}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.green }]}
            onPress={() => navigation.navigate('AddMeal')}
          >
            <Text style={styles.buttonText}>+ Ajouter des invendus</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vos dons actifs</Text>
          
          <View style={styles.donation}>
            <View style={styles.donationHeader}>
              <View>
                <Text style={styles.donationTitle}>Salades variées</Text>
                <Text style={styles.donationQuantity}>5 portions</Text>
              </View>
              <View style={styles.donationTime}>
                <Text style={styles.donationTimeText}>Jusqu'à 21h</Text>
              </View>
            </View>
            <Text style={styles.reservationStatus}>Réservé par: Association Solidarité</Text>
          </View>
          
          <View style={styles.donation}>
            <View style={styles.donationHeader}>
              <View>
                <Text style={styles.donationTitle}>Sandwichs et desserts</Text>
                <Text style={styles.donationQuantity}>8 pièces</Text>
              </View>
              <View style={styles.donationTime}>
                <Text style={styles.donationTimeText}>Jusqu'à 20h</Text>
              </View>
            </View>
            <Text style={styles.pendingStatus}>En attente de réservation</Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Impact de vos dons</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.green }]}>23</Text>
              <Text style={styles.statLabel}>Repas sauvés</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.orange }]}>5</Text>
              <Text style={styles.statLabel}>Assoc. aidées</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.green }]}>11kg</Text>
              <Text style={styles.statLabel}>CO₂ économisé</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* BARRE DE NAVIGATION SUPPRIMÉE - celle-ci est maintenant gérée par react-navigation */}
    </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.green,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  card: {
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
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  donation: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  donationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  donationQuantity: {
    fontSize: 12,
    color: '#666',
  },
  donationTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donationTimeText: {
    fontSize: 12,
    color: '#666',
  },
  reservationStatus: {
    fontSize: 12,
    color: colors.orange,
    fontWeight: '500',
  },
  pendingStatus: {
    fontSize: 12,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  // Styles de navbar supprimés car ils ne sont plus nécessaires
});

export default EcranRestaurant;