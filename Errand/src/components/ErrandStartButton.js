import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

import * as Common from '../utils/Common';
import Colors from '../constants/Colors';

export default ErrandStartButton = (props) => {
    const { backgroundColor, onPress } = props;

    return (
        <LinearGradient style={{borderRadius: 5}} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}>
            <TouchableOpacity  onPress={onPress}>
                <Text style={styles.buttonText}>시작하기</Text>
                
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    submitButton: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: Common.width / 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: Colors.white,
        flexDirection: 'row',
        fontSize: 18,
        borderRadius: 5,
        fontWeight: "bold",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginRight: 30,
        marginLeft: 30,
    }
});