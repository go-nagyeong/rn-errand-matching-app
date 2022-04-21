import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../constants/Colors';

export default PriceButton = (props) => {
    const {price, borderColor, onPress} = props;

    return (
        <TouchableOpacity style={[styles.submitButton, {borderColor: borderColor}]} onPress={onPress}>
            <Text style={styles.buttonText}>{price}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    submitButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
    },
    buttonText: {
        color: Colors.black,
        fontSize: 14,
    }
});