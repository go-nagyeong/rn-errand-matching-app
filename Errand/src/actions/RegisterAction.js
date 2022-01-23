import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import RegisterScreen from '../screens/RegisterScreen';

export default RegisterAction = (props) => {
    const [nameErr, setNameErr] = useState("")
    const [isDuplicatedName, setDuplicatedName] = useState(false)
    const [nameIsEdited, setNameEdited] = useState(false)

    const [idErr, setIdErr] = useState("")
    const [idIsEdited, setIdEdited] = useState(false)

    const [pwErr, setPwErr] = useState("")
    const [pwIsEdited, setPwEdited] = useState(false)

    const [rePwErr, setRePwErr] = useState("")
    const [rePwIsEdited, setRePwEdited] = useState(false)
    
    const users = firestore().collection('Users')
    
    useEffect(()=>{ 
        if(isDuplicatedName) {
            setNameErr('이미 사용 중인 이름입니다.');
        }
    }, [isDuplicatedName])
    
    
    const validateName = (nickname) => {
        var nameReg = /^[a-zA-Z0-9ㄱ-힣-_.]{2,10}$/;

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
                if(!nickname) {
                    setNameErr('이름을 입력해주세요.');
                } else if (!nameReg.test(nickname)) {
                    setNameErr('2~10자 한글, 영문, 숫자, 특수문자 -_.만 사용 가능');
                } else {
                    setNameErr("");
                }
            }
        })
    }
    
    const validateId = (id) => {
        var idReg = /^[A-Za-z0-9]{5,15}$/g;

        setIdEdited(true)

        if(!id) {
            setIdErr('이메일을 입력해주세요.');
        } else if (!idReg.test(id)) {
            setIdErr('이메일이 올바르지 않습니다.');
        } else {
            setIdErr("");
        }
    }
    
    const validatePassword = (password) => {
        var pwReg = /^.*(?=^.{6,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        setPwEdited(true)

        if(!password) {
            setPwErr('비밀번호를 입력해주세요.');
        } else if (!pwReg.test(password)) {
            setPwErr('영문, 숫자, 특수문자를 모두 포함 (6~16자 이내)');
        } else {
            setPwErr("");
        }
    }

    const validateRePassword = (password, confirmPassword) => {
        setRePwEdited(true)

        if(!confirmPassword) {
            setRePwErr('비밀번호 재확인을 입력해주세요.');
        } else if(confirmPassword !== password) {
            setRePwErr('비밀번호가 일치하지 않습니다.');
        } else {
            setRePwErr("");
        }
    }

    const createUser = (nickname, id, password, confirmPassword) => {
        var email = id + "@student.anu.ac.kr";

        validateName(nickname)
        validateId(id)
        validatePassword(password)
        validateRePassword(password, confirmPassword)

        if(!nickname || !id || !password || !confirmPassword || nameErr || idErr || pwErr || rePwErr) {
            return false;
        } else {
            auth()
            // auth로 이메일, 비밀번호 회원가입
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                // firestore에 이메일, 닉네임, 등급 저장
                await users
                .doc(email)
                .set({
                    email: email,
                    nickname: nickname,
                    grade: 2.3,
                })
                .then(() => console.log('User added!'))
                .catch(error => console.error(error));
                
                // auth에도 아이디, 비번 뿐 아니라 닉네임도 저장
                auth()
                .currentUser
                .updateProfile({
                    displayName: nickname
                });

                // 인증 메일 전송
                userCredential.user?.sendEmailVerification();
                auth().signOut();
                Alert.alert(
                    "이메일 인증",
                    "인증 메일을 전송하였습니다.\n전송된 이메일의 링크를 클릭하면 회원가입이 완료됩니다.",
                    [{
                        text: "확인",
                        onPress: () => props.navigation.navigate('Login'),
                        style: "cancel",
                    }],
                );
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setIdErr('이미 사용 중인 이메일입니다.');
                }
                if (error.code === 'auth/invalid-email') {
                    setIdErr('유효하지 않은 이메일 주소입니다.');
                }
            })
        }
    }
    
    return <RegisterScreen 
            nameIsEdited={nameIsEdited}
            idIsEdited={idIsEdited}
            pwIsEdited={pwIsEdited}
            rePwIsEdited={rePwIsEdited}

            nameErr={nameErr} 
            idErr={idErr} 
            pwErr={pwErr} 
            rePwErr={rePwErr}

            validateName={validateName}
            validateId={validateId}
            validatePassword={validatePassword}
            validateRePassword={validateRePassword}

            createUser={createUser}

            navi={props.navigation} />
}
