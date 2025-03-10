// composants/Header.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native'; // Assurez-vous d'installer lucide-react-native
import { colors } from '../constantes/couleurs';

/**
 * Composant d'en-tête réutilisable
 * @param {string} title - Titre à afficher
 * @param {boolean} showBack - Afficher le bouton retour
 * @param {function} onBack - Fonction de retour personnalisée (facultatif)
 * @param {object} style - Styles additionnels (facultatif)
 * @param {React.ReactNode} rightContent - Contenu à afficher à droite (facultatif)
 * @returns {JSX.Element}
 */
const Header = ({ 
  title, 
  showBack = false, 
  onBack, 
  style, 
  rightContent 
}) => {
  const navigation = useNavigation();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity 
            onPress={handleBack} 
            style={styles.backButtonContainer}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Augmente la zone de toucher
          >
            <ChevronLeft 
              color="white" 
              size={24} 
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>
      
      <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </Text>
      
      <View style={styles.rightContainer}>
        {rightContent || <View style={{ width: 50 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20, // Réduit de 50 à 20
    paddingHorizontal: 20,
    paddingBottom: 10, // Réduit de 20 à 10
    backgroundColor: colors.green,
    height: 60, // Ajout d'une hauteur fixe pour plus de contrôle
  },
  leftContainer: {
    width: 50, // Réduit de 80 à 50
    alignItems: 'flex-start',
  },
  backButtonContainer: {
    padding: 5,
  },
  rightContainer: {
    width: 50, // Réduit de 80 à 50
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18, // Légèrement réduit
    fontWeight: 'bold',
    color: 'white',
    maxWidth: '60%',
  },
});

export default Header;