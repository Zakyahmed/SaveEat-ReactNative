// ecrans/EcranProfil.js - Amélioré
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  Image,
  Dimensions,
  Animated
} from 'react-native';
import { colors } from '../constantes/couleurs';
import { useAuth } from '../context/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width - 40;

const EcranProfil = ({ navigation }) => {
  const { user, userType, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Animation pour améliorer l'UX
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const profilData = {
    nom: user?.name || 'Jean Dupont',
    type: userType === 'restaurant' ? 'Restaurant' : 'Association',
    email: user?.email || 'jean.dupont@association.fr',
    repas_sauves: 42,
    co2_economise: 18.5,
    associations_aidees: 5,
    // Image d'avatar (peut être remplacée par une véritable image de l'utilisateur)
    avatar: null
  };

  // Fonction pour générer les initiales pour l'avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              const result = await logout();
              
              if (result.success) {
                // Redirection vers l'écran d'accueil
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                });
              } else {
                Alert.alert('Erreur', result.error || 'Impossible de se déconnecter');
                setIsLoggingOut(false);
              }
            } catch (error) {
              console.error('Erreur lors de la déconnexion', error);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
              setIsLoggingOut(false);
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SaveEat</Text>
      </View>
      
      {isLoggingOut ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Déconnexion en cours...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.profilSection,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }] 
              }
            ]}
          >
            <View style={styles.avatarContainer}>
              {profilData.avatar ? (
                <Image 
                  source={{ uri: profilData.avatar }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>
                    {getInitials(profilData.nom)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.profilNom}>{profilData.nom}</Text>
            <View style={styles.typeTag}>
              <Text style={styles.profilType}>{profilData.type}</Text>
            </View>
            <Text style={styles.profilEmail}>{profilData.email}</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.card, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }] 
              }
            ]}
          >
            <View style={styles.impactHeader}>
              <Text style={styles.cardTitle}>Impact</Text>
              <TouchableOpacity style={styles.infoButton}>
                <FontAwesome5 name="info-circle" size={16} color={colors.green} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.green }]}>{profilData.repas_sauves}</Text>
                <Text style={styles.statLabel}>Repas sauvés</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.orange }]}>{profilData.co2_economise} kg</Text>
                <Text style={styles.statLabel}>CO₂ économisé</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.green }]}>{profilData.associations_aidees}</Text>
                <Text style={styles.statLabel}>Associations aidées</Text>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.card, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: translateY }] 
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditerProfil')}
            >
              <FontAwesome5 name="user-edit" size={18} color={colors.green} style={styles.buttonIcon} />
              <Text style={styles.actionText}>Éditer le profil</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#ccc" />
            </TouchableOpacity>
            
            <View style={styles.buttonDivider} />
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <FontAwesome5 name="sign-out-alt" size={18} color="#f44336" style={styles.buttonIcon} />
              <Text style={styles.logoutText}>Déconnexion</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#ccc" />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      )}
    </SafeAreaView>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.green,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  profilSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.green,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
  },
  profilNom: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: `${colors.green}20`, // 20% d'opacité
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  profilType: {
    fontSize: 14,
    color: colors.green,
    fontWeight: '600',
  },
  profilEmail: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  impactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoButton: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  buttonIcon: {
    marginRight: 15,
    width: 20,
  },
  actionText: {
    flex: 1,
    color: colors.green,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  logoutText: {
    flex: 1,
    color: '#f44336',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EcranProfil;