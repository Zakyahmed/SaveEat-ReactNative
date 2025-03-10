// composants/Logo.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../constantes/couleurs';

const Logo = ({ size = 'large' }) => {
  // Ajuster la taille du logo en fonction du paramètre
  const fontSize = size === 'large' ? 36 : 30;
  const imageSize = size === 'large' ? 90 : 70; // Légèrement réduit
  
  return (
    <View style={[styles.logoContainer, size === 'medium' && styles.mediumContainer]}>
      <Image 
        source={require('../assets/Fichier1.png')} 
        style={{ width: imageSize, height: imageSize, marginBottom: 10 }} // Espace réduit
        resizeMode="contain"
      />
      
      <Text style={[styles.logoText, { fontSize }]}>
        <Text style={{ color: colors.orange }}>Save</Text>
        <Text style={{ color: colors.green }}>Eat</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  mediumContainer: {
    marginBottom: 15, // Moins d'espace pour la version medium
  },
  logoText: {
    fontWeight: 'bold',
  }
});

export default Logo;