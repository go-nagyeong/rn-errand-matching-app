import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/EvilIcons';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';

export default RenderItem = ({ item }) => {
    const navigation = useNavigation()

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
    return (
        <TouchableOpacity onPress={ () => navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName: item.writer, writerGrade: writerGrade, price: item.price, writerEmail: item.writerEmail, id: item.id, image: item.image, writerImage: writerImage, views: item.views, arrive: item.arrive, destination: item.destination, date: item.date}) }>  
            <View style={styles.itemView}>
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
                    {item.image ? <Image source={{ uri: item.image }} style={styles.postImage}/> : null}
                </View>

                {/* 조회수, 하트수, 금액 */}
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='eyeo' size={13} color={Colors.gray} />
                        <Text style={{marginLeft: 4, marginRight: 18, fontSize: 12, color: Colors.darkGray2}}>
                            {item.views}
                        </Text>

                        <Icon name='heart' size={13} color={Colors.gray} />
                        <Text style={{marginLeft: 4, fontSize: 12, color: Colors.darkGray2}}>
                            {item.hearts}
                        </Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='pay-circle-o1' size={13} color={Colors.gray} />
                        <Text style={{marginLeft: 6, fontSize: 14, color: Colors.black}}>
                            {item.price}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemView: {
        backgroundColor: Colors.white,
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
    },

    postImage: {
        borderRadius: 12,
        width: '30%',
        height: 70,
    },
})