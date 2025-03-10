// ecrans/EcranConnexion.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, StyleSheet } from 'react-native';
import { colors } from '../constantes/couleurs';
import { globalStyles } from '../theme/styles';
import Header from '../composants/Header';
import Button from '../composants/Button';
import Logo from '../composants/Logo';
import { useAuth } from '../context/AuthContext';

const EcranConnexion = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Récupérez le contexte d'authentification
  const authContext = useAuth();

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Utilisez la méthode login du contexte
        const result = await authContext.login(email, password);
        
        if (result.success) {
          navigation.navigate('SelectProfile');
        } else {
          Alert.alert('Erreur de connexion', result.error || 'Identifiants invalides');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: colors.beige }]}>
      <Header 
        title="Connexion" 
        showBack={true}
      />

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Logo size="medium" />
        </View>

        <View style={styles.formContainer}>
          {/* Email */}
          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>Email</Text>
            <TextInput
              style={[
                globalStyles.input, 
                errors.email ? globalStyles.inputError : null
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? (
              <Text style={globalStyles.errorText}>
                {errors.email}
              </Text>
            ) : null}
          </View>

          {/* Mot de passe */}
          <View style={globalStyles.inputContainer}>
            <View style={styles.passwordHeader}>
              <Text style={globalStyles.label}>Mot de passe</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPassword}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                globalStyles.input, 
                errors.password ? globalStyles.inputError : null
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry
            />
            {errors.password ? (
              <Text style={globalStyles.errorText}>
                {errors.password}
              </Text>
            ) : null}
          </View>

          {/* Bouton de connexion */}
          <Button 
            label={isLoading ? "Connexion en cours..." : "Se connecter"}
            onPress={handleLogin}
            type="primary"
          />

          {/* Lien d'inscription */}
          <View style={styles.registerLink}>
            <Text style={{ color: '#777' }}>
              Pas encore de compte ? 
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerButton}>
                S'inscrire
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: colors.beige // Même couleur que l'écran d'accueil
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 20, // Espace réduit
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  forgotPassword: {
    fontSize: 14,
    color: colors.green,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerButton: {
    color: colors.green,
    fontWeight: 'bold',
    marginLeft: 5,
  }
});

export default EcranConnexion;