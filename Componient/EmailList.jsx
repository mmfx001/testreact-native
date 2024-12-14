import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const EmailList = ({ onUserClick, selectedUser }) => {
    const [usersWithMessages, setUsersWithMessages] = useState([]); // Xabar almashgan foydalanuvchilar
    const [allUsers, setAllUsers] = useState([]); // Barcha foydalanuvchilar
    const [searchQueryMessages, setSearchQueryMessages] = useState(''); // Xabarlar bo'yicha qidirish
    const [searchQueryAllUsers, setSearchQueryAllUsers] = useState(''); // Barcha foydalanuvchilar uchun qidirish
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user

    useEffect(() => {
        fetchLoggedInUser();
        fetchUsers();
    }, []);

    const fetchLoggedInUser = async () => {
        const user = await AsyncStorage.getItem('loggedInUser');
        if (user) {
            setLoggedInUser(JSON.parse(user)); // Assuming the logged-in user is stored as a JSON string
        }
    };

    useEffect(() => {
        if (loggedInUser) {
            fetchMessages();
        }
    }, [loggedInUser]);

    const fetchMessages = () => {
        axios.get('https://insta-lvyt.onrender.com/messages')
            .then(response => {
                const messages = response.data;
                const filteredUsers = messages
                    .filter(msg => msg.sender === loggedInUser.nomer || msg.receiver === loggedInUser.nomer)
                    .map(msg => msg.sender === loggedInUser.nomer ? msg.receiver : msg.sender)
                    .filter((nomer, index, self) => self.indexOf(nomer) === index); // Takrorlanuvchilarni olib tashlash

                // Xabar almashgan foydalanuvchilarni o'rnating
                setUsersWithMessages(allUsers.filter(user => filteredUsers.includes(user.nomer)));
            })
            .catch(error => console.error("Xabarlarni olishda xato:", error));
    };

    const fetchUsers = () => {
        axios.get('https://avtoelonnode.onrender.com/users')
            .then(response => {
                setAllUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Foydalanuvchilarni olishda xato:", error);
                setLoading(false);
            });
    };

    // Foydalanuvchilarni xabarlar bo'yicha filtrlash
    const getFilteredUsersByMessages = () => {
        return usersWithMessages.filter(user =>
            user.email.toLowerCase().includes(searchQueryMessages.toLowerCase())
        );
    };

    const getFilteredAllUsers = () => {
        return allUsers.filter(user =>
            user.email.toLowerCase().includes(searchQueryAllUsers.toLowerCase())
        );
    };

    const handleUserClick = (user) => {
        onUserClick(user);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <TextInput
                style={{
                    padding: 10,
                    margin: 15,
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: '#666',
                    backgroundColor: '#333',
                    color: 'white',
                    fontSize: 16,
                }}
                placeholder="Xabarlar bo'yicha qidirish..."
                placeholderTextColor="#ccc"
                value={searchQueryMessages}
                onChangeText={(text) => {
                    setSearchQueryMessages(text);
                }}
            />

            <TextInput
                style={{
                    padding: 10,
                    margin: 15,
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: '#666',
                    backgroundColor: '#333',
                    color: 'white',
                    fontSize: 16,
                }}
                placeholder="Barcha foydalanuvchilarni qidirish..."
                placeholderTextColor="#ccc"
                value={searchQueryAllUsers}
                onChangeText={(text) => {
                    setSearchQueryAllUsers(text);
                }}
            />

            <View style={{ flex: 1 }}>
                {loading ? (
                    <ActivityIndicator size="large" color="#00ff00" style={{ marginTop: 20 }} />
                ) : (
                    <>
                        {/* Xabarlar bo'yicha filtrlash */}
                        {getFilteredUsersByMessages().map((user) =>
                            user && user.nomer ? ( // Check for `user` and `user.nomer` to ensure they exist
                                <TouchableOpacity
                                    key={user.nomer} // Use `nomer` as the key instead of `email`
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 15,
                                        flexDirection: 'row',
                                        backgroundColor: selectedUser === user.nomer ? '#1D72B8' : '#333',
                                        marginBottom: 5,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => handleUserClick(user)}
                                >
                                    <Icon name="user-circle" size={24} color="#888" style={{ marginRight: 10 }} />
                                    <Text style={{ color: 'white', fontWeight: '500' }}>
                                        {user.nomer ? user.nomer.toString() : 'No Nomer'} {/* Safeguard for nomer */}
                                    </Text>
                                </TouchableOpacity>
                            ) : null // Skip rendering if user or nomer is undefined
                        )}

                        {/* Barcha foydalanuvchilarni qidirish */}
                        {searchQueryAllUsers && getFilteredAllUsers().map((user) =>
                            user && user.nomer ? ( // Check for `user` and `user.nomer`
                                <TouchableOpacity
                                    key={user.nomer} // Use `nomer` as the key
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 15,
                                        flexDirection: 'row',
                                        backgroundColor: selectedUser === user.nomer ? '#1D72B8' : '#333',
                                        marginBottom: 5,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => handleUserClick(user)}
                                >
                                    <Icon name="user-circle" size={24} color="#888" style={{ marginRight: 10 }} />
                                    <Text style={{ color: 'white', fontWeight: '500' }}>
                                        {user.nomer ? user.nomer.toString() : 'No Nomer'} {/* Safeguard for nomer */}
                                    </Text>
                                </TouchableOpacity>
                            ) : null
                        )}
                    </>
                )}

            </View>
        </View>
    );
};

export default EmailList;
