import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';
import Container from '../../components/Container';
import SubmitButton from '../../components/SubmitButton';

export default FindPassword = (props) => {
    const { withdrawal } = props.route.params;

    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);
    const [err, setErr] = useState('');

    const resetPassword = (email) => {
        const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    
        if (!email) {
            setErr('이메일을 입력해주세요.');
            return false;
        } else if (!emailReg.test(email)) {
            setErr('이메일 형식을 올바르게 입력해주세요.');
            return false;
        } else if (email != Firebase.currentUser.email) {
            setErr('가입 정보와 맞지 않는 이메일입니다.')
        } else {
            setErr('');
        
            auth()
                .sendPasswordResetEmail(email)
                .then(() => setErr('비밀번호 재설정 메일을 전송하였습니다.'))
                .catch(error => {
                    if (error.code === 'auth/invalid-email') {
                        setErr("이메일이 유효하지 않습니다.");
                    } 
                    if (error.code === 'auth/user-not-found') {
                        setErr("존재하지 않는 아이디입니다.");
                    } 
                    if (error.code == 'auth/too-many-requests'){
                        setErr("너무 많은 이메일이 요청되었습니다.");
                    }
                });
        }
    }

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>비밀번호 재설정</Text>
                <Text style={styles.textArea}>가입할 때 사용하신 이메일을 입력해주세요.</Text>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onFocus={() => {setEmailFocus(true)}}
                    onBlur={() => {setEmailFocus(false)}}
                    onChangeText={text => {setEmail(text)}}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {resetPassword(email)}}
                    selectionColor={Colors.darkGray2}
                    // react-native-paper
                    activeUnderlineColor={Colors.cyan}
                    left={<TextInput.Icon name={() => <Icon name="email" size={20} color={emailFocus ? Colors.cyan : Colors.midGray} />} />}
                />
                <Text style={{fontSize: 14, color: err.charAt(0) == '비' ? Colors.green : Colors.red}}>{err}</Text>
            </View>
            
            <View style={styles.buttonWrapper}>
                <SubmitButton title="재설정 메일 전송" onPress={() => resetPassword(email)} />
            </View>

            {withdrawal &&
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => withdrawal()}>
                        <Text style={styles.textButton}>회원탈퇴</Text>
                    </TouchableOpacity>
                </View>
            }
        </Container>
    )
}

const styles = StyleSheet.create({
    titleWrapper: {
        marginLeft: 30,
        marginTop: "10%",
        marginBottom: 34,
    },
    title: {
        includeFontPadding: false,
        fontFamily: 'NotoSansKR-Medium',
        color: Colors.black,
        fontSize: 22,
        marginBottom: 12,
    },
    textArea: {
        fontFamily: 'Roboto-Light',
        color: Colors.black,
        fontSize: 16,
    },
    inputWrapper: {
        paddingHorizontal: 35,
        marginBottom: 34,
    },
    input: {
        backgroundColor: Colors.white,
        marginBottom: 12,
    },
    buttonWrapper: {
        paddingHorizontal: 35,
        marginBottom: 34,
    },
    footer: {
        marginHorizontal: 40,
        alignItems: 'flex-end',
    },
    textButton: {
        fontSize: 15,
        color: Colors.midGray,
        textDecorationLine: 'underline',
    },
})