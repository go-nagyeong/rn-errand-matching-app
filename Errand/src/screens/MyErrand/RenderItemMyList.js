import React, { useState } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BottomSheet, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import IOIcon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';

import ErrandRating from './ErrandRating';

const width = Dimensions.get('window').width;

export default RenderItemMyList = ({ item }) => {
    const navigation = useNavigation()

    const [isVisibleRatingModal, setIsVisibleRatingModal] = useState(false);
    const [isVisibleBottomSheet, setIsVisibleBottomSheet] = useState(false);
    const list = [
        { title: '게시물 보기' },
        { 
            title: '삭제',
            titleStyle: { color: 'red' },
        },
        {
            title: '취소',
            containerStyle: { color: 'red' },
            onPress: () => setIsVisibleBottomSheet(false),
        },
    ];

    const [errandStep, setErrandStep] = useState(20)

    categoryIconStyle = {
        마트: 'shoppingcart',
        과제: 'book',
        탐색: 'eyeo',
        서류: 'filetext1',
        공구: 'tool',
        짐: 'car',
        생각: 'bulb1',
        기타: 'ellipsis1',
    }

    const processIndex = {
        // regist: 0,
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
            {index < processIndex[item.process]
            ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.currentMarkerPoint} style={styles.trackLine} />
            : <View style={styles.trackLine} />}
        </View>

    )
    const customMarker = steps.map((step, index) =>
        <View key={index} style={styles.marker}>
            {item.process === step.title
            ? 
            (item.process === 'matching'
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.markerPoint} />
                : <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.currentMarkerPoint}>
                        <FIcon name='bell' size={18} color='#fff' />
                    </LinearGradient>)
            : 
            (index < processIndex[item.process]
                ? <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.currentMarkerPoint} style={styles.trackLine} style={styles.markerPoint} />
                : <View style={styles.markerPoint} />)
            }
        </View>
    )
    const customLabel = steps.map((step, index) =>
        <Text style={[
            item.process === step.title ? styles.currentStepLabel : styles.stepLabel,
            step.title === 'finishRequest' && {left: -27}
        ]}>
            {step.koTitle}
        </Text>
    )
    return (
        <View style={styles.itemView}>
            <BottomSheet isVisible={isVisibleBottomSheet}>
                {list.map((l, i) => (
                    <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
                    <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                    </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>


            <View style={styles.infoView}>
                <Text style={{fontSize: 13, color: '#C2C2C2'}}>
                    {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                        ? Moment(item.date.toDate()).fromNow()
                        : Moment(item.date.toDate()).format('YY/MM/DD')}
                </Text>

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.chatButton} onPress={() => console.log('채팅 띄우기')}>
                        <Text style={styles.chatButtonText}>채팅</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsVisibleBottomSheet(true)}>
                        <IOIcon name='ellipsis-horizontal' size={20} color='#7d7d7d' />
                    </TouchableOpacity>
                </View>
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
                    {item.process === 'regist' && 'Errander를 기다리는 중 입니다.'
                    || item.process === 'request' && 'Errander의 심부름 요청을 받아주세요.'
                    || item.process === 'matching' && 'Errander와 연결이 되었습니다.\n심부름이 완료될 때까지 기다려주세요.'
                    || item.process === 'finishRequest' && 'Errander가 완료 요청을 보냈습니다.\n심부름이 정말 끝났다면 완료를 해주세요.'
                    }
                </Text>
            </View>

            {item.process === 'request' &&
                <View style={styles.responseView}>
                    <Text style={{ fontSize: 16 }}>{item.errander} </Text>

                    <TouchableOpacity onPress={() => accept()}>
                        <Text> 허락하기 </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => reject()}>
                        <Text> 거부하기 </Text>
                    </TouchableOpacity>

                </View>
            || item.process === 'finishRequest' &&
                <View style={styles.responseView}>
                    <TouchableOpacity style={styles.finishRequestButton} onPress={() => setIsVisibleRatingModal(true)}>
                        <Text>완료</Text>
                    </TouchableOpacity>

                    <ErrandRating
                        visible={isVisibleRatingModal}
                        onRequestClose={() => setIsVisibleRatingModal(false)}
                        id={item.id}
                        errander={item.errander}
                        erranderEmail={item.erranderEmail}
                        errandPrice={item.price}
                        errandProcess={item.process}
                        // erranderGrade={item.erranderGrade}
                        // erranderImage={item.erranderImage}
                        // calculateGrade={item.calculateGrade}
                        // btnErrandRating={btnErrandRating}
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
        width: (width-94)/3,
        color: '#d3d3d3',
        fontFamily: 'NotoSansKR-Medium',
        left: -14,
    },
    currentStepLabel: {
        width: (width-94)/3,
        color: '#7d7d7d',
        fontFamily: 'NotoSansKR-Bold',
        left: -14,
    },
    stepGuide: {
        textAlign: 'center',
        fontSize: 13,
        fontFamily: 'NotoSansKR-Medium',
        color: '#636363',
        marginTop: 10,
    },

    responseView: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'darkgray',
    },
    finishRequestButton: {
        marginHorizontal: 100,
        padding: 10,
        alignItems: 'center'
    },
})