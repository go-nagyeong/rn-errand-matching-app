import React, { useState } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BottomSheet, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import IOIcon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import 'moment/locale/ko';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

import ErrandRating from './ErrandRating';
import { SafeAreaView } from 'react-native-safe-area-context';

const width = Dimensions.get('window').width;

export default RenderItemMyPerformList = ({ item, getMyPerformErrand }) => {
    const navigation = useNavigation()

    const [writerGrade, setWriterGrade] = useState("")
    const [erranderGrade, setErranderGrade] = useState("");
    const [erranderImage, setErranderImage] = useState("");

    const calculateGrade = (gradeNum) => {
        if (gradeNum >= 4.1) {
            return 'A+';
        } else if (gradeNum >= 3.6) {
            return 'A0';
        } else if (gradeNum >= 3.1) {
            return 'B+';
        } else if (gradeNum >= 2.6) {
            return 'B0';
        } else if (gradeNum >= 2.1) {
            return 'C+';
        } else if (gradeNum >= 1.6) {
            return 'C0';
        } else if (gradeNum >= 1.1) {
            return 'D+';
        } else if (gradeNum >= 0.6) {
            return 'D0';
        } else {
            return 'F';
        }
    }

    // 게시물 보기 페이지의 작성자 등급
    firestore()
        .collection('Users')
        .doc(item.writerEmail)
        .get()
        .then(doc => {
            if (doc.exists) {
                setWriterGrade(calculateGrade(doc.data()['grade']))
            }
        })
    // 심부름 완료 요청 페이지의 Errander 정보
    if (item.process.title === 'matching') {
        firestore()
            .collection('Users')
            .doc(item.erranderEmail)
            .get()
            .then(doc => {
                if (doc.exists) {
                    let gradeNum = doc.data()['grade'];
                    setErranderGrade(calculateGrade(gradeNum))
                }
            })
    
        storage()
            .ref('Users/' + item.erranderEmail)
            .getDownloadURL()
            .then(url => {
                setErranderImage(url)
            })
            .catch(err => console.log(err.code));
    }


    const requestCancle = () => {
        Alert.alert(
            "심부름 요청 취소",
            "정말로 취소하시겠습니까?",
            [{
                text: "확인",
                onPress: () => {
                    firestore()
                        .collection('Posts')
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
                    firestore()
                        .collection('Posts')
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

    const [isVisibleBottomSheet, setIsVisibleBottomSheet] = useState(false);
    const list = [
        { 
            title: '게시물 상세보기',
            containerStyle: { borderTopLeftRadius: 15, borderTopRightRadius: 15, borderBottomWidth: StyleSheet.hairlineWidth },
            titleStyle: { alignSelf: 'center' },
            onPress: () => navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName : item.writer, writergrade : writerGrade, price : item.price, email : item.writerEmail, id : item.id }),
        },
        { 
            title: '삭제',
            containerStyle: { borderBottomWidth: 0.5 },
            titleStyle: { color: 'red', alignSelf: 'center' },
            onPress: () => deletePost(),
        },
        {
            title: '닫기',
            titleStyle: { alignSelf: 'center', fontWeight: '600' },
            onPress: () => setIsVisibleBottomSheet(false),
        },
    ];
    const [isVisibleRatingModal, setIsVisibleRatingModal] = useState(false);


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
            ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.currentMarkerPoint} style={styles.trackLine} />
            : <View style={styles.trackLine} />}
        </View>
    )
    const customMarker = steps.map((step, index) =>
        <View key={index} style={styles.marker}>
            {item.process.title === step.title
            ? (item.process.title !== 'matching'
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.markerPoint} />
                : <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.currentMarkerPoint}>
                        <FIcon name='running' size={18} color='#fff' />
                    </LinearGradient>)
            : (index < processIndex[item.process.title]
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.currentMarkerPoint} style={styles.trackLine} style={styles.markerPoint} />
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
                <Text style={{fontSize: 13, color: '#C2C2C2'}}>
                    {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                        ? Moment(item.date.toDate()).fromNow()
                        : Moment(item.date.toDate()).format('YY/MM/DD')}
                </Text>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate("Chat", {id : item.id})}>
                        <Text style={styles.chatButtonText}>채팅</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => setIsVisibleBottomSheet(true)}>
                        <IOIcon name='ellipsis-horizontal' size={20} color='#7d7d7d' />
                    </TouchableOpacity>
                </View>
                
                <BottomSheet isVisible={isVisibleBottomSheet}>
                    {list.map((l, i) => (
                        <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                        </ListItem>
                    ))}
                </BottomSheet>
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
                        <Text style={{includeFontPadding: false, color: 'gray', fontFamily: 'NotoSansKR-Regular'}}>요청 취소</Text>
                    </TouchableOpacity>
                </View>
            || item.process.title === 'matching' &&
                <View style={styles.responseView}>
                    <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.finishRequestButtonBorder}>
                        <View style={{backgroundColor: '#fff', borderRadius: 30}}>
                            <TouchableOpacity style={styles.finishRequestButton} onPress={() => setIsVisibleRatingModal(true)}>
                                <Text style={styles.finishRequestButtonText}>평점 작성</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <ErrandRating
                        visible={isVisibleRatingModal}
                        onRequestClose={() => setIsVisibleRatingModal(false)}
                        calculateGrade={calculateGrade}
                        id={item.id}
                        writerEmail={item.writerEmail}
                        errandPrice={item.price}
                        errander={item.errander}
                        erranderEmail={item.erranderEmail}
                        erranderGrade={erranderGrade}
                        erranderImage={erranderImage}
                        errandProcess={item.process.title}
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
        backgroundColor: '#fff',
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
        borderColor: 'gray',
        borderRadius: 15,
        paddingTop: 1,
        paddingBottom: 2,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    chatButtonText: {
        includeFontPadding: false,
        fontSize: 12,
        color: 'black',
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
        color: '#090909',
    },
    content: {
        fontSize: 14,
        color: '#89888c',
        marginTop: 10,
    },

    progressView: {
        flex: 1,
        marginHorizontal: 30,
        marginBottom: 26,
    },
    trackLine: {
        backgroundColor: '#d3d3d3',
        width: (width-94)/3,
        height: 2,
    },
    marker: {
        width: (width-94)/3,
        height: 36,
        justifyContent: 'center',
    },
    markerPoint: {
        backgroundColor: '#d3d3d3',
        width: 12,
        height: 12,
        borderRadius: 30,
        left: -7,
    },
    currentMarkerPoint: {
        backgroundColor: '#d3d3d3',
        width: 36,
        height: 36,
        borderRadius: 30, 
        left: -18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepLabel: {
        includeFontPadding: false,
        width: (width-94)/3,
        color: '#d3d3d3',
        fontFamily: 'NotoSansKR-Medium',
        left: -14,
    },
    currentStepLabel: {
        includeFontPadding: false,
        width: (width-94)/3,
        color: '#7d7d7d',
        fontFamily: 'NotoSansKR-Bold',
        left: -14,
    },
    stepGuide: {
        includeFontPadding: false,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'NotoSansKR-Medium',
        color: '#636363',
        marginTop: 10,
    },

    responseView: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'darkgray',
        paddingVertical: 12,
        paddingHorizontal: 18,
    },
    finishRequestButtonBorder: {
        width: (width-60)/3,
        padding: 1,
        borderRadius: 30,
        alignSelf: 'center',
    },
    finishRequestButton: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 6,
        alignItems: 'center',
    },
    finishRequestButtonText: {
        includeFontPadding: false,
        color: '#262626',
        fontFamily: 'NotoSansKR-Regular'
    },
})