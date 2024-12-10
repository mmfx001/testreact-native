import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Home')}>
        <Icon name="home-outline" size={18} color="#000" />
        <Text style={styles.label}>Avtoelon.uz</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Saved')}>
        <Icon name="heart-outline" size={18} color="#000" />
        <Text style={styles.label}>Saqlangan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButtonContainer} onPress={() => navigation.navigate('Add')}>
        <View style={styles.addButton}>
          <Icon name="add" size={18} color="#fff" />
        </View>
        <Text style={styles.label}>Sotish</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Chat')}>
        <View style={styles.chatNotification}>
          <Icon name="paper-plane-outline" size={18} color="#000" />
          <View style={styles.notificationDot}>
            <Text style={styles.notificationText}>1</Text>
          </View>
        </View>
        <Text style={styles.label}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Profile')}>
        <Icon name="person-outline" size={18} color="#000" />
        <Text style={styles.label}>Kabinet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 8,
    color: '#000',
    marginTop: 4,
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 8,
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 25,
    padding: 8,
  },
  chatNotification: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 6,
    fontWeight: 'bold',
  },
});

export default Footer;
