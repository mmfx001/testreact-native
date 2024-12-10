import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://avtoelonnode.onrender.com/users';

const Login = ({ navigation }) => {
  const [nomer, setNomer] = useState('+998'); // Default phone number format
  const [parol, setParol] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nomerError, setNomerError] = useState('');
  const [parolError, setParolError] = useState('');



  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setMessage('');
    setNomer('+998');
    setParol('');
    setNomerError('');
    setParolError('');
  };

  const validatePhoneNumber = (number) => /^\+998\d{9}$/.test(number);

  const validatePassword = (password) => password.length >= 4;

  const handleSubmit = async () => {
    setLoading(true);

    if (!validatePhoneNumber(nomer)) {
      setNomerError('Telefon raqami noto‘g‘ri. 12 raqamli bo‘lishi kerak.');
      setLoading(false);
      return;
    } else {
      setNomerError('');
    }

    if (!validatePassword(parol)) {
      setParolError('Parol kamida 4 ta belgidan iborat bo‘lishi kerak.');
      setLoading(false);
      return;
    } else {
      setParolError('');
    }

    isSignUp ? await handleSignUp() : await handleLogin();
    setLoading(false);
  };

  const handleLogin = async () => {
    try {
      const { data: users } = await axios.get(API_URL);
      console.log('Fetched users:', users);

      const user = users.find((v) => v.nomer == nomer && v.parol == parol);

      if (user) {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        navigation.navigate('Details');
        return;
      }

      setMessage('Telefon raqami yoki parol noto‘g‘ri.');
      clearMessage();
    } catch (error) {
      console.error('Error during login:', error.response || error.message);
      setMessage('Tarmoq xatosi. Iltimos qayta urinib ko‘ring.');
      clearMessage();
    }
  };

  const handleSignUp = async () => {
    try {
      const { data: users } = await axios.get(API_URL);
      console.log('Fetched users for signup:', users);

      const existingUser = users.find((user) => user.nomer === nomer);

      if (existingUser) {
        setMessage('Bunday foydalanuvchi mavjud.');
        clearMessage();
        return;
      }

      const newUser = { nomer, parol, hisob: 0 };
      const response = await axios.post(API_URL, newUser);
      console.log('User created successfully:', response.data);

      setMessage('Ro‘yxatdan o‘tdingiz! Endi kirishingiz mumkin.');
      clearMessage();
      setIsSignUp(false);
    } catch (error) {
      console.error('Error during signup:', error.response || error.message);
      setMessage('Ro‘yxatdan o‘ta olmadik. Iltimos qayta urinib ko‘ring.');
      clearMessage();
    }
  };

  const handlePhoneChange = (text) => {
    const value = text.replace(/[^0-9]/g, '');
    if (value.startsWith('998')) {
      setNomer(`+${value}`);
    } else if (value.startsWith('+998') || value === '+998') {
      setNomer(value);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Telefon raqami"
        value={nomer}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
      />
      {nomerError ? <Text style={styles.error}>{nomerError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Parol"
        value={parol}
        onChangeText={setParol}
        secureTextEntry
      />
      {parolError ? <Text style={styles.error}>{parolError}</Text> : null}

      <Button
        title={isSignUp ? 'Ro‘yxatdan o‘tish' : 'Kirish'}
        onPress={handleSubmit}
        disabled={loading}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Button
        title={isSignUp ? 'Kirish' : 'Ro‘yxatdan o‘tish'}
        onPress={toggleForm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  message: {
    color: 'green',
    marginBottom: 10,
  },
});

export default Login;
