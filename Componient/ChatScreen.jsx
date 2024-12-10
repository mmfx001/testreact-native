import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]); 
    const [loggedInUser, setLoggedInUser] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('loggedInUser');
            setLoggedInUser(JSON.parse(userData));
        };
        loadUserData();
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            fetchMessages();
            fetchUsers();
        }
    }, [loggedInUser]);

    const fetchMessages = () => {
        axios.get('https://insta-lvyt.onrender.com/messages')
            .then(response => {
                const filteredMessages = response.data.filter(msg => msg.sender === loggedInUser.nomer || msg.receiver === loggedInUser.nomer);
                setMessages(filteredMessages);
            })
            .catch(error => console.error('Error fetching messages:', error));
    };

    const fetchUsers = () => {
        axios.get('https://avtoelonnode.onrender.com/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setNewMessage('');
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        // Simulate message sending logic (send to the server and fetch updated messages)
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: loggedInUser.nomer, receiver: selectedUser.nomer, text: newMessage },
        ]);
        setNewMessage('');
        scrollToBottom();
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            {selectedUser ? (
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#007aff' }}>
                        <TouchableOpacity onPress={() => setSelectedUser(null)}>
                            <Text style={{ color: 'white' }}>Back</Text>
                        </TouchableOpacity>
                        <Text style={{ color: 'white' }}>{selectedUser.nomer}</Text>
                    </View>
                    <ScrollView style={{ flex: 1, padding: 10 }} ref={chatEndRef}>
                        {messages.map((msg, index) => (
                            <View key={index} style={{ marginBottom: 10 }}>
                                <Text style={{
                                    color: msg.sender === loggedInUser.nomer ? '#007aff' : 'black',
                                    textAlign: msg.sender === loggedInUser.nomer ? 'right' : 'left'
                                }}>
                                    {msg.text}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={{
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        marginBottom: 60
                    }}>
                        <TextInput
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder="Type a message"
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 20,
                                borderColor: '#ddd',
                                marginRight: 10,
                                backgroundColor: '#fff',
                            }}
                        />
                        <IconButton
                            icon="send"
                            size={30}
                            color="#007aff"
                            onPress={handleSendMessage}
                        />
                    </View>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={users}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleUserClick(item)}>
                                <View style={{
                                    padding: 15,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ddd',
                                    backgroundColor: '#fff',
                                    marginBottom: 10,
                                    borderRadius: 10,
                                    elevation: 1
                                }}>
                                    <Text>{item.nomer}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item._id.toString()}
                    />
                </View>
            )}
        </View>
    );
};

export default Chat;
