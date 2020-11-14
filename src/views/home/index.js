import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text, Image, Dimensions, PermissionsAndroid } from 'react-native';
import { Button } from "@ant-design/react-native";
import Swiper from "react-native-swiper";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { init, Geolocation, setLocatingWithReGeocode } from "react-native-amap-geolocation";

const { width, height } = Dimensions.get('window')
const gif = require("../../assets/image/home.gif");
const gifWH = Image.resolveAssetSource(gif).width / Image.resolveAssetSource(gif).height;



class Home extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        positionCity: ""
    }

    /**
     * 方法调用
     */
    handlerRoute = () => {
        this.props.navigation.navigate("TenderBid", {
            positionCity: this.state.positionCity
        })
    }
    componentDidMount() {
        // 高德API
        this.requestGeoLocation()
    }

    requestGeoLocation = async () => {
        if (Platform.OS === "android") {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        } else {
            setLocatingWithReGeocode(true)
        }
        await init({
            ios: "",
            android: "9a6985f053d3584caff590f9000f53dd"
        })
        this.getCurrentPosition()
    }

    /**
     * 高德定位
     */
    getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => this.updateLocationState(position),
            error => this.updateLocationState(error)
        );
    };
    updateLocationState(location) {
        console.log("高德定位", location);
        if (location) {
            location.updateTime = new Date().toLocaleString();
            let data = location.location
            this.setState({
                positionCity: data.city,
            });
        }
    }

    render() {
        console.log(this.props);
        return (
            <SafeAreaView >
                <ScrollView>
                    <Swiper
                        //样式
                        style={styles.wrapper}
                        //高度
                        height={width * 30 / 75}
                        // autoHeight={true}
                        // 是否显示控制按钮（即左右两侧的箭头是否可见）
                        showsButtons={false}
                        //这个很主要啊，解决白屏问题
                        removeClippedSubviews={false}
                        // 切换时间，单位秒
                        autoplayTimeout={3}
                        // 是否自动轮播
                        autoplay={true}
                        // 如果为true，滚动方向是横向的，如果为false，滚动方向是竖向的
                        horizontal={true}
                        // 分页风格
                        paginationStyle={styles.paginationStyle}
                        // 点样式
                        dotStyle={styles.dotStyle}
                        // 活动点样式
                        activeDotStyle={styles.activeDotStyle}
                    >
                        <Image style={styles.bannerImg} resizeMode="cover" source={require("../../assets/image/swiper.png")}></Image>
                        <Image style={styles.bannerImg} resizeMode="cover" source={require("../../assets/image/swiper-1.png")}></Image>
                        <Image style={styles.bannerImg} resizeMode="cover" source={require("../../assets/image/swiper-2.png")}></Image>
                    </Swiper>
                    <View style={chooseStyle.module} >
                        <View style={chooseStyle.itemTopModule}>
                            <TouchableOpacity onPress={() => this.handlerRoute()}>
                                <Text style={chooseStyle.itemTitle}>招标中标</Text>
                                <Text style={chooseStyle.itemTitleDescript}>百万用户选择</Text>
                                <Image style={chooseStyle.itemImage} source={require("../../assets/image/zbzb.png")}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={chooseStyle.itemTopModule}>
                            <Text style={chooseStyle.itemTitle}>企业招聘</Text>
                            <Text style={chooseStyle.itemTitleDescript}></Text>
                            <Image style={chooseStyle.itemImage} source={require("../../assets/image/qyzp.png")}></Image>

                        </View>
                        <View style={chooseStyle.itemTopModule}>
                            <Text style={chooseStyle.itemTitle}>实时新闻</Text>
                            <Text style={chooseStyle.itemTitleDescript}></Text>
                            <Image style={chooseStyle.itemImage} source={require("../../assets/image/ssxw.png")}></Image>

                        </View>
                        <View style={chooseStyle.itemBottomModule}>
                            <Text style={chooseStyle.itemTitle}>机械租赁</Text>
                            <Text style={chooseStyle.itemTitleDescript}>机型任你选</Text>
                            <Image style={chooseStyle.itemImage} source={require("../../assets/image/jxzl.png")}></Image>

                        </View>
                        <View style={chooseStyle.itemBottomModule}>
                            <Text style={chooseStyle.itemTitle}>维修服务</Text>
                            <Text style={chooseStyle.itemTitleDescript}></Text>
                            <Image style={chooseStyle.itemImage} source={require("../../assets/image/wxfw.png")}></Image>

                        </View>
                        <View style={chooseStyle.itemBottomModule}>
                            <Text style={chooseStyle.itemTitle}>求租求购</Text>
                            <Text style={chooseStyle.itemTitleDescript}></Text>
                            <Image style={chooseStyle.itemImage} source={require("../../assets/image/qzqg.png")}></Image>
                        </View>
                    </View >
                    <View style={HeadlineStyle.headlineModule}>
                        <View style={HeadlineStyle.ImageContent}>
                            <Image resizeMode="stretch" style={HeadlineStyle.image} source={require("../../assets/image/jxstt.png")}></Image>
                        </View>
                        <View style={HeadlineStyle.titleContent}>
                            <Text style={HeadlineStyle.title} numberOfLines={1}>啊啊啊啊啊啊啊爱爱啊啊啊啊啊啊啊啊啊啊啊啊啊啊试试电子照群奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥奥大做</Text>
                        </View>
                    </View>
                    <View style={gitStyle.gifContent}>
                        <Image style={gitStyle.gifImg} resizeMode="stretch" source={gif}></Image>
                    </View>
                    <View style={CertificateStyle.certificateModule}>
                        <View style={CertificateStyle.itemLeftModule}>
                            <View>
                                <Text style={CertificateStyle.itemTitle}>操作证培训</Text>
                                <Text style={CertificateStyle.itemTitleDescript}>工程机械专业证书</Text>
                            </View>
                            <Image style={{ width: 40, height: 40 }} resizeMode="cover" source={require("../../assets/image/czz.png")}></Image>
                        </View>
                        <View style={CertificateStyle.itemRightModule}>
                            <View>
                                <Text style={CertificateStyle.itemTitle}>工程机械险</Text>
                                <Text style={CertificateStyle.itemTitleDescript}>太平洋官方报价</Text>
                            </View>
                            <Image style={{ width: 40, height: 40 }} resizeMode="cover" source={require("../../assets/image/baoxian.png")}></Image>
                        </View>
                    </View >
                    <View style={ModelsStyle.modelModule}>
                        <Text style={ModelsStyle.modelTitle}>热门机型对比</Text>

                        <View style={ModelsStyle.modelContent}>
                            <View style={ModelsStyle.itemModel}>
                                <Image source={require("../../assets/image/wjq.png")}></Image>
                                <Text style={ModelsStyle.itemTitle}>挖掘机</Text>
                            </View>
                            <View style={ModelsStyle.itemModel}>
                                <Image source={require("../../assets/image/ylj.png")}></Image>
                                <Text style={ModelsStyle.itemTitle}>压路机</Text>
                            </View>
                            <View style={ModelsStyle.itemModel}>
                                <Image source={require("../../assets/image/ttj.png")}></Image>
                                <Text style={ModelsStyle.itemTitle}>推土机</Text>
                            </View>
                        </View>

                        <Button style={{ height: 33, borderWidth: 0, marginTop: 12, marginHorizontal: 15, paddingVertical: 8, backgroundColor: "#F2F3F7", }}>
                            <Text style={{ color: "#3D7EFF", fontSize: 14 }}>更多机型对比</Text>
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default Home;

const styles = StyleSheet.create({
    wrpaper: {
        width: width,
    },
    paginationStyle: {
        bottom: 6,
    },
    dotStyle: {
        backgroundColor: '#999',
        opacity: 0.4,
    },
    activeDotStyle: {
        backgroundColor: '#1989fa',
    },
    bannerImg: {
        width: width,
        height: "100%",
    }
});


const chooseStyle = StyleSheet.create({
    module: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: 15,
        backgroundColor: "#fff"
    },
    itemTopModule: {
        position: "relative",
        width: (width - 60) / 3,
        padding: 7.5,
        marginBottom: 8,
        backgroundColor: "#D2E3FC",
        borderRadius: 5
    },

    itemBottomModule: {
        position: "relative",
        width: (width - 60) / 3,
        padding: 7.5,
        backgroundColor: "#FCEDD8",
        borderRadius: 5

    },


    itemTitle: {
        fontSize: 14,
        color: "#000000",
    },

    itemTitleDescript: {
        fontSize: 12,
        color: "#999999",
    },

    itemImage: {
        position: "absolute",
        right: 0,
        bottom: 0
    }
})


const HeadlineStyle = StyleSheet.create({
    headlineModule: {
        width: "100%",
        height: 34,
        display: "flex",
        flexDirection: "row",
        marginVertical: 6,
        paddingHorizontal: 15,
        paddingVertical: 6,
        backgroundColor: "#fff"
    },

    ImageContent: {
        width: "31%",
    },

    image: {
        width: "100%",
        height: "100%",
        transform: [{ scale: 0.9 }]
    },

    titleContent: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: "#EEEEEE",
        borderStyle: "solid",
    },
    title: {
        paddingLeft: 8,
    }
})

