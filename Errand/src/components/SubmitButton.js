import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../constants/Colors';

export default SubmitButton = (props) => {
    const {title, onPress} = props;

    return (
        <LinearGradient style={styles.roundButton} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.roundButtonText}>{title}</Text>
          </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    roundButton: {
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 25,
    },
    roundButtonText: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: '600',
    },
});