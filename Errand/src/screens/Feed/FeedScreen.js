import React, { useState, useCallback } from 'react';
import {Alert, StyleSheet, Platform, SafeAreaView, useColorScheme, StatusBar, View, Text, TouchableHighlight, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Animated} from 'react-native';
import {FAB} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import FeedFilter from './FeedFilter';
import RenderItem from './RenderItem';

export default FeedScreen = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const [selectedId, setSelectedId] = useState(1);

    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(1));

    const showPostButton = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start();
    };
    const hidePostButton = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start();
    };


    const categories = [
        { id: 1, text: '전체보기', icon: 'bars' },
        { id: 2, text: '마트', icon: 'shoppingcart' },
        { id: 3, text: '과제', icon: 'book' },
        { id: 4, text: '탐색', icon: 'eyeo' },
        { id: 5, text: '서류', icon: 'filetext1' },
        { id: 6, text: '공구', icon: 'tool' },
        { id: 7, text: '짐', icon: 'car' },
        { id: 8, text: '생각', icon: 'bulb1' },
        { id: 9, text: '기타', icon: 'ellipsis1' }
    ]
    const CategoryBox = ({ backgroundColor, color, onPress, item }) => (
        <TouchableHighlight underlayColor='#fff' activeOpacity={1} style={[styles.categoryBox, backgroundColor]} onPress={onPress}>
            <>
                <Text style={[styles.categoryText, color]}>{item.text}</Text>
                <AntDesign name={item.icon} size={30} style={[color]}/>
            </>
        </TouchableHighlight>
    )
    const renderCategoryBox = ({ item }) => {
        const backgroundColor = item.id === selectedId ? 'white' : 'transparent';
        const color = item.id === selectedId ? 'black' : 'white';
        return (
            <CategoryBox
                backgroundColor={{ backgroundColor }}
                color = {{ color }}
                onPress={() => {
                    setSelectedId(item.id)
                    props.selectCategory(item.text);
                }}
                item={item}
            />
        )
    }

    const renderFooter = () => {
        if (props.loading) {
            return <ActivityIndicator style={{ marginTop: 10 }} />
        } else {
            return null
        }
    }

    const renderItem = ({ item }) => {
        return <RenderItem item={item} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={{flex: 1}}>
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
                        renderItem={renderItem}
                        refreshControl={<RefreshControl refreshing={props.refreshing} onRefresh={props.getFeed} />}
                        ListFooterComponent={renderFooter}
                        onEndReached={!props.isListEnd && props.getMoreFeed}
                        onScrollBeginDrag={() => hidePostButton()}
                        onScrollEndDrag={() => showPostButton()}

                    />

                    <Animated.View style={[styles.postButtonWrap, {transform: [{ scale: scaleAnim }]}]}>
                        <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#36D1DC', '#5B86E5']} style={{borderRadius: 30}}>
                            <TouchableOpacity style={{padding: 18}} onPress={() => props.navi.navigate('SelectCategory')}>
                                <FontAwesome5 name='pen' size={20} color='#fff' />
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
    },
    categoryBox: {
        padding: 16,
        borderRadius: 30,
        width: 100,
        height: 100,
        marginRight: 15,
        borderWidth: 0.8,
        borderColor: '#fff',
    },
    categoryText: {
        fontFamily: 'NotoSansKR-Regular',
        fontSize: 15,
        marginBottom: 4,
    },
    boardView: {
        flex: Platform.OS === 'ios' ? 2.6 : 1.9,
        backgroundColor: '#EDF1F5',
        paddingHorizontal: 12,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    postButtonWrap: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});