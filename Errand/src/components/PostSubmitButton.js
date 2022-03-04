import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get('window').width;

export default PostSubmitButton = (props) => {
    const {backgroundColor, onPress} = props;

    return (
        <TouchableOpacity style={[styles.submitButton, {backgroundColor: backgroundColor}]} onPress={onPress}>
            <Text style={styles.buttonText}>OK</Text>
            <Icon name='right' size={16} color='#fff' />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    submitButton: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: width/4,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 5,
    }
});