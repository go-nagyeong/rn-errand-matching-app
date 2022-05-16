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

    let opponentEmail =  Firebase.currentUser.email === item.writerEmail ?  item.erranderEmail : item.writerEmail; // 상대방 이메일
    let opponentNickname = Firebase.currentUser.displayName === item.writer ? item.errander : item.writer; // 상대방 닉네임
    
    const [reportDetailVisible, setReportDetailVisible] = useState(false); // 신고 작성 페이지
    
    const [isReported, setReported] = useState(false)

    const [writerGrade, setWriterGrade] = useState("")
    const [writerImage, setWriterImage] = useState("")
    useEffect(() => {
        // 중복 신고 여부 검사
        if (item.reported.includes(Firebase.currentUser.email)) {
            setReported(true)
        }

        Firebase.usersRef
            .doc(item.writerEmail)
            .get()
            .then(doc => {
                if (doc.exists) {
                    let gradeNum = doc.data()['grade']
                    setWriterGrade(Common.calculateGrade(gradeNum))
                    setWriterImage(doc.data()['image'])
                }
            })
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
                            "안내",
                            "중복 신고는 불가능합니다.",
                            [{
                                text: "확인",
                                onPress: () => prevOpenedRow.close(),
                                style: "default",
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
            containerStyle={[styles.itemBackground, isReported && {backgroundColor: Colors.lightGray2}]}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => closeRow(index)}
        >
            <View style={styles.itemView}>
                <TouchableOpacity style={{padding: 10}} onPress={ () => navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName: item.writer, writerGrade: writerGrade, price: item.price, writerEmail: item.writerEmail, id: item.id, image: item.image, writerImage: writerImage, views: item.views, arrive: item.arrive, destination: item.destination, date: item.date}) }>  
                    {/* 작성일, 카테고리 아이콘 */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                        <Text style={{ fontSize: 13, color: Colors.midGray }}>
                            {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                                ? Moment(item.date.toDate()).fromNow()
                                : Moment(item.date.toDate()).format('YY/MM/DD')}
                        </Text>
                        <EIcon style={{right: -2}} name={categoryIconStyle[item.category][1]} size={22} color={categoryIconStyle[item.category][0]} />
                    </View>

                    {/* 제목, 내용 */}
                    <View style={{width: '90%', paddingHorizontal: 5, marginBottom: 20}}>
                        <Text style={{fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 8}} numberOfLines={1} ellipsizeMode="tail">
                            {item.title}
                        </Text>
                        <Text style={{ fontSize: 14, color: Colors.gray }} numberOfLines={1} ellipsizeMode="tail">
                            {item.content}
                        </Text>
                    </View>

                    {/* 금액, 심부름꾼, 신고 */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 12}}>
                            <AIcon name='pay-circle-o1' size={13} color={Colors.gray} />
                            <Text style={{includeFontPadding: false, marginLeft: 5, fontSize: 13, color: Colors.black}}>
                                {item.price}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AIcon name='team' size={14} color={Colors.gray} />
                            <Text style={{includeFontPadding: false, marginLeft: 4, fontSize: 13, color: Colors.black}}>
                                {opponentNickname}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity> 
            </View>
            {/* 신고 내용 작성하는 Modal */}
            <ReportDetail 
                visible={reportDetailVisible}
                onRequestClose={() => setReportDetailVisible(false)}
                opponentEmail={opponentEmail}
                opponentNickname={opponentNickname}
                postId={item.id}
                writerEmail={item.writerEmail}
                getPosts={getPosts}
            />
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    itemBackground: {
        backgroundColor: Colors.red,
        marginBottom: 15,
        borderRadius: 15,
    },
    itemView: {
        backgroundColor: Colors.white,
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