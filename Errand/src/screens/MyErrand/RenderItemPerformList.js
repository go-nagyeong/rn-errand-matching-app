import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import IOIcon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import 'moment/locale/ko';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';
import ErrandRating from './ErrandRating';

export default RenderItemMyPerformList = ({ item, getMyPerformErrand }) => {
    const navigation = useNavigation()

    const actionSheet = useRef(null)

    const [isVisibleRatingModal, setIsVisibleRatingModal] = useState(false);

    const [writerGrade, setWriterGrade] = useState("")
    const [writerImage, setWriterImage] = useState("")

    useEffect(() => {
        // 게시물 보기 페이지의 Writer 정보 + 심부름 완료 요청 페이지의 Writer 정보
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
    }, [])


    const requestCancle = () => {
        Alert.alert(
            "심부름 요청 취소",
            "정말로 취소하시겠습니까?",
            [{
                text: "확인",
                onPress: () => {
                    Firebase.postsRef
                        .doc(item.id + '%' + item.writerEmail)
                        .update({
                            process: {
                                title: 'regist',          // regist > request > matching > finishRequest > finished
                                myErrandOrder: 4,         // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
                                myPerformErrandOrder: 4,  // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
                            },
                            errander: "",
                            erranderEmail: "",
                        })
                        .then(() => getMyPerformErrand())
                        .catch(err => console.log(err));
                    
                    // 채팅 삭제 (firestore에 있는 텍스트)
                    Firebase.chatsRef
                        .where('post', '==', item.id + '%' + item.writerEmail)
                        .get()
                        .then(querySnapshot => { 
                            querySnapshot.forEach(doc => doc.ref.delete())
                        })
                        .catch(err => console.log(err));

                    // 채팅 삭제 (storage에 있는 이미지 & 폴더)
                    storage()
                        .ref('Chats/' + item.id + '%' + item.writerEmail)
                        .listAll()
                        .then(dir => {
                            dir.items.forEach(fileRef => {
                                storage()
                                    .ref(fileRef.path)
                                    .delete()
                                    .then(() => console.log('성공'))
                                
                            })
                        })
                        .catch(err => console.log(err));
                },
                style: "default",
            },
            {
                text: "취소",
                style: "default",
            }],
        )
    }

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
                            getMyPerformErrand()
                        })
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
            ? (item.process.title !== 'matching'
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.markerPoint} />
                : <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.currentMarkerPoint}>
                        <FIcon name='running' size={18} color={Colors.white} />
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
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() => navigation.navigate("Chat", {
                            id: item.id, writerEmail: item.writerEmail, erranderEmail: item.erranderEmail, errandInfo: item
                        })}
                    >
                        <Text style={styles.chatButtonText}>채팅</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => actionSheet.current.show()}>
                        <IOIcon name='ellipsis-horizontal' size={20} color={Colors.gray} />
                    </TouchableOpacity>
                </View>
                
                <ActionSheet
                    ref={actionSheet}
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
                    {item.process.title === 'request' && '심부름 요청이 수락될 때까지 기다려주세요.'
                    || item.process.title === 'matching' && 'Writer와 연결이 되었습니다.\n심부름을 끝낸 뒤에 완료 요청을 해주세요.'
                    || item.process.title === 'finishRequest' && '심부름 완료 요청을 보냈습니다.'
                    }
                </Text>
            </View>

            {item.process.title === 'request' &&
                <View style={styles.responseView}>
                    <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => requestCancle()}>
                        <Text style={{includeFontPadding: false, color: Colors.gray, fontFamily: 'NotoSansKR-Regular'}}>요청 취소</Text>
                    </TouchableOpacity>
                </View>
            || item.process.title === 'matching' &&
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
                        opponentName={item.writer}
                        opponentEmail={item.writerEmail}
                        opponentGrade={writerGrade}
                        opponentImage={writerImage}
                        errandProcess={item.process.title}
                        errandDestination={item.destination}
                        errandArrive={item.arrive}
                        errandCategory={item.category}
                        getMyPerformErrand={getMyPerformErrand}
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