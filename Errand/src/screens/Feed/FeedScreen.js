import React, { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, Platform, ScrollView, SafeAreaView, View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Animated, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EIcon from 'react-native-vector-icons/EvilIcons';
import F5Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import FeedFilter from './FeedFilter';
import RenderItem from './RenderItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderInfo from './RenderInfo';

export default FeedScreen = (props) => {
    const [selectedId, setSelectedId] = useState(1);

    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(1));
    // 처음 설치 시 기능 설명 말풍선 관련 변수
    const [modalVisible, setModalVisible] = useState(true)
    const [modalPage, setModalPage] = useState(null)
    const text = [
      {'modalPage': '1', 
      'modalViewStyle': {left: -50}, 
      'downSharpStyle': {left: -147}, 
      'name': 'Home', 
      'text': '글 작성 및 심부름 글을 볼 수 있어요'},
      
      {'modalPage': '2', 
      'modalViewStyle': {left: 0}, 
      'downSharpStyle': {left: -50}, 
      'name': 'MyErrand', 
      'text': '내가 작성한/요청한 심부름을 확인할 수 있어요'},

      {'modalPage': '3', 
      'modalViewStyle': {left: 0}, 
      'downSharpStyle': {left: 50}, 
      'name': 'Message', 
      'text': '상대방과 채팅할 수 있어요'},
      
      {'modalPage': '4', 
      'modalViewStyle': {left: 30}, 
      'downSharpStyle': {left: 146}, 
      'name': 'Mypage', 
      'text': '개인 정보 수정 및 다양한 정보를 볼 수 있어요'},
    ]

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
            ? <EIcon name={category.icon} size={30} color={Colors.black} />
            : <Text style={styles.categoryText}>{category.text}</Text>}
        </TouchableOpacity>
    )
    const categoryBox = categories.map((category, index) => {
        const isSelected = category.id === selectedId;
        return <CategoryBox key={index} isSelected={isSelected} category={category} />
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

    // 기능 설명 말풍선 렌더링 함수
    const renderInfo = (items) => {
      return <RenderInfo items={items} modalPage={modalPage} setModalPage={setModalPage}/>
    }  

    // 첫 실행인지 확인 하는 함수 (기능 설명 말풍선 관련)
    useEffect(() => {
      const getDb = async () => {
        try {
          const value = await AsyncStorage.getItem('firstInstalled')
          // 값이 존재하면
          if(value !== null) {
            setModalPage(value)
          }
          // 값이 존재하지 않으면
          else {
            console.log('존재하지 않습니다 생성합니다')
            await AsyncStorage.setItem('firstInstalled', '1')
          }
        } catch(e) {
          console.log(e)
        }
      }
      getDb();
    }, [])
    
    const insertDb = async (value) => {
      try {
        await AsyncStorage.setItem('firstInstalled', value)
      } catch (e) {
        console.log(e)
      }
    }
    // insertDb('1') //테스트 용

    return (
        <LinearGradient style={{flex: 1}} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>ANSIM</Text>

                    <View style={styles.categoryView}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {categoryBox}
                        </ScrollView>
                    </View>

                    <FeedFilter
                        sortFilter={props.sortFilter}
                        priceFilter={props.priceFilter}
                    />
                </View>

                <View style={styles.content}>
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

                    {/* 기능 설명 말풍선 */}
                    <FlatList
                      keyExtractor={(item, index) => String(index)}
                      data={text}
                      renderItem={renderInfo}
                    />

                    <Animated.View style={[styles.postButtonWrap, {transform: [{ scale: scaleAnim }]}]}>
                        <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={{borderRadius: 30}}>
                            <TouchableOpacity style={{padding: 18}} onPress={() => props.navi.navigate('SelectCategory')}>
                                <F5Icon name='pen' size={20} color={Colors.white} />
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        color: Colors.white,
        fontWeight: '700',
        marginHorizontal: 16,
        marginBottom: 4,
    },

    categoryView: {
        marginHorizontal: 16,
        marginBottom: 4,
    },
    categoryBox: {
        backgroundColor: Colors.white,
        borderRadius: 14,
        width: (Common.width-32-30)/3.7,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
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
        color: Colors.black,
        fontSize: 15,
    },

    content: {
        flex: 1,
        backgroundColor: Colors.backgroundGray,
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