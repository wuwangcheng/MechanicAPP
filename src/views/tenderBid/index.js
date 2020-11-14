import { Button, WhiteSpace } from '@ant-design/react-native';
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, FlatList, RefreshControl, PermissionsAndroid, TouchableOpacity, ScrollView } from "react-native";
import { http, GeoHttp } from "../../utils/request";
import { tenderBidList, recentVisitCity, hotCity, updateRecentVisitCity } from "../../apis/pathMap";
import { Picker, Button as MTButton, Calendar, BottomModal } from "beeshell"
import moment from "moment";



// 招标中标
class TenderBid extends Component {
    constructor(props) {
        super(props)
    }

    positionCity = this.props.route.params.positionCity // 定位城市

    state = {
        activeRegion: "常用",
        regionList: [],// 行政区域列表
        childRegion: [], // 下级行政区域
        tenderData: [], // 列表
        isLoading: false, // 上拉刷新loading
        tenderCity: this.props.route.params.positionCity,
        tenderName: "全部",
        tenderList: [{ label: "全部", value: "" }, { label: "招标", value: 1 }, { label: "中标", value: 2 }],
        dateName: "不限",
        dateList: [{ label: "不限", value: 1 }, { label: "近一周", value: 2 }, { label: "近三个月", value: 3 }, { label: "近半年", value: 4 }],
        recentList: [], // 最近访问
        hotList: [], // 热门城市
        startTime: "",
        endTime: ""

    }
    listParam = {
        pageSize: 10,
        currentPage: 1,
        province: "江苏省",
        city: "无锡市",
        dataType: "",
        startTime: "",
        endTime: ""
    }

    /**
     * 页面加载完成ComponentDidMount
     */
    componentDidMount() {
        // 获取列表
        this.requestTenderList()
        // 获取最近访问城市
        this.requestRecentVisitCityList()
        // 热门城市
        this.requestHotCityList()
        // 获取行政区域
        this.requestRegions()
    }

    requestRegions = () => {
        GeoHttp.get("/v3/config/district", {
            params: {
                key: "b5994a2c493353471c78508c1a5377f3",
                subdistrict: 2,
                extensions: "base"
            }
        }).then(({ data }) => {
            let customRegion = [{ name: "常用" }, { name: "全国" }]
            this.setState({
                regionList: [...customRegion, ...data.districts[0].districts]
            })
            console.log(this.state.regionList);
        })
    }


    requestTenderList = () => {
        http.post(tenderBidList, Object.assign(this.listParam)).then(({ data }) => {
            if (data.code == 10000 && this.state.isLoading) {
                this.setState({ tenderData: data.data, isLoading: false })
            } else {
                this.setState({ tenderData: [...this.state.tenderData, ...data.data] })
            }
        })
    }

    searchTenderList = () => {
        http.post(tenderBidList, Object.assign(this.listParam)).then(({ data }) => {
            if (data.code == 10000) {
                this.setState({ tenderData: data.data })
            }
        })
    }

    requestRecentVisitCityList = () => {
        http.post(recentVisitCity, Object.assign({})).then(({ data }) => {
            if (data.data && data.code == 10000) {
                this.setState({ recentList: data.data.visitCitys })
            }
        })
    }

    requestHotCityList = () => {
        http.post(hotCity, Object.assign({})).then(({ data }) => {
            if (data.data && data.code == 10000) {
                this.setState({ hotList: data.data.hotCitys })
            }
        })
    }
    /**
     * 下拉刷新
     */
    onRefresh = (refreshing) => {
        if (refreshing) {
            this.setState({ isLoading: true })
            this.listParam.currentPage = 1;
            this.requestTenderList();
        }
    }


    /**
     *触底加载
     */
    onEndReached = () => {
        this.listParam.currentPage++;
        this.requestTenderList()
    }

    /**
     * 城市切换
     * @param {*} item 
     */
    doRegionChange = (item) => {
        this.setState({
            activeRegion: item.name,
            childRegion: item.districts
        })
    }

