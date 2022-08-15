import React from 'react';
import { View, Button } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        };
    }
    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello Developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://palceimg.com/140/40/any',
                    },
                },
                {
                    _id: 2,
                    text: "This is a system message",
                    createdAt: new Date(),
                    system: true,
                }
            ],
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
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
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

