import React, { useState, useEffect } from 'react';
import {StyleSheet, Platform, SafeAreaView, useColorScheme, StatusBar, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import {FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';
import 'moment/locale/ko';

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

    return (
        <View style={{flexDirection: 'row', backgroundColor: '#fff', height: 100, marginBottom: 15, padding: 15, borderRadius: 10}}>
            {/* 카테고리 아이콘 */}
            <View style={{backgroundColor: categoryBackgroundColor, borderRadius: 30, padding: 10, marginRight: 15, alignSelf: 'center'}}>
                <Icon name={categoryIcon} size={30} color='white' />
            </View>

            {/* 제목, 내용 */}
            <View style={{flex: 3.8, flexDirection: 'column', marginRight: 15, alignSelf: 'center'}}>
                <Text style={{fontSize: 15, fontWeight: '600', color: '#090909', marginBottom: 7}} numberOfLines={1} ellipsizeMode="tail">
                    {item.title.join(' ')}
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

    const [selectedId, setSelectedId] = useState(1);

    const [showFAB, setShowFAB] = useState(true);

    const categories = [
        {id: 1, text: '전체보기', icon: 'bars'},
        {id: 2, text: '마트', icon: 'shoppingcart'}, 
        {id: 3, text: '과제', icon: 'book'}, 
        {id: 4, text: '탐색', icon: 'eyeo'}, 
        {id: 5, text: '서류', icon: 'filetext1'}, 
        {id: 6, text: '공구', icon: 'tool'}, 
        {id: 7, text: '짐', icon: 'car'}, 
        {id: 8, text: '생각', icon: 'bulb1'}, 
        {id: 9, text: '기타', icon: 'ellipsis1'}
    ]
    const CategoryBox = ({opacity, onPress, item}) => (
        <TouchableOpacity style={[styles.categoryBox, opacity]} onPress={onPress}>
            <Text style={styles.categoryText}>{item.text}</Text>
            <Icon name={item.icon} size={30}></Icon>
        </TouchableOpacity>
    )
    const renderCategoryBox = ({item}) => {
        const opacity = item.id === selectedId ? 0.7:1;
        return (
            <CategoryBox 
                opacity={{opacity}}
                onPress={() => {
                    setSelectedId(item.id)
                    props.selectCategory(item.text);
                }}
                item={item}
            />
        )
    }

    const renderFooter = () => {
        if(props.loading) {
            return <ActivityIndicator style={{marginTop: 10}}/>
        } else {
            return null
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <FlatList 
                    contentContainerStyle={{padding: 18}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    data={categories}
                    renderItem={renderCategoryBox}
                    extraData={selectedId}
                />

                <View style={styles.filter} >
                    <TouchableOpacity style={styles.filterButton} activeOpacity={0.5} onPress={() => console.log('pressed')}>
                        <FIcon name='filter' size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.boardView}>
                <FlatList 
                    keyExtractor={item => item.key}
                    data={props.data}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={props.refreshing} onRefresh={props.getFeed} />}
                    ListFooterComponent={renderFooter}
                    onEndReached={!props.isListEnd && props.getMoreFeed}
                    onScrollBeginDrag={() => setShowFAB(false)}
                    onScrollEndDrag={() => setShowFAB(true)}
                />

                <FAB
                    style={styles.postButton}
                    color="#fff"
                    large
                    icon="pencil"
                    visible={showFAB}
                    onPress={() => props.navi.navigate('SelectCategory')}
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
        padding: 17,
        borderRadius: 30,
        width: 100,
        height: 100,
        marginRight: 15,
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        marginBottom: 3,
    },
    filter: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 10,
    },
    filterButton: {
        flexDirection: 'row',
        backgroundColor: 'tranparent',
    },
    boardView: {
        flex: Platform.OS === 'ios' ? 2.8 : 2.1,
        backgroundColor: '#EDF1F5',
        paddingHorizontal: 12,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    postButton: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#1bb55a',
    },
});