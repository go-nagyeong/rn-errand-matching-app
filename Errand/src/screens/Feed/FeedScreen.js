import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import FeedFilter from './FeedFilter';
import RenderItem from './RenderItem';




export default FeedScreen = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const [selectedId, setSelectedId] = useState(1);

    const [showFAB, setShowFAB] = useState(true);

    const categories = [
        { id: 1, text: '전체보기', icon: 'bars' },
        { id: 2, text: '마트', icon: 'shoppingcart' },
        { id: 3, text: '과제', icon: 'book' },
        { id: 4, text: '탐색', icon: 'eyeo' },
        { id: 5, text: '서류', icon: 'filetext1' },
        { id: 6, text: '공구', icon: 'tool' },
        { id: 7, text: '짐', icon: 'car' },
        { id: 8, text: '생각', icon: 'bulb1' },
        { id: 9, text: '기타', icon: 'ellipsis1' }
    ]
    const CategoryBox = ({ opacity, onPress, item }) => (
        <TouchableOpacity style={[styles.categoryBox, opacity]} onPress={onPress}>
            <Text style={styles.categoryText}>{item.text}</Text>
            <Icon name={item.icon} size={30}></Icon>
        </TouchableOpacity>
    )
    const renderCategoryBox = ({ item }) => {
        const opacity = item.id === selectedId ? 0.7 : 1;
        return (
            <CategoryBox
                opacity={{ opacity }}
                onPress={() => {
                    setSelectedId(item.id)
                    props.selectCategory(item.text);
                }}
                item={item}
            />
        )
    }

    const renderFooter = () => {
        if (props.loading) {
            return <ActivityIndicator style={{ marginTop: 10 }} />
        } else {
            return null
        }
    }

    const renderItem = ({ item }) => {
        return <RenderItem item={item} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <FlatList 
                    contentContainerStyle={{padding: 18}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    data={categories}
                    renderItem={renderCategoryBox}
                    extraData={selectedId}
                />

                <FeedFilter
                    sortFilter={props.sortFilter}
                    priceFilter={props.priceFilter}
                />
            </View>

            <View style={styles.boardView}>
                <FlatList
                    keyExtractor={(item, index) => String(index)}
                    data={props.data}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={props.refreshing} onRefresh={props.getFeed} />}
                    ListFooterComponent={renderFooter}
                    onEndReached={!props.isListEnd && props.getMoreFeed}
                    onScrollBeginDrag={() => setShowFAB(false)}
                    onScrollEndDrag={() => setShowFAB(true)}

                />

                <FAB
                    style={styles.postButton}
                    color="#fff"
                    large
                    icon="pencil"
                    visible={showFAB}
                    onPress={() => props.navi.navigate('SelectCategory')}
                />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53B77C',
    },
    header: {
        flex: 1,
        backgroundColor: '#53B77C',
    },
    categoryBox: {
        backgroundColor: '#fff',
        padding: 17,
        borderRadius: 30,
        width: 100,
        height: 100,
        marginRight: 15,
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        marginBottom: 3,
    },
    boardView: {
        flex: Platform.OS === 'ios' ? 2.6 : 1.9,
        backgroundColor: '#EDF1F5',
        paddingHorizontal: 12,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    postButton: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#1bb55a',
    },
});

// 알림 전송 관련 소스
    // ownerId - who owns the picture someone liked
    // userId - id of the user who liked the picture
    // picture - metadata about the picture

    // async function onUserPictureLiked() {
    //     // Get the owners details
    //     const owner = firestore()
    //         .collection('users')
    //         .doc('bonoboss1028@student.anu.ac.kr')
    //         .get();

    //     // Get the users details
    //     const user = firestore()
    //         .collection('users')
    //         .doc('bonoboss1028@student.anu.ac.kr')
    //         .get();

    //     await messaging().sendToDevice(
    //         owner.tokens, // ['token_1', 'token_2', ...]
    //         {
    //         data: {
    //             owner: JSON.stringify(owner),
    //             user: JSON.stringify(user),
    //         },
    //         },
    //         {
    //         // Required for background/quit data-only messages on iOS
    //         contentAvailable: true,
    //         // Required for background/quit data-only messages on Android
    //         priority: 'high',
    //         },
    //     );
    // }
    // function callApiSubscribeTopic(topic = 'Car') {
    //     //   return instance.post('/push');
    //     return messaging()
    //         .subscribeToTopic(topic)
    //         .then(() => {
    //             Alert.alert(`${topic} 구독 성공!!`);
    //         })
    //         .catch(() => {
    //             Alert.alert(`${topic} 구독 실패! ㅜㅜ`);
    //         });
    // }
    // const getFcmToken = useCallback(async () => {
    //     const fcmToken = await messaging().getToken();
    //     console.log(fcmToken);
    //     await Alert.alert(fcmToken);
    // }, []);

    // var admin = require('firebase-admin');