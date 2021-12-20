import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import RegisterScreen from '../screens/RegisterScreen';

export default RegisterAction = (props) => {
    const [nameErr, setNameErr] = useState("")
    const [isDuplicatedName, setDuplicatedName] = useState(false)
    const [nameIsEdited, setNameEdited] = useState(false)

    const [emailErr, setEmailErr] = useState("")
    const [emailIsEdited, setEmailEdited] = useState(false)

    const [pwErr, setPwErr] = useState("")
    const [pwIsEdited, setPwEdited] = useState(false)

    const [rePwErr, setRePwErr] = useState("")
    const [rePwIsEdited, setRePwEdited] = useState(false)

    const users = firestore().collection('Users')

    const validateName = (nickname) => {
        setNameEdited(true)

        // 닉네임 중복 검사
        users
        .where('nickname', '==', nickname)
        .get()
        .then(querySnapshot => {
            if(querySnapshot.size >= 1) {
                setDuplicatedName(true);
            } else {
                setDuplicatedName(false);
            }
        })
        
        if(!nickname) {
            setNameErr('이름을 입력해주세요.');
            // setRegistrable(false);
        } else if(isDuplicatedName) {
            setNameErr('이미 사용 중인 이름입니다.');
            // setRegistrable(false);
        } else {
            setNameErr(null);
            // setRegistrable(true);
        }

        console.log("이름 : " + nickname);
        console.log("이름 에러 : " + nameErr);
        console.log("----------------------------");
    }
    
    const validateEmail = (email) => {
        var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;

        setEmailEdited(true)

        if(!email) {
            setEmailErr('이메일를 입력해주세요.');
            // setRegistrable(false);
        } else if (!emailReg.test(email)) {
            setEmailErr('이메일 형식을 올바르게 입력해주세요.');
            // setRegistrable(false);
        } else {
            setEmailErr(null);
            // setRegistrable(true);
        }

        console.log("이메일 : " + email);
        console.log("이메일 에러 : " + emailErr);
        console.log("----------------------------");
    }
    
    const validatePassword = (password) => {
        var pwReg = /^.*(?=^.{6,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        setPwEdited(true)

        if(!password) {
            setPwErr('비밀번호를 입력해주세요.');
            // setRegistrable(false);
        } else if (!pwReg.test(password)) {
            setPwErr('영문, 숫자, 특수문자를 모두 포함 (6~16자 이내)');
            // setRegistrable(false);
        } else {
            setPwErr(null);
            // setRegistrable(true);
        }

        console.log("비번 : " + password);
        console.log("비번 에러 : " + pwErr);
        console.log("----------------------------");
    }

    const validateRePassword = (password, confirmPassword) => {
        setRePwEdited(true)

        if(!confirmPassword) {
            setRePwErr('비밀번호 재확인을 입력해주세요.');
            // setRegistrable(false);
        } else if(confirmPassword !== password) {
            setRePwErr('비밀번호가 일치하지 않습니다.');
            // setRegistrable(false);
        } else {
            setRePwErr(null);
            // setRegistrable(true);
        }

        console.log("재확인 비번 : " + confirmPassword);
        console.log("재확인 비번 에러 : " + rePwErr);
        console.log("----------------------------");
    }

    const createUser = (nickname, email, password, confirmPassword) => {
        validateName(nickname)
        validateEmail(email)
        validatePassword(password)
        validateRePassword(password, confirmPassword)

        console.log("회원가입 기능 실행")
        if(!email || !password || nameErr || emailErr || pwErr || rePwErr) {
            console.log("통과 X")
            return false;
        } else {
            console.log("통과 O")
            auth()
            // auth로 이메일, 비밀번호 회원가입
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // firestore에 이메일, 닉네임, 등급 저장
                users
                .doc(email.substr(0,8))
                .set({
                    email: email,
                    nickname: nickname,
                    grade: 1,
                })
                .then(() => {
                    console.log('User added!');
                })
                .catch(error => {console.error(error);})

                // 인증 메일 전송
                userCredential.user?.sendEmailVerification();
                auth().signOut();
                Alert.alert(
                    "이메일 인증",
                    "인증 메일을 전송하였습니다.\n전송된 이메일의 링크를 클릭하면 회원가입이 완료됩니다.",
                    [{
                        text: "확인",
                        onPress: () => props.navigation.navigate('Home'),
                        style: "cancel",
                    }],
                );
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setEmailErr('이미 사용 중인 이메일입니다.');
                }
                if (error.code === 'auth/invalid-email') {
                    setEmailErr('유효하지 않은 이메일 주소입니다.');
                }
            })
        }
    }
    
    return <RegisterScreen 
            nameIsEdited={nameIsEdited}
            emailIsEdited={emailIsEdited}
            pwIsEdited={pwIsEdited}
            rePwIsEdited={rePwIsEdited}

            nameErr={nameErr} 
            emailErr={emailErr} 
            pwErr={pwErr} 
            rePwErr={rePwErr}

            validateName={validateName}
            validateEmail={validateEmail}
            validatePassword={validatePassword}
            validateRePassword={validateRePassword}

            createUser={createUser}

            navi={props.navigation} />
}
