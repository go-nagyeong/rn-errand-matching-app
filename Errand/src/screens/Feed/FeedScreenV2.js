import React, { useState, useCallback } from 'react';
import {Dimensions, Alert, StyleSheet, Platform, SafeAreaView, useColorScheme, StatusBar, View, Text, TouchableHighlight, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Animated} from 'react-native';
import {FAB} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import EIcon from 'react-native-vector-icons/EvilIcons';
import F5Icon from 'react-native-vector-icons/FontAwesome5';

import FeedFilter from './FeedFilter';
import RenderItem from './RenderItem';
import { ScrollView } from 'react-native-gesture-handler';

const width = Dimensions.get('window').width;

export default FeedScreen = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const [selectedId, setSelectedId] = useState(1);

    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(1));

    const showPostButton = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start();
    };
    const hidePostButton = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start();
    };


    const categories = [
        { id: 1, text: '전체보기', icon: 'navicon' },
        { id: 2, text: '마트', icon: 'cart' },
        { id: 3, text: '과제', icon: 'pencil' },
        { id: 4, text: '탐색', icon: 'search' },
        { id: 5, text: '서류', icon: 'paperclip' },
        { id: 6, text: '공구', icon: 'gear' },
        { id: 7, text: '짐', icon: 'archive' },
        { id: 8, text: '생각', icon: 'comment' },
        { id: 9, text: '기타', icon: 'navicon' }
    ]
    const CategoryBox = ({ isSelected, category }) => (
        <TouchableOpacity style={[styles.categoryBox, {opacity: isSelected ? 0.7 : 1}]} onPress={() => {setSelectedId(category.id); props.selectCategory(category.text)}}>
            {isSelected
            ? <EIcon name={category.icon} size={30} color="#000" />
            : <Text style={styles.categoryText}>{category.text}</Text>}
        </TouchableOpacity>
    )
    const categoryBox = categories.map((category, index) => {
        const isSelected = category.id === selectedId;
        return <CategoryBox isSelected={isSelected} category={category} />
    })

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

            <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={{flex: 1}}>
                <View style={styles.header}>
                    <ScrollView style={{paddingVertical: 18, marginRight: 18}} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {categoryBox}
                    </ScrollView>

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
                        onScrollBeginDrag={() => hidePostButton()}
                        onScrollEndDrag={() => showPostButton()}

                    />

                    <Animated.View style={[styles.postButtonWrap, {transform: [{ scale: scaleAnim }]}]}>
                        <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#36D1DC', '#5B86E5']} style={{borderRadius: 30}}>
                            <TouchableOpacity style={{padding: 18}} onPress={() => props.navi.navigate('SelectCategory')}>
                                <F5Icon name='pen' size={20} color='#fff' />
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    categoryBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: (width-32-30-18-32)/3.7,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        ...Platform.select({
            ios: {
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: {width: 3, height: 3},
            },
            android: {
              elevation: 6,
            },
        }),
    },
    categoryText: {
        includeFontPadding: false,
        color: 'black',
        fontSize: 14,
    },
    boardView: {
        flex: 1,
        backgroundColor: '#EDF1F5',
        paddingHorizontal: 12,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    postButtonWrap: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
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