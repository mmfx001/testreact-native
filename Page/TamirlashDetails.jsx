import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import for AsyncStorage
import Swiper from 'react-native-swiper';
import Svg, { Path } from 'react-native-svg';

const HeartIcon = ({ isLiked, onClick, likeCount }) => (
  <View style={styles.heartContainer}>
    <TouchableOpacity onPress={onClick}>
      <Svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={[styles.heartIcon, { fill: isLiked ? 'red' : 'gray' }]}
      >
        <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </Svg>
    </TouchableOpacity>
    {likeCount > 0 && <Text style={styles.likeCount}>{likeCount}</Text>}
  </View>
);
const TamirlashDetails = ({ route, navigation }) => {
  const { carId } = route.params;
  console.log(carId);

  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedStates, setLikedStates] = useState({});
  const [users, setUsers] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await AsyncStorage.getItem('loggedInUser');
        setLoggedInUser(user ? JSON.parse(user) : null);
      } catch (err) {
        console.error('Failed to fetch logged-in user:', err);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          axios.get(`https://avtoelonnode.onrender.com/tamirlashturi/${carId}`),
          axios.get('https://avtoelonnode.onrender.com/users'),
        ]);

        const post = postsResponse.data;
        if (!post) {
          setError('Car data not found');
          setLoading(false);
          return;
        }

        setCar(post);

        if (Array.isArray(usersResponse.data)) {
          setUsers(usersResponse.data);

          const currentUser = usersResponse.data.find(
            (u) => u.nomer === loggedInUser?.nomer
          );
          if (currentUser) {
            setLikedStates({
              [post._id]: currentUser.likeItems?.includes(post._id) || false,
            });
          }
        }
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
  }, [carId, loggedInUser]);

  const handleLikeToggle = async (item) => {
    if (!loggedInUser) {
      Alert.alert('Login Required', 'Please log in to like items.');
      return;
    }

    const user = users.find((u) => u.nomer === loggedInUser.nomer);
    if (!user) return;

    const isLiked = likedStates[item._id];
    const updatedLikedItems = isLiked
      ? user.likeItems.filter((id) => id !== item._id)
      : [...(user.likeItems || []), item._id];

    const updatedUser = {
      ...user,
      likeItems: updatedLikedItems,
      hisob: isLiked ? user.hisob - 1000 : user.hisob + 1000,
    };

    const updatedCar = {
      ...item,
      likecount: isLiked ? item.likecount - 1 : item.likecount + 1,
    };

    try {
      await Promise.all([
        axios.put(`https://avtoelonnode.onrender.com/users/${user._id}`, updatedUser),
        axios.put(`https://avtoelonnode.onrender.com/tamirlashturi/${item._id}`, updatedCar),
      ]);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.nomer === loggedInUser.nomer ? updatedUser : u
        )
      );
      setCar(updatedCar);
      setLikedStates((prev) => ({ ...prev, [item._id]: !isLiked }));
    } catch (error) {
      console.error('Failed to update like:', error);
      Alert.alert('Error', 'Could not update like.');
    }
  };

  const calculateAveragePrice = async () => {
    if (!car) return;

    try {
      const response = await axios.get(
        `https://avtoelonnode.onrender.com/tamirlashturi?marka=${car.marka}`
      );
      const similarCars = response.data;

      const totalPrice = similarCars.reduce(
        (sum, car) =>
          sum + (parseInt(car.narx.replace(/\D/g, '')) || 0),
        0
      );
      setAveragePrice(similarCars.length ? totalPrice / similarCars.length : 0);
    } catch (error) {
      console.error('Failed to calculate average price:', error);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!car) return <Text>No car details found.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.carTitle}>{car.marka || 'Unknown'}</Text>
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
        <Text style={styles.priceText}>Narx: {car.narx || 'N/A'}</Text>
        <Text style={styles.description}>{car.tafsilot || 'No details.'}</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Details</Text>
        <Text>Marka: {car.marka || 'N/A'}</Text>
        <Text>Dvigatel: {car.dvigatel || 'N/A'}</Text>
        <Text>User: {loggedInUser?.nomer || 'N/A'}</Text>
        <Text>Raqam: {car.raqam || 'N/A'}</Text>
        <Text>Qutisi: {car.qutisi || 'N/A'}</Text>
        <Text>Yoqilgi: {car.yoqilgi || 'N/A'}</Text>
        <Text>Kuzov: {car.kuzov || 'N/A'}</Text>
        <Text>Shahar: {car.Shahar || 'N/A'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Back to Listing" onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Show Average Price" onPress={calculateAveragePrice} />
        {averagePrice !== null && (
          <Text style={styles.priceText}>
            Average Price: {averagePrice.toFixed(2)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
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
  swiper: {
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  card: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  detailsCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  heartContainer: {
    alignItems: 'center',
  },
  heartIcon: {
    marginTop: 10,
  },
  likeCount: {
    color: 'gray',
    fontSize: 12,
  },
});

export default TamirlashDetails;
