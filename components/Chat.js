import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'

// import Firestore
const firebase = require('firebase');
require('firebase/firestore');
// import async storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// import netinfo package to find out if a user is online or not
import NetInfo from '@react-native-community/netinfo';
// import custom actions to add to GiftedChats
import CustomActions from './CustomActions';
// import the necessary components from Expo
import MapView from 'react-native-maps';

export default class Chat extends Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
            isConnected: false,
            image: null,
            location: null
        };

        //information for the database
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyDurhor4Lf9Pcbo1u8TKA7DzBxyzdEHWe8",
                authDomain: "giftedchat-4b882.firebaseapp.com",
                projectId: "giftedchat-4b882",
                storageBucket: "giftedchat-4b882.appspot.com",
                messagingSenderId: "553912126244",
                appId: "1:553912126244:web:85acf1b8036fa39ff3c1b1",
                measurementId: "G-DSNS5NYD00"

            });
        }

        //references the database
        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.refMsgsUser = null;
    };
    // retrieves the chat messages from async storage
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    }
    // saves message in asynstorage
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }
    // deletes messages in asynstorage
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {

        //this.getMessages();
        // get username prop from Start.js
        const name = this.props.route.params.name;
        // if (name === '') name = 'UNNAMED'
        this.props.navigation.setOptions({ title: name });

        // NetInfo detects whether or not the user has an internet connection
        NetInfo.fetch().then(connection => {
            // if user is online
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log('online');
                // listens for updates in the collection
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);

                //listen to authentication events, sign in anonymously
                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: "https://placeimg.com/140/140/any"
                        }
                    });
                    //referencing messages of current user
                    this.refMsgsUser = firebase
                        .firestore()
                        .collection("messages")
                        .where("uid", "==", this.state.uid);
                });
                //save messages when online
                this.saveMessages();
            } else {
                // when the user is offline
                this.setState({ isConnected: false });
                console.log('offline');
                //retrieve chat from asyncstorage
                this.getMessages();
            }
        });
    }

    // when updated set the messages state with the current data
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages: messages,
        });
    }

    //adding messages to the database
    addMessage() {
        // add a new message to the firebase collection
        const message = this.state.messages[0];

        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            createdAt: message.createdAt,
            text: message.text || '',
            user: this.state.user,
            image: message.image || null,
            location: message.location || null,
        });
    };
    //when a message is sent, save its current state into asyncStorage
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            // add messages to local AsyncStorage
            this.addMessage();
            // save messages to local AsyncStorage
            this.saveMessages();
        })
    }

    componentWillUnmount() {
        if (this.state.isConnected) {
            this.authUnsubscribe();
            this.unsubscribe();
        }
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    },
                    left: {
                        backgroundColor: '#fff'
                    }
                }}
            />
        )
    }

    // renders the chat input field toolbar only when user is online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return <InputToolbar {...props} />;
        }
    }

    // Returns a mapview when user adds a location to current message
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <View style={{ borderRadius: 13, overflow: 'hidden', margin: 3 }}>
                    <MapView
                        style={{ width: 350, height: 200 }}
                        region={{
                            latitude: currentMessage.location.latitude,
                            longitude: currentMessage.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    />
                </View>
            );
        }
        return null;
    }

    // displays the communication features
    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };


    //render components
    render() {
        //background color chosen in Start screen is set as const bgColor
        const { bgColor } = this.props.route.params;

        return (
            <>
                <View style={styles.chatView}>
                    <GiftedChat
                        renderBubble={this.renderBubble.bind(this)}
                        renderInputToolbar={this.renderInputToolbar.bind(this)}
                        messages={this.state.messages}
                        renderActions={this.renderCustomActions}
                        onSend={messages => this.onSend(messages)}
                        renderCustomView={this.renderCustomView}
                        user={{
                            _id: this.state.user._id,
                            name: this.state.name,
                            avatar: this.state.user.avatar,
                        }}
                    />
                    {/* this avoids the keyboard to overlap pver the typed text in android */}
                    {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
                </View></>
        )
    }
}

const styles = StyleSheet.create({
    chatView: {
        flex: 1,
    }

})