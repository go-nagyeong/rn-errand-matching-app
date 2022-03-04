import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default SpeechBalloon = (props) => {
    const {prev, content} = props;

    return (
        <View style={styles.speechBalloon}>
            <View style={styles.triangle}></View>
            <View style={styles.oval}>
                <Text style={styles.speechBalloonText}>
                    {prev === 'price' ? content + '원'
                        : (prev === 'title' ? '제목: ' + content : content)
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
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#E9E9E9",
        transform: [{ rotate: "-90deg" }],
    },
    oval: {
        left: -2,
        borderRadius: 20,
        backgroundColor: '#E9E9E9',
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    speechBalloonText: {
        color: 'black',
    },
});