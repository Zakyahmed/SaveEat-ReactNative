// ecrans/EcranVerificationProfil.js - Amélioré
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  TextInput,
  Animated,
  ActivityIndicator
} from 'react-native';
import { colors } from '../constantes/couleurs';
import Header from '../composants/Header';
import Button from '../composants/Button';
import { useAuth } from '../context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import ConfirmationModal from '../composants/ConfirmationModal';

const EcranVerificationProfil = ({ navigation, route }) => {
  const { userRole } = route.params;
  const { submitVerification } = useAuth();

  const [formData, setFormData] = useState({
    nomStructure: 'Ma Structure',
    ide: 'CHE-123.456.789',
    adresse: 'Rue de la Structure 1',
    codePostal: '1200',
    documentProof: {
      type: 'success',
      name: 'justificatif.pdf',
      uri: 'file://fake/path/justificatif.pdf'
    },
  });

  const [demandeValidee, setDemandeValidee] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Animation pour améliorer l'UX
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(30));
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Réinitialiser demandeValidee quand on quitte l'écran
    return () => {
      setDemandeValidee(false);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Réinitialiser l'erreur pour ce champ si elle existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setFormData(prev => ({
          ...prev,
          documentProof: result
        }));
        
        // Réinitialiser l'erreur pour ce champ si elle existe
        if (errors.documentProof) {
          setErrors(prev => ({ ...prev, documentProof: null }));
        }
      }
    } catch (error) {
      console.log('Erreur lors du téléchargement du document', error);
    }
  };

  const openRegistreCommerce = () => {
    Linking.openURL('https://www.ge.ch/entreprises/inscription-registre-commerce');
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nomStructure.trim()) {
      newErrors.nomStructure = 'Le nom de la structure est requis';
    }
    
    if (!formData.ide.trim()) {
      newErrors.ide = 'Le numéro IDE est requis';
    } else if (!/^CHE-\d{3}\.\d{3}\.\d{3}$/.test(formData.ide)) {
      newErrors.ide = 'Format IDE invalide (CHE-XXX.XXX.XXX)';
    }
    
    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }
    
    if (!formData.codePostal.trim()) {
      newErrors.codePostal = 'Le code postal est requis';
    } else if (!/^\d{4}$/.test(formData.codePostal)) {
      newErrors.codePostal = 'Format code postal invalide (4 chiffres)';
    }
    
    if (!formData.documentProof) {
      newErrors.documentProof = 'Veuillez télécharger un justificatif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simule une validation backend
    setTimeout(() => {
      setIsSubmitting(false);
      setDemandeValidee(true);
    }, 2000);
  };

  const closeConfirmation = () => {
    setDemandeValidee(false);
    if (userRole === 'restaurant') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'RestaurantTabs' }]
      });
    } else if (userRole === 'association') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AssociationTabs' }]
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={`Vérification ${userRole === 'restaurant' ? 'Restaurant' : 'Association'}`}
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }
          ]}
        >
          <Text style={styles.title}>Informations de votre structure à Genève</Text>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Informations générales</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom de la structure</Text>
              <View style={[
                styles.inputWrapper,
                errors.nomStructure ? styles.inputWrapperError : null
              ]}>
                <FontAwesome5 name="building" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom de votre établissement"
                  value={formData.nomStructure}
                  onChangeText={(text) => handleInputChange('nomStructure', text)}
                />
              </View>
              {errors.nomStructure && (
                <Text style={styles.errorText}>{errors.nomStructure}</Text>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Numéro IDE</Text>
              <View style={[
                styles.inputWrapper,
                errors.ide ? styles.inputWrapperError : null
              ]}>
                <FontAwesome5 name="id-card" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="CHE-XXX.XXX.XXX"
                  value={formData.ide}
                  onChangeText={(text) => handleInputChange('ide', text)}
                />
              </View>
              {errors.ide && (
                <Text style={styles.errorText}>{errors.ide}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Adresse</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Rue et numéro</Text>
              <View style={[
                styles.inputWrapper,
                errors.adresse ? styles.inputWrapperError : null
              ]}>
                <FontAwesome5 name="map-marker-alt" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Adresse complète"
                  value={formData.adresse}
                  onChangeText={(text) => handleInputChange('adresse', text)}
                />
              </View>
              {errors.adresse && (
                <Text style={styles.errorText}>{errors.adresse}</Text>
              )}
            </View>
            
            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Code postal</Text>
                <View style={[
                  styles.inputWrapper,
                  errors.codePostal ? styles.inputWrapperError : null
                ]}>
                  <FontAwesome5 name="map-pin" size={16} color={colors.green} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="XXXX"
                    value={formData.codePostal}
                    onChangeText={(text) => handleInputChange('codePostal', text)}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                {errors.codePostal && (
                  <Text style={styles.errorText}>{errors.codePostal}</Text>
                )}
              </View>
              
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Ville</Text>
                <View style={styles.inputWrapper}>
                  <FontAwesome5 name="city" size={16} color={colors.green} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Genève"
                    value="Genève"
                    editable={false}
                  />
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Vérification</Text>
            
            <View style={styles.documentContainer}>
              <Text style={styles.inputLabel}>Justificatif d'entreprise</Text>
              <TouchableOpacity 
                style={[
                  styles.uploadButton,
                  formData.documentProof ? styles.uploadButtonSuccess : styles.uploadButtonDefault,
                  errors.documentProof ? styles.uploadButtonError : null
                ]} 
                onPress={handleUploadDocument}
              >
                <FontAwesome5 
                  name={formData.documentProof ? "check-circle" : "cloud-upload-alt"} 
                  size={24} 
                  color="white" 
                  style={styles.uploadIcon} 
                />
                <Text style={styles.uploadButtonText}>
                  {formData.documentProof ? "Justificatif téléchargé" : "Télécharger un extrait du registre"}
                </Text>
              </TouchableOpacity>
              {errors.documentProof && (
                <Text style={styles.errorText}>{errors.documentProof}</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.helpLinkContainer} 
              onPress={openRegistreCommerce}
            >
              <FontAwesome5 name="question-circle" size={16} color={colors.green} />
              <Text style={styles.helpLink}>
                Besoin d'aide ? Consulter le registre du commerce
              </Text>
            </TouchableOpacity>
          </View>
          
          <Button 
            label={isSubmitting ? "Traitement en cours..." : "Soumettre la vérification"}
            onPress={handleSubmit}
            type="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            style={styles.submitButton}
          />
        </Animated.View>
      </ScrollView>

      {/* Modal de confirmation avec visibilité contrôlée */}
      <ConfirmationModal
        visible={demandeValidee}
        message="Votre demande a été validée avec succès."
        onClose={closeConfirmation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.green,
    textAlign: 'center',
    marginBottom: 25,
  },
  formSection: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.green,
    paddingLeft: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: 55,
  },
  inputWrapperError: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  inputIcon: {
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentContainer: {
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  uploadButtonDefault: {
    backgroundColor: colors.green,
  },
  uploadButtonSuccess: {
    backgroundColor: '#4caf50',
  },
  uploadButtonError: {
    backgroundColor: '#f44336',
  },
  uploadIcon: {
    marginRight: 12,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
  },
  helpLink: {
    color: colors.green,
    marginLeft: 8,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  submitButton: {
    marginTop: 15,
    borderRadius: 12,
    height: 55,
  }
});

export default EcranVerificationProfil;