const gitStyle = StyleSheet.create({
    gifContent: {
        width: width,
        height: width / gifWH,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: "#fff"
    },
    gifImg: {
        width: "100%",
        height: "100%",
    }
})


const CertificateStyle = StyleSheet.create({
    certificateModule: {
        display: "flex",
        flexDirection: "row",
        marginVertical: 8,
        padding: 15,
        backgroundColor: "#fff"
    },

    itemLeftModule: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderRightWidth: 1,
        borderStyle: "solid",
        borderColor: "#EEE"
    },
    itemRightModule: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderLeftWidth: 1,
        borderStyle: "solid",
        borderColor: "#EEE"
    },

    itemTitle: {
        fontSize: 16,
    },

    itemTitleDescript: {
        fontSize: 13,
        color: "#C6C6C6"
    }
})


const ModelsStyle = StyleSheet.create({
    modelModule: {
        backgroundColor: "#fff",
        paddingBottom: 18
    },
    modelTitle: {
        marginTop: 5,
        paddingLeft: 12,
        borderLeftWidth: 5,
        borderStyle: "solid",
        borderColor: "#3D7EFF",
        fontSize: 16,
        color: "#333"
    },
    modelContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        paddingHorizontal: 15
    },
    itemModel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    itemTitle: {
        paddingTop: 10,
        fontSize: 12,
        color: "#333333"
    },
    moreModel: {
        marginTop: 12,
        paddingHorizontal: 16
    }
})

