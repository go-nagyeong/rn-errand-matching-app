import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

import * as Firebase from '../utils/Firebase';
import EditProfileScreen from '../screens/Mypage/EditProfileScreen';

export default EditProfileAction = (props) => {
  const currentUser = Firebase.currentUser != null ? Firebase.currentUser : auth().currentUser

  const [err, setErr] = useState('');

  const reauthenticate = (password) => {
    if (!password) {
      setErr('비밀번호를 입력해주세요.');
      return false;
    } else {
      setErr('');
      const credential = auth.EmailAuthProvider.credential(currentUser.email, password);
  
      currentUser
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
          Firebase.postsRef
            .where('process.title', 'not-in', ['regist', 'finished'])
            .get()
            .then(querySnapshot => {
              let isAbleToWithdraw = true

              querySnapshot.forEach(doc => {
                const writerEmail = doc.data().writerEmail
                const erranderEmail = doc.data().erranderEmail
  
                if (writerEmail == currentUser.email || erranderEmail == currentUser.email) {
                  isAbleToWithdraw = false
                  return false
                }
              })

              if (isAbleToWithdraw) {
                delete_user_posts(currentUser.email)
                delete_user_hearts(currentUser.email)
                erase_user_email(currentUser.email)
                delete_user(currentUser.email)
              } else {
                Alert.alert(
                  "회원탈퇴 불가능",
                  "요청 또는 진행 중인 심부름이 있을 경우, 회원탈퇴가 불가능합니다.",
                  [{
                      text: "확인",
                      onPress: () => props.navigation.navigate('Mypage'),
                      style: "cancel",
                  }],
                )
              }
            })
          
        },
        style: "destructive",
      }],
    );
  }

  const delete_user_posts = (email) => {
    Firebase.postsRef
      .where('writerEmail', '==', email)
      .where('process.title', '!=', 'finished')
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(doc => {
              doc.ref.delete()
          })
      })
      .catch(err => console.log(err));
  }

  const delete_user_hearts = (email) => {
    Firebase.heartsRef
      .where('who', '==', email)
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(doc => {
              doc.ref.delete()
          })
      })
      .catch(err => console.log(err));
  }

  const erase_user_email = (email) => {
    const finishedPost = Firebase.postsRef.where('process.title', '==', 'finished')

    finishedPost
      .where('writerEmail', '==', email)
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(doc => {
              doc.ref.update({writerEmail: ''})
          })
      })
      .catch(err => console.log(err))
    finishedPost
      .where('erranderEmail', '==', email)
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(doc => {
              doc.ref.update({erranderEmail: ''})
          })
      })
      .catch(err => console.log(err))

    Firebase.chatsRef
      .where('user._id', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({user: {_id: ''}})
        })
      })
      .catch(err => console.log(err))
    Firebase.chatsRef
      .where('opponent._id', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update({opponent: {_id: ''}})
        })
      })
      .catch(err => console.log(err))
  }
  
  const delete_user = (email) => {
    Firebase.usersRef
      .doc(currentUser.email)
      .delete()
      .then(() => {
        currentUser
          .delete()
          .then(() => props.navigation.reset({routes: [{name: 'Login'}]}))
          .catch((error) => console.log(error))
      })
      .catch((err) => console.log(err));
  }
  
  return <EditProfileScreen 
          err={err}
          reauthenticate={reauthenticate}
        />
}
