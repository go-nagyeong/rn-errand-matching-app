import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import RegisterScreen from '../screens/RegisterScreen';

export default RegisterAction = (props) => {
    const [submit, setSubmit] = useState(false)

    const [nameErr, setNameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [pwErr, setPwErr] = useState("")
    const [rePwErr, setRePwErr] = useState("")

    const [registrable, setRegistrable] = useState(false)

    const createUser = (nickname, email, password, confirmPassword, phoneNum) => {
        var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        var pwReg = /^.*(?=^.{6,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
                
        setSubmit(true);
        
        if(!nickname) {
            setNameErr('이름을 입력해주세요.');
            setRegistrable(false);
        } else {
            setNameErr('');
            setRegistrable(true);
        }

        if(!email) {
            setEmailErr('이메일를 입력해주세요.');
            setRegistrable(false);
        } else if (!emailReg.test(email)) {
            setEmailErr('이메일 형식을 올바르게 입력해주세요.');
            setRegistrable(false);
        } else {
            setEmailErr('');
            setRegistrable(true);
        }

        if(!password) {
            setPwErr('비밀번호를 입력해주세요.');
            setRegistrable(false);
        } else if (!pwReg.test(password)) {
            setPwErr('영문, 숫자, 특수문자를 모두 포함 (6~16자 이내)');
            setRegistrable(false);
        } else {
            setPwErr('');
            setRegistrable(true);
        }

        if(!confirmPassword) {
            setRePwErr('비밀번호 재확인을 입력해주세요.');
            setRegistrable(false);
        } else if(confirmPassword !== password) {
            setRePwErr('비밀번호가 일치하지 않습니다.');
            setRegistrable(false);
        } else {
            setRePwErr('');
            setRegistrable(true);
        }


        if(registrable) {
            auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
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
            submit={submit}
            nameErr={nameErr} 
            emailErr={emailErr} 
            pwErr={pwErr} 
            rePwErr={rePwErr} 
            createUser={createUser}
            navi={props.navigation} />
}
