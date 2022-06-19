import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Moment from 'moment';
import 'moment/locale/ko';
import ActionSheet from 'react-native-actionsheet';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import IOIcon from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';
import ErranderRequest from './ErranderRequest';
import ErrandRating from './ErrandRating';

export default RenderItemMyList = ({ item, getMyErrand }) => {
    const navigation = useNavigation()

    const twoOptionSheet = useRef(null)
    const threeOptionSheet = useRef(null)

    const [isVisibleRatingModal, setIsVisibleRatingModal] = useState(false);
    const [isVisibleRequestModal, setIsVisibleRequestModal] = useState(false);

    const deletePost = () => {
        Alert.alert(
            "심부름 삭제",
            "정말로 삭제하시겠습니까?",
            [{
                text: "확인",
                onPress: () => {
                    Firebase.heartsRef
                        .where('postId', '==', item.id + '%' + item.writerEmail)
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(doc => {
                                doc.ref.delete()
                            })
                        })
                        .catch(err => console.log(err));
                    
                    storage()
                        .ref('Posts/' + item.id + '%' + item.writerEmail)
                        .listAll()
                        .then(dir => {
                            dir.items.forEach(fileRef => {
                                fileRef.delete()
                            })
                        })
                        .catch(err => console.log(err));

                    Firebase.postsRef
                        .doc(item.id + '%' + item.writerEmail)
                        .delete()
                        .then(() => getMyErrand())
                        .catch(err => console.log(err));
                },
                style: "default",
            },
            {
                text: "취소",
                style: "cancel",
            }],
        );
    }


    const processIndex = {
        request: 0,
        matching: 1,
        finishRequest: 2,
    }
    const steps = [
        { title: 'request', koTitle: '요청' },
        { title: 'matching', koTitle: '매칭' },
        { title: 'finishRequest', koTitle: '완료 요청' },
    ]
    const customTrack = steps.map((step, index) =>
        <View key={index}>
            {index < processIndex[item.process.title]
            ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.trackLine} />
            : <View style={styles.trackLine} />}
        </View>
    )
    const customMarker = steps.map((step, index) =>
        <View key={index} style={styles.marker}>
            {item.process.title === step.title
            ? (item.process.title === 'matching'
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.markerPoint} />
                : <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.currentMarkerPoint}>
                    <FIcon name='bell' size={16} color={Colors.white} />
                </LinearGradient>)
            : (index < processIndex[item.process.title]
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.markerPoint} />
                : <View style={styles.markerPoint} />)
            }
        </View>
    )
    const customLabel = steps.map((step, index) =>
        <Text key={index} style={[
            item.process.title === step.title ? styles.currentStepLabel : styles.stepLabel,
            step.title === 'finishRequest' && { left: -27 }
        ]}>
            {step.koTitle}
        </Text>
    )

    return (
        <View style={styles.itemView}>
            <View style={styles.infoView}>
                <Text style={{ fontSize: 13, color: Colors.midGray }}>
                    {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                        ? Moment(item.date.toDate()).fromNow()
                        : Moment(item.date.toDate()).format('YY/MM/DD')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.process.title !== 'regist' &&
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() => navigation.navigate("Chat", {item: item})}
                        >
                            <Text style={styles.chatButtonText}>채팅</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={() => item.process.title === 'regist' ? threeOptionSheet.current.show() : twoOptionSheet.current.show()}>
                        <IOIcon name='ellipsis-horizontal' size={20} color={Colors.gray} />
                    </TouchableOpacity>
                </View>

                <ActionSheet
                    ref={threeOptionSheet}
                    options={['게시물 상세보기', '삭제', '취소']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => {
                        if (index == 0) {
                            navigation.navigate("ShowDetailPost", {...item});
                        } else if (index == 1) {
                            deletePost();
                        }
                    }}
                />
                <ActionSheet
                    ref={twoOptionSheet}
                    options={['게시물 상세보기', '취소']}
                    cancelButtonIndex={1}
                    onPress={(index) => {
                        if (index == 0) {
                            navigation.navigate("ShowDetailPost", {...item});
                        }
                    }}
                />
            </View>

            <View style={styles.titleView}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                </Text>
                <Text style={styles.content} numberOfLines={1} ellipsizeMode="tail">
                    {item.content}
                </Text>
            </View>

            <View style={styles.progressView}>
                <View style={{ flexDirection: 'row' }}>
                    {customTrack}
                </View>
                <View style={{ flexDirection: 'row', top: -18 }}>
                    {customMarker}
                    <View style={styles.marker}>
                        <View style={styles.markerPoint} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', top: -14 }}>
                    {customLabel}
                    <Text style={styles.stepLabel}>완료</Text>
                </View>
                <Text style={styles.stepGuide}>
                    {item.process.title === 'regist' && 'Errander를 기다리는 중 입니다.'
                        || item.process.title === 'request' && 'Errander의 심부름 요청을 받아주세요.'
                        || item.process.title === 'matching' && 'Errander와 연결이 되었습니다.\n심부름이 완료될 때까지 기다려주세요.'
                        || item.process.title === 'finishRequest' && 'Errander가 완료 요청을 보냈습니다.\n심부름이 정말 끝났다면 완료를 해주세요.'
                    }
                </Text>
            </View>

            {item.process.title === 'request' &&
                <View style={styles.responseView}>
                    <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.finishRequestButtonBorder}>
                        <View style={{ backgroundColor: Colors.white, borderRadius: 30 }}>
                            <TouchableOpacity style={styles.finishRequestButton} onPress={() => setIsVisibleRequestModal(true)}>
                                <Text style={styles.finishRequestButtonText}>요청 확인</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <ErranderRequest
                        visible={isVisibleRequestModal}
                        onRequestClose={() => setIsVisibleRequestModal(false)}
                        item={item}
                        getMyErrand={getMyErrand}
                    />
                </View>
                || item.process.title === 'finishRequest' &&
                <View style={styles.responseView}>
                    <LinearGradient start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.finishRequestButtonBorder}>
                        <View style={{ backgroundColor: Colors.white, borderRadius: 30 }}>
                            <TouchableOpacity style={styles.finishRequestButton} onPress={() => setIsVisibleRatingModal(true)}>
                                <Text style={styles.finishRequestButtonText}>평점 작성</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <ErrandRating
                        visible={isVisibleRatingModal}
                        onRequestClose={() => setIsVisibleRatingModal(false)}
                        postId={item.id + '%' + item.writerEmail}
                        price={item.price}
                        category={item.category}
                        process={item.process.title}
                        destination={item.destination}
                        arrive={item.arrive}
                        opponentEmail={item.erranderEmail}
                        getErrand={getMyErrand}
                        
                        matchingTime={item.matchingTime}
                        finishTime={item.finishTime}
                    />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    itemView: {
        flex: 1,
        backgroundColor: Colors.white,
        marginVertical: 12,
        marginHorizontal: 20,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 2, height: 4 },
            },
            android: {
                elevation: 6,
            },
        }),
    },

    infoView: {
        flex: 1,
        marginTop: 15,
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    chatButton: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.darkGray,
        borderRadius: 15,
        paddingVertical: Platform.OS === 'ios' ? 4 : 2,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    chatButtonText: {
        includeFontPadding: false,
        fontSize: 12,
        color: Colors.darkGray,
        fontWeight: '200',
    },

    titleView: {
        flex: 1,
        marginHorizontal: 15,
        marginBottom: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.black,
    },
    content: {
        fontSize: 14,
        color: Colors.gray,
        marginTop: 10,
    },

    progressView: {
        flex: 1,
        marginHorizontal: 30,
        marginBottom: 26,
    },
    trackLine: {
        backgroundColor: Colors.lightGray,
        width: (Common.width - 94) / 3,
        height: 2,
    },
    marker: {
        width: (Common.width - 94) / 3,
        height: 36,
        justifyContent: 'center',
    },
    markerPoint: {
        backgroundColor: Colors.lightGray,
        width: 12,
        height: 12,
        borderRadius: 30,
        left: -7,
    },
    currentMarkerPoint: {
        width: 32,
        height: 32,
        borderRadius: 30, 
        left: -18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepLabel: {
        includeFontPadding: false,
        width: (Common.width - 94) / 3,
        color: Colors.midGray,
        fontSize: 14,
        fontWeight: '500',
        left: -14,
    },
    currentStepLabel: {
        includeFontPadding: false,
        width: (Common.width - 94) / 3,
        color: Colors.darkGray,
        fontSize: 14,
        fontWeight: '600',
        left: -14,
    },
    stepGuide: {
        includeFontPadding: false,
        textAlign: 'center',
        fontSize: 14,
        color: Colors.darkGray,
        fontWeight: '500',
        marginTop: 10,
    },

    responseView: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.gray,
        paddingVertical: 12,
        paddingHorizontal: 18,
    },
    finishRequestButtonBorder: {
        width: (Common.width - 60) / 3,
        padding: 1,
        borderRadius: 30,
        alignSelf: 'center',
    },
    finishRequestButton: {
        backgroundColor: Colors.white,
        borderRadius: 30,
        paddingVertical: 6,
        alignItems: 'center',
    },
    finishRequestButtonText: {
        includeFontPadding: false,
        color: Colors.darkGray2,
        fontSize: 14,
    },
})