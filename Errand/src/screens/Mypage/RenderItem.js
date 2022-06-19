import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform, View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/EvilIcons';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';
import ReportDetail from './ReportDetail'

let row = [];
let prevOpenedRow = null;

export default RenderItem = ({ item, index, getPosts }) => {
    const navigation = useNavigation();

    const opponentEmail = Firebase.currentUser.email == item.writerEmail ? item.erranderEmail : item.writerEmail; // 상대방 이메일
    const opponentName = Firebase.currentUser.email == item.writerEmail ? item.errander : item.writer; // 상대방 닉네임

    const [reportDetailVisible, setReportDetailVisible] = useState(false); // 신고 작성 페이지
    
    const [isReported, setReported] = useState(false)
    useEffect(() => {
        // 중복 신고 여부 검사
        if (item.reported.includes(Firebase.currentUser.email)) {
            setReported(true)
        }
    }, [])

    categoryIconStyle = {
        마트: ['lightsalmon', 'cart'],
        과제: ['mediumaquamarine', 'pencil'],
        탐색: ['mediumpurple', 'search'],
        서류: ['lightskyblue', 'paperclip'],
        공구: ['burlywood', 'gear'],
        짐: ['steelblue', 'archive'],
        생각: ['lightcoral', 'comment'],
        기타: ['darkgray', 'question']
    }

    const renderRightActions = () => {
        return (
            <RectButton
                style={styles.rightReportButton}
                onPress={() => {
                    isReported 
                        ? Alert.alert(
                            "중복 신고는 불가능합니다.",
                            "",
                            [{
                                text: "확인",
                                onPress: () => prevOpenedRow.close(),
                                style: "cancel",
                            }],
                        )
                        : setReportDetailVisible(true)
                }}
            >
                <Icon name='person-circle' size={26} color={Colors.white} />
                <Text style={styles.rightReportButtonText}>신고하기</Text>
            </RectButton>
        );
    };
    // rightAction은 한 번에 한 게시물에 한해서만 작동되게
    const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow != row[index]) {
            prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
    }
    return (
        <Swipeable
            ref={ref => row[index] = ref}
            containerStyle={[styles.swipeableBackground, isReported && {backgroundColor: Colors.lightGray2}]}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => closeRow(index)}
        >
            <View style={styles.itemBackground}>
                <TouchableOpacity style={styles.itemView} onPress={ () => navigation.navigate("ShowDetailPost", {...item}) }>  
                    {/* 작성일, 카테고리 아이콘 */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                        <Text style={{ fontSize: 13, color: Colors.midGray }}>
                            {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                                ? Moment(item.date.toDate()).fromNow()
                                : Moment(item.date.toDate()).format('YY/MM/DD')}
                        </Text>
                        <EIcon style={{right: -2}} name={categoryIconStyle[item.category][1]} size={22} color={categoryIconStyle[item.category][0]} />
                    </View>

                    {/* 제목, 내용, 사진 */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 4, marginBottom: item.image !== "" ? 12 : 22}}>
                        <View style={item.image !== "" && {width: '65%'}}>
                            <Text style={{fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 8}} numberOfLines={1} ellipsizeMode="tail">
                                {item.title}
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.gray }} numberOfLines={1} ellipsizeMode="tail">
                                {item.content}
                            </Text>
                        </View>
                        {item.image[0] ? <Image source={{ uri: item.image[0] }} style={styles.postImage}/> : null}
                    </View>

                    {/* 조회수, 하트수, 금액 */}
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AIcon name='pay-circle-o1' size={13} color={Colors.gray} />
                            <Text style={{marginLeft: 6, fontSize: 14, color: Colors.black}}>
                                {item.price}
                            </Text>
                        </View>
                        
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AIcon name='team' size={14} color={Colors.gray} />
                            <Text style={{includeFontPadding: false, marginLeft: 4, marginRight: 16, fontSize: 13, color: Colors.black}}>
                                {opponentName}
                            </Text>

                            <AIcon name='clockcircleo' size={13} color={Colors.gray} />
                            <Text style={{marginLeft: 5, fontSize: 13, color: Colors.black}}>
                                {item.errandDuration}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            {/* 신고 내용 작성하는 Modal */}
            <ReportDetail 
                visible={reportDetailVisible}
                onRequestClose={() => setReportDetailVisible(false)}
                postId={item.id + '%' + item.writerEmail}
                opponentEmail={opponentEmail}
                getPosts={getPosts}
            />
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    swipeableBackground: {
        backgroundColor: Colors.red,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden'
    },
    itemBackground: {
        backgroundColor: Colors.white,
    },
    itemView: {
        padding: 10,
    },
    postImage: {
        borderRadius: 12,
        width: '30%',
        height: 70,
    },
    
    rightReportButton: {
        width: '26%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightReportButtonText: {
        includeFontPadding: false,
        fontSize: 15,
        color: Colors.white,
        marginTop: 4,
    },
})