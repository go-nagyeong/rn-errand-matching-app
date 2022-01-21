import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const width = 50; 

const LabelBase = (props) => {
    const {leftPosition, value, topPosition} = props;

    return (
        <View style={[styles.label, {left: leftPosition-width/2, top: topPosition}]}>
            <Text style={styles.labelText}>{value}</Text>
        </View>
    )
}

export default CustomLabel = (props) => {
    const {
        oneMarkerValue,
        twoMarkerValue,
        oneMarkerLeftPosition,
        twoMarkerLeftPosition,
    } = props;

    return (
        <View>
            <LabelBase
                leftPosition={oneMarkerLeftPosition}
                value={oneMarkerValue}
                topPosition={28}
            />
            <LabelBase
                leftPosition={twoMarkerLeftPosition}
                value={twoMarkerValue}
                topPosition={-28}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        position: 'absolute',
        justifyContent: 'center',
        top: 28,
        width: width,
        height: width,
    },
    labelText: {
        textAlign: 'center',
        lineHeight: width,
        color: '#1bb55a',
    }
});
