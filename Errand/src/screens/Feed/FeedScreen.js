import React, { useState } from 'react';
import {StyleSheet, Platform, SafeAreaView, useColorScheme, StatusBar, View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import {FAB} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';

import FeedFilter from './FeedFilter';
import RenderItem from './RenderItem';

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

                <FeedFilter 
                    sortFilter={props.sortFilter}
                    priceFilter={props.priceFilter}
                />
            </View>

            <View style={styles.boardView}>
                <FlatList 
                    keyExtractor={(item, index) => String(index)}
                    data={props.data}
                    renderItem={RenderItem}
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
    boardView: {
        flex: Platform.OS === 'ios' ? 2.6 : 1.9,
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