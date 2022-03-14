import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get('window').width;

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
        color: '#090909',
        fontSize: 14,
    }
});