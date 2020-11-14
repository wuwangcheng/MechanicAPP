import React, { Component } from 'react';
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import Tabbar from "./tabbar";
import TenderBid from "../views/tenderBid/index";
import TenderInfo from "../views/tenderBid/info"


const Stack = createStackNavigator();


class Nav extends Component {
    constructor(props) {
        super(props)
    }
    state = {
    }
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Tabbar" screenOptions={{ headerTitleAlign: true, headerStyle: { borderBottomWidth: 0, elevation: 0 } }}>
                    <Stack.Screen name="TenderBid" component={TenderBid} options={{ title: "招标中标" }} />
                    <Stack.Screen name="TenderInfo" component={TenderInfo} options={{ headerMode: () => null }} />
                    <Stack.Screen name="Tabbar" component={Tabbar} />
                </Stack.Navigator>


            </NavigationContainer>
        );
    }
}

export default Nav;