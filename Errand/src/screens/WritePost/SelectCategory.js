import React, { useState } from 'react';
import { Platform, Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';

import Container from '../../components/Container';

export default SelectCategory = (props) => {
    const setCategory = (category) => {
        props.navigation.navigate('InputPrice', {category: category,})
    }

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>카테고리</Text>
                <Text style={styles.subTitle}>카테고리를 선택해 주세요.</Text>
            </View>

            <View style={{backgroundColor: '#53B77C', borderRadius: 10}}>
                <View style={[styles.centerView, { marginTop: 20}]}>
                    <View>
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("탐색")}}>
                            <Text style={styles.itemText}>탐색</Text>
                            <Text style={styles.itemTextContent}>물건을 찾아주세요.</Text>
                            <Image
                                source={require('../../assets/img/Search.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("기타")}}>
                            <Text style={styles.itemText}>기타</Text>
                            <Text style={styles.itemTextContent}>기타 입니다.</Text>
                            <Image
                                source={require('../../assets/img/Chat.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.centerView}>
                    <View>
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("서류")}}>
                            <Text style={styles.itemText}>서류</Text>
                            <Text style={styles.itemTextContent}>서류를 배달해 주세요.</Text>
                            <Image
                                source={require('../../assets/img/Folder.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("마트")}}>
                            <Text style={styles.itemText}>마트</Text>
                            <Text style={styles.itemTextContent}>대신 장을 봐주세요.</Text>
                            <Image
                                source={require('../../assets/img/Home.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.centerView}>
                    <View>
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("과제")}}>
                            <Text style={styles.itemText}>과제</Text>
                            <Text style={styles.itemTextContent}>과제를 도와주세요.</Text>
                            <Image
                                source={require('../../assets/img/Pen.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("공구")}}>
                            <Text style={styles.itemText}>공구</Text>
                            <Text style={styles.itemTextContent}>맥가이버가 되어보세요.</Text>
                            <Image
                                source={require('../../assets/img/ToolBox.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            
                <View style={[styles.centerView, { marginBottom: 20}]}>
                    <View >
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("짐")}}>
                            <Text style={styles.itemText}>짐</Text>
                            <Text style={styles.itemTextContent}>짐 나르기를 도와주세요.</Text>
                            <Image
                                source={require('../../assets/img/Box.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.boxView]} onPress={() => {setCategory("생각")}}>
                            <Text style={styles.itemText}>생각</Text>
                            <Text style={styles.itemTextContent}>생각을 공유해 보세요.</Text>
                            <Image
                                source={require('../../assets/img/Idea.png')}
                                style={[styles.item]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    centerView: {
        flex: 1,
        flexDirection: 'row', 
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    boxView: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight : 10,
        marginLeft : 10,
        width: 170, 
        height: 170, 
    },
    checkItem: {
        width: 70, 
        height: 70, 
    },
    item: {
        marginLeft: "45%",
        marginTop: "15%",
        width: 70, 
        height: 70, 
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
    inputWrapper: {
        paddingHorizontal: 35,
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    buttonWrapper: {
        paddingHorizontal: 35,
    },
    squareButton: {
        backgroundColor: '#53B77C',
        paddingVertical: 13,
        alignItems: 'center',
        borderRadius: 5,
    },
    squareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    textButtonText: {
        color: "#53B77C",
        fontSize: 16,
        fontWeight: "600",
    },
  });