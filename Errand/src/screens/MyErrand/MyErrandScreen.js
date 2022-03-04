/*
    작업자 : shan
    
    2번 째 탭
    나의 리스트 및 수행리스트 화면
*/
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, useWindowDimensions, RefreshControl, Animated } from 'react-native';
import { TabView, TabBar } from "react-native-tab-view";
import LinearGradient from 'react-native-linear-gradient';

import RenderItemMyList from './RenderItemMyList';
import RenderItemPerformList from './RenderItemPerformList';

export default MyErrandScreen = (props) => {
    const layout = useWindowDimensions();

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
        return <RenderItemMyList item={item} />
    }
    const FirstRoute = () => (
        <View style={styles.boardView} >
            <FlatList
                keyExtractor={item => item.id}
                data={props.myErrand}
                renderItem={renderItemMyList}
                refreshControl={<RefreshControl refreshing={props.refreshing} onRefresh={props.getMyErrand} />}
            />
        </View>
    );


    // Second Screen
    const renderItemPerformList = ({ item }) => {
        return <RenderItemPerformList item={item} />
    }
    const SecondRoute = () => (
        <View style={styles.boardView} >
            <FlatList
                keyExtractor={item => item.id}
                data={props.myPerformErrand}
                renderItem={renderItemPerformList}
                refreshControl={<RefreshControl refreshing={props.refreshing} onRefresh={props.getMyPerformErrand} />}
            />
        </View>
    );


    // Tab View
    const renderIndicator = (props) => {
        const { getTabWidth, layout, navigationState } = props;
        const width = getTabWidth();
        const translateX = Animated.multiply(navigationState.index, getTabWidth());

        return (
            <Animated.View style={{ width: width, height: 3, bottom: -layout.height+3, transform: [{ translateX: translateX }] }}>
                <LinearGradient
                    start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                    colors={['#5B86E5', '#36D1DC']}
                >
                    <Text></Text>
                </LinearGradient>
            </Animated.View>
        )
    }
    const renderTabBar = (props) => (
        <TabBar
            {...props}
            labelStyle={{ color: 'black' }}
            // indicatorStyle={{ backgroundColor: '#5B86E5' }}
            renderIndicator={renderIndicator}
            style={{ backgroundColor: '#fff' }}
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
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}

const styles = StyleSheet.create({
    boardView: {
        backgroundColor: '#EDF1F5',
        paddingTop: 20,
    },
})