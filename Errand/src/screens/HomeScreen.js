import React, { useState, useEffect } from 'react';
import {StyleSheet, Platform, SafeAreaView, useColorScheme, StatusBar, View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import Moment from 'moment';
import 'moment/locale/ko';

import Container from '../components/Container';

const renderItem = ({ item }) => {
    return (
        <View style={{flexDirection: 'row', backgroundColor: '#fff', height: 80, marginBottom: 15, padding: 15, borderRadius: 10}}>
            {/* 카테고리 아이콘 */}
            <View style={{borderRadius: 30, padding: 10, marginRight: 15,
                backgroundColor: 
                    item.category === '대신구매' && 'orange' 
                    || item.category === '과제' && 'green'
                    || item.category === '기타' && 'gray'
            }}>
                <Icon size={30} color='white' 
                    name={
                        item.category === '대신구매' && 'shoppingcart' 
                        || item.category === '과제' && 'book'
                        || item.category === '기타' && 'plus'
                    }
                />
            </View>

            {/* 제목, 내용 */}
            <View style={{flex: 3.8, flexDirection: 'column', flexShrink: 1, marginRight: 15}}>
                <Text style={{fontSize: 15, fontWeight: '600', color: '#090909', marginBottom: 7}}>[{item.category}] {item.title}</Text>
                <Text style={{fontSize: 14, color: '#89888c'}} numberOfLines={1} ellipsizeMode="tail">{item.content}</Text>
            </View>

            {/* 작성일 */}
            <View style={{flex: 1, alignSelf: 'center'}}>
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

    const [data, setData] = useState([]);
    const [keyword, setKeyword] = useState('');

    const board = firestore().collection('Board')

    useEffect(() => {
        board
        .onSnapshot(querySnapshot => {
            const data = [];

            querySnapshot.forEach(documentSnapshot => {
                data.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });

            setData(data);
        });
    }, [])
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
            </View>

            <View style={styles.boardView}>
                <View style={styles.boardHeader}>
                    <View style={styles.search} >
                        <TextInput style={styles.searchBox} placeholder="search" value={keyword} onChangeText={text => setKeyword(text)}/>
                        <TouchableOpacity style={styles.searchButton}>
                            <Icon name="search1" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.filter}>필터 위치</Text>
                </View>
                
                <FlatList 
                    keyExtractor={item => item.id}
                    data={data}
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
    boardView: {
        flex: 3,
        backgroundColor: '#EDF1F5',
        padding: 12,
        paddingVertical: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    boardHeader: {
        alignItems: 'center',
    },
    search: {
        position: 'absolute',
        top: -65, 
        left: 5,
        right: 5, 
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
    filter: {
        fontSize: 20,
        marginBottom: 10,
    },
});