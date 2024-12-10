import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Swiper from 'react-native-swiper'; // Use React Native Swiper
import Svg, { Path } from 'react-native-svg';

const HeartIcon = ({ isLiked, onClick, likeCount }) => (
  <View style={styles.heartContainer}>
    <TouchableOpacity onPress={onClick}>
      <Svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={[styles.heartIcon, { fill: isLiked ? 'red' : 'gray' }]}
      >
        <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </Svg>
    </TouchableOpacity>
    {likeCount > 0 && <Text style={styles.likeCount}>{likeCount}</Text>}
  </View>
);

const Details = ({ route, navigation }) => {
  const _id = route.params?._id || "6755863dcf30740f3559c19b"; // Assuming the car _id is passed as a route param or fallback
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedStates, setLikedStates] = useState({});
  const [users, setUsers] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null); // O‘rtacha narx uchun state
  const [loggedInUser, setLoggedInUser] = useState(null); // State for logged-in user

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await AsyncStorage.getItem('loggedInUser');
      setLoggedInUser(user ? JSON.parse(user) : null);
    };

    fetchLoggedInUser();

    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([ 
          axios.get(`https://avtoelonnode.onrender.com/yengilavtomobil/${_id}`),
          axios.get('https://avtoelonnode.onrender.com/users')
        ]);

        const post = postsResponse.data;
        if (!post || typeof post !== 'object') {
          throw new Error("Fetched post is not an object");
        }
        setCar(post);

        // Check if usersResponse.data is an array
        if (Array.isArray(usersResponse.data)) {
          const currentUser = usersResponse.data.find(u => u.nomer == loggedInUser?.nomer);
          if (currentUser) {
            const initialLikedStates = {};
            initialLikedStates[post._id] = currentUser.likeItems?.includes(post._id) || false;
            setLikedStates(initialLikedStates);
          }
        } else {
          throw new Error('usersResponse.data is not an array');
        }

        setUsers(usersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchData();
    }
  }, [_id, loggedInUser]);

  const handleLikeToggle = async (item) => {
    if (!loggedInUser) {
      alert('Please log in to like products.');
      return;
    }

    const user = users.find((user) => user.nomer == loggedInUser.nomer);
    if (!user) {
      console.error('User not found.');
      return;
    }

    const isProductLiked = likedStates[item._id];

    const updatedLikedItems = isProductLiked
      ? user.likeItems.filter((i) => i !== item._id)
      : [...(user.likeItems || []), item._id];

    const updatedUser = {
      ...user,
      likeItems: updatedLikedItems,
      hisob: isProductLiked ? user.hisob - 1000 : user.hisob + 1000,
    };

    const updatedCar = {
      ...item,
      likecount: isProductLiked ? item.likecount - 1 : item.likecount + 1,
    };

    try {
      await Promise.all([
        axios.put(`https://avtoelonnode.onrender.com/users/${user._id}`, updatedUser),
        axios.put(`https://avtoelonnode.onrender.com/yengilavtomobil/${item._id}`, updatedCar),
      ]);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.nomer === loggedInUser.nomer ? updatedUser : u))
      );
      setCar((prevCar) => ({
        ...prevCar,
        likecount: updatedCar.likecount,
      }));
      setLikedStates((prevStates) => ({
        ...prevStates,
        [item._id]: !isProductLiked,
      }));
    } catch (error) {
      console.error('Error updating likes or balance:', error);
      Alert.alert('Error', 'Failed to update like status or balance.');
    }
  };

  const calculateAveragePrice = async () => {
    if (!car) return;

    try {
      const response = await axios.get(`https://avtoelonnode.onrender.com/yengilavtomobil?marka=${car.marka}`);
      const similarCars = response.data;

      const totalPrice = similarCars.reduce((sum, car) => sum + (parseInt(car.narx.replace(/[^0-9]/g, '')) || 0), 0);
      const average = similarCars.length > 0 ? totalPrice / similarCars.length : 0;

      setAveragePrice(average);
    } catch (error) {
      console.error('Error fetching similar cars:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!car) {
    return <Text>No car details found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.carTitle}>{car.marka || "Unknown"}</Text>
        <HeartIcon
          isLiked={likedStates[car._id]}
          onClick={() => handleLikeToggle(car)}
          likeCount={car.likecount || 0}
        />
      </View>

      <Swiper showsPagination showsButtons style={styles.swiper}>
        {car.img1 && (
          <View>
            <Image source={{ uri: car.img1 }} style={styles.image} />
          </View>
        )}
        {car.img2 && (
          <View>
            <Image source={{ uri: car.img2 }} style={styles.image} />
          </View>
        )}
      </Swiper>

      <View style={styles.card}>
        {car.narx && <Text style={styles.priceText}>Narx: {car.narx || "N/A"}</Text>}
        {car.tafsilot && <Text style={styles.description}>{car.tafsilot || "No details available."}</Text>}
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Details</Text>
        {car.marka && <Text>Marka: {car.marka || "N/A"}</Text>}
        {car.dvigatel && <Text>Dvigatel: {car.dvigatel || "N/A"}</Text>}
        {loggedInUser?.nomer && <Text>User: {loggedInUser.nomer || "N/A"}</Text>}
        {car.raqam && <Text>Raqam: {car.raqam || "N/A"}</Text>}
        {car.qutisi && <Text>Qutisi: {car.qutisi || "N/A"}</Text>}
        {car.yoqilgi && <Text>Yoqilgi: {car.yoqilgi || "N/A"}</Text>}
        {car.kuzov && <Text>Kuzov: {car.kuzov || "N/A"}</Text>}
        {car.uzatma && <Text>Uzatma: {car.uzatma || "N/A"}</Text>}
        {car.Shahar && <Text>Shahar: {car.Shahar || "N/A"}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Back to Listing" onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Show Average Price" onPress={calculateAveragePrice} />
        {averagePrice !== null && (
          <Text style={styles.averagePrice}>
            Average Price: {averagePrice.toFixed(2)} so'm
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    cursor: 'pointer',
    transition: 'fill 0.3s',
  },
  likeCount: {
    fontSize: 18,
    marginLeft: 5,
  },
  swiper: {
    height: 300,
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  priceText: {
    fontSize: 18,
  },
  description: {
    color: 'gray',
  },
  detailsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  averagePrice: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default Details;
