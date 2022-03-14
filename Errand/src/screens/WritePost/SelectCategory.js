import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import auth from '@react-native-firebase/auth';

import Container from '../../components/Container';

const width = Dimensions.get('window').width;

export default SelectCategory = (props) => {
    const user = auth().currentUser;

    const selectCategory = (color, category) => {
        props.navigation.navigate('InputPrice', {color: color, category: category, })
    }

    const categories = [
        {title: '마트', content: '대신 장을 좀 봐주세요.', icon: 'cart', color: 'lightsalmon', layout: ['top', 'right']}, 
        {title: '과제', content: '과제를 도와주세요.', icon: 'pencil', color: 'mediumaquamarine', layout: ['bottom', 'left']}, 
        {title: '탐색', content: '물건을 찾아주세요.', icon: 'search', color: 'mediumpurple', layout: ['bottom', 'left']}, 
        {title: '서류', content: '서류를 배달해주세요.', icon: 'paperclip', color: 'lightskyblue', layout: ['top', 'left']}, 
        {title: '공구', content: '맥가이버가 되어주세요.', icon: 'gear', color: 'burlywood', layout: ['bottom', 'right']}, 
        {title: '짐', content: '무거운 짐을 옮겨주세요.', icon: 'archive', color: 'steelblue', layout: ['top', 'right']}, 
        {title: '생각', content: '생각을 공유해보세요.', icon: 'comment', color: 'lightcoral', layout: ['top', 'right']}, 
        {title: '기타', content: '{ ... }을 해주세요.', icon: 'question', color: 'darkgray', layout: ['bottom', 'right']}
    ]
    const categoryBox = categories.map((category, index) => 
        <TouchableOpacity key={index} style={styles.boxWrapper} onPress={() => {selectCategory(category.color, category.title)}}>
            <View>
                <Text style={styles.boxTitle}>{category.title}</Text>
                <Text style={styles.boxContent}>{category.content}</Text>
                <Icon name={category.icon} size={100} color='black' style={styles.boxIcon} />
                <View style={{
                    position: 'absolute',
                    top: category.layout[0] === 'top' ? (width-65)/4-20 : (width-65)/4+10,
                    left: category.layout[1] === 'left' ? (width-65)/6-20 : (width-65)/6+10,
                    width: 40,
                    height: 40, 
                    backgroundColor: category.color, 
                    borderRadius: 30,
                    opacity: 0.4,
                }} />
            </View>
        </TouchableOpacity>
    )

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>심부름 종류를 골라주세요.</Text>
            </View>

            <View style={styles.categoryView}>
                {categoryBox}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    titleWrapper: {
        paddingTop: 15,
        paddingBottom: 5,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: 'NotoSansKR-Regular',
        color: 'black',
        fontSize: Platform.OS === 'ios' ? 17:16,
    },
    categoryView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
    },
    boxWrapper: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: (width-60)/2,
        height: (width-60)/2, 
        marginBottom: 20,
        padding: 15,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.2,
                shadowRadius: 5,
                shadowOffset: {width: 2, height: 2},
            },
            android: {
                elevation: 6,
            },
        })
    },
    boxTitle: {
        fontSize: 18,
        color: 'black',
    },
    boxContent: {
        marginVertical: 7,
        fontSize: 14,
        color: 'black',
    },
    boxIcon: {
        alignSelf: 'center',
        marginTop: 7,
    },
  });