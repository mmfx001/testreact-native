import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

const CategoryDetails = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: '1', name: 'Yengil avtomobillar', count: 46208, icon: '🚗', type: 'avtomobil' },
    { id: '2', name: 'Mototexnika', count: 1705, icon: '🏍️', type: 'mototexnika' },
    { id: '3', name: 'Suv transporti', count: 22, icon: '🛥️', type: 'suvTransport' },
  ];

  useEffect(() => {
    const fetchMaxsusTexnika = async () => {
      try {
        const response = await axios.get('https://avtoelonnode.onrender.com/yengilavtomobil');
        
        // Ma'lumotlarni kategoriyaga mos ravishda filtrlash
        const filteredData = response.data.filter((item) => {
          return selectedCategory ? item.turi === selectedCategory : true;
        });

        setData(filteredData);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchMaxsusTexnika();
  }, [selectedCategory]); // selectedCategory o'zgarganda ma'lumotni qayta yuklash

  const handleCategorySelect = (categoryType) => {
    if (selectedCategory === categoryType) {
      // If the category is already selected, clear the selection
      setSelectedCategory(null);
    } else {
      // Otherwise, select the category
      setSelectedCategory(categoryType);
    }
  };

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item.type && styles.selectedCategory]}
      onPress={() => handleCategorySelect(item.type)}
    >
      <Text style={styles.categoryButtonText}>{item.icon} {item.name}</Text>
    </TouchableOpacity>
  );

  const renderCar = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Title', { data: item })}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.title}>{item.model}</Text>
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
      <Text style={styles.price}>{item.narx}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>{item.yetkazish}</Text>
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
    <View style={styles.container}>
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryButton}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={data}
        renderItem={renderCar}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.carList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    height: 100,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: '#f0f0f0', // Highlight the selected category with a light color
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    display: 'flex',
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#333',
  },
  price: {
    fontSize: 16,
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
  carList: {
    paddingBottom: 20,
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
