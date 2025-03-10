// composants/Button.js - Optimisé
import React, { useMemo, memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../constantes/couleurs';

/**
 * Composant bouton réutilisable, optimisé pour éviter les re-rendus inutiles
 * 
 * @param {string} label - Texte du bouton
 * @param {function} onPress - Fonction au clic
 * @param {string} type - Type de bouton (primary, secondary, danger, warning)
 * @param {object} style - Styles additionnels pour le bouton
 * @param {object} textStyle - Styles additionnels pour le texte
 * @param {boolean} isLoading - Affiche un indicateur de chargement si true
 * @param {boolean} disabled - Désactive le bouton si true
 * @returns {JSX.Element}
 */
const Button = ({ 
  label, 
  onPress, 
  type = 'primary', 
  style, 
  textStyle,
  isLoading = false,
  disabled = false
}) => {
  // Calcul mémoïsé des styles pour éviter les recalculs inutiles
  const { buttonStyle, labelStyle } = useMemo(() => {
    // Styles de base du bouton
    let btnStyle = [styles.button];
    let txtStyle = [styles.buttonText];
    
    // Appliquer les styles en fonction du type
    switch (type) {
      case 'secondary':
        btnStyle.push(styles.outlineButton, { borderColor: colors.green });
        txtStyle.push({ color: colors.green });
        break;
      case 'danger':
        btnStyle.push({ backgroundColor: '#D32F2F' });
        break;
      case 'warning':
        btnStyle.push({ backgroundColor: colors.orange });
        break;
      default: // 'primary'
        btnStyle.push({ backgroundColor: colors.green });
        break;
    }
    
    // Appliquer les styles pour l'état désactivé
    if (disabled) {
      btnStyle.push(styles.disabledButton);
      txtStyle.push(styles.disabledText);
    }
    
    // Ajouter les styles personnalisés
    if (style) btnStyle.push(style);
    if (textStyle) txtStyle.push(textStyle);
    
    return { buttonStyle: btnStyle, labelStyle: txtStyle };
  }, [type, style, textStyle, disabled]);

  return (
    <TouchableOpacity 
      style={buttonStyle}
      onPress={onPress}
      activeOpacity={0.8} // Améliore le feedback tactile
      disabled={isLoading || disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isLoading || disabled }}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={type === 'secondary' ? colors.green : 'white'} 
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50, // Hauteur fixe pour une meilleure cohérence visuelle
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', // Centrer verticalement pour le loading
    marginBottom: 15,
    flexDirection: 'row', // Pour aligner l'indicateur et le texte
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  }
});

// Utilisation de memo pour éviter les re-rendus inutiles
export default memo(Button);