// Navigation.js - Configuration de navigation optimisée
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { colors } from './constantes/couleurs';
import { useAuth } from './context/AuthContext';

// Imports des écrans
import EcranAccueil from './ecrans/EcranAccueil';
import EcranConnexion from './ecrans/EcranConnexion';
import EcranInscription from './ecrans/EcranInscription';
import EcranMotDePasseOublie from './ecrans/EcranMotDePasseOublie';
import EcranSelectionProfil from './ecrans/EcranSelectionProfil';
import EcranVerificationProfil from './ecrans/EcranVerificationProfil';
import EcranRestaurant from './ecrans/EcranRestaurant';
import EcranAjoutInvendu from './ecrans/EcranAjoutInvendu';
import EcranMesDons from './ecrans/EcranMesDons';
import EcranProfil from './ecrans/EcranProfil';
import EcranAssociation from './ecrans/EcranAssociation';
import EcranMesReservations from './ecrans/EcranMesReservations';
import EcranDetailInvendu from './ecrans/EcranDetailInvendu';
import EcranConfirmationReservation from './ecrans/EcranConfirmationReservation';
import EcranEditerProfil from './ecrans/EcranEditerProfil';
import EcranCarte from './ecrans/EcranCarte';
import ModifierDon from './ecrans/ModifierDon';
import EcranDetailDonRestaurant from './ecrans/EcranDetailDonRestaurant';

// Création des navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Composant d'onglet personnalisé pour une meilleure UX
const TabBarItem = ({ label, icon, isFocused, onPress }) => {
  // Animations pour rendre l'onglet plus interactif
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const colorAnim = React.useRef(new Animated.Value(0)).current;
  
  const activeColor = colors.green;
  const inactiveColor = '#999';
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.2 : 1,
        friction: 10,
        useNativeDriver: true
      }),
      Animated.timing(colorAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false
      })
    ]).start();
  }, [isFocused]);
  
  const color = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor]
  });
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <FontAwesome5 
          name={icon} 
          size={20} 
          color={isFocused ? activeColor : inactiveColor} 
        />
      </Animated.View>
      <Animated.Text style={[styles.tabLabel, { color }]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

// Navigateur pour les onglets du restaurant
const RestaurantTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBarStyle,
      tabBarShowLabel: false,
    }}
    tabBar={props => (
      <View style={styles.tabBar}>
        {props.state.routes.map((route, index) => {
          const isFocused = props.state.index === index;
          
          const tabConfig = {
            'RestaurantHome': { 
              icon: 'home', 
              label: 'Accueil' 
            },
            'MesDons': { 
              icon: 'gift', 
              label: 'Mes dons' 
            },
            'Carte': { 
              icon: 'map-marked-alt', 
              label: 'Carte' 
            },
            'RestaurantProfil': { 
              icon: 'user', 
              label: 'Profil' 
            }
          }[route.name] || { icon: 'circle', label: route.name };

          const onPress = () => {
            props.navigation.navigate(route.name);
          };

          return (
            <TabBarItem
              key={route.key}
              label={tabConfig.label}
              icon={tabConfig.icon}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    )}
  >
    <Tab.Screen name="RestaurantHome" component={EcranRestaurant} />
    <Tab.Screen name="MesDons" component={EcranMesDons} />
    <Tab.Screen name="Carte" component={EcranCarte} />
    <Tab.Screen name="RestaurantProfil" component={EcranProfil} />
  </Tab.Navigator>
);

// Navigateur pour les onglets de l'association
const AssociationTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBarStyle,
      tabBarShowLabel: false,
    }}
    tabBar={props => (
      <View style={styles.tabBar}>
        {props.state.routes.map((route, index) => {
          const isFocused = props.state.index === index;
          
          const tabConfig = {
            'AssociationHome': { 
              icon: 'home', 
              label: 'Accueil' 
            },
            'MesReservations': { 
              icon: 'clipboard-list', 
              label: 'Réservations' 
            },
            'AssociationCarte': { 
              icon: 'map-marked-alt', 
              label: 'Carte' 
            },
            'AssociationProfil': { 
              icon: 'user', 
              label: 'Profil' 
            }
          }[route.name] || { icon: 'circle', label: route.name };

          const onPress = () => {
            props.navigation.navigate(route.name);
          };

          return (
            <TabBarItem
              key={route.key}
              label={tabConfig.label}
              icon={tabConfig.icon}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    )}
  >
    <Tab.Screen name="AssociationHome" component={EcranAssociation} />
    <Tab.Screen name="MesReservations" component={EcranMesReservations} />
    <Tab.Screen name="AssociationCarte" component={EcranCarte} />
    <Tab.Screen name="AssociationProfil" component={EcranProfil} />
  </Tab.Navigator>
);

// Options de transition personnalisées
const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: '#fff' },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      }),
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  }),
};

// Navigateur principal
const Navigation = () => {
  const { user, userType, isInitialized, isLoading } = useAuth();
  
  // Déterminer l'écran initial en fonction de l'état d'authentification
  const getInitialRouteName = () => {
    if (!isInitialized || isLoading) return "Welcome";
    if (!user) return "Welcome";
    if (!userType) return "SelectProfile";
    return userType === 'restaurant' ? "RestaurantTabs" : "AssociationTabs";
  };
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={screenOptions}
      >
        {/* Écrans d'authentification */}
        <Stack.Screen name="Welcome" component={EcranAccueil} />
        <Stack.Screen name="Login" component={EcranConnexion} />
        <Stack.Screen name="Register" component={EcranInscription} />
        <Stack.Screen name="ForgotPassword" component={EcranMotDePasseOublie} />
        <Stack.Screen name="SelectProfile" component={EcranSelectionProfil} />
        
        {/* Vérification de profil */}
        <Stack.Screen name="EcranVerificationProfil" component={EcranVerificationProfil} />
        
        {/* Écrans principaux */}
        <Stack.Screen name="RestaurantTabs" component={RestaurantTabNavigator} />
        <Stack.Screen name="AssociationTabs" component={AssociationTabNavigator} />
        
        {/* Écrans spécifiques sans onglets */}
        <Stack.Screen name="AddMeal" component={EcranAjoutInvendu} />
        <Stack.Screen name="DetailInvendu" component={EcranDetailInvendu} />
        <Stack.Screen name="DetailDonRestaurant" component={EcranDetailDonRestaurant} />
        <Stack.Screen name="ConfirmationReservation" component={EcranConfirmationReservation} />
        <Stack.Screen name="EditerProfil" component={EcranEditerProfil} />
        <Stack.Screen name="ModifierDon" component={ModifierDon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 25 : 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 5,
  },
  tabBarStyle: {
    display: 'none',
  },
});

export default Navigation;