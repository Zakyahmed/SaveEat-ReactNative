// ecrans/EcranEditerProfil.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { colors } from '../constantes/couleurs';
import Header from '../composants/Header';
import Button from '../composants/Button';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const EcranEditerProfil = ({ navigation, route }) => {
  const { user, userType, updateUserProfile } = useAuth();
  
  // État pour stocker les informations du profil modifiables
  const [profileInfo, setProfileInfo] = useState({
    nom: user?.name || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || '',
    codePostal: user?.codePostal || '',
    ville: user?.ville || 'Genève',
    description: user?.description || '',
    logo: user?.logo || null,
    siteWeb: user?.siteWeb || '',
  });
  
  // État pour suivre les modifications
  const [modifie, setModifie] = useState(false);
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  
  // Mettre à jour le drapeau de modification lorsque les informations changent
  useEffect(() => {
    setModifie(true);
  }, [profileInfo]);
  
  // Fonction pour mettre à jour les champs
  const handleChange = (field, value) => {
    setProfileInfo({
      ...profileInfo,
      [field]: value
    });
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!profileInfo.nom) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!profileInfo.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(profileInfo.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (profileInfo.telephone && !/^[0-9+ ]{10,15}$/.test(profileInfo.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }
    
    if (!profileInfo.adresse) {
      newErrors.adresse = 'L\'adresse est requise';
    }
    
    if (!profileInfo.codePostal) {
      newErrors.codePostal = 'Le code postal est requis';
    } else if (!/^[0-9]{4}$/.test(profileInfo.codePostal)) {
      newErrors.codePostal = 'Le code postal doit contenir 4 chiffres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Fonction pour sélectionner une image de profil/logo
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à votre galerie.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (!result.canceled) {
      handleChange('logo', result.assets[0].uri);
    }
  };
  
  // Fonction pour enregistrer les modifications
  const enregistrerModifications = () => {
    if (validateForm()) {
      // Simuler l'enregistrement des modifications
      setTimeout(() => {
        Alert.alert(
          'Modifications enregistrées',
          'Vos informations ont été mises à jour avec succès.',
          [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
      }, 1000);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Modifier le profil" 
        showBack={true}
        onBack={() => {
          if (modifie) {
            Alert.alert(
              'Modifications non enregistrées',
              'Voulez-vous quitter sans enregistrer vos modifications?',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Quitter', onPress: () => navigation.goBack() }
              ]
            );
          } else {
            navigation.goBack();
          }
        }}
      />
      
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.profileImageContainer}>
          {profileInfo.logo ? (
            <Image source={{ uri: profileInfo.logo }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImagePlaceholderText}>
                {userType === 'restaurant' ? 'R' : 'A'}
              </Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.changeImageButton} onPress={selectImage}>
            <Text style={styles.changeImageText}>Changer l'image</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom {userType === 'restaurant' ? 'du restaurant' : 'de l\'association'}</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              value={profileInfo.nom}
              onChangeText={(text) => handleChange('nom', text)}
              placeholder={userType === 'restaurant' ? 'Nom du restaurant' : 'Nom de l\'association'}
            />
            {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={profileInfo.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="exemple@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={[styles.input, errors.telephone && styles.inputError]}
              value={profileInfo.telephone}
              onChangeText={(text) => handleChange('telephone', text)}
              placeholder="+41 XX XXX XX XX"
              keyboardType="phone-pad"
            />
            {errors.telephone && <Text style={styles.errorText}>{errors.telephone}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Site web</Text>
            <TextInput
              style={styles.input}
              value={profileInfo.siteWeb}
              onChangeText={(text) => handleChange('siteWeb', text)}
              placeholder="www.votresite.ch"
              autoCapitalize="none"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Adresse</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rue et numéro</Text>
            <TextInput
              style={[styles.input, errors.adresse && styles.inputError]}
              value={profileInfo.adresse}
              onChangeText={(text) => handleChange('adresse', text)}
              placeholder="Rue de la Paix 10"
            />
            {errors.adresse && <Text style={styles.errorText}>{errors.adresse}</Text>}
          </View>
          
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Code postal</Text>
              <TextInput
                style={[styles.input, errors.codePostal && styles.inputError]}
                value={profileInfo.codePostal}
                onChangeText={(text) => handleChange('codePostal', text)}
                placeholder="1200"
                keyboardType="numeric"
                maxLength={4}
              />
              {errors.codePostal && <Text style={styles.errorText}>{errors.codePostal}</Text>}
            </View>
            
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Ville</Text>
              <TextInput
                style={styles.input}
                value={profileInfo.ville}
                onChangeText={(text) => handleChange('ville', text)}
                placeholder="Genève"
              />
            </View>
          </View>
          
          {userType === 'restaurant' && (
            <>
              <Text style={styles.sectionTitle}>À propos</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description de votre restaurant</Text>
                <TextInput
                  style={[styles.input, styles.textareaInput]}
                  value={profileInfo.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholder="Parlez de votre restaurant, de votre cuisine, de vos spécialités..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}
          
          {userType === 'association' && (
            <>
              <Text style={styles.sectionTitle}>À propos</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description de votre association</Text>
                <TextInput
                  style={[styles.input, styles.textareaInput]}
                  value={profileInfo.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholder="Présentez votre association, votre mission, vos actions..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}
          
          <Button
            label="Enregistrer les modifications"
            onPress={enregistrerModifications}
            type="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImagePlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  changeImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.green,
  },
  changeImageText: {
    color: colors.green,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
    color: colors.green,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  textareaInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
});

export default EcranEditerProfil;