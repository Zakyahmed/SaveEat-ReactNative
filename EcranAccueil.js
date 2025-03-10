// ecrans/EcranAccueil.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../constantes/couleurs';
import { globalStyles } from '../theme/styles';
import Button from '../composants/Button';
import Logo from '../composants/Logo';

const EcranAccueil = ({ navigation }) => {
  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: colors.beige }]}>
      <View style={styles.content}>
        {/* Logo - centré avec un bon espacement */}
        <View style={styles.logoWrapper}>
          <Logo size="large" />
        </View>
        
        {/* Contenu dans une carte blanche comme sur l'écran de connexion */}
        <View style={styles.card}>
          <Text style={styles.description}>
            Moins de déchets, plus de partage. Connectons les restaurants aux associations pour lutter contre le gaspillage alimentaire.
          </Text>
          
          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <Button 
              label="Connexion"
              onPress={() => navigation.navigate('Login')}
              type="primary"
            />
            
            <Button 
              label="Inscription"
              onPress={() => navigation.navigate('Register')}
              type="secondary"
            />
          </View>
        </View>
      </View>
      
      {/* Footer */}
      <Text style={styles.footer}>
        Ensemble contre le gaspillage alimentaire
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoWrapper: {
    marginTop: 0, // Centrage vertical
    marginBottom: 25,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    fontSize: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
  },
  footer: {
    textAlign: 'center',
    color: '#777',
    padding: 10,
  }
});

export default EcranAccueil;