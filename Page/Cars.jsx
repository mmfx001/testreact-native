import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';

const CategoryDetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://avtoelonnode.onrender.com/yengilavtomobil');
        
        // Faqat avtomashinalarni filter qilamiz
        const filteredData = response.data.filter(item => item.texnikaturi === 'avtomashina');
        setData(filteredData); // Filtrlangan ma'lumotlarni saqlaymiz
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const renderCar = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img1 }} style={styles.image} />
      <Text style={styles.title}>{item.marka}</Text>
      <Text style={styles.detail}>{item.tafsilot}</Text>
      <Text style={styles.price}>{item.narx}</Text>
    </View>
  );

  return (
    <FlatList
      data={data} // Filtrlangan ma'lumotlarni chiqaramiz
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
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

export default CategoryDetails;
