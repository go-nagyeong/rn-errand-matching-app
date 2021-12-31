import React, { useState, useEffect } from 'react';
import {StyleSheet, SafeAreaView, useColorScheme, StatusBar, View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';

import Container from '../components/Container';

const renderItem = ({ item }) => {
    return (
        <View style={styles.boardListItem}>
            <Text style={{alignSelf: 'center', marginRight: 10, fontWeight: '600'}}>{item.category}</Text>
            <View style={{marginRight: 10, flexDirection: 'column'}}>
                <Text>title: {item.title}</Text>
                <Text>content: {item.content}</Text>
            </View>
            <Text>{item.date.toDate().toDateString()}</Text>
        </View>
    );
};  

export default HomeScreen = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const [data, setData] = useState([]);
    const [keyword, searchKeyword] = useState('');

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

            <View style={styles.title}>
                <Text style={{alignSelf:'center', fontSize:30, marginBottom: 30}}>메인 화면</Text>
            </View>

            <View style={styles.boardView}>
                <View style={styles.boardHeader}>
                    <Text style={styles.filter}>필터 위치</Text>
                    
                    <View style={styles.search} >
                        <TextInput style={styles.searchBox} placeholder="search" value={keyword} />
                        <TouchableOpacity style={styles.searchButton}>
                            <Icon name="search1" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: '#fff',
    },
    title: {
        flex: 1,
    },
    boardView: {
        flex: 4,
        marginTop: 100,
        backgroundColor: '#53B77C',
        padding: 12,
        paddingVertical: 40,
    },
    boardHeader: {
        alignItems: 'center',
    },
    filter: {
        position: 'absolute',
        top: -100, 
        fontSize: 20,
    },
    search: {
        position: 'absolute',
        top: -65, 
        left: 5,
        right: 5, 
    },
    searchBox: {
        backgroundColor: '#F9F9F9',
        padding: 15,
        fontSize: 16,
        borderRadius: 30,
    },
    searchButton: {
        alignSelf: 'flex-end',
        top: -44, 
        right: 6,
        backgroundColor: '#53B77C',
        padding: 10,
        alignItems: 'center',
        borderRadius: 30,
    },
    boardListItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    }
});