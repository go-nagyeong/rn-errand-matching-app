import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

import * as Firebase from '../utils/Firebase';
import EditProfileScreen from '../screens/Mypage/EditProfileScreen';

export default EditProfileAction = (props) => {
  const [err, setErr] = useState('');

  const reauthenticate = (password) => {
    if (!password) {
      setErr('비밀번호를 입력해주세요.');
      return false;
    } else {
      setErr('');
      const userEmail = Firebase.currentUser.email;
      const credential = auth.EmailAuthProvider.credential(userEmail, password);
  
      Firebase.currentUser
        .reauthenticateWithCredential(credential)
        .then(() => props.navigation.navigate('ResetPw', {withdrawal: withdrawal}))
        .catch(error => {
          if (error.code === 'auth/wrong-password') {
            setErr('잘못된 비밀번호 입니다.')
          } else if (error.code === 'auth/too-many-requests') {
            setErr('인증을 여러 번 실패하여 계정이 일시적으로 비활성화 되었습니다. 잠시 후에 다시 시도해주세요.')
          }
        });
    }
  }

  const withdrawal = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말 탈퇴 하시겠습니까?",
      [{
        text: "취소",
        style: "cancel",
      },
      {
        text: "탈퇴",
        onPress: () => {
          Firebase.currentUser
            .delete()
            .then(() => {
              const userEmail = Firebase.currentUser.email;
              const userInfo = Firebase.usersRef.doc(userEmail);
              userInfo
                .delete()
                .then(() => console.log('계정 정보 삭제 완료'))
                .catch((err) => console.log(err));
            })
            .catch((error) => console.log(error))
        },
        style: "destructive",
      }],
    );
  }
  
  return <EditProfileScreen 
          err={err}
          reauthenticate={reauthenticate}
        />
}
