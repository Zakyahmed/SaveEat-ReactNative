// ecrans/EcranAjoutInvendu.js
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../constantes/couleurs';
import { globalStyles } from '../theme/styles';
import Header from '../composants/Header';
import Button from '../composants/Button';
import Card from '../composants/Card';

const EcranAjoutInvendu = ({ navigation }) => {
  const [titre, setTitre] = useState('');
  const [quantite, setQuantite] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = () => {
    // Validation des données et soumission
    navigation.navigate('RestaurantTabs');
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Header 
        title="Ajouter un invendu"
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.contentContainer}>
        <Card>
          {/* Type d'invendus */}
          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>Type d'invendus</Text>
            <TextInput
              style={globalStyles.input}
              value={titre}
              onChangeText={setTitre}
              placeholder="Ex: Salades, sandwichs, plats du jour..."
            />
          </View>
          
          {/* Quantité */}
          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>Quantité disponible</Text>
            <TextInput
              style={globalStyles.input}
              value={quantite}
              onChangeText={setQuantite}
              placeholder="Nombre de portions ou poids"
              keyboardType="numeric"
            />
          </View>
          
          {/* Description */}
          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>Description détaillée</Text>
            <TextInput
              style={[globalStyles.input, { height: 100, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez les produits, allergènes potentiels..."
              multiline
              numberOfLines={4}
            />
          </View>
          
          {/* Date et Heure */}
          <Text style={globalStyles.label}>Date limite de récupération</Text>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <View style={{ flex: 3, marginRight: 10 }}>
              <TextInput
                style={globalStyles.input}
                value={date}
                onChangeText={setDate}
                placeholder="JJ/MM/AAAA"
              />
            </View>
            <View style={{ flex: 2 }}>
              <TextInput
                style={globalStyles.input}
                value={heure}
                onChangeText={setHeure}
                placeholder="HH:MM"
              />
            </View>
          </View>
          
          {/* Option Urgent */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={globalStyles.label}>Signaler comme urgent</Text>
            <Switch
              trackColor={{ false: "#ddd", true: colors.orange }}
              thumbColor={isUrgent ? "#fff" : "#fff"}
              onValueChange={() => setIsUrgent(!isUrgent)}
              value={isUrgent}
            />
          </View>
          
          {/* Bouton de soumission */}
          <Button 
            label="Publier l'offre"
            onPress={handleSubmit}
            type="primary"
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EcranAjoutInvendu;