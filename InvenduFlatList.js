// composants/InvenduFlatList.js
import React, { memo, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constantes/couleurs';

/**
 * Composant d'élément individuel pour la liste des invendus
 * Implémentation mémoïsée pour éviter les re-rendus inutiles
 */
const InvenduItem = memo(({ item, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.invenduItem}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.invenduInfo}>
        <Text style={styles.restaurantName}>{item.restaurant}</Text>
        <Text style={styles.repasName}>{item.repas}</Text>
        <Text style={styles.quantite}>{item.quantite}</Text>
      </View>
      <View style={styles.invenduMeta}>
        <Text style={styles.temps}>{item.jusqua}</Text>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
    </TouchableOpacity>
  );
});

/**
 * Composant de liste optimisé utilisant FlatList au lieu de ScrollView
 * pour un meilleur recyclage des vues et des performances améliorées
 */
const InvenduFlatList = ({ 
  data, 
  onItemPress, 
  ListEmptyComponent,
  ListHeaderComponent,
  refreshing = false,
  onRefresh = null,
  contentContainerStyle
}) => {
  // Mémoïsation de la fonction de rendu pour éviter les recréations inutiles
  const renderItem = useCallback(({ item }) => (
    <InvenduItem item={item} onPress={onItemPress} />
  ), [onItemPress]);

  // Mémoïsation de l'extracteur de clé
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Mémoïsation du séparateur
  const ItemSeparatorComponent = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={[
        styles.contentContainer,
        contentContainerStyle,
        data.length === 0 && styles.emptyListContainer
      ]}
      showsVerticalScrollIndicator={false}
      initialNumToRender={8} // Limitez le nombre initial d'éléments à afficher
      maxToRenderPerBatch={5} // Limitez le nombre d'éléments rendus par lot
      windowSize={11} // Réduisez la taille de la fenêtre pour améliorer les performances
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invenduItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'white',
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
    marginBottom: 3,
  },
  distance: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default memo(InvenduFlatList);