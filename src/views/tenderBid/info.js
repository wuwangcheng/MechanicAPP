import React, { Component, useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, Button, StyleSheet, Dimensions } from "react-native";
import { http } from "../../utils/request"
import { tenderInfo, getMyCollection, insertCollection, deleteCollection } from "../../apis/pathMap"
import { style } from './index'
import { WebView } from "react-native-webview";
import ShareUtil from "../../utils/ShareUtil"
const { width, height } = Dimensions.get("window");

class TenderInfo extends Component {
    constructor(props) {
        super(props)
        this.itemRow = this.props.route.params.row
        console.log("props", this.props);
    }
    /**
     * 参数
     */
    isCollect = false
    state = {
        webHeight: 0,
        rowInfo: {},
    }
    itemRow = {}

    // 组件装载
    componentDidMount() {
        // console.log("componentDidMount", this.itemRow);
        this.getCollection()
        this.getTenderDetails()
    }

    // 组件卸载
    componentWillUnmount() {
        console.log("componentWillUnmount");
    }

    /**
     * 自定义头部导航
     */
    navigationOptions = () => {
        this.props.navigation.setOptions({
            headerTitle: <Text>详情</Text>,
            headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                    {
                        this.isCollect ?
                            (
                                <Text onPress={() => { this.isCollectChange() }} style={{ fontFamily: "iconfont", color: "#1989fa", fontSize: 24, marginRight: 12 }}>{'\ue68b'}</Text>
                            ) :
                            (
                                <Text onPress={() => { this.isCollectChange() }} style={{ fontFamily: "iconfont", color: "#333", fontSize: 24, marginRight: 12 }}>{'\ue688'}</Text>
                            )
                    }
                    <Text style={{ fontFamily: "iconfont", color: "#333", fontSize: 24, marginRight: 12 }} onPress={() => { this.doSharing() }}>{'\ue68a'}</Text>
                </View>
            ),
        })
    }

    doSharing = (sharemedia, optionsOject) => {
        console.log("开始分享", ShareUtil);
    }
    /**
     * 获取详情
     */
    getTenderDetails = () => {
        let param = { id: this.itemRow.id }
        http.post(tenderInfo, Object.assign(param))
            .then(({ data }) => {
                if (data.data && data.code == 10000) {
                    this.setState({
                        rowInfo: data.data[0]
                    })
                }
            })
            .catch(err => { })
    }

    getCollection = () => {
        let param = { o_id: this.itemRow.id, type: this.itemRow.dataType == 1 ? "招标" : "中标" }
        http.post(getMyCollection, Object.assign(param))
            .then(({ data }) => {
                if (data.data.myCollection.length > 0) {
                    this.isCollect = true
                    this.navigationOptions()
                } else {
                    this.isCollect = true
                    this.navigationOptions()
                }

            })
    }

    /**
     * 子组件
     */
    // 头部
    header = () => {
        return (
            <View style={style.listContent}>
                <View style={style.listRow}>
                    <Text style={{ lineHeight: 30 }}>
                        {
                            this.itemRow.dataType == 1 ?
                                <Image style={{ marginRight: 18 }} source={require("../../assets/image/zhaobiao.png")}></Image> :
                                <Image style={{ marginRight: 18 }} source={require("../../assets/image/zhongbiao.png")}></Image>
                        }
                        <Text style={style.listName}>&nbsp;&nbsp;&nbsp;&nbsp;{this.itemRow.subject}</Text>
                    </Text>
                </View>
                <View style={style.listRow}>
                    <Text style={style.amountTitle}>项目金额:</Text>
                    <Text style={style.amountMoney}>{this.itemRow.amount}</Text>
                </View>
                <View style={style.listRow}>
                    <Text style={style.labels}>{this.itemRow.labels}</Text>
                </View>
                <Text>
                    <Text style={{ fontFamily: "iconfont", color: "#999" }}>{'\ue6c5'}</Text>
                    <Text style={style.localInfo}>{this.itemRow.province + this.itemRow.city}&nbsp;&nbsp;发布时间:{this.itemRow.createTime}</Text>
                </Text>
            </View>
        )
    }
    // 标文内容
    content = () => {
        const injectedJs = 'setInterval(() => {window.parent.postMessage(document.getElementById("content").clientHeight)}, 500)'
        return (
            <View style={styleInfo.content}>
                <Text>标文内容</Text>
                <View style={{ width: width, height: this.state.webHeight }}>
                    <WebView
                        style={{ width: width }}
                        javaScriptEnabled={true}
                        source={{ html: this.createHtml(this.state.rowInfo.param_value) }}
                        onMessage={this.onMessage}
                        scalesPageToFit={false}
                    ></WebView>
                </View>
            </View >
        )
    }

    onMessage = (msg) => {
        if (msg.nativeEvent.data !== undefined && msg.nativeEvent.data !== null) {
            let height = parseInt(msg.nativeEvent.data);
            if (isNaN(height)) {
                height = 0;
            }
            this.setState({
                webHeight: height
            });
        }
    }

    createHtml(html) {
        return `
        <body>
            <div id="__container__">
                ${html}
                <div></div>
            </div>
            <script>
                var oldonload = window.onload;//得到上一个onload事件的函数

                window.onload = function () {
                    if (typeof oldonload == 'function') {
                        oldonload();
                    } 

                    setTimeout(()=>{
                        // 向 WebView 发送消息
                        let webHeight = document.getElementById("__container__").clientHeight;
                        window.ReactNativeWebView.postMessage(webHeight);
                    }, 1)
                }
            </script>
        <body>
        `
    }

    // 底部免责申明
    footer = () => {
        return (
            <View style={styleInfo.footer}>
                <Text style={styleInfo.footerTitle}>标文内容</Text>
                <Text style={styleInfo.footerDesc}>以上信息来源网络渠道，本平台只提供来源，不对信息的真实性、合法性以及有效性负责，请认真审核</Text>
            </View>
        )
    }
    isCollectChange = () => {
        this.isCollect = !this.isCollect
        this.isCollect ? this.handlerDeleteCollect() : this.handlerInsertCollect()
    }
    /**
     * 收藏
     */
    handlerInsertCollect = () => {
        let param = {
            type: this.itemRow.dataType == 1 ? "招标" : "中标",
            o_id: this.itemRow.id,
            province: this.itemRow.province,
            city: this.itemRow.province == this.itemRow.city ? "全部" : this.itemRow.city
        }
        http.post(insertCollection, Object.assign(param))
            .then(({ data }) => {
                if (data.code == 10000) {
                    this.updateCollectIcon()
                }
            })
    }
    /**
     * 取消收藏
     */
    handlerDeleteCollect = () => {
        http.post(deleteCollection, Object.assign({ id: [this.itemRow.id] }))
            .then(({ data }) => {
                if (data.code == 10000) {
                    this.updateCollectIcon()
                }
            })
    }

    /**
     *更新导航栏收藏标签 
     */
    updateCollectIcon = () => {
        console.log(111);
        this.props.navigation.replace("TenderInfo", {
            row: this.itemRow
        })
    }


    render() {
        return (
            <SafeAreaView>
                <ScrollView style={styleInfo.container}>
                    {this.header()}
                    {this.content()}
                    {this.footer()}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default TenderInfo;

const styleInfo = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
        paddingTop: 16
    },
    content: {
        padding: 15,
        marginTop: 15,
        borderRadius: 5,
        backgroundColor: "#fff"
    },
    footer: {
        padding: 15,
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: "#fff"
    },
    footerTitle: {
        fontSize: 18,
        color: "#333"
    },
    footerDesc: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20
    }
})