    /**
     * 城市选择 1
     * 招中标类型 2
     * 时间选择 3
     * @param {*} item 
     */
    handlerSelectSearch = (type, item) => {
        if (type == 1) {
            console.log(item);
            this.picker_1.close().catch((e) => { })
            this.setState({ tenderCity: item.type == 4 ? item.param.city : item.name })
            this.doUpdateRecentVisitCity(item)
        } else if (type == 2) {
            this.picker_2.close().catch((e) => { })
            this.setState({ tenderName: item.label })
            this.listParam.dataType = item.value
        } else if (type == 3) {
            this.picker_3.close().catch((e) => { })
            this.setState({ dateName: item.label })
            this.getChangeDate(item.value)
        }
        this.listParam.currentPage = 1
        this.searchTenderList()
        this._flatList.scrollToOffset({ animated: true, viewPosition: 0, index: 0 });
    }

    /**
     * 最近访问的城市
     * @param {} item 
     */
    handlerRecentCity = (item) => {
        console.log(item);
        if (item.province == item.city) {
            this.listParam.province = item.province
            this.listParam.city = ""
            this.setState({
                tenderCity: item.province
            })
        } else {
            this.listParam.province = item.province
            this.listParam.city = item.city
            this.setState({
                tenderCity: item.city
            })
        }
        this.picker_1.close().catch(() => { })
        this.searchTenderList()
    }
    /**
     * 1 2 3 4
     * 不限 一周 三月 半年
     * @param {} type 
     */
    getChangeDate(type) {
        // 当前时间
        if (type == 1) {
            this.listParam.startTime = null
            this.listParam.endTime = null
            this.state.startTime = ""
            this.state.endTime = ""
        } else {
            const typeList = [{ label: "week", value: 1 }, { label: "month", value: 3 }, { label: "month", value: 6 }]
            const nowDate = moment(new Date()).format("YYYY-MM-DD")
            const beginDate = moment(nowDate).subtract(typeList[type - 2].value, typeList[type - 2].label).format("YYYY-MM-DD")
            this.listParam.startTime = beginDate
            this.listParam.endTime = nowDate
            this.state.startTime = beginDate
            this.state.endTime = nowDate
        }
    }

    /**
     * 选择城市的时候更新最新访问城市
     */
    doUpdateRecentVisitCity = (item) => {
        if (item.type == 1) {
            // 全国
            this.listParam.city = ""
            this.listParam.province = ""
        } else if (item.type == 2) {
            // 省
            this.listParam.city = ""
            this.listParam.province = item.name
            const city = ""
            const province = item.name
            http.post(updateRecentVisitCity, Object.assign({ city: city, province: province })).then(({ data }) => {
                if (data.code == 10000) {
                    this.requestRecentVisitCityList()
                }
            })
            console.log(999, city, province);
        } else if (item.type == 3) {
            // 市
            this.listParam.city = item.name
            this.listParam.province = ""
            const city = item.name
            const province = ""
            http.post(updateRecentVisitCity, Object.assign({ city: city, province: province })).then(({ data }) => {
                if (data.code == 10000) {
                    this.requestRecentVisitCityList()
                }
            })
            console.log(999, city, province);
        } else if (item.type == 4) {
            // 热门城市
            if (item.param.province == item.param.city) {
                this.listParam.city = ""
                this.listParam.province = item.param.province
                const city = item.param.province
                const province = item.param.province
                http.post(updateRecentVisitCity, Object.assign({ city: city, province: province })).then(({ data }) => {
                    if (data.code == 10000) {
                        this.requestRecentVisitCityList()
                    }
                })
                console.log(999, city, province);

            } else {
                this.listParam.city = item.param.city
                this.listParam.province = ""
                const city = item.param.city
                const province = ""
                http.post(updateRecentVisitCity, Object.assign({ city: city, province: province })).then(({ data }) => {
                    if (data.code == 10000) {
                        this.requestRecentVisitCityList()
                    }
                })
                console.log(999, city, province);
            }
        }
    }


