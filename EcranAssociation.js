// ecrans/EcranAssociation.js - Optimisé
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  StatusBar
} from 'react-native';
import { colors } from '../constantes/couleurs';
import { useFood } from '../context/FoodContext';
import { useAuth } from '../context/AuthContext';
import Card from '../composants/Card';
import InvenduFlatList from '../composants/InvenduFlatList';
import LoadingOverlay from '../composants/LoadingOverlay';

const EcranAssociation = ({ navigation }) => {
  // État local
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Accès aux contextes
  const { user } = useAuth();
  const { 
    invendus, 
    reservations, 
    getAvailableInvendus, 
    isLoading 
  } = useFood();
  
  // Obtenir les invendus disponibles - mémoïsation pour éviter les calculs inutiles
  const availableInvendus = useMemo(() => {
    const available = getAvailableInvendus();
    
    // Filtrer par la recherche si nécessaire
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return available.filter(invendu => 
        invendu.restaurant?.toLowerCase().includes(query) || 
        invendu.repas?.toLowerCase().includes(query)
      );
    }
    
    return available;
  }, [getAvailableInvendus, invendus, searchQuery]);
  
  // Trouver la réservation active de l'utilisateur
  const userReservation = useMemo(() => {
    return reservations.find(res => 
      res.userId === user?.id && 
      res.status === 'confirmed'
    );
  }, [reservations, user]);
  
  // Trouver l'invendu associé à la réservation
  const reservedInvendu = useMemo(() => {
    if (!userReservation) return null;
    return invendus.find(inv => inv.id === userReservation.invenduId);
  }, [userReservation, invendus]);
  
  // Simuler le chargement de données - CORRIGÉ avec deps vides
  const loadData = useCallback(async () => {
    setLoading(true);
    // Simuler une latence réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  }, []); // tableau vide = une seule définition de fonction
  
  // Charger les données au montage du composant - CORRIGÉ avec isMounted
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isMounted) {
        await loadData();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [loadData]);
  
  // Gestionnaire de rafraîchissement - CORRIGÉ pour éviter les mises à jour en cascade
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);
  
  // Gestionnaire pour la navigation vers les détails d'un invendu
  const handleInvenduPress = useCallback((invendu) => {
    navigation.navigate('DetailInvendu', { id: invendu.id });
  }, [navigation]);
  
  // Rendu du composant vide (pas d'invendus)
  const renderEmptyList = useCallback(() => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>
        Aucun invendu disponible pour le moment
      </Text>
      <Text style={styles.emptyListSubText}>
        Revenez plus tard ou modifiez vos critères de recherche
      </Text>
    </View>
  ), []);
  
  // Rendu de l'en-tête de liste
  const renderListHeader = useCallback(() => (
    <Text style={styles.sectionTitle}>
      {searchQuery 
        ? `Résultats (${availableInvendus.length})` 
        : 'Invendus disponibles'}
    </Text>
  ), [searchQuery, availableInvendus.length]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <Text style={styles.title}>SaveEat</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.greeting}>
          Bonjour, {user?.name || 'Association'}!
        </Text>
        <Text style={styles.subtitle}>
          Découvrez les invendus disponibles près de vous
        </Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Invendus disponibles</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AssociationCarte')}>
              <Text style={styles.mapLink}>Voir la carte</Text>
            </TouchableOpacity>
          </View>
          
          <InvenduFlatList
            data={availableInvendus}
            onItemPress={handleInvenduPress}
            ListEmptyComponent={renderEmptyList}
            ListHeaderComponent={renderListHeader}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </Card>
        
        {reservedInvendu && (
          <Card title="Votre réservation">
            <View style={styles.reservationItem}>
              <View style={styles.invenduInfo}>
                <Text style={styles.restaurantName}>{reservedInvendu.restaurant}</Text>
                <Text style={styles.repasName}>{reservedInvendu.repas}</Text>
                <Text style={styles.quantite}>{reservedInvendu.quantite}</Text>
              </View>
              <View style={styles.invenduMeta}>
                <Text style={styles.temps}>À récupérer entre 18h-19h</Text>
                <TouchableOpacity 
                  style={styles.itineraireButton}
                  onPress={() => navigation.navigate('MesReservations')}
                >
                  <Text style={styles.itineraireText}>Voir l'itinéraire</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
      </View>
      
      <LoadingOverlay visible={loading && !refreshing} text="Chargement des invendus..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.green,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingRight: 40, // Espace pour le bouton de suppression
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapLink: {
    color: colors.green,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyListSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  reservationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  invenduInfo: {
    flex: 2,
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 3,
  },
  repasName: {
    fontSize: 14,
    marginBottom: 2,
  },
  quantite: {
    fontSize: 12,
    color: '#666',
  },
  invenduMeta: {
    flex: 1,
    alignItems: 'flex-end',
  },
  temps: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  itineraireButton: {
    backgroundColor: colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itineraireText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default EcranAssociation;