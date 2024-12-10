import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const Home = ({ navigation }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: '1', title: 'Sotish', icon: require('../assets/plus.png'), bg: '#007BFF' },
    { id: '2', title: 'Avtomobillar', icon: require('../assets/mashina.png'), bg: '#f0f8ff' },
    { id: '3', title: 'Yuk mashinalari', icon: require('../assets/gruz.png'), bg: '#f0f8ff' },
    { id: '4', title: 'Ehtiyot qismlari va tovarlar', icon: require('../assets/zapchas.png'), bg: '#f0f8ff' },
    { id: '5', title: 'Maxsus texnika', icon: require('../assets/trakt.png'), bg: '#f0f8ff' },
    { id: '6', title: "Ta'mirlash va xizmatlar", icon: require('../assets/gayka.png'), bg: '#f0f8ff' },
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('https://avtoelonnode.onrender.com/yengilavtomobil');
        setCars(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.bg }]}
      onPress={() => {
        if (item.id === '1') {
          navigation.navigate('Sell'); // Sotish sahifasi
        } else if (item.id === '4') {
          navigation.navigate('EhtiyotQismlari'); // Ehtiyot qismlar
        } else if (item.id === '5') {
          navigation.navigate('MaxsusTexnika'); // Maxsus texnika
        } else if (item.id === '3') {
          navigation.navigate('YukMashinalari'); // Yuk Mashinalari sahifasi
        } else if (item.id === '6') {
          navigation.navigate('Tamirlash'); // Ta'mirlash sahifasi
        } else {
          navigation.navigate('Cars', { id: item.id }); // Kategoriya tafsilotlari
        }
      }}
    >
      <Image source={item.icon} style={styles.categoryIcon} />
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderCar = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Title', { car: item })} // Pass selected car data to Title page
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.img1 || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
        <View style={styles.vipBadge}>
          <Text style={styles.vipText}>VIP</Text>
        </View>
      </View>
      <Text style={styles.title}>{item.marka}</Text>
      <Text style={styles.price}>{item.narx}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>{item.yili} yil</Text>
        <Text style={styles.detailText}>{item.yoqilgi}</Text>
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
      data={cars}
      keyExtractor={(item) => item._id}
      renderItem={renderCar}
      ListHeaderComponent={
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          numColumns={3} // Display 3 categories per row
          contentContainerStyle={styles.categoryContainer}
        />
      }
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryCard: {
    flex: 1,
    aspectRatio: 1, // Square shape
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    elevation: 3,
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
    backgroundColor: 'red',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  vipText: {
    color: '#fff',
    fontSize: 12,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  detailText: {
    fontSize: 12,
    color: '#555',
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

export default Home;
