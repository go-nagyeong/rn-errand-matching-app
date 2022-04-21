import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/EvilIcons';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';
import Container from '../../components/Container';
import SubmitButton from '../../components/SubmitButton';

export default ReNameScreen = (props) => {
    const [nickname, setNickname] = useState('');
    const [nicknameFocus, setNicknameFocus] = useState(false);
    const [err, setErr] = useState('');
  
    const changeName = (nickname) => {
        const nameReg = /^[a-zA-Z0-9ㄱ-힣-_.]{2,10}$/

        if (!nickname) {
            setErr('닉네임을 입력해주세요.');
            return false;
        } else if (!nameReg.test(nickname)) {
            setErr('2~10자 한글, 영문, 숫자, 특수문자 -_.만 사용 가능');
            return false;
        } else {
            setErr('');

            Firebase.usersRef
                .where('nickname', '==', nickname)
                .get()
                .then(async (querySnapshot) => {
                    if (querySnapshot.size >= 1) { // 중복 검사
                        setErr('이미 사용 중인 닉네임입니다.');
                    } else {
                        // firestore에 존재하는 nickname 변경
                        await Firebase.usersRef
                            .doc(Firebase.currentUser.email)
                            .update({'nickname': nickname})
                            .then(() => console.log('firestore 이름 변경 완료'))
                            .catch(err => console.log(err));
                        
                        // auth에 존재하는 nickname 변경
                        Firebase.currentUser
                            .updateProfile({displayName: nickname})
                            .then(() => {
                                Alert.alert(
                                    "닉네임 변경",
                                    "닉네임 변경이 완료되었습니다.",
                                    [{
                                        text: "확인",
                                        onPress: () => props.navigation.navigate('Mypage'),
                                        style: "default",
                                    }],
                                );
                            })
                    }
                })
        }
    }

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>닉네임 변경</Text>
                <Text style={styles.textArea}>변경할 닉네임을 입력해주세요.</Text>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    placeholder="Nickname"
                    value={nickname}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onFocus={() => {setNicknameFocus(true)}}
                    onBlur={() => {setNicknameFocus(false)}}
                    onChangeText={text => {setNickname(text)}}
                    blurOnSubmit={false}
                    onSubmitEditing={() => changeName(nickname)}
                    selectionColor={Colors.darkGray2}
                    // react-native-paper
                    activeUnderlineColor={Colors.cyan}
                />
                <Text style={{fontSize: 14, color: Colors.red}}>{err}</Text>
            </View>
            <View style={styles.buttonWrapper}>
                <SubmitButton title="확인" onPress={() => changeName(nickname)} />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    titleWrapper: {
        marginLeft: 30,
        marginTop: "10%",
        marginBottom: 28,
    },
    title: {
        includeFontPadding: false,
        fontFamily: 'NotoSansKR-Medium',
        color: Colors.black,
        fontSize: 26,
        marginBottom: 12,
    },
    textArea: {
        fontFamily: 'Roboto-Light',
        color: Colors.black,
        fontSize: 16,
        lineHeight: 24,
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
})