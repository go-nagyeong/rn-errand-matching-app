import React, { useState } from 'react';
import {StyleSheet, Platform, View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/EvilIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Moment from 'moment';
import 'moment/locale/ko';
import { useLinkProps, useNavigation } from '@react-navigation/native';

export default RenderItem = ({ item }) => {
    const navigation = useNavigation()

    const [postImage, setPostImage] = useState('')
    storage()
        .ref('Posts/' + item.id + '%' + item.writerEmail)
        .getDownloadURL()
        .then((url) => {
            setPostImage(url)
        })

    const [writerGrade, setWriterGrade] = useState(0)
    firestore()
        .collection('Users')
        .doc(item.writerEmail)
        .get()
        .then(doc => {
            if (doc.exists) {
                setWriterGrade(doc.data()['grade'])
            }
        })

    let grade = '',
        gradeColor = '';

    if (writerGrade >= 4.1) {
        grade = 'A+';
        gradeColor = '#4CA374';
    } else if (writerGrade >= 3.6) {
        grade = 'A0';
        gradeColor = '#4CA374';
    } else if (writerGrade >= 3.1) {
        grade = 'B+';
        gradeColor = '#4CA374';
    } else if (writerGrade >= 2.6) {
        grade = 'B0';
        gradeColor = '#4CA374';
    } else if (writerGrade >= 2.1) {
        grade = 'C+';
        gradeColor = '#4CA374';
    } else if (writerGrade >= 1.6) {
        grade = 'C0';
        gradeColor = '#4CA374';
    } else if (writerGrade >= 1.1) {
        grade = 'D+';
        gradeColor = '#EB4E3D';
    } else if (writerGrade >= 0.6) {
        grade = 'D0';
        gradeColor = '#EB4E3D';
    } else {
        grade = 'F';
        gradeColor = '#EB4E3D';
    }

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
        <TouchableOpacity onPress={ () => navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName: item.writer, writerGrade: grade, price: item.price, writerEmail: item.writerEmail, id: item.id}) }>  
            <View style={styles.itemView}>
                {/* 작성일, 카테고리 아이콘 */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                    <Text style={{fontSize: 13, color: '#C2C2C2'}}>
                        {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                            ? Moment(item.date.toDate()).fromNow()
                            : Moment(item.date.toDate()).format('YY/MM/DD')}
                    </Text>
                    <EIcon style={{top: -5, right: -8}} name={categoryIconStyle[item.category][1]} size={22} color={categoryIconStyle[item.category][0]} />
                </View>

                {/* 제목, 내용, 사진 */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, marginBottom: 12}}>
                    <View style={postImage !== "" && {width: '65%'}}>
                        <Text style={{fontSize: 15, fontWeight: '600', color: '#090909', marginBottom: 8}} numberOfLines={1} ellipsizeMode="tail">
                            {item.title}
                        </Text>
                        <Text style={{fontSize: 14, color: '#89888c'}} numberOfLines={1} ellipsizeMode="tail">
                            {item.content}
                        </Text>
                    </View>
                    {postImage !== "" && <Image source={{ uri: postImage }} style={styles.postImage} />}
                </View>

                {/* 금액 */}
                <View style={{flex: 1.1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 5}}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon name='pay-circle-o1' size={13} color='#808080' />
                        <Text style={{top: Platform.OS=='ios'?-1:-3, marginLeft: 6, fontSize: 14, fontFamily: 'Roboto-Medium', color: 'black'}}>
                            {item.price}
                        </Text>
                    </View>
                    
                </View>
            </View>
        </TouchableOpacity   >  
       
    );
}

const styles = StyleSheet.create({
    itemView: {
        backgroundColor: '#fff',
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