// components/Toast.js 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  Platform 
} from 'react-native';
import { colors } from '../constantes/couleurs';

// Types de toast
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Gestionnaire de toast global
class ToastManager {
  static instance = null;
  static listeners = [];

  static getInstance() {
    if (!this.instance) {
      this.instance = new ToastManager();
    }
    return this.instance;
  }

  static addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  static show(message, type = TOAST_TYPES.INFO, duration = 3000) {
    this.listeners.forEach(listener => listener(message, type, duration));
  }
}

// Hook personnalisé pour déclencher des toasts
export const useToast = () => ({
  showToast: (message, type = TOAST_TYPES.INFO, duration = 3000) => 
    ToastManager.show(message, type, duration)
});

// Composant Toast principal
const Toast = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState(TOAST_TYPES.INFO);
  const [isVisible, setIsVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  // Configuration des styles en fonction du type
  const getToastStyles = useCallback(() => {
    const baseStyles = {
      backgroundColor: {
        [TOAST_TYPES.SUCCESS]: colors.green,
        [TOAST_TYPES.ERROR]: '#D32F2F',
        [TOAST_TYPES.WARNING]: colors.orange,
        [TOAST_TYPES.INFO]: colors.secondary
      }[type],
      icon: {
        [TOAST_TYPES.SUCCESS]: '✓',
        [TOAST_TYPES.ERROR]: '✕',
        [TOAST_TYPES.WARNING]: '!',
        [TOAST_TYPES.INFO]: 'i'
      }[type]
    };
    return baseStyles;
  }, [type]);

  // Afficher le toast
  const showToast = useCallback((msg, toastType, duration) => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);

    // Animation d'entrée
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();

    // Masquer après la durée spécifiée
    timeoutRef.current = setTimeout(hideToast, duration);
  }, [animatedValue]);

  // Masquer le toast
  const hideToast = useCallback(() => {
    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Animation de sortie
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setIsVisible(false);
    });
  }, [animatedValue]);

  // Enregistrer l'écouteur de toast
  useEffect(() => {
    const listener = ToastManager.addListener(showToast);
    return listener;
  }, [showToast]);

  // Ne rien afficher si pas de message
  if (!isVisible) return null;

  const { backgroundColor, icon } = getToastStyles();

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0]
              })
            }
          ],
          opacity: animatedValue
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text style={styles.messageText}>{message}</Text>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000
  },
  iconContainer: {
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold'
  },
  messageText: {
    color: 'white',
    flex: 1,
    fontSize: 14
  }
});

export default Toast;