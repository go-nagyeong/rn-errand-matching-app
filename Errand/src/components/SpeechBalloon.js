import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Colors from '../constants/Colors';

export default SpeechBalloon = (props) => {
    const {prev, content} = props;

    return (
        <View style={styles.speechBalloon}>
            <View style={styles.triangle}></View>
            <View style={styles.oval}>
                <Text style={styles.speechBalloonText}>
                    {prev === 'price' && content + '원'
                    || prev === 'location' && '장소: ' + content[0] + ' > ' + content[1]
                    || prev === 'destination' && '목적지: ' + content
                    || prev === 'arrive' && '도착지: ' + content
                    || content
                    }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    speechBalloon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    triangle: {
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 19,
        borderLeftColor: Colors.transparent,
        borderRightColor: Colors.transparent,
        borderBottomColor: Colors.lightGray,
        transform: [{ rotate: "-90deg" }],
    },
    oval: {
        left: -2,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    speechBalloonText: {
        color: Colors.black,
    },
});