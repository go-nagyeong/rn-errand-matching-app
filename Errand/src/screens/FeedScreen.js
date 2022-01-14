import React, { useState, useEffect } from 'react';
import {StyleSheet, Platform, SafeAreaView, useColorScheme, StatusBar, ScrollView, View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import Moment from 'moment';
import 'moment/locale/ko';

import Container from '../components/Container';

const renderItem = ({ item }) => {
    let categoryBackgroundColor = '',
        categoryIcon = '',
        grade = '',
        gradeColor = '';

    switch (item.category) {
        case '마트':
            categoryBackgroundColor = 'green';
            categoryIcon = 'shoppingcart'; break;
        case '과제':
            categoryBackgroundColor = 'lightgreen';
            categoryIcon = 'book'; break;
        case '탐색':
            categoryBackgroundColor = 'brown';
            categoryIcon = 'eyeo'; break;
        case '서류':
            categoryBackgroundColor = 'lightblue';
            categoryIcon = 'filetext1'; break;
        case '공구':
            categoryBackgroundColor = 'gray';
            categoryIcon = 'tool'; break;
        case '짐':
            categoryBackgroundColor = 'navy';
            categoryIcon = 'car'; break;
        case '생각':
            categoryBackgroundColor = 'orange';
            categoryIcon = 'bulb1'; break;
        case '기타':
            categoryBackgroundColor = 'lightgray';
            categoryIcon = 'ellipsis1'; break;
    }

    if (item.writergrade >= 4.1) {
        grade = 'A+';
        gradeColor = '#4CA374';
    } else if (item.writergrade >= 3.6) {
        grade = 'A0';
        gradeColor = '#4CA374';
    } else if (item.writergrade >= 3.1) {
        grade = 'B+';
        gradeColor = '#4CA374';
    } else if (item.writergrade >= 2.6) {
        grade = 'B0';
        gradeColor = '#4CA374';
    } else if (item.writergrade >= 2.1) {
        grade = 'C+';
        gradeColor = '#4CA374';
    } else if (item.writergrade >= 1.6) {
        grade = 'C0';
        gradeColor = '#4CA374';
    } else if (item.writergrade >= 1.1) {
        grade = 'D+';
        gradeColor = '#EB4E3D';
    } else if (item.writergrade >= 0.6) {
        grade = 'D0';
        gradeColor = '#EB4E3D';
    } else {
        grade = 'F';
        gradeColor = '#EB4E3D';
    }

    return (
        <View style={{flexDirection: 'row', backgroundColor: '#fff', height: 100, marginBottom: 15, padding: 15, borderRadius: 10}}>
            {/* 카테고리 아이콘 */}
            <View style={{backgroundColor: categoryBackgroundColor, borderRadius: 30, padding: 10, marginRight: 15, alignSelf: 'center'}}>
                <Icon name={categoryIcon} size={30} color='white' />
            </View>

            {/* 제목, 내용 */}
            <View style={{flex: 3.8, flexDirection: 'column', marginRight: 15, alignSelf: 'center'}}>
                <Text style={{fontSize: 15, fontWeight: '600', color: '#090909', marginBottom: 7}}>
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
    );
}

export default HomeScreen = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const [keyword, setKeyword] = useState('');

    const categories = [
        {text: '전체보기', icon: 'bars'},
        {text: '마트', icon: 'shoppingcart'}, 
        {text: '과제', icon: 'book'}, 
        {text: '탐색', icon: 'eyeo'}, 
        {text: '서류', icon: 'filetext1'}, 
        {text: '공구', icon: 'tool'}, 
        {text: '짐', icon: 'car'}, 
        {text: '생각', icon: 'bulb1'}, 
        {text: '기타', icon: 'ellipsis1'}
    ]
    const categoryBox = categories.map((category, index) => 
        <TouchableOpacity style={styles.categoryBox} onPress={() => {props.selectCategory(category.text); this.textInput.clear();} }>
            <Text style={styles.categoryText}>{category.text}</Text>
            <Icon name={category.icon} size={30}></Icon>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <ScrollView style={{padding: 20}} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {categoryBox}
                </ScrollView>
            </View>

            <View style={styles.boardView}>
                <View style={styles.search} >
                    <TextInput
                        style={styles.searchBox}
                        placeholder="search"
                        value={keyword}
                        onChangeText={text => setKeyword(text)}
                        autoCapitalize={false}
                        autoCorrect={false}
                        ref={(input) => { this.textInput = input }}
                         />
                    <TouchableOpacity style={styles.searchButton} onPress={() => keyword? props.searchKeyword(keyword):null}>
                        <Icon name="search1" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                
                <FlatList 
                    keyExtractor={item => item.id}
                    data={props.posts}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53B77C',
    },
    header: {
        flex: 1,
        backgroundColor: '#53B77C',
    },
    categoryBox: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 30,
        width: 100,
        height: 100,
        marginRight: 15,
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
    },
    boardView: {
        flex: Platform.OS === 'ios' ? 2.6 : 2,
        backgroundColor: '#EDF1F5',
        padding: 12,
        paddingVertical: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    search: {
        position: 'absolute',
        top: -25, 
        left: 20,
        right: 20, 
    },
    searchBox: {
        backgroundColor: '#fff',
        padding: Platform.OS === "ios" ? 15 : 12,
        fontSize: 16,
        borderRadius: 30,
    },
    searchButton: {
        alignSelf: 'flex-end',
        top: "-50%", 
        right: 6,
        backgroundColor: '#53B77C',
        padding: 10,
        alignItems: 'center',
        borderRadius: 30,
    },
    disabledSearchButton: {
        alignSelf: 'flex-end',
        top: "-50%", 
        right: 6,
        backgroundColor: '#53B77C',
        opacity: 0.5,
        padding: 10,
        alignItems: 'center',
        borderRadius: 30,
    },
});