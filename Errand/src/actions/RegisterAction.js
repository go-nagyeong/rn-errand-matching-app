import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

import RegisterScreen from '../screens/RegisterScreen';

export default RegisterAction = (props) => {
    const [submit, setSubmit] = useState(false)

    const [nameErr, setNameErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [pwErr, setPwErr] = useState("")
    const [rePwErr, setRePwErr] = useState("")

    const createUser = (nickname, email, password, confirmPassword, phoneNum) => {
        var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        var pwReg = /^.*(?=^.{6,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        setSubmit(true)
        
        if(!nickname) {
            setNameErr('이름을 입력해주세요.');
        } else {
            setNameErr('');
        }

        if(!email) {
            setEmailErr('이메일를 입력해주세요.');
        } else if (!emailReg.test(email)) {
            setEmailErr('이메일 형식을 올바르게 입력해주세요.');
        } else {
            setEmailErr('');
        }

        if(!password) {
            setPwErr('비밀번호를 입력해주세요.');
        } else if (!pwReg.test(password)) {
            setPwErr('영문, 숫자, 특수문자를 모두 포함 (6~16자 이내)');
        } else {
            setPwErr('');
        }

        if(!confirmPassword) {
            setRePwErr('비밀번호 재확인을 입력해주세요.');
        } else if(confirmPassword !== password) {
            setRePwErr('비밀번호가 일치하지 않습니다.');
        } else {
            setRePwErr('');
        }


        if(!nameErr && !emailErr && !pwErr && !rePwErr) {
            auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                userCredential.user?.sendEmailVerification();
                auth().signOut();
                console.log("Email sent");
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
