import React, { Component } from 'react';
import { StyleSheet, Pressable, View, Text, TextInput, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            bgColor: "",
        };
    }

    //dunction to update state with new background color
    changeBgColor = (newColor) => {
        this.setState({ bgColor: newColor });
    };

    //colors to choose
    colors = {
        black: "#090C08",
        purple: "#474056",
        grey: "#8A95A5",
        green: "B9C6AE",
        blue: "#1B70A0",
    };

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/Background-Image.png')} style={styles.backgroundImage} resizeMode="cover" >
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>Chat App</Text>
                    </View>

                    <View style={styles.box1}>
                        <View style={styles.inputBox}>
                            <TextInput style={styles.input}
                                onChangeText={(text) =>
                                    this.setState({ name: text })}
                                value={this.state.name}
                                placeholder="What is your name?" />
                        </View>

                        <View style={styles.colorBox}>
                            <Text style={styles.chooseColor}>
                                {" "}
                                Pick your background color!{" "}
                            </Text>
                        </View>

                        <View style={styles.colorArray}>
                            <TouchableOpacity
                                style={styles.color1}
                                onPress={() => this.changeBgColor(this.colors.black)}>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.color2}
                                onPress={() => this.changeBgColor(this.colors.purple)}>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.color3}
                                onPress={() => this.changeBgColor(this.colors.grey)}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                style={styles.color4}
                                onPress={() => this.changeBgColor(this.colors.green)}
                            ></TouchableOpacity>
                        </View>

                        <Pressable
                            style={styles.button}
                            onPress={() =>
                                this.props.navigation.navigate("Chat", {
                                    name: this.state.name,
                                    bgColor: this.state.bgColor,
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundImage: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    titleBox: {
        height: "40%",
        width: "88%",
        alignItems: "center",
        paddingTop: 100,
    },

    title: {
        fontSize: 45,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    box1: {
        backgroundColor: "#FFFFFF",
        height: "46%",
        width: "88%",
        justifyContent: "space-around",
        alignItems: "center",
    },

    inputBox: {
        borderWidth: 2,
        borderRadius: 1,
        borderColor: "grey",
        width: "88%",
        height: 60,
        paddingLeft: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    image: {
        width: 20,
        height: 20,
        marginRight: 10,
    },

    input: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
    },

    colorBox: {
        marginRight: "auto",
        paddingLeft: 15,
        width: "88%",
    },

    chooseColor: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 100,
    },

    colorArray: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },

    color1: {
        backgroundColor: "#090C08",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color2: {
        backgroundColor: "#474056",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color3: {
        backgroundColor: "#8A95A5",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color4: {
        backgroundColor: "#B9C6AE",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    button: {
        width: "88%",
        height: 70,
        borderRadius: 8,
        backgroundColor: "#757083",
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});