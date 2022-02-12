import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Fontisto';

import Container from '../components/Container';

export default FindPassword = (props) => {
    const [email, setEmail] = useState('');

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Forgot{"\n"}Password?</Text>
                <Text style={styles.textArea}>가입할 때 사용한 이메일 주소를 입력해주세요.{"\n"}</Text>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={text => {setEmail(text)}}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {props.findPassword(email)}}
                    selectionColor="#292929"
                    // react-native-paper
                    activeUnderlineColor='#53B77C'
                    left={<TextInput.Icon name={() => <Icon name="email" size={20} color="#53B77C" />} />}
                />
                <Text style={{
                    fontSize: 14,
                    marginBottom: props.err ? 30 : 0, 
                    color: props.err.charAt(0) === "비" ? 'green' : 'red'
                }}>
                {props.err}
                </Text>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.squareButton} onPress={() => {props.findPassword(email)}}>
                    <Text style={styles.squareButtonText}>{email && !props.err ? "이메일 전송" : "비밀번호 찾기"}</Text>
                </TouchableOpacity>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    titleWrapper: {
        marginLeft: 30,
        marginTop: Platform.OS === "ios" ? "15%" : "10%",
        marginBottom: 40,
    },
    title: {
        fontFamily: 'Roboto-Medium',
        color: 'black',
        fontSize: 32,
        lineHeight: 45,        
    },
    textArea: {
        fontFamily: 'Roboto-Light',
        color: 'black',
        fontSize: 16,
        marginTop: 25,
    },
    inputWrapper: {
        paddingHorizontal: 35,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    buttonWrapper: {
        paddingHorizontal: 35,
    },
    squareButton: {
        backgroundColor: '#53B77C',
        paddingVertical: 13,
        alignItems: 'center',
        borderRadius: 5,
    },
    squareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})