// ecrans/EcranDetailDonRestaurant.js
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

const EcranDetailDonRestaurant = ({ navigation, route }) => {
  const { id } = route.params;
  const { invendus, deleteInvendu, isLoading } = useFood();
  const { user, userType } = useAuth();
  const [invendu, setInvendu] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));
  
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

  // Gérer la modification
  const handleEdit = () => {
    navigation.navigate('ModifierDon', { don: invendu });
  };

  // Gérer la suppression
  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'invendu",
      "Êtes-vous sûr de vouloir supprimer cet invendu ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteInvendu(id);
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la suppression.",
                [{ text: "OK" }]
              );
            }
          } 
        }
      ]
    );
  };

  // Si l'invendu n'est pas trouvé
  if (!invendu && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Détail du don</Text>
          <View style={{ width: 20 }}></View>
        </View>
        
        <View style={styles.notFoundContainer}>
          <FontAwesome5 name="search" size={60} color="#ccc" />
          <Text style={styles.notFoundText}>Don non trouvé</Text>
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
          <Text style={styles.title}>Détail du don</Text>
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
        <Text style={styles.title}>Détail du don</Text>
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
          <View style={styles.statusHeader}>
            <Text style={styles.mealName}>{invendu.repas || invendu.titre}</Text>
            {invendu.status === 'pending' ? (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>En attente</Text>
              </View>
            ) : invendu.status === 'reserved' ? (
              <View style={[styles.statusBadge, { backgroundColor: colors.orange }]}>
                <Text style={styles.statusText}>Réservé</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.statusText}>Complété</Text>
              </View>
            )}
          </View>
          
          <View style={styles.separator}></View>
          
          <View style={styles.mealSection}>
            <Text style={styles.mealDescription}>
              {invendu.description || "Aucune description disponible."}
            </Text>
            
            <View style={styles.mealDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantité:</Text>
                <Text style={styles.detailValue}>{invendu.quantite}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Disponible jusqu'à:</Text>
                <Text style={styles.detailValue}>{invendu.limite}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date d'ajout:</Text>
                <Text style={styles.detailValue}>{invendu.dateAjout || "15/02/2024"}</Text>
              </View>
              {invendu.allergenes && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Allergènes:</Text>
                  <Text style={styles.detailValue}>{invendu.allergenes}</Text>
                </View>
              )}
              {invendu.temperature && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Conservation:</Text>
                  <Text style={styles.detailValue}>{invendu.temperature}</Text>
                </View>
              )}
            </View>
          </View>
          
          {invendu.status === 'reserved' && invendu.reservation && (
            <>
              <View style={styles.separator}></View>
              
              <View style={styles.reservationSection}>
                <Text style={styles.reservationTitle}>Informations de réservation</Text>
                
                <View style={styles.reservationInfo}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Association:</Text>
                    <Text style={styles.detailValue}>{invendu.reservation.association}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contact:</Text>
                    <Text style={styles.detailValue}>{invendu.reservation.contact}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Réservé le:</Text>
                    <Text style={styles.detailValue}>{invendu.reservation.dateReservation}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => {
                    Alert.alert(
                      "Contacter l'association",
                      `Voulez-vous contacter ${invendu.reservation.association}?`,
                      [
                        { text: "Annuler", style: "cancel" },
                        { text: "Contacter", onPress: () => console.log("Contacter") }
                      ]
                    );
                  }}
                >
                  <FontAwesome5 name="envelope" size={16} color={colors.green} style={styles.contactIcon} />
                  <Text style={styles.contactButtonText}>Contacter l'association</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
        
        {invendu.status === 'pending' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>Modifier le don</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Supprimer le don</Text>
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  mealSection: {
    marginBottom: 15,
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
    maxWidth: '60%',
    textAlign: 'right',
  },
  reservationSection: {
    marginBottom: 10,
  },
  reservationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  reservationInfo: {
    backgroundColor: '#fff8e1',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: colors.green,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 5,
  },
  editButton: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#f44336',
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

export default EcranDetailDonRestaurant;