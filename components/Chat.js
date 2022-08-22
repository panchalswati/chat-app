import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: '',
                avatar: '',
            },
        };

        const firebaseConfig = {
            apiKey: "AIzaSyDurhor4Lf9Pcbo1u8TKA7DzBxyzdEHWe8",
            authDomain: "giftedchat-4b882.firebaseapp.com",
            projectId: "giftedchat-4b882",
            storageBucket: "giftedchat-4b882.appspot.com",
            messagingSenderId: "553912126244",
            appId: "1:553912126244:web:85acf1b8036fa39ff3c1b1",
            measurementId: "G-DSNS5NYD00"
        };
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.refMsgsUser = null;
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text || '',
                createdAT: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,

                },
            });
        });
        this.setState({
            messages
        });
    };

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
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

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
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log('online');
                //listen for update in collection
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);
                //authenticate user anonymously
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: 'https://placeimg.com/140/140/any'
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

    componentWillUnmount() {
        if (this.isConnected) {

            this.authUnsubscribe();
            this.unsubscribe();
        }
    }

    addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: message.user,

        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessages();
            this.saveMessages();
        });
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
            console.log('is offline');
        } else {
            console.log('is online');
            return <InputToolbar {...props} />
        }
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgrounColor: 'lightcyan',
                        paddingHorizontal: 8,
                        paddingVertical: 1,
                    },
                    right: {
                        backgroundColor: '#000',
                        paddingHorizontal: 8,
                        paddingVertical: 1,
                    },
                }}
            />);
    }

    render() {
        //let name = this.props.route.params.name;
        //this.props.navigation.setOptions({ title: name });
        return (
            <View style={styles.container}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }} />
                {Platform.OS === "android" ?
                    <KeyboardAvoidingView behaviour="height" />
                    : null}
                <Button
                    title="Go to Start"
                    onPress={() => this.props.navigation.navigate('Start')}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
