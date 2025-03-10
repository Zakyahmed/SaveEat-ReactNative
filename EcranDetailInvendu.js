// ecrans/EcranDetailInvendu.js - Amélioré
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Animated,
  Image,
  Alert
} from 'react-native';
import { colors } from '../constantes/couleurs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFood } from '../context/FoodContext';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../composants/LoadingOverlay';

const EcranDetailInvendu = ({ navigation, route }) => {
  const { id } = route.params;
  const { invendus, reserveInvendu, isLoading } = useFood();
  const { user, userType } = useAuth();
  const [invendu, setInvendu] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));
  const [reservationLoading, setReservationLoading] = useState(false);
  
  // Rechercher l'invendu par ID
  useEffect(() => {
    const foundInvendu = invendus.find(item => item.id === id);
    setInvendu(foundInvendu || null);
    
    // Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, invendus]);

  // Gérer la réservation
  const handleReservation = async () => {
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour réserver un invendu.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setReservationLoading(true);
    try {
      await reserveInvendu(id, user.id);
      navigation.navigate('ConfirmationReservation', { id });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la réservation.",
        [{ text: "OK" }]
      );
    } finally {
      setReservationLoading(false);
    }
  };

  // Si l'invendu n'est pas trouvé
  if (!invendu && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Détail de l'offre</Text>
          <View style={{ width: 20 }}></View>
        </View>
        
        <View style={styles.notFoundContainer}>
          <FontAwesome5 name="search" size={60} color="#ccc" />
          <Text style={styles.notFoundText}>Invendu non trouvé</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Afficher un loading pendant le chargement
  if (isLoading || !invendu) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Détail de l'offre</Text>
          <View style={{ width: 20 }}></View>
        </View>
        
        <View style={styles.loadingContainer}>
          <LoadingOverlay visible={true} text="Chargement des détails..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Détail de l'offre</Text>
        <View style={{ width: 20 }}></View>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image du plat (placeholder ou image réelle) */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/Fichier1.png')} 
            style={styles.image} 
            resizeMode="contain"
          />
          {invendu.isUrgent && (
            <View style={styles.urgentBadge}>
              <FontAwesome5 name="exclamation-circle" size={14} color="white" />
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        
        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          <View style={styles.restaurantHeader}>
            <View>
              <Text style={styles.restaurantName}>{invendu.restaurant}</Text>
              <Text style={styles.restaurantAddress}>{invendu.adresse || "Adresse non disponible"}</Text>
            </View>
            <View style={styles.distanceBadge}>
              <FontAwesome5 name="map-marker-alt" size={12} color={colors.green} />
              <Text style={styles.distance}>{invendu.distance}</Text>
            </View>
          </View>
          
          <View style={styles.separator}></View>
          
          <View style={styles.mealSection}>
            <Text style={styles.mealName}>{invendu.repas}</Text>
            <Text style={styles.mealDescription}>
              {invendu.description || "5 portions de salades fraîches préparées ce matin. Contient: laitue, tomates, concombres, maïs, carottes râpées."}
            </Text>
            
            <View style={styles.mealDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantité:</Text>
                <Text style={styles.detailValue}>{invendu.quantite}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Récupération jusqu'à:</Text>
                <Text style={styles.detailValue}>{invendu.limite}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date d'ajout:</Text>
                <Text style={styles.detailValue}>{invendu.dateAjout || "15/02/2024"}</Text>
              </View>
              {invendu.status === 'reserved' && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Statut:</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Réservé</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.separator}></View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Informations supplémentaires</Text>
            {invendu.infos ? (
              invendu.infos.map((info, index) => (
                <Text key={index} style={styles.infoItem}>• {info}</Text>
              ))
            ) : (
              <>
                <Text style={styles.infoItem}>• À conserver au réfrigérateur</Text>
                <Text style={styles.infoItem}>• Contient: gluten, lactose</Text>
                <Text style={styles.infoItem}>• Apportez vos contenants si possible</Text>
              </>
            )}
          </View>
        </Animated.View>
        
        {userType === 'association' && invendu.status !== 'reserved' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.green }]}
              onPress={handleReservation}
              disabled={reservationLoading}
            >
              {reservationLoading ? (
                <LoadingOverlay visible={true} text="Réservation en cours..." />
              ) : (
                <Text style={styles.buttonText}>Réserver cette offre</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.outlineButton]}
              onPress={() => {
                // Simuler une action de contact pour l'instant
                Alert.alert(
                  "Contacter le restaurant",
                  `Voulez-vous contacter ${invendu.restaurant}?`,
                  [
                    { text: "Annuler", style: "cancel" },
                    { text: "Contacter", onPress: () => console.log("Contacter") }
                  ]
                );
              }}
            >
              <Text style={[styles.buttonText, { color: colors.green }]}>Contacter le restaurant</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  urgentBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  distance: {
    fontSize: 13,
    color: colors.green,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  mealSection: {
    marginBottom: 15,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  mealDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  mealDetails: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 5,
  },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EcranDetailInvendu;