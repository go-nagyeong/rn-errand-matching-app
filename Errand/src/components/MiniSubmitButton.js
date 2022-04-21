import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../constants/Colors';

export default MiniSubmitButton = (props) => {
    const {title, backgroundColor, onPress} = props;

    return (
        <TouchableOpacity style={[styles.submitButton, {backgroundColor: backgroundColor}]} onPress={onPress}>
            <Text style={styles.buttonText}>{title ? title : 'OK'}</Text>
            <Icon name='right' size={16} color={Colors.white} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    submitButton: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '30%',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        marginRight: 5,
    }
});