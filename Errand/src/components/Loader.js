import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import Colors from '../constants/Colors';

export default Loader = (props) => {
    const { isLoading } = props

    return (
        isLoading &&
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.white} />
        </View>
    )
}

const styles = StyleSheet.create({
    loaderContainer: {
        position: 'absolute',
        backgroundColor: Colors.translucent2,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})