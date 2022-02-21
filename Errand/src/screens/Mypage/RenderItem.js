import React from 'react';
import {Platform, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';

export default RenderItem = ({ item }) => {
    const navigation = useNavigation()

    let grade = '',
        gradeColor = '';

    if (item.writerGrade >= 4.1) {
        grade = 'A+';
        gradeColor = '#4CA374';
    } else if (item.writerGrade >= 3.6) {
        grade = 'A0';
        gradeColor = '#4CA374';
    } else if (item.writerGrade >= 3.1) {
        grade = 'B+';
        gradeColor = '#4CA374';
    } else if (item.writerGrade >= 2.6) {
        grade = 'B0';
        gradeColor = '#4CA374';
    } else if (item.writerGrade >= 2.1) {
        grade = 'C+';
        gradeColor = '#4CA374';
    } else if (item.writerGrade >= 1.6) {
        grade = 'C0';
        gradeColor = '#4CA374';
    } else if (item.writerGrade >= 1.1) {
        grade = 'D+';
        gradeColor = '#EB4E3D';
    } else if (item.writerGrade >= 0.6) {
        grade = 'D0';
        gradeColor = '#EB4E3D';
    } else {
        grade = 'F';
        gradeColor = '#EB4E3D';
    }

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
    return (
        <TouchableOpacity   title = { item.title  +  ' ' + item.content }   onPress={() => {  } } >  
            <View style={{flexDirection: 'row', backgroundColor: '#fff', height: 100, marginBottom: 15, padding: 15, borderRadius: 10}}>
                {/* 카테고리 아이콘 */}
                <View style={{backgroundColor: categoryIconStyle[item.category][0], borderRadius: 30, padding: 10, marginRight: 15, alignSelf: 'center'}}>
                    <Icon name={categoryIconStyle[item.category][1]} size={30} color='white' />
                </View>

                {/* 제목, 내용 */}
                <View style={{flex: 3.8, flexDirection: 'column', marginRight: 15, alignSelf: 'center'}}>
                    <Text style={{fontSize: 15, fontWeight: '600', color: '#090909', marginBottom: 7}} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                    </Text>
                    <Text style={{fontSize: 14, color: '#89888c', marginBottom: 12}} numberOfLines={1} ellipsizeMode="tail">
                        {item.content}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        <Icon name='pay-circle-o1' size={13} color='#808080' />
                        <Text style={{top: Platform.OS=='ios'?-1:-3, marginLeft: 6, fontSize: 14, fontFamily: 'Roboto-Medium', color: 'black'}}>
                            {item.price}
                        </Text>
                    </View>
                </View>

                {/* 작성자 등급, 작성일 */}
                <View style={{flex: 1.1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: 5}}>
                    <View style={{flexDirection: 'row'}}>
                        <FIcon name='user-circle' size={16} color={gradeColor} />
                        <Text style={{top: Platform.OS=='ios'?0:-2, marginLeft: 6, fontSize: 14, fontFamily: 'Roboto-Medium', color: 'black'}}>
                            {grade}
                        </Text>
                    </View>
                    <Text style={{fontSize: 13, color: '#C2C2C2'}}>
                        {Moment(item.date.toDate()).diff(Moment(), 'days') >= -2
                            ? Moment(item.date.toDate()).fromNow()
                            : Moment(item.date.toDate()).format('YY/MM/DD')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity   >  
       
    );
}