    /**
     * 跳转路由
     * 获取详情
     * @param {*} row 
     */
    getRowInfo = (row) => {
        this.props.navigation.navigate("TenderInfo", {
            row: row
        })
    }


    render() {
        const { activeRegion, tenderData, isLoading, tenderCity, tenderName, dateName, recentList, hotList } = this.state

        return (
            <SafeAreaView>
                <View style={{ flexDirection: "row" }}>
                    <Picker
                        style={{ flex: 1 }}
                        ref={(c) => {
                            this.picker_1 = c
                        }}
                        label={tenderCity}
                        disabled={false}
                        cancelable={true}
                        onToggle={(active) => {
                            if (active) {
                                this.picker_2.close().catch((e) => { })
                                this.picker_3.close().catch((e) => { })
                            }
                        }}>

                        <View style={[style.selectPanel, style.panelCity]}>
                            <ScrollView style={{ width: "33%" }}>
                                <View style={style.cityList}>
                                    {
                                        this.state.regionList.map((item, index) => {
                                            return <Text
                                                key={index}
                                                style={[style.regionItem, activeRegion == item.name ? style.regionItemActive : ""]}
                                                onPress={() => this.doRegionChange(item)}
                                            >{item.name}</Text>
                                        })
                                    }
                                </View>
                            </ScrollView>
                            <ScrollView style={{ width: "67%" }}>
                                <View style={style.rightList}>
                                    {
                                        activeRegion == "常用" ?
                                            (
                                                <>
                                                    <Text style={style.clsTitle}>当前定位</Text>
                                                    <View style={style.itemCity}>
                                                        <Text style={style.positionCity}>
                                                            <Text style={{ fontFamily: "iconfont", color: tenderCity == this.positionCity ? "#39A6FF" : "#000" }}>{'\ue6c5'}</Text>
                                                            <Text style={[style.itemCityName, tenderCity == this.positionCity ? style.itemCityNameActived : ""]}>{this.positionCity}</Text>
                                                        </Text>
                                                    </View>
                                                    <Text style={style.clsTitle}>最近访问</Text>
                                                    <View style={style.itemCity}>
                                                        {
                                                            recentList.map((item, index) => {
                                                                return <Text key={index} style={[style.itemCityName, item.city == tenderCity ? style.itemCityNameActived : ""]} onPress={() => this.handlerRecentCity(item)}>{item.city}</Text>
                                                            })
                                                        }
                                                    </View>
                                                    <Text style={style.clsTitle}>热门城市</Text>
                                                    <View style={style.itemCity}>
                                                        {
                                                            hotList.map((item, index) => {
                                                                return <Text key={index} style={[style.itemCityName, item.city == tenderCity ? style.itemCityNameActived : ""]} onPress={() => this.handlerSelectSearch(1, { type: 4, param: item })}>{item.city}</Text>
                                                            })
                                                        }
                                                    </View>
                                                </>
                                            ) : activeRegion == "全国" || this.state.childRegion.length < 2 ? (
                                                <View style={{ justifyContent: "flex-start" }}>
                                                    <View style={style.itemCity}>
                                                        <Text style={[style.itemCityName, tenderCity == activeRegion ? style.itemCityNameActived : ""]} onPress={() => this.handlerSelectSearch(1, { type: 1, name: this.state.activeRegion })}>{"不限"}</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                    <View style={style.itemCity}>
                                                        <Text style={[style.itemCityName, tenderCity == activeRegion ? style.itemCityNameActived : ""]} onPress={() => this.handlerSelectSearch(1, { type: 2, name: this.state.activeRegion })}>{"不限"}</Text>
                                                        {
                                                            this.state.childRegion.map((item, index) => {
                                                                return <Text key={index} style={[style.itemCityName, tenderCity == item.name ? style.itemCityNameActived : ""]} onPress={() => this.handlerSelectSearch(1, { type: 3, name: item.name })}>{item.name}</Text>
                                                            })
                                                        }
                                                    </View>
                                                )
                                    }

                                </View>
                            </ScrollView>
                        </View>
                    </Picker>
                    <Picker
                        style={{ flex: 1 }}
                        ref={(c) => {
                            this.picker_2 = c
                        }}
                        label={tenderName}
                        disabled={false}
                        cancelable={true}
                        onToggle={(active) => {
                            if (active) {
                                this.picker_1.close().catch((e) => { })
                                this.picker_3.close().catch((e) => { })
                            }
                        }}>

                        <View style={style.selectPanel}>
                            {this.state.tenderList.map((item, index) => {
                                return <Text key={index} style={[style.tenderItem, item.label == tenderName ? style.tenderItemActive : ""]} onPress={() => this.handlerSelectSearch(2, item)}>{item.label}</Text>
                            })}
                        </View>
                    </Picker>
                    <Picker
                        style={{ flex: 1 }}
                        ref={(c) => {
                            this.picker_3 = c
                        }}
                        label={dateName}
                        disabled={false}
                        cancelable={true}
                        onToggle={(active) => {
                            if (active) {
                                this.picker_1.close().catch((e) => { })
                                this.picker_2.close().catch((e) => { })
                            }
                        }}>

                        <View style={style.selectPanel}>
                            {
                                this.state.dateList.map((item, index) => {
                                    return <Text key={index} numberOfLines={1} style={[style.tenderItem, item.label == dateName ? style.tenderItemActive : ""]} onPress={() => this.handlerSelectSearch(3, item)}>{item.label}</Text>
                                })
                            }
                            <View style={style.customTime}>
                                <Text style={style.customItem} onPress={() => { this.bottomModal1.open() }}>{this.state.startTime ? this.state.startTime : "开始时间"}&nbsp;&nbsp;{">"}</Text>
                                <BottomModal
                                    ref={(c) => { this.bottomModal1 = c }}
                                    cancelable={true}
                                    title='开始日期'
                                    leftLabelTextStyle={{ display: "none" }}
                                    rightLabelTextStyle={{ display: "none" }}
                                >
                                    <Calendar
                                        date={this.state.startTime}
                                        endDate={this.state.endTime}
                                        onChange={(date) => {
                                            this.setState({ startTime: date })
                                            this.listParam.startTime = date
                                            this.bottomModal1.close()
                                            if (this.state.endTime) {
                                                this.setState({ dateName: "自定义" })
                                                this.listParam.currentPage = 1
                                                this.picker_3.close().catch(() => { })
                                                this.searchTenderList()
                                            }
                                        }}>
                                    </Calendar>
                                </BottomModal>
                                <Text style={style.customItem}>{"————"}</Text>
                                <Text style={style.customItem} onPress={() => { this.bottomModal2.open() }}>{this.state.endTime ? this.state.endTime : "结束时间"}&nbsp;&nbsp;{">"}</Text>
                                <BottomModal
                                    ref={(c) => { this.bottomModal2 = c }}
                                    cancelable={true}
                                    title='结束日期'
                                    leftLabelTextStyle={{ display: "none" }}
                                    rightLabelTextStyle={{ display: "none" }}
                                >
                                    <Calendar
                                        date={this.state.endTime}
                                        startDate={this.state.startTime}
                                        onChange={(date) => {
                                            this.setState({ endTime: date })
                                            this.listParam.endTime = date
                                            this.bottomModal2.close()
                                            if (this.state.startTime) {
                                                this.setState({ dateName: "自定义" })
                                                this.listParam.currentPage = 1
                                                this.picker_3.close().catch(() => { })
                                                this.searchTenderList()
                                            }
                                        }}>
                                    </Calendar>
                                </BottomModal>
                            </View>
                        </View>
                    </Picker>
                </View>
                <View style={{ height: "100%", position: "relative" }}>
                    <FlatList
                        ref={(flatList) => this._flatList = flatList}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={0.3}
                        data={tenderData}
                        keyExtractor={v => v.id + ""}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                colors={['#ff0000', '#00ff00', '#0000ff']}
                                tintColor={'#fff'}
                                progressBackgroundColor={"#ffffff"}
                                onRefresh={() => {
                                    this.onRefresh(true)
                                }}
                            ></RefreshControl>
                        }
                        renderItem={({ item, index }) =>
                            <View key={index} style={{ margin: 16 }} >
                                <TouchableOpacity onPress={() => { this.getRowInfo(item) }}>
                                    <View style={style.listContent}>
                                        <View style={style.listRow}>
                                            <Text style={{ lineHeight: 30 }}>
                                                {
                                                    item.dataType == 1 ?
                                                        <Image style={{ marginRight: 18 }} source={require("../../assets/image/zhaobiao.png")}></Image> :
                                                        <Image style={{ marginRight: 18 }} source={require("../../assets/image/zhongbiao.png")}></Image>
                                                }
                                                <Text style={style.listName}>&nbsp;&nbsp;&nbsp;&nbsp;{item.subject}</Text>
                                            </Text>
                                        </View>
                                        <View style={style.listRow}>
                                            <Text style={style.amountTitle}>项目金额:</Text>
                                            <Text style={style.amountMoney}>{item.amount}</Text>
                                        </View>
                                        <View style={style.listRow}>
                                            <Text style={style.labels}>{item.labels}</Text>
                                        </View>
                                        <Text>
                                            <Text style={{ fontFamily: "iconfont", color: "#999" }}>{'\ue6c5'}</Text>
                                            <Text style={style.localInfo}>{item.province + item.city}&nbsp;&nbsp;发布时间:{item.createTime}</Text>
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                    ></FlatList>

                </View>

            </SafeAreaView >
        );
    }
}

