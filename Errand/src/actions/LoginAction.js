import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

import LoginScreen from '../screens/Mypage/LoginScreen';

export default LoginAction = (props) => {
    const [isLoading, setLoading] = useState(false);

    const [err, setErr] = useState('');

    const signIn = (email, password) => {
        var emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        
        if(!email) {
            setErr('아이디(이메일)를 입력해주세요.');
            return false;
        } else if(!password) {
            setErr('비밀번호를 입력해주세요.');
            return false;
        } else {
            setLoading(true)

            let id = email;
            if(!emailReg.test(email)) {
                id = email + "@student.anu.ac.kr";
            }
            auth()
            .signInWithEmailAndPassword(id, password)
            .then(() => {
                setLoading(false)

                var user = auth().currentUser;
                if (user) {
                    if(user.emailVerified) {
                        setErr('');
                    } else {
                        auth().signOut()

                        Alert.alert(
                            "로그인 불가능",
                            "이메일 인증을 완료해야 서비스 이용이 가능합니다.",
                            [{
                                text: "확인",
                                style: "cancel",
                            }],
                        );
                    }
                }
            })
            .catch(error => {
                setLoading(false)
                
                if (error.code === 'auth/user-not-found') {
                    setErr('존재하지 않는 계정입니다.');
                }
                if (error.code === 'auth/wrong-password') {
                    setErr('잘못된 비밀번호입니다.');
                }
            });
        }
    }
    
    return <LoginScreen 
                err={err}
                signIn={signIn} 
                navi={props.navigation} 
                isLoading={isLoading}
            />
}
