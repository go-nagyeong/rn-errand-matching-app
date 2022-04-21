import React from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../constants/Colors';
import RenderItem from './RenderItem';

export default MessageScreen = (props) => {
    const renderItem = ({ item }) => {
        return <RenderItem item={props.myChats[item]} notification={props.myChatCount[item]} />
        // return <RenderItem item={item} />  // 다른 방법
    }

    return (
        <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={{flex: 1}}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Message</Text>
                </View>

                <View style={styles.boardView}>
                    <FlatList
                        keyExtractor={index => String(index)}
                        data={Object.keys(props.myChats)}
                        // data={props.myChats}  // 다른 방법
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
    header: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        color: Colors.white,
        fontWeight: '700',
    },
    boardView: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 4,
    },
})