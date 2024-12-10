import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Sell = () => {
  const categories = [
    { id: '1', title: 'Avtomobillar' },
    { id: '2', title: 'Mototexnika' },
    { id: '3', title: 'Suv transporti' },
    { id: '4', title: 'Yuk mashinalari' },
    { id: '5', title: 'Maxsus texnika' },
    { id: '6', title: 'Maxsus texnika ehtiyot qismlari' },
    { id: '7', title: 'Maxsus texnika ijarasi' },
    { id: '8', title: 'Tijorat xizmatlari' },
    { id: '9', title: 'Shinalar va disklar' },
    { id: '10', title: 'Ehtiyot qismlar' },
    { id: '11', title: 'Moy va rasxodniklar' },
    { id: '12', title: 'Aksessuarlar va elektronika' },
    { id: '13', title: 'Avtomobil ehtiyot qismlar uchun' },
    { id: '14', title: 'Tamirlash' },
    { id: '15', title: 'Xizmatlar' },
    { id: '16', title: 'Tyuning' },
    { id: '17', title: 'Boshqalar' },


  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nima sotyapsiz?</Text>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.item}>
          <Text style={styles.itemText}>{category.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  item: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Sell;
