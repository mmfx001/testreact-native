import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const YukMashinalari = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaxsusTexnika = async () => {
      try {
        const response = await axios.get('https://avtoelonnode.onrender.com/yengilavtomobil');
        // Filter the data based on the "turi" field (only include "yukmashina")
        const filteredData = response.data.filter(item => item.turi === 'yukmashina');
        setData(filteredData);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchMaxsusTexnika();
  }, []);

  const renderCar = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Title', { data: item})} // Ensure EhtiytDetails screen exists in your navigator
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.img1 || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        {item.vip && (
          <View style={styles.vipBadge}>
            <Text style={styles.vipText}>VIP</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{item.modeluchun}</Text>
      <Text style={styles.price}>{item.narx}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>{item.yetkazish} </Text>
        <Text style={styles.detailText}>{item.holati}</Text>
        <Text style={styles.detailText}>{item.shahar}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderCar}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    elevation: 3,
    display: 'flex',
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  vipBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFD700',
    padding: 5,
    borderRadius: 5,
  },
  vipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  details: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  detailText: {
    marginBottom: 3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default YukMashinalari;
