import React, { useState } from 'react';
import { Platform, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Container from '../../components/Container';

export default SelectCategory = (props) => {
    const setCategory = (category, content) => {
        props.navigation.navigate('InputPrice', {category: category, content: content,})
    }

    const categories = [
        {title: '마트', content: '대신 장을 좀 봐주세요.', image: 'Home.png'}, 
        {title: '과제', content: '과제를 도와주세요.', image: 'Pen.png'}, 
        {title: '탐색', content: '물건을 찾아주세요.', image: 'Search.png'}, 
        {title: '서류', content: '서류를 배달해주세요.', image: 'Folder.png'}, 
        {title: '공구', content: '맥가이버가 되어보세요.', image: 'ToolBox.png'}, 
        {title: '짐', content: '무거운 짐을 옮겨주세요.', image: 'Box.png'}, 
        {title: '생각', content: '생각을 공유해보세요.', image: 'Idea.png'}, 
        {title: '기타', content: '~을 해주세요.', image: 'Chat.png'}
    ]
    const categoryBox = categories.map((category, index) => 
        <TouchableOpacity key={String(index)} style={styles.boxView} onPress={() => {setCategory(category.title, category.content)}}>
            <Text style={styles.itemText}>{category.title}</Text>
            <Text style={styles.itemTextContent}>{category.content}</Text>
            <Image
                source={require('../../assets/img/Home.png')}  // 파라미터로 변수 사용 불가 (icon으로 변경 ?)
                style={styles.itemImage}
            />
        </TouchableOpacity>
    )

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>카테고리</Text>
                <Text style={styles.subTitle}>카테고리를 선택해 주세요.</Text>
            </View>

            <View style={styles.centerView}>
                {categoryBox}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    titleWrapper: {
        alignItems: 'center',
        marginTop: Platform.OS === "ios" ? "18%" : "8%",
        marginBottom: Platform.OS === "ios" ? "7%" : "5%",
    },
    title: {
        fontFamily: 'Roboto-Bold',
        color: 'black',
        fontSize: 24,
        padding: 10,
    },
    subTitle: {
        fontFamily: 'Roboto',
        color: 'black',
        fontSize: 18,
        padding: 10,
    },

    centerView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: '#53B77C',
        borderRadius: 10,
        padding: 15,
    },
    boxView: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: 170, 
        height: 170, 
        marginBottom: 15,
        padding: 5,
    },
    itemText: {
        marginTop : 10,
        marginLeft : 10,
        fontSize: 18,
    },
    itemTextContent: {
        margin : 5,
        marginLeft : 10,
        fontSize: 14,
    },
    itemImage: {
        marginLeft: "45%",
        marginTop: "15%",
        width: 70, 
        height: 70, 
    },
  });