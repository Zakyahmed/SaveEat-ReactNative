// composants/Card.js - Optimisé
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constantes/couleurs';

/**
 * Composant carte réutilisable optimisé
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {string} title - Titre de la carte (optionnel)
 * @param {object} style - Styles additionnels
 * @param {function} onPress - Fonction appelée au clic (optionnel)
 * @param {boolean} shadow - Ajouter une ombre (par défaut: true)
 * @returns {JSX.Element}
 */
const Card = ({ 
  children, 
  title, 
  style, 
  onPress,
  shadow = true,
}) => {
  const cardStyles = [
    styles.card, 
    shadow && styles.cardShadow,
    style
  ];
  
  const CardComponent = onPress ? TouchableOpacity : View;
  const cardProps = onPress 
    ? { style: cardStyles, onPress, activeOpacity: 0.8 } 
    : { style: cardStyles };
  
  return (
    <CardComponent {...cardProps}>
      {title && (
        <Text 
          style={styles.cardTitle}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      )}
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardShadow: {
    // Ombres optimisées pour iOS et Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.green,
  },
});

// Mémoïsation pour éviter les re-rendus inutiles
export default memo(Card);