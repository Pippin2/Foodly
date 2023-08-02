import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSessionContext } from '../UserContext';

const Congelados = () => {
  const [items, setItems] = useState([]); // Estado para almacenar los artículos
  const [newItem, setNewItem] = useState(''); // Estado para el nuevo artículo
  const [quantity, setQuantity] = useState(''); // Estado para la cantidad

  const { currentUser } = useContext(UserSessionContext); // Contexto de la sesión del usuario actual

  useEffect(() => {
    loadItemsFromStorage(); // Cargar los artículos al montar el componente
  }, []);

  // Cargar los artículos desde el AsyncStorage
  const loadItemsFromStorage = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('currentUser')); // Obtener el usuario actual del AsyncStorage
      if (user && user.usuario) {
        const itemsData = await AsyncStorage.getItem(`congelados-${user.usuario}`); // Obtener los artículos de la clave correspondiente al usuario
        if (itemsData) {
          setItems(JSON.parse(itemsData)); // Actualizar los artículos en el estado
        }
      } else {
        console.log('Error: currentUser no tiene usuario.');
      }
    } catch (error) {
      console.log('Error al cargar los artículos desde AsyncStorage:', error);
    }
  };

  // Guardar los artículos en el AsyncStorage
  const saveItemsToStorage = async (newItems) => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('currentUser')); // Obtener el usuario actual del AsyncStorage
      if (user && user.usuario) {
        await AsyncStorage.setItem(`congelados-${user.usuario}`, JSON.stringify(newItems)); // Guardar los artículos en la clave correspondiente al usuario
      } else {
        console.log('Error: currentUser no tiene usuario.');
      }
    } catch (error) {
      console.log('Error al guardar los artículos en AsyncStorage:', error);
    }
  };

  // Manejar la adición de un nuevo artículo
  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const newItemObj = {
        id: Math.random().toString(),
        name: newItem,
        quantity: quantity,
      };

      const updatedItems = [...items, newItemObj];

      setItems(updatedItems); // Actualizar los artículos en el estado
      saveItemsToStorage(updatedItems); // Guardar los artículos en el AsyncStorage
      setNewItem(''); // Limpiar el campo de nuevo artículo
      setQuantity(''); // Limpiar el campo de cantidad
    } else {
      Alert.alert('Error', 'Por favor, ingrese el nombre del artículo.');
    }
  };

  // Manejar la eliminación de un artículo
  const handleDeleteItem = (itemId) => {
    Alert.alert(
      'Eliminar artículo',
      '¿Estás seguro de que deseas eliminar este artículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedItems = items.filter((item) => item.id !== itemId);

            setItems(updatedItems); // Actualizar los artículos en el estado
            saveItemsToStorage(updatedItems); // Guardar los artículos en el AsyncStorage
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Renderizar un elemento de la lista de artículos
  const renderListItem = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../../../assets/FondoRosa.jpg')} style={styles.container}>
      <Text style={styles.title}>Congelados</Text>
      <View style={styles.newItemContainer}>
        <TextInput
          style={styles.newItemInput}
          placeholder="Nuevo artículo"
          value={newItem}
          onChangeText={setNewItem}
        />
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Cantidad:</Text>
          <TextInput
            style={styles.quantityInput}
            placeholder="0"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>
        <TouchableOpacity style={styles.newItemButton} onPress={handleAddItem}>
          <Text style={styles.newItemButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      {items.length === 0 ? (
        <Text style={styles.emptyMessage}>No hay artículos guardados</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  newItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    
  },
  newItemInput: {
    flex: 1,
    borderColor: '#FF69B4',
    borderBottomWidth: 1,
    backgroundColor: '#F2F2F2',
    color: '#FF69B4',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  quantityInput: {
    width: 55,
    borderColor: '#FF69B4',
    borderBottomWidth: 1,
    backgroundColor: '#F2F2F2',
    color: '#FF69B4',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  },
  newItemButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  newItemButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
  },
  listItem: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    flex: 1,
    
  },
  itemQuantity: {
    fontSize: 16,
    color: '#FF69B4',
    textAlign: 'center',
    marginLeft: 16,
    margin: 12
  },
  deleteButton: {
    backgroundColor: '#D0021B',
    borderRadius: 8,
    padding: 8,
    margin: 2
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default Congelados;
