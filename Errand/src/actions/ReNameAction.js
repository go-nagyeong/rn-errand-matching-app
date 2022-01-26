import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ReNameScreen from '../screens/ReNameScreen';

const users = firestore().collection('Users');

export default ReNameAction = (props) => {
    const [err, setErr] = useState('');
    const nicknameReg  =  /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/
    
    const changeName = (nickname) => {
        // auth().onAuthStateChanged((user) => {doc = user.email});
        // 로그인 되어있다는 전제에서 동작가능! 
        users
        .where('nickname', '==', nickname)
        .get()
        .then(querySnapshot => {
            if(querySnapshot.size >= 1) { // 중복 검사
                console.log('값이 이미 존재합니다');
            } else { // 유효성 검사
                if(!nickname) {
                    console.log('이름을 입력해주세요.');
                }
                else if(!nicknameReg.test(nickname)){
                    console.log('글자 수 (2~20자 이내)');
                }else {
                    // firestore에 존재하는 nickname 변경
                    firestore()
                        .collection('Users')
                        .doc(auth().currentUser.email)
                        .update({
                            'nickname': nickname,
                        })
                        .then(() => {
                            console.log('이름 변경완료');
                        })
                        .catch(err => {console.log(err)})
                    
                    // auth에 존재하는 nickname 변경
                    auth()
                    .currentUser
                    .updateProfile({
                        displayName: nickname
                    })
                    .then(() => {
                        console.log('success')
                        Alert.alert(
                            "이름 변경",
                            "이름 변경이 완료되었습니다.",
                            [{
                                text: "확인",
                                onPress: () => props.navigation.navigate('Mypage'),
                                style: "cancel",
                            }],
                        );
                    })
                }
            }
        })
        
    }

    return <ReNameScreen
        // navi = {props.navigation} 
        err = {err}
        changeName = {changeName}
        />
}

/*
이미지, 
프로필 이미지 변경기능 + 등급 추가
진행중인 심부름
비밀번호 변경
로그아웃 기능
등급(신뢰도)
currentuser.displayname

심부름 진행중 상태, 완료되면 제거
프로필 전체를 클릭하면 (버튼으로 작동해서) 이름, 이미지 수정


게시글 내용
- 지도

board 컬렉션
- 작성 날짜, 제목, 내용, 카테고리, 사진, 지도, 마감 날짜, 금액, 이름, 

채팅으로 대화
채팅 끝나고 평점 매기기

비대면 하는 쪽으로, 최대한 

검색 - 제목, 내용 한번에 검색되게끔


깨달은 것
앞으로 배운 것은 무조건 글로 재생산 할 것이다.
깃허브 커밋은 꼭 작성하자마자 하자

게시글 작성 시간 업로드
firestore()
            .collection('Users')
            .doc('ABC')
            // .set({
            //     name: 'Ada Lovelace',
            //     age: 70,
            // })
            .update({
                'age': 10,
                createdAt: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                console.log('User added!');
            });

데이터 삭제 (게시글 삭제, 계정 삭제에 활용가능)
firestore()
  .collection('Users')
  .doc('ABC')
  .delete()
  .then(() => {
    console.log('User deleted!');
  });

  // 로그인된 userid
        // add
        // firestore()
        //     .collection('Users')
        //     // Filter results
        //     .add({
        //         name: 'Ada Lovelace',
        //         age: 30,    
        //     })
        //     .then(() => {
        //         console.log('User added!');
        //     });
        // 이름 변경
        // firestore()
        //     .collection('Users')
        //     .doc('ABC')
        //     // .set({
        //     //     name: 'Ada Lovelace',
        //     //     age: 70,
        //     // })
        //     .update({
        //         'age': 10,
        //     })
        //     .then(() => {
        //         console.log('User added!');
        //     });
*/