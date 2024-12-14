import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikeItemsScreen = () => {
  const [likeItems, setLikeItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserLikes = async () => {
    try {
      // `AsyncStorage` orqali foydalanuvchini olish
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      const currentUser = JSON.parse(storedUser);

      if (!currentUser || !currentUser._id) {
        console.error('Foydalanuvchi topilmadi');
        setLoading(false);
        return;
      }

      // Foydalanuvchini API'dan `_id` orqali olish
      const userResponse = await fetch(`https://avtoelonnode.onrender.com/users/${currentUser._id}`);
      const fetchedUser = await userResponse.json();

      if (!fetchedUser || !fetchedUser.likeItems || !fetchedUser.likeItems.length) {
        console.log('Yoqtirilgan kartalar topilmadi');
        setLikeItems([]);
        setLoading(false);
        return;
      }

      const itemIds = fetchedUser.likeItems;

      // API endpointlarini belgilash
      const endpoints = [
        'https://avtoelonnode.onrender.com/yengilavtomobil',
        'https://avtoelonnode.onrender.com/maxsustexnika',
        'https://avtoelonnode.onrender.com/ehtiyotqisimlar',
        'https://avtoelonnode.onrender.com/tamirlashturi',
      ];

      // Barcha ma'lumotlarni olish
      const allData = await Promise.all(
        endpoints.map(async (endpoint) => {
          const res = await fetch(endpoint);
          return res.json();
        })
      );

      // `likeItems` bo'yicha kartalarni filtrlash
      const filteredItems = allData.flat().filter(item => itemIds.includes(item._id));
      setLikeItems(filteredItems);
    } catch (error) {
      console.error('Yoqtirilgan kartalarni olishda xato:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLikes();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#ff9900" style={styles.loader} />;
  }

  if (!likeItems.length) {
    return (
      <View style={styles.noItems}>
        <Text>Hech qanday yoqtirilgan karta mavjud emas.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {likeItems.map((item, index) => (
        <View key={index} style={styles.card}>
          {/* Rasm joylashuvi */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.img1 || 'https://via.placeholder.com/150' }}
              style={styles.image}
            />
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          </View>
          {/* Ma'lumotlar */}
          <Text style={styles.title}>{item.marka || 'Noma\'lum'}</Text>
          <Text style={styles.price}>{item.narx || 'Narx kiritilmagan'}</Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>{item.yili || 'Yil ma\'lumot yo\'q'}</Text>
            <Text style={styles.detailText}>{item.yoqilgi || 'Yoqilg\'i ma\'lumot yo\'q'}</Text>
            <Text style={styles.detailText}>{item.shahar || 'Manzil yo\'q'}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  vipBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'orange',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  vipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#ff9900',
    marginBottom: 5,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});

export default LikeItemsScreen;
