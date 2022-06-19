import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../constants/Colors';
import RenderItem from './RenderItem';
import Header from '../../components/Header';

export default MessageScreen = (props) => {
    const renderItem = ({ item }) => {
        return <RenderItem item={props.myChats[item]} notification={props.myChatCount[item]} />
    }

    return (
        <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={{flex: 1}}>
            <SafeAreaView style={styles.container}>
                <Header title='메세지' titleColor={Colors.white} />

                <View style={styles.boardView}>
                    <FlatList
                        keyExtractor={index => String(index)}
                        data={Object.keys(props.myChats)}
                        renderItem={renderItem}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boardView: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 4,
    },
})