export default TenderBid;

export const style = StyleSheet.create({
    tbModule: {
        backgroundColor: "#fff",
    },
    header: {
        display: "flex",
        flexDirection: "row",
    },
    headerItem: {
        flex: 1,
    },
    itemTitle: {
        paddingVertical: 12,
        fontSize: 15,
        color: "#323232",
        textAlign: "center",
    },
    listContent: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 5,
        shadowOffset: { width: 1, height: 4 },
        shadowColor: "#000",
        shadowOpacity: .5
    },
    listRow: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 8
    },
    listStatus: {
        width: 50,
        height: 20,
        marginRight: 18,
        fontSize: 15,
        color: "#fff",
        textAlign: "center",
        lineHeight: 20,
        borderRadius: 20,
        backgroundColor: "#3D7EFF",
    },
    listName: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    amountTitle: {
        fontSize: 18,
        color: "#999"
    },
    amountMoney: {
        fontSize: 18,
        color: "#FC953B"
    },
    labels: {
        fontSize: 14,
        color: "#999",
        paddingHorizontal: 16,
        paddingVertical: 2,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#999",
        borderRadius: 20
    },
    localInfo: {
        fontSize: 12,
        color: "#999"
    },
    selectPanel: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ddd',
        borderTopWidth: StyleSheet.hairlineWidth
    },
    panelCity: {
        height: 500,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start"
    },
    tenderItem: {
        textAlign: "center",
        fontSize: 14,
        color: "#999",
        lineHeight: 50
    },
    tenderItemActive: {
        color: "#39A6FF"
    },
    cityList: {
        backgroundColor: "#F6F9FD"
    },
    regionItem: {
        flexWrap: "wrap",
        textAlign: "center",
        color: "#323233",
        fontSize: 14,
        fontWeight: "500",
        paddingHorizontal: 20,
        lineHeight: 50,
    },
    regionItemActive: {
        borderLeftColor: "#39a6ff",
        borderLeftWidth: 3,
        borderStyle: "solid",
        backgroundColor: "#fff"
    },
    rightList: {
        padding: 20,
    },
    clsTitle: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold"
    },
    itemCity: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    positionCity: {
        padding: 10,
        fontSize: 12,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#DDD",
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 10
    },
    itemCityName: {
        fontSize: 12,
        color: "#333",
        padding: 10,
        fontWeight: "bold",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#DDD",
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 10
    },
    itemCityNameActived: {
        color: "#39A6FF"
    },
    customTime: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    customItem: {
        color: "#999",
        fontSize: 14,
        alignItems: "center"
    },
})