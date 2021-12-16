import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';

import Container from '../components/Container';

export default AuthTextInput = (props) => {
    const [Focus, setFocus] = useState(false);

    return (
        <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize='none'
            onBlur={() => {setFocus(false)}}
            onFocus={() => {setFocus(true)}}
            selectionColor="#292929"
            activeUnderlineColor={props.underlineColor === 'red' ? 'red':'#53B77C'}
            theme={{ colors: {text: Focus ? "black" : "#999899", placeholder: Focus ? "transparent" : "#999899"} }}

            placeholder={props.placeholder}
            value={props.value}
            onChangeText={props.onChangeText}
            secureTextEntry={props.secureTextEntry}
            ref={props.ref}
            returnKeyType={props.returnKeyType}
            onSubmitEditing={props.onSubmitEditing}
            blurOnSubmit={props.blurOnSubmit}
            left={props.left}
            right={props.right}
            underlineColor={props.underlineColor}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        marginBottom: 12,
    },
})