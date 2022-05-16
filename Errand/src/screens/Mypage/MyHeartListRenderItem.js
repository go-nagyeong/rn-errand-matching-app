import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/EvilIcons';
import Moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';

let row = [];
let prevOpenedRow = null;

export default MyHeartListRenderItem = ({ item, index }) => {
    const navigation = useNavigation();

    const [writerGrade, setWriterGrade] = useState("")
    const [writerImage, setWriterImage] = useState("")
    useEffect(() => {
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

    const cancelHeart = () => {
        Firebase.heartsRef
            .where('postId', '==', item.id + "%" + item.writerEmail)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => doc.ref.delete())
            })
            .catch((err) => console.log(err));

        Firebase.postsRef
            .doc(item.id + "%" + item.writerEmail)
            .update(
                {
                    'hearts': firestore.FieldValue.increment(-1)
                })
            .then(() => {
                console.log('하트 취소');
            })
            .catch(err => { console.log(err) })
    }


    const renderRightActions = () => {
        return (
            <RectButton
                style={styles.rightReportButton}
                onPress={() => {
                    cancelHeart()
                    prevOpenedRow.close()
                }}
            >
                <Icon name='heart-dislike' size={26} color={Colors.white} />
                <Text style={styles.rightReportButtonText}>찜 취소</Text>
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
            containerStyle={styles.itemBackground}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => closeRow(index)}
        >
            <View style={styles.itemView}>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName: item.writer, writerGrade: writerGrade, price: item.price, writerEmail: item.writerEmail, id: item.id, image: item.image, writerImage: writerImage, views: item.views, arrive: item.arrive, destination: item.destination, date: item.date}) }>  
                    {/* 작성일, 카테고리 아이콘 */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 13, color: Colors.midGray }}>
                            {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                                ? Moment(item.date.toDate()).fromNow()
                                : Moment(item.date.toDate()).format('YY/MM/DD')}
                        </Text>
                        <EIcon style={{ right: -2 }} name={categoryIconStyle[item.category][1]} size={22} color={categoryIconStyle[item.category][0]} />
                    </View>

                    {/* 제목, 내용, 사진 */}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginBottom: 12}}>
                        <View style={item.image !== "" && {width: '65%'}}>
                            <Text style={{fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 8}} numberOfLines={1} ellipsizeMode="tail">
                                {item.title}
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.gray }} numberOfLines={1} ellipsizeMode="tail">
                                {item.content}
                            </Text>
                        </View>
                        {item.image ? <Image source={{ uri: item.image }} style={styles.postImage} />
                            : <Image source={{ uri: 'blank' }} style={styles.postImage} />}
                    </View>

                    {/* 조회수, 하트수, 금액 */}
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AIcon name='eyeo' size={13} color={Colors.gray} />
                            <Text style={{marginLeft: 4, marginRight: 18, fontSize: 12, color: Colors.darkGray2}}>
                                {item.views}
                            </Text>

                            <AIcon name='heart' size={13} color={Colors.gray} />
                            <Text style={{marginLeft: 4, fontSize: 12, color: Colors.darkGray2}}>
                                {item.hearts}
                            </Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <AIcon name='pay-circle-o1' size={13} color={Colors.gray} />
                            <Text style={{marginLeft: 6, fontSize: 14, color: Colors.black}}>
                                {item.price}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
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