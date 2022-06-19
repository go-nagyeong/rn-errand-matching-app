import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Colors from '../constants/Colors';

export default Header = (props) => {
    const { title, titleColor } = props

    return (
        <View style={styles.header}>
            <Text style={[styles.title, {color: titleColor}]}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        // borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
})