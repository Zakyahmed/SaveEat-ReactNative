import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Animated } from 'react-native';
import { colors } from '../constantes/couleurs';
import { globalStyles } from '../theme/styles';
import Button from '../composants/Button';
import Logo from '../composants/Logo';
import { useAuth } from '../context/AuthContext';

const EcranSelectionProfil = ({ navigation }) => {
  const { setUserRole } = useAuth();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const createPressAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleSelectRestaurant = async () => {
    createPressAnimation();
    try {
      const result = await setUserRole('restaurant');
      if (result.success) {
        // Naviguez vers l'écran de vérification de profil
        navigation.navigate('EcranVerificationProfil', { 
          userRole: 'restaurant' 
        });
      } else {
        Alert.alert('Erreur', result.error || 'Impossible de définir le profil');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };
  
  const handleSelectAssociation = async () => {
    createPressAnimation();
    try {
      const result = await setUserRole('association');
      if (result.success) {
        // Naviguez vers l'écran de vérification de profil
        navigation.navigate('EcranVerificationProfil', { 
          userRole: 'association' 
        });
      } else {
        Alert.alert('Erreur', result.error || 'Impossible de définir le profil');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: colors.beige }]}>
      <Animated.View 
        style={[
          styles.content, 
          { 
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim.interpolate({
              inputRange: [0.95, 1],
              outputRange: [0.9, 1]
            })
          }
        ]}
      >
        <View style={styles.logoWrapper}>
          <Logo size="large" />
        </View>
        
        <Text style={styles.description}>
          <Text style={styles.highlightText}>Réduisons le gaspillage</Text>{'\n'}
          Connectez restaurants et associations{'\n'}
          pour un impact positif
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            label="Je suis un restaurant"
            onPress={handleSelectRestaurant}
            type="primary"
          />
          
          <Button 
            label="Je suis une association"
            onPress={handleSelectAssociation}
            type="warning"
          />
        </View>
      </Animated.View>
      
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
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  description: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#555',
    fontSize: 16,
    lineHeight: 24,
  },
  highlightText: {
    color: colors.green,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  footer: {
    textAlign: 'center',
    color: '#777',
    padding: 10,
  }
});

export default EcranSelectionProfil;