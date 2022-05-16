/*
    작업자 : shan
    
    2번 째 탭
    나의 리스트 및 수행리스트 화면
*/
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, View, Text, RefreshControl, Animated } from 'react-native';
import { Badge } from 'react-native-elements'
import { TabView, TabBar } from "react-native-tab-view";
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import RenderItemMyList from './RenderItemMyList';
import RenderItemPerformList from './RenderItemPerformList';

export default MyErrandScreen = (props) => {
    const { myErrandBadgeNum, myPerformErrandBadgeNum, getMyErrand, getMyPerformErrand } = props;

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "first", title: "나의 심부름" },
        { key: "second", title: "내가 하는 심부름" },
    ]);

    // tab 바꿀 때 해당 탭의 리스트만 다시 새로고침
    useEffect(() => {
        if (index == 0) {
            props.getMyErrand()  
        } else {
            props.getMyPerformErrand()
        }
    }, [index])


    // First Screen
    const renderItemMyList = ({ item }) => {
        return <RenderItemMyList item={item} getMyErrand={getMyErrand} />
    }
    const FirstRoute = () => (
        <View style={styles.boardView} >
            <FlatList
                keyExtractor={item => item.id}
                data={props.myErrand}
                renderItem={renderItemMyList}
                refreshControl={<RefreshControl refreshing={props.refreshingL} onRefresh={props.getMyErrand} />}
            />
        </View>
    );


    // Second Screen
    const renderItemPerformList = ({ item }) => {
        return <RenderItemPerformList item={item} getMyPerformErrand={getMyPerformErrand} />
    }
    const SecondRoute = () => (
        <View style={styles.boardView} >
            <FlatList
                keyExtractor={item => item.id}
                data={props.myPerformErrand}
                renderItem={renderItemPerformList}
                refreshControl={<RefreshControl refreshing={props.refreshingR} onRefresh={props.getMyPerformErrand} />}
            />
        </View>
    );


    // Tab View
    const renderBadge = (props) => {
        const { route } = props;

        return (
            route.key === 'first'
            ? myErrandBadgeNum != 0 && <Badge value={myErrandBadgeNum} status="error" />
            : myPerformErrandBadgeNum != 0 && <Badge value={myPerformErrandBadgeNum} status="error" />
        )
    }
    const renderIndicator = (props) => {
        const { getTabWidth, layout, navigationState } = props;
        const width = getTabWidth();
        const translateX = Animated.multiply(navigationState.index, getTabWidth());

        return (
            <Animated.View style={{ width: width, height: 3, bottom: -layout.height+3, transform: [{ translateX: translateX }] }}>
                <LinearGradient
                    start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                    colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}
                >
                    <Text></Text>
                </LinearGradient>
            </Animated.View>
        )
    }
    const renderTabBar = (props) => (
        <TabBar
            {...props}
            labelStyle={{ color: Colors.black }}
            renderIndicator={renderIndicator}
            style={{ backgroundColor: Colors.white }}
            renderBadge={renderBadge}
        />
    );

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "first":
                return <FirstRoute />;
            case "second":
                return <SecondRoute />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>심부름 관리</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                initialLayout={{ width: Common.width, height: Common.height }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        color: Colors.black,
        fontWeight: '700',
    },
    boardView: {
        flex: 1,
        backgroundColor: Colors.backgroundGray,
        paddingTop: 20,
    },
})