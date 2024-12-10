// EhtiyotQismlari.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import axios from 'axios';

const EhtiyotQismlari = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get('https://avtoelonnode.onrender.com/ehtiyotqisimlar');
        setParts(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  const renderPart = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img1 }} style={styles.image} />
      <Text style={styles.title}>{item.modeluchun}</Text>
      <Text style={styles.detail}>{item.qismturi}</Text>
      <Text style={styles.price}>{item.narx}</Text>
      <Text style={styles.detail}>{item.shahar}</Text>
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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={parts}
      keyExtractor={(item) => item._id}
      renderItem={renderPart}
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
    marginVertical: 10,
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
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  detail: {
    fontSize: 14,
    color: '#666',
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

export default EhtiyotQismlari;
