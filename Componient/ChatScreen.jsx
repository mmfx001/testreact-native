import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatUsers, setChatUsers] = useState([]); // Xabar almashilgan foydalanuvchilar
    const [selectedUser, setSelectedUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const chatEndRef = useRef(null);

    // Load logged-in user from AsyncStorage
    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('loggedInUser');
            if (userData) {
                setLoggedInUser(JSON.parse(userData));
            }
        };
        loadUserData();
    }, []);

    // Fetch chat users and messages on loggedInUser load
    useEffect(() => {
        if (loggedInUser) {
            fetchChatUsers();
        }
    }, [loggedInUser]);

    // Fetch users who have exchanged messages with logged-in user
    const fetchChatUsers = async () => {
        try {
            const response = await axios.get('https://insta-lvyt.onrender.com/messages');
            const userMessages = response.data.filter(msg =>
                msg.sender === loggedInUser.nomer || msg.receiver === loggedInUser.nomer
            );

            // Extract unique chat users with their last message
            const uniqueUsers = [];
            userMessages.forEach(msg => {
                const otherUserNomer =
                    msg.sender === loggedInUser.nomer ? msg.receiver : msg.sender;

                // Check if this user already exists in uniqueUsers
                const existingUser = uniqueUsers.find(user => user.nomer === otherUserNomer);
                if (!existingUser) {
                    uniqueUsers.push({
                        nomer: otherUserNomer,
                        lastMessage: msg.text,
                        lastMessageTime: msg.timestamp,
                    });
                } else if (new Date(msg.timestamp) > new Date(existingUser.lastMessageTime)) {
                    // Update last message if this message is newer
                    existingUser.lastMessage = msg.text;
                    existingUser.lastMessageTime = msg.timestamp;
                }
            });

            setChatUsers(uniqueUsers); // Set chat users with last messages
        } catch (error) {
            console.error('Error fetching chat users:', error);
        }
    };

    // Fetch messages between logged-in user and selected user
    const fetchMessages = async (selectedUser) => {
        try {
            const response = await axios.get('https://insta-lvyt.onrender.com/messages');
            const filteredMessages = response.data.filter(msg =>
                (msg.sender === loggedInUser.nomer && msg.receiver === selectedUser.nomer) ||
                (msg.sender === selectedUser.nomer && msg.receiver === loggedInUser.nomer)
            );
            setMessages(filteredMessages);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Handle selecting a user to chat with
    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchMessages(user);
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            sender: loggedInUser.nomer,
            receiver: selectedUser.nomer,
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        try {
            await axios.post('https://insta-lvyt.onrender.com/messages', messageData);
            setMessages(prevMessages => [...prevMessages, messageData]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Scroll to the bottom of the chat
    const scrollToBottom = () => {
        chatEndRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <View style={styles.container}>
            {selectedUser ? (
                <View style={styles.chatContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setSelectedUser(null)}>
                            <Text style={styles.headerText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerText}>{selectedUser.nomer}</Text>
                    </View>

                    <ScrollView style={styles.messagesContainer} ref={chatEndRef}>
                        {messages.map((msg, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.message,
                                    msg.sender === loggedInUser.nomer
                                        ? styles.sentMessage
                                        : styles.receivedMessage,
                                ]}
                            >
                                <Text style={styles.messageText}>{msg.text}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder="Type a message"
                            style={styles.input}
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
                <FlatList
                    data={chatUsers}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleUserClick(item)}>
                            <View style={styles.userCard}>
                                <Text style={styles.userText}>{item.nomer}</Text>
                                <Text style={styles.lastMessageText}>
                                    {item.lastMessage || 'No messages yet'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    chatContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#007aff',
    },
    headerText: {
        color: 'white',
        fontSize: 18,
    },
    messagesContainer: {
        flex: 1,
        padding: 10,
    },
    message: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    sentMessage: {
        backgroundColor: '#007aff',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#808080',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        marginRight: 10,
    },
    userCard: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2,
    },
    userText: {
        fontSize: 16,
        color: '#333',
    },
    lastMessageText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default Chat;
