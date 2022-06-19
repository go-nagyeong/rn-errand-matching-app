import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Image } from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/EvilIcons';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';

export default RenderItem = ({ item }) => {
    const navigation = useNavigation()
    
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
    );
}

const styles = StyleSheet.create({
    itemBackground: {
        backgroundColor: Colors.white,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden'
    },
    itemView: {
        padding: 10,
    },

    postImage: {
        borderRadius: 12,
        width: '30%',
        height: 70,
    },
})