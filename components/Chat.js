import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            user: {
                name: '',
            },
        };

        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyBDRX9ylnNplDR3L3U50cj3xG4QNgSXmJo",
                authDomain: "chat-test-71990.firebaseapp.com",
                projectId: "chat-test-71990",
                storageBucket: "chat-test-71990.appspot.com",
                messagingSenderId: "857068983412",
                appId: "1:857068983412:web:3b2357b2e56db10ccf6d21",
                measurementId: "G-QDRFQEDY56"
            });
        }

        this.referenceChatMessages = firebase.firestore().collection("messages");
    }

    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        this.referenceChatMessages = firebase.firestore().collection("messages");

        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                messages: [],
                user: {
                    _id: 1,
                    name: `Hello ${this.props.route.params.name}`,

                },
            });
            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            var data = doc.data();
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

    addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: message.user,

        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    },
                }}
            />);
    }

    render() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        return (
            <View style={styles.container}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        name: name,
                        avatar: this.state.user.avatar
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
