import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const EmailList = ({ onUserClick, selectedUser }) => {
    const [usersWithMessages, setUsersWithMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQueryMessages, setSearchQueryMessages] = useState('');
    const [searchQueryAllUsers, setSearchQueryAllUsers] = useState('');
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        // Retrieve logged-in user from AsyncStorage
        AsyncStorage.getItem('loggedInUser')
            .then((user) => {
                if (user) {
                    setLoggedInUser(JSON.parse(user));
                }
            })
            .catch((error) => console.error("Error fetching logged-in user from AsyncStorage:", error));
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            fetchUsers();
            fetchMessages();
        }
    }, [loggedInUser]);

    const fetchMessages = () => {
        axios.get('https://avtoelonnode.onrender.com/messages') // Ensure the correct API endpoint
            .then(response => {
                const messages = response.data;
                const filteredUsers = messages
                    .filter(msg => msg.sender === loggedInUser.email || msg.receiver === loggedInUser.email)
                    .map(msg => msg.sender === loggedInUser.email ? msg.receiver : msg.sender)
                    .filter((email, index, self) => self.indexOf(email) === index);

                setUsersWithMessages(allUsers.filter(user => filteredUsers.includes(user.email)));
            })
            .catch(error => console.error("Error fetching messages:", error));
    };

    const fetchUsers = () => {
        axios.get('https://avtoelonnode.onrender.com/users') // Ensure the correct API endpoint
            .then(response => {
                setAllUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    };

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
        <View style={{ flex: 1, backgroundColor: '#2d2d2d' }}>
            <TextInput
                style={{
                    backgroundColor: '#3a3a3a',
                    color: '#fff',
                    padding: 12,
                    margin: 16,
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: '#4a4a4a',
                }}
                placeholder="Search all users..."
                placeholderTextColor="#aaa"
                value={searchQueryAllUsers}
                onChangeText={(text) => setSearchQueryAllUsers(text)}
            />
            <TextInput
                style={{
                    backgroundColor: '#3a3a3a',
                    color: '#fff',
                    padding: 12,
                    margin: 16,
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: '#4a4a4a',
                }}
                placeholder="Search by messages..."
                placeholderTextColor="#aaa"
                value={searchQueryMessages}
                onChangeText={(text) => {
                    setSearchQueryMessages(text);
                    fetchMessages();
                }}
            />
            
            <View style={{ flex: 1, padding: 16 }}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        {/* All Users Filtering */}
                        <FlatList
                            data={searchQueryAllUsers ? getFilteredAllUsers() : allUsers}
                            keyExtractor={(item) => item.email}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    onPress={() => handleUserClick(item)} 
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 16,
                                        backgroundColor: selectedUser === item.email ? '#3498db' : '#333',
                                        marginBottom: 8,
                                        borderRadius: 8,
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserCircle} size={30} color="#aaa" />
                                    <Text style={{ color: '#fff', marginLeft: 16, fontSize: 16 }}>{item.email}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Messages Filtering */}
                        <FlatList
                            data={getFilteredUsersByMessages()}
                            keyExtractor={(item) => item.email}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    onPress={() => handleUserClick(item)} 
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 16,
                                        backgroundColor: selectedUser === item.email ? '#3498db' : '#333',
                                        marginBottom: 8,
                                        borderRadius: 8,
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserCircle} size={30} color="#aaa" />
                                    <Text style={{ color: '#fff', marginLeft: 16, fontSize: 16 }}>{item.email}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

export default EmailList;
