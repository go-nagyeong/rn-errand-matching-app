import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Moment from 'moment';
import 'moment/locale/ko';
import ActionSheet from 'react-native-actionsheet';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import IOIcon from 'react-native-vector-icons/Ionicons';

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

    const [writerGrade, setWriterGrade] = useState("")
    const [writerImage, setWriterImage] = useState("")
    const [erranderGrade, setErranderGrade] = useState("");
    const [erranderImage, setErranderImage] = useState("");

    const [errandDuration, setErrandDuration] = useState("")

    useEffect(() => {
        // 게시물 보기 페이지의 Writer 정보
        Firebase.usersRef
            .doc(item.writerEmail)
            .get()
            .then(doc => {
                if (doc.exists) {
                    let gradeNum = doc.data()['grade'];
                    setWriterGrade(Common.calculateGrade(gradeNum))
                    setWriterImage(doc.data()['image'])
                }
            })
        // 심부름 요청과 심부름 완료 페이지의 Errander 정보
        if (item.process.title === 'request' || item.process.title === 'finishRequest') {
            const unsubscribe = Firebase.usersRef
                .doc(item.erranderEmail)
                .onSnapshot(doc => {
                    if (doc.exists) {
                        let gradeNum = doc.data()['grade'];
                        setErranderGrade(Common.calculateGrade(gradeNum))
                        setErranderImage(doc.data()['image'])
                    }
                })
            unsubscribe;
        }
        // 심부름 완료 페이지의 심부름 소요 시간 계산
        if (item.process.title === 'finishRequest') {
            Firebase.postsRef
                .doc(item.id + '%' + item.writerEmail)
                .get()
                .then(documentSnapshot => {
                    if (documentSnapshot.exists) {
                        let matchingTime = Moment(documentSnapshot.data()['matchingTime'].toDate())
                        let finishTime = Moment(documentSnapshot.data()['finishTime'].toDate())
                        let errandDuration = finishTime.diff(matchingTime, 'minutes')
                        setErrandDuration(errandDuration)
                    }
                })
        }
    }, [])


    const deletePost = () => {
        Alert.alert(
            "심부름 삭제",
            "정말로 삭제하시겠습니까?",
            [{
                text: "확인",
                onPress: () => {
                    Firebase.postsRef
                        .doc(item.id + '%' + item.writerEmail)
                        .delete()
                        .then(() => {
                            getMyErrand()
                        })

                        //TODO: HEARTS도 같이 지워줘야함
                },
                style: "default",
            },
            {
                text: "취소",
                style: "default",
            }],
        );
    }


    const processIndex = {
        request: 0,
        matching: 1,
        finishRequest: 2,
    }
    const steps = [
        {title: 'request', koTitle: '요청'}, 
        {title: 'matching', koTitle: '매칭'}, 
        {title: 'finishRequest', koTitle: '완료 요청'}, 
    ]
    const customTrack = steps.map((step, index) =>
        <View key={index}>
            {index < processIndex[item.process.title]
            ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.currentMarkerPoint} style={styles.trackLine} />
            : <View style={styles.trackLine} />}
        </View>
    )
    const customMarker = steps.map((step, index) =>
        <View key={index} style={styles.marker}>
            {item.process.title === step.title
            ? (item.process.title === 'matching'
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.markerPoint} />
                : <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.currentMarkerPoint}>
                        <FIcon name='bell' size={18} color={Colors.white} />
                    </LinearGradient>)
            : (index < processIndex[item.process.title]
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.currentMarkerPoint} style={styles.trackLine} style={styles.markerPoint} />
                : <View style={styles.markerPoint} />)
            }
        </View>
    )
    const customLabel = steps.map((step, index) =>
        <Text key={index} style={[
            item.process.title === step.title ? styles.currentStepLabel : styles.stepLabel,
            step.title === 'finishRequest' && {left: -27}
        ]}>
            {step.koTitle}
        </Text>
    )

    return (
        <View style={styles.itemView}>
            <View style={styles.infoView}>
                <Text style={{fontSize: 13, color: Colors.midGray}}>
                    {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                        ? Moment(item.date.toDate()).fromNow()
                        : Moment(item.date.toDate()).format('YY/MM/DD')}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item.process.title !== 'regist' &&
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() => navigation.navigate("Chat", {
                                id: item.id, writerEmail: item.writerEmail, erranderEmail: item.erranderEmail, errandInfo: item
                            })}
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
                            navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName : item.writer, writergrade : writerGrade, price : item.price, email : item.writerEmail, id : item.id, image: item.image, writerImage: writerImage, views: item.views});
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
                            navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName : item.writer, writergrade : writerGrade, price : item.price, email : item.writerEmail, id : item.id, image: item.image, writerImage: writerImage, views: item.views});
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
                <View style={{flexDirection: 'row'}}>
                    {customTrack}
                </View>
                <View style={{flexDirection: 'row', top: -18}}>
                    {customMarker}
                    <View style={styles.marker}>
                        <View style={styles.markerPoint} />
                    </View>
                </View>
                <View style={{flexDirection: 'row', top: -14}}>
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
                    <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.finishRequestButtonBorder}>
                        <View style={{backgroundColor: Colors.white, borderRadius: 30}}>
                            <TouchableOpacity style={styles.finishRequestButton} onPress={() => setIsVisibleRequestModal(true)}>
                                <Text style={styles.finishRequestButtonText}>요청 확인</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <ErranderRequest 
                        visible={isVisibleRequestModal}
                        onRequestClose={() => setIsVisibleRequestModal(false)}
                        id={item.id}
                        writerEmail={item.writerEmail}
                        erranderName={item.errander}
                        erranderEmail={item.erranderEmail}
                        erranderGrade={erranderGrade}
                        erranderImage={erranderImage}
                        getMyErrand={getMyErrand}
                        item={item}
                    />
                </View>
            || item.process.title === 'finishRequest' &&
                <View style={styles.responseView}>
                    <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.finishRequestButtonBorder}>
                        <View style={{backgroundColor: Colors.white, borderRadius: 30}}>
                            <TouchableOpacity style={styles.finishRequestButton} onPress={() => setIsVisibleRatingModal(true)}>
                                <Text style={styles.finishRequestButtonText}>평점 작성</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <ErrandRating
                        visible={isVisibleRatingModal}
                        onRequestClose={() => setIsVisibleRatingModal(false)}
                        id={item.id}
                        writerEmail={item.writerEmail}
                        errandPrice={item.price}
                        opponentName={item.errander}
                        opponentEmail={item.erranderEmail}
                        opponentGrade={erranderGrade}
                        opponentImage={erranderImage}
                        errandProcess={item.process.title}
                        errandDuration={errandDuration}
                        errandDestination={item.destination}
                        errandArrive={item.arrive}
                        errandCategory={item.category}
                        getMyErrand={getMyErrand}
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
              shadowOffset: {width: 2, height: 4},
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
        paddingTop: 1,
        paddingBottom: 2,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    chatButtonText: {
        includeFontPadding: false,
        fontSize: 12,
        color: Colors.black,
        fontFamily: 'NotoSansKR-Light',
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
        width: (Common.width-94)/3,
        height: 2,
    },
    marker: {
        width: (Common.width-94)/3,
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
        width: 36,
        height: 36,
        borderRadius: 30, 
        left: -18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepLabel: {
        includeFontPadding: false,
        width: (Common.width-94)/3,
        color: Colors.midGray,
        fontFamily: 'NotoSansKR-Medium',
        left: -14,
    },
    currentStepLabel: {
        includeFontPadding: false,
        width: (Common.width-94)/3,
        color: Colors.darkGray,
        fontFamily: 'NotoSansKR-Bold',
        left: -14,
    },
    stepGuide: {
        includeFontPadding: false,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'NotoSansKR-Medium',
        color: Colors.darkGray,
        marginTop: 10,
    },

    responseView: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.gray,
        paddingVertical: 12,
        paddingHorizontal: 18,
    },
    finishRequestButtonBorder: {
        width: (Common.width-60)/3,
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
        fontFamily: 'NotoSansKR-Regular'
    },
})