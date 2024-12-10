import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import axios from 'axios';

const Tamirlash = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTamirlashData = async () => {
      try {
        const response = await axios.get('https://avtoelonnode.onrender.com/tamirlashturi');
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTamirlashData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.elonnomi}</Text>
      <Text style={styles.remontTuri}>Remont turi: {item.remontturi}</Text>
      <Text style={styles.tafsilot}>Tavsif: {item.tafsilot}</Text>
      <Text style={styles.city}>Shahar: {item.shahar}</Text>
      <Text style={styles.contact}>Telefon raqam: {item.raqam}</Text>
      <Text style={styles.experience}>Tajriba: {item.tajriba} yil</Text>
      <Text style={styles.kamibor}>Kamibor: {item.kamibor}</Text>
    </View>
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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
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
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  remontTuri: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  tafsilot: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  city: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  contact: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 5,
  },
  experience: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  kamibor: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
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

export default Tamirlash;
