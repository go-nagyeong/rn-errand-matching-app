import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

import LoginScreen from '../screens/LoginScreen';

export default LoginAction = (props) => {
    const [err, setErr] = useState('');

    const signIn = (email, password) => {
        var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        
        if(!email) {
            setErr('이메일을 입력해주세요.');
            return false;
        } else if(!emailReg.test(email)) {
            setErr('이메일 형식을 올바르게 입력해주세요.');
            return false;
        } else if(!password) {
            setErr('비밀번호를 입력해주세요.');
            return false;
        } else {
            auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                var user = auth().currentUser;
                if (user) {
                    if(user.emailVerified) {
                        setErr('');
                        props.navigation.navigate('Tab');
                    } else {
                        auth().signOut();
                        setErr('이메일 인증을 진행해주세요.');
                    }
                }
            })
            .catch(error => {
                if (error.code === 'auth/user-not-found') {
                    setErr('존재하지 않는 계정입니다.');
                }
                if (error.code === 'auth/wrong-password') {
                    setErr('잘못된 비밀번호입니다.');
                }
            });
        }
    }
    
    return <LoginScreen err={err} signIn={signIn} navi={props.navigation} />
}
