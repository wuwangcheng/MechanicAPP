import React, { useState, Component } from 'react';
import { View, ScrollView, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../views/home";
import Tool from "../views/tool";
import Message from "../views/message";
import Mine from "../views/mine";
import { HeaderTitle } from '@react-navigation/stack';
import { style } from '../views/tenderBid';

const Tab = createBottomTabNavigator();


class TabRouters extends Component {
    state = {}
    render() {
        return (
            <Tab.Navigator initialRouteName="home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'home') {
                            iconName = focused
                                ? require("../assets/image/TabIcons/home-active.png")
                                : require("../assets/image/TabIcons/home.png");
                        } else if (route.name === 'tool') {
                            iconName = focused
                                ? require("../assets/image/TabIcons/tool-active.png")
                                : require("../assets/image/TabIcons/tool.png");
                        } else if (route.name === 'message') {
                            iconName = focused
                                ? require("../assets/image/TabIcons/msg-active.png")
                                : require("../assets/image/TabIcons/msg.png");
                        } else if (route.name === 'mine') {
                            iconName = focused
                                ? require("../assets/image/TabIcons/my-active.png")
                                : require("../assets/image/TabIcons/my.png");
                        }
                        return <Image style={{ width: 18, height: 18 }} source={iconName}></Image>;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: '#1989FA',
                    inactiveTintColor: '#646566',
                    tabStyle: {
                        paddingBottom: 4,
                    },
                    labelStyle: {
                        fontSize: 12
                    }
                }}>
                <Tab.Screen name="home" component={Home} options={{ title: "首页" }}></Tab.Screen>
                <Tab.Screen name="tool" component={Tool} options={{ title: "工具" }}></Tab.Screen>
                <Tab.Screen name="message" component={Message} options={{ title: "我的", tabBarBadge: 3 }}></Tab.Screen>
                <Tab.Screen name="mine" component={Mine} options={{ title: "消息" }}></Tab.Screen>
            </Tab.Navigator>
        );
    }
}

export default TabRouters;

