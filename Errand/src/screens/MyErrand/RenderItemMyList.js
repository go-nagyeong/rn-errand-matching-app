import React from 'react';
import { Platform, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';

export default RenderItemMyList = ({ item }) => {
    const navigation = useNavigation()

    categoryIconStyle = {
        마트: ['green', 'shoppingcart'],
        과제: ['lightgreen', 'book'],
        탐색: ['brown', 'eyeo'],
        서류: ['lightblue', 'filetext1'],
        공구: ['gray', 'tool'],
        짐: ['navy', 'car'],
        생각: ['orange', 'bulb1'],
        기타: ['lightgray', 'ellipsis1']
    }

    postBackgroundColor = {
        regist: '#fff',
        request: '#ffe',
        matching: '#fef',
    }

    return (
        <TouchableOpacity title={item.title + ' ' + item.content} onPress={() => { navigation.navigate("ShowAcceptPost", { id: item.id, erranderEmail: item.erranderEmail, errandPrice: item.price, errander: item.errander, errandProcess: item.process }) }}>
            <View style={{ flexDirection: 'row', backgroundColor: postBackgroundColor[item.process], height: 100, marginBottom: 15, padding: 15, borderRadius: 10 }}>
                <View style={{ backgroundColor: categoryIconStyle[item.category][0], borderRadius: 30, padding: 10, marginRight: 15, alignSelf: 'center' }}>
                    <Icon name={categoryIconStyle[item.category][1]} size={30} color='white' />
                </View>

                <View style={{ flex: 3.8, flexDirection: 'column', marginRight: 15, alignSelf: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#090909', marginBottom: 7 }} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#89888c', marginBottom: 12 }} numberOfLines={1} ellipsizeMode="tail">
                        {item.content}
                    </Text>
                </View>

                <View style={{ flex: 1.1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 5 }}>
                    <Text>
                        {item.process === 'request' ? '요청' : (item.process === 'matching' ? '매칭' : '등록')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}