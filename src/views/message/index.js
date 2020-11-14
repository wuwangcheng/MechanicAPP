import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from "@ant-design/react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';


class Message extends Component {
    state = {}
    handlerClick = () => {
        
    }
    render() {
        return (
            <View>
                <Text onPress={() => this.handlerClick()}>消息</Text>
                <Button onPress={this.handlerClick}>default</Button>
            </View>
        );
    }
}

export default Message;