import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, View } from 'react-native';

// Import your components
import SavedScreen from './Componient/SavedScreen';
import Login from './Componient/Login';
import DetailsScreen from './Componient/DetailsScreen';
import AddScreen from './Componient/AddScreen';
import ChatScreen from './Componient/ChatScreen';
import Footer from './Componient/Footer';

import Home from './Componient/HomeScreen';
import YukMashinalari from './Page/YukMashina';
import Sell from './Page/YukMashina'; // Ensure this is the correct import
import EhtiyotQismlari from './Page/EhtiyotQismlar';
import MaxsusTexnika from './Page/MaxsusTexnika';
import CategoryDetails from './Page/Cars';
import Tamirlash from './Page/Tamirlash';
import Title from './Page/Title';

// Create Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>
          <Stack.Navigator initialRouteName="Home">
            {/* Define screens inside Stack.Navigator */}
            <Stack.Screen 
              name="Home" 
              component={Home} 
              options={{ title: 'Kategoriyalar' }} 
            />
            <Stack.Screen 
              name="Details" 
              component={DetailsScreen} 
              options={{ title: 'Details' }} 
            />
            <Stack.Screen 
              name="Saved" 
              component={SavedScreen} 
              options={{ title: 'Saved Items' }} 
            />
            <Stack.Screen 
              name="Add" 
              component={AddScreen} 
              options={{ title: 'Add Item' }} 
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen} 
              options={{ title: 'Chat' }} 
            />
            <Stack.Screen 
              name="Profile" 
              component={Login} 
              options={{ title: 'Profile' }} 
            />
            <Stack.Screen 
              name="YukMashinalari" 
              component={YukMashinalari} 
              options={{ title: 'Yuk Mashinalari' }} 
            />
            <Stack.Screen 
              name="Sell" 
              component={Sell} 
              options={{ title: 'Nima sotyapsiz?' }} 
            />
            <Stack.Screen 
              name="EhtiyotQismlari" 
              component={EhtiyotQismlari} 
              options={{ title: 'Ehtiyot qismlari' }} 
            />
            <Stack.Screen 
              name="MaxsusTexnika" 
              component={MaxsusTexnika} 
              options={{ title: 'Maxsus texnika' }} 
            />
            <Stack.Screen 
              name="Tamirlash" 
              component={Tamirlash} 
              options={{ title: "Ta'mirlash va xizmatlar" }} 
            />
            <Stack.Screen 
              name="Cars" 
              component={CategoryDetails} 
              options={{ title: 'Avtomobillar' }} 
            />
            <Stack.Screen 
              name="Title" 
              component={Title} 
              options={{ title: 'Avtomobil maʼlumotlari' }} 
            />
          </Stack.Navigator>
        </View>
        <Footer />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
});

export default App;
