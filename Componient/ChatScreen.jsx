import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatUsers, setChatUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const chatEndRef = useRef(null);

    // Logged-in userni AsyncStorage'dan yuklash
    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem('loggedInUser');
            if (userData) {
                setLoggedInUser(JSON.parse(userData));
            }
        };
        loadUserData();
    }, []);

    // Chat foydalanuvchilarni va xabarlarni yuklash
    useEffect(() => {
        if (loggedInUser) {
            fetchChatUsers();
        }
    }, [loggedInUser]);

    // Chat foydalanuvchilarni olish funksiyasi
    const fetchChatUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await axios.get('https://insta-lvyt.onrender.com/messages');
            const userMessages = response.data.filter(msg =>
                msg.sender === loggedInUser.nomer || msg.receiver === loggedInUser.nomer
            );

            const uniqueUsers = [];
            userMessages.forEach(msg => {
                const otherUserNomer =
                    msg.sender === loggedInUser.nomer ? msg.receiver : msg.sender;

                const existingUser = uniqueUsers.find(user => user.nomer === otherUserNomer);
                if (!existingUser) {
                    uniqueUsers.push({
                        nomer: otherUserNomer,
                        lastMessage: msg.text,
                        lastMessageTime: msg.timestamp,
                    });
                } else if (new Date(msg.timestamp) > new Date(existingUser.lastMessageTime)) {
                    existingUser.lastMessage = msg.text;
                    existingUser.lastMessageTime = msg.timestamp;
                }
            });

            setChatUsers(uniqueUsers);
        } catch (error) {
            console.error('Foydalanuvchilarni yuklashda xatolik:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Xabarlarni yuklash funksiyasi
    const fetchMessages = async (selectedUser) => {
        setLoadingMessages(true);
        try {
            const response = await axios.get('https://insta-lvyt.onrender.com/messages');
            const filteredMessages = response.data.filter(msg =>
                (msg.sender === loggedInUser.nomer && msg.receiver === selectedUser.nomer) ||
                (msg.sender === selectedUser.nomer && msg.receiver === loggedInUser.nomer)
            );
            setMessages(filteredMessages);
            scrollToBottom();
        } catch (error) {
            console.error('Xabarlarni yuklashda xatolik:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Foydalanuvchi tanlash funksiyasi
    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchMessages(user);
    };

    // Yangi xabar yuborish funksiyasi
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
            console.error('Xabar yuborishda xatolik:', error);
        }
    };

    // Chatni oxiriga o'tish funksiyasi
    const scrollToBottom = () => {
        chatEndRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <View style={styles.container}>
            {selectedUser ? (
                <View style={styles.chatContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setSelectedUser(null)}>
                            <Text style={styles.headerText}>Ortga</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerText}>{selectedUser.nomer}</Text>
                    </View>

                    {loadingMessages ? (
                        <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
                    ) : (
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
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder="Xabar yozing"
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
                <>
                    {loadingUsers ? (
                        <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
                    ) : (
                        <FlatList
                            data={chatUsers}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleUserClick(item)}>
                                    <View style={styles.userCard}>
                                        <Text style={styles.userText}>{item.nomer}</Text>
                                        <Text style={styles.lastMessageText}>
                                            {item.lastMessage || 'Hozircha xabar yo\'q'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#007aff',
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        padding: 10,
    },
    message: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007aff',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e4e4e4',
    },
    messageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    userCard: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    userText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessageText: {
        fontSize: 14,
        color: '#888',
    },
});

export default Chat;
