import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const Title = ({ route }) => {
  const { car } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: car.img1 }} style={styles.image} />
      
      <Text style={styles.title}>{car.marka}</Text>
      <Text style={styles.price}>{car.narx}</Text>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>Yili: {car.yili}</Text>
        <Text style={styles.detailText}>Shahar: {car.shahar}</Text>
        <Text style={styles.detailText}>Kuzov: {car.kuzov}</Text>
        <Text style={styles.detailText}>Dvigatel: {car.dvigatel}</Text>
        <Text style={styles.detailText}>Uzatma: {car.uzatma}</Text>
        <Text style={styles.detailText}>Texnika turi: {car.texnikaturi}</Text>
        <Text style={styles.detailText}>Holati: {car.holati}</Text>
        <Text style={styles.detailText}>Rang: {car.rang}</Text>
      </View>

      <Text style={styles.description}>{car.tafsilot}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F9F9F9',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#007BFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    marginBottom: 30,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginTop: 20,
    paddingHorizontal: 10,
    textAlign: 'justify',
  },
});

export default Title;
