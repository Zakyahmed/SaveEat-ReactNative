// ecrans/EcranConfirmationReservation.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../constantes/couleurs';

const EcranConfirmationReservation = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Confirmation</Text>
        <View style={{ width: 50 }}></View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.checkIcon}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        </View>
        
        <Text style={styles.confirmationTitle}>Réservation confirmée !</Text>
        <Text style={styles.confirmationText}>
          Vous avez réservé 5 portions de "Salades variées" auprès de Bistro Central.
        </Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informations de collecte :</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lieu :</Text>
            <Text style={styles.infoValue}>Bistro Central, 23 rue des Fleurs, 75001</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Heure :</Text>
            <Text style={styles.infoValue}>À récupérer avant aujourd'hui 21h</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.orange }]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Voir l'itinéraire</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.outlineButton]}
          onPress={() => navigation.navigate('AssociationHome')}
        >
          <Text style={[styles.buttonText, { color: colors.green }]}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.green,
  },
  backButton: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  checkIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.green,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EcranConfirmationReservation;