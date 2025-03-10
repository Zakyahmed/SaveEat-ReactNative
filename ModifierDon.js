// ecrans/ModifierDon.js - Simplifié sans datetimepicker
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView, 
  TextInput, 
  Switch, 
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { colors } from '../constantes/couleurs';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../composants/Header';
import Button from '../composants/Button';
import { useFood } from '../context/FoodContext';

const ModifierDon = ({ navigation, route }) => {
  const { don } = route.params;
  const { updateInvendu } = useFood();
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    titre: don.titre || '',
    quantite: don.quantite || '',
    description: don.description || '',
    date: 'Aujourd\'hui', 
    heure: '20:00', 
    isUrgent: don.isUrgent || false,
    allergenes: don.allergenes || '',
    temperature: don.temperature || 'Ambiante',
    instructions: don.instructions || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation à l'ouverture de l'écran
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Extraction de la date et l'heure à partir de la limite
    if (don.limite) {
      const timeMatch = don.limite.match(/(\d{1,2})h/);
      if (timeMatch) {
        setFormData(prev => ({
          ...prev,
          heure: `${timeMatch[1]}:00`
        }));
      }
      
      // Si la limite contient "Aujourd'hui"
      if (don.limite.includes('Aujourd\'hui')) {
        setFormData(prev => ({
          ...prev,
          date: 'Aujourd\'hui'
        }));
      } else {
        const dateMatch = don.limite.match(/(\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch) {
          setFormData(prev => ({
            ...prev,
            date: dateMatch[1]
          }));
        }
      }
    }
  }, [don]);

  // Gestionnaire de changement de valeur
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Réinitialiser l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le type d\'invendus est requis';
    }

    if (!formData.quantite.trim()) {
      newErrors.quantite = 'La quantité est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Créer l'objet de mise à jour
      const updatedDon = {
        ...don,
        titre: formData.titre,
        quantite: formData.quantite,
        description: formData.description,
        limite: `${formData.date} ${formData.heure}`,
        isUrgent: formData.isUrgent,
        allergenes: formData.allergenes,
        temperature: formData.temperature,
        instructions: formData.instructions
      };
      
      // Appeler la fonction de mise à jour du contexte
      const result = await updateInvendu(don.id, updatedDon);
      
      if (result) {
        Alert.alert(
          'Mise à jour réussie',
          'Votre don a été mis à jour avec succès.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du don.');
      }
    } catch (error) {
      console.error('Erreur lors de la modification du don:', error);
      Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Modifier l'invendu"
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[styles.formCard, { opacity: fadeAnim }]}
        >
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations de base</Text>
            
            {/* Type d'invendus */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type d'invendus</Text>
              <View style={[
                styles.inputWrapper,
                errors.titre ? styles.inputError : null
              ]}>
                <FontAwesome5 name="utensils" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.titre}
                  onChangeText={(text) => handleChange('titre', text)}
                  placeholder="Ex: Salades, sandwichs, plats du jour..."
                />
              </View>
              {errors.titre && <Text style={styles.errorText}>{errors.titre}</Text>}
            </View>
            
            {/* Quantité */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Quantité disponible</Text>
              <View style={[
                styles.inputWrapper,
                errors.quantite ? styles.inputError : null
              ]}>
                <FontAwesome5 name="balance-scale" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.quantite}
                  onChangeText={(text) => handleChange('quantite', text)}
                  placeholder="Nombre de portions ou poids"
                  keyboardType="numeric"
                />
              </View>
              {errors.quantite && <Text style={styles.errorText}>{errors.quantite}</Text>}
            </View>
            
            {/* Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description détaillée</Text>
              <View style={styles.textareaWrapper}>
                <TextInput
                  style={styles.textarea}
                  value={formData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  placeholder="Décrivez les produits, leur contenu..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Disponibilité</Text>
            
            {/* Date et Heure */}
            <Text style={styles.label}>Date limite de récupération</Text>
            <View style={styles.dateTimeContainer}>
              <View style={[styles.inputWrapper, { flex: 3, marginRight: 10 }]}>
                <FontAwesome5 name="calendar-alt" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.date}
                  onChangeText={(text) => handleChange('date', text)}
                  placeholder="Aujourd'hui ou JJ/MM/AAAA"
                />
              </View>
              
              <View style={[styles.inputWrapper, { flex: 2 }]}>
                <FontAwesome5 name="clock" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.heure}
                  onChangeText={(text) => handleChange('heure', text)}
                  placeholder="HH:MM"
                />
              </View>
            </View>
            
            {/* Option Urgent */}
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Signaler comme urgent</Text>
              <Switch
                trackColor={{ false: "#ddd", true: colors.orange }}
                thumbColor={formData.isUrgent ? "#fff" : "#fff"}
                onValueChange={(value) => handleChange('isUrgent', value)}
                value={formData.isUrgent}
              />
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations complémentaires</Text>
            
            {/* Allergènes */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Allergènes présents</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="exclamation-circle" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.allergenes}
                  onChangeText={(text) => handleChange('allergenes', text)}
                  placeholder="Ex: gluten, lactose, fruits à coque..."
                />
              </View>
            </View>
            
            {/* Température de conservation */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Température de conservation</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome5 name="temperature-low" size={18} color={colors.green} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.temperature}
                  onChangeText={(text) => handleChange('temperature', text)}
                  placeholder="Ex: Ambiante, Réfrigérée..."
                />
              </View>
            </View>
            
            {/* Instructions spéciales */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Instructions pour la récupération</Text>
              <View style={styles.textareaWrapper}>
                <TextInput
                  style={styles.textarea}
                  value={formData.instructions}
                  onChangeText={(text) => handleChange('instructions', text)}
                  placeholder="Instructions spéciales pour la récupération..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
          
          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <Button 
              label={isLoading ? "Mise à jour en cours..." : "Mettre à jour"}
              onPress={handleSubmit}
              type="primary"
              disabled={isLoading}
            />
            
            <Button 
              label="Annuler"
              onPress={() => navigation.goBack()}
              type="secondary"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.green,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
    width: 24,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  textareaWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  textarea: {
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  buttonContainer: {
    marginTop: 15,
  },
});

export default ModifierDon;