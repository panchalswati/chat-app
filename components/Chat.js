import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default class Chat extends React.Component {
    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Text>Hello</Text>
                <Button
                    title="Go to Start"
                    onPress={() => this.props.navigation.navigate('Start')}
                />
            </View>
        )
    }
}

