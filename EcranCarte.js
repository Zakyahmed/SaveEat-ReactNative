// ecrans/EcranCarte.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps'; 
import * as Location from 'expo-location'; 
import { colors } from '../constantes/couleurs';
import { useAuth } from '../context/AuthContext';

const EcranCarte = ({ navigation }) => {
  const { userType } = useAuth();
  
  // État pour stocker les données de la carte
  const [region, setRegion] = useState({
    latitude: 46.2044,
    longitude: 6.1432,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  // État pour stocker la position de l'utilisateur
  const [userLocation, setUserLocation] = useState(null);
  
  // État pour indiquer si on attend la position de l'utilisateur
  const [loadingLocation, setLoadingLocation] = useState(true);
  
  // Données fictives pour les marqueurs
  const [markers, setMarkers] = useState([
    // Restaurants avec invendus (à afficher pour les associations)
    {
      id: '1',
      type: 'restaurant',
      name: 'Bistro Central',
      address: '23 rue des Fleurs, 1205 Genève',
      coordinate: {
        latitude: 46.2000,
        longitude: 6.1500,
      },
      food: 'Salades variées',
      quantity: '5 portions',
      until: 'Aujourd\'hui 21h'
    },
    {
      id: '2',
      type: 'restaurant',
      name: 'La Trattoria',
      address: '45 rue du Mont-Blanc, 1201 Genève',
      coordinate: {
        latitude: 46.2080,
        longitude: 6.1470,
      },
      food: 'Pâtes à la sauce tomate',
      quantity: '3 portions',
      until: 'Aujourd\'hui 22h'
    },
    {
      id: '3',
      type: 'restaurant',
      name: 'Sushi Express',
      address: '8 avenue de la Gare, 1201 Genève',
      coordinate: {
        latitude: 46.2100,
        longitude: 6.1422,
      },
      food: 'Plateau mixte',
      quantity: '2 portions',
      until: 'Aujourd\'hui 21h30'
    },
    
    // Associations (à afficher pour les restaurants)
    {
      id: '4',
      type: 'association',
      name: 'Caritas Genève',
      address: '53 rue de Carouge, 1205 Genève',
      coordinate: {
        latitude: 46.1930,
        longitude: 6.1420,
      },
      distance: '1.3 km'
    },
    {
      id: '5',
      type: 'association',
      name: 'Les Restos du Cœur',
      address: '12 rue de la Servette, 1201 Genève',
      coordinate: {
        latitude: 46.2110,
        longitude: 6.1380,
      },
      distance: '0.8 km'
    },
    {
      id: '6',
      type: 'association',
      name: 'Fondation Partage',
      address: '32 rue Blavignac, 1227 Carouge',
      coordinate: {
        latitude: 46.1880,
        longitude: 6.1350,
      },
      distance: '2.1 km'
    }
  ]);
  
  // Filtrer les marqueurs en fonction du type d'utilisateur
  const filteredMarkers = userType === 'restaurant' 
    ? markers.filter(marker => marker.type === 'association')
    : markers.filter(marker => marker.type === 'restaurant');
  
  // Obtenir la position de l'utilisateur
  useEffect(() => {
    (async () => {
      try {
        // Demander la permission d'accéder à la localisation
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Permission de localisation refusée');
          setLoadingLocation(false);
          return;
        }
        
        // Obtenir la position actuelle
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        // Mettre à jour la position de l'utilisateur
        setUserLocation({
          latitude,
          longitude
        });
        
        // Mettre à jour la région affichée sur la carte
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      } catch (error) {
        console.log('Erreur lors de la récupération de la position:', error);
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);
  
  // Gestionnaire pour le clic sur un marqueur
  const handleMarkerPress = (marker) => {
    if (userType === 'association' && marker.type === 'restaurant') {
      // Pour une association, navigue vers les détails de l'invendu
      navigation.navigate('DetailInvendu', { id: marker.id });
    }
  };
  
  // Rendu des marqueurs
  const renderMarkers = () => {
    return filteredMarkers.map(marker => (
      <Marker
        key={marker.id}
        coordinate={marker.coordinate}
        title={marker.name}
        description={marker.address}
        pinColor={marker.type === 'restaurant' ? colors.green : colors.orange}
        onPress={() => handleMarkerPress(marker)}
      >
        <Callout tooltip>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>{marker.name}</Text>
            <Text style={styles.calloutAddress}>{marker.address}</Text>
            
            {marker.type === 'restaurant' && (
              <>
                <Text style={styles.calloutFood}>{marker.food}</Text>
                <Text style={styles.calloutQuantity}>{marker.quantity}</Text>
                <Text style={styles.calloutUntil}>{marker.until}</Text>
              </>
            )}
            
            {marker.type === 'association' && (
              <Text style={styles.calloutDistance}>Distance: {marker.distance}</Text>
            )}
          </View>
        </Callout>
      </Marker>
    ));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {userType === 'restaurant' 
            ? 'Associations proches' 
            : 'Invendus disponibles'}
        </Text>
      </View>
      
      <View style={styles.mapContainer}>
        {loadingLocation ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.green} />
            <Text style={styles.loadingText}>Récupération de votre position...</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {renderMarkers()}
          </MapView>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {userType === 'restaurant' 
            ? 'Découvrez les associations proches de vous qui pourraient récupérer vos invendus.' 
            : 'Consultez les restaurants autour de vous proposant des invendus.'}
        </Text>
        
        {userType === 'restaurant' && (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('AddMeal')}
          >
            <Text style={styles.buttonText}>+ Ajouter des invendus</Text>
          </TouchableOpacity>
        )}
      </View>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.green,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  calloutFood: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
  },
  calloutQuantity: {
    fontSize: 12,
    color: '#666',
  },
  calloutUntil: {
    fontSize: 12,
    color: colors.orange,
    fontWeight: '500',
    marginTop: 3,
  },
  calloutDistance: {
    fontSize: 12,
    color: colors.green,
    fontWeight: '500',
    marginTop: 3,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EcranCarte;