import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ImageBackground } from 'react-native';

export default class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            color: '#090C08'
        };
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/Background-Image.png')} style={styles.image} >
                    <Text style={styles.text}>Chat App</Text>
                    <TextInput style={styles.input}
                        onChangeText={(name) =>
                            this.setState({ name })}
                        value={this.state.name}
                        placeholder="Your Name" />
                    <Button style={styles.button}
                        title="Go to Chat"
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
                    />

                </ImageBackground>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 45,
        margin: 2,
        padding: 80
    },
    input: {
        padding: 15,
        fontSize: 30,
        borderColor: 'black',
        borderWidth: 1,
        margin: 5,
        backgroundColor: 'lightgrey'
    },
    button: {
        flex: 45,
        fontSize: 50,
    }
})
