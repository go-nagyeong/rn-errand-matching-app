import React, {useState, useEffect} from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; // Migration from 2.x.x to 3.x.x => showImagePicker API is removed.

import MypageScreen from '../screens/MypageScreen'

export default MypageAction = (props) => {
    console.log('설정 액션 화면입니다')
    let email = auth().currentUser.email
    const [nickname, setNickname] = useState(null)
    const [url, setUrl] = useState(null)


    const nicknameReg  =  /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/
    const options = {
        title: 'Select Avatar',
        storageOptions: {
        skipBackup: true,
        },
    };

    const withdrawal = () => {
      const users = firestore().collection('Users').doc(email);
      // firestore에서 삭제
      users.delete()
      .then(() => {
        console.log('계정 삭제 완료')
      })
      .catch((err) => {
        console.log('error :', err)
      })
      // authentification에서 삭제
      var user = auth().currentUser;
      console.log('탈퇴')
      user.delete()
      .then(() => {
        console.log('계정이 삭제되었어요')
      })
      .catch((error) => {
        console.log('error : ', error)
      })
    }
    // nickname 변수를 ReNameScreen에 전달해서 수정할 순 없을까? (그렇다면 refresh 없이도 자동 업데이트 가능)
    // 사용 x
    const updateNickname = () => {
      setNickname(auth().currentUser.displayName)
      console.log('닉네임 수정 완료', nickname)
    }
    
    const downloadImg = () => {
      // firebase에서 이미지 다운로드
      // useEffect(() => {
        // useEffect로 묶지 않으면 storage()부분을 2번 실행 (리소스 낭비)
        // useEffect()로 묶는 다면 한번만 실행되지만 에러 발생 (Invalid hook call)
        storage()
        .ref('Users/' + email) //name in storage in firebase console
        .getDownloadURL()
        .then((url) => {
            console.log('이미지를 다운로드 하였습니다')
            setUrl(url)
        })
        .catch((e) => console.log('Errors while downloading => ', e));
      // })
    }

    const importFromCamera = () => {
        launchCamera(options, (response) => { // Use launchImageLibrary to open image gallery
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = response['assets'][0]['uri'];
          
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          
              // console.log(source)
              const filename = source.substring(source.lastIndexOf('/') + 1);
              const uploadUri = Platform.OS === 'ios' ? source.replace('file://', '') : source;
          
              const task = storage()
                .ref('Users/'+ auth().currentUser.email) // storage에 저장될 경로
                .putFile(uploadUri); // 보낼 이미지의 경로
              // set progress state
              task.on('state_changed', taskSnapshot => {
                console.log(taskSnapshot.state);
              });
              task.then(() => {
                console.log('이미지 업로드 완료');
                // firebase에서 이미지 다운로드
                downloadImg()
              })
              .catch((error) => {
                console.error(error.message);
              });
              
            }
        });
        
    }

    const importFromAlbum = () => {
        launchImageLibrary(options, (response) => {
            if (response["didCancel"] !== true) { // 뒤로가기 시 에러 처리
                const source = response['assets'][0]['uri']; 
                const filename = source.substring(source.lastIndexOf('/') + 1);
                const uploadUri = Platform.OS === 'ios' ? source.replace('file://', '') : source;

                const task = storage()
                    .ref('Users/'+ auth().currentUser.email) // storage에 저장될 경로
                    .putFile(uploadUri); // 보낼 이미지의 경로
                // set progress state
                task.on('state_changed', taskSnapshot => {
                    console.log(taskSnapshot.state);
                });
                task.then(() => {
                    console.log('Task complete');
                    // firebase에서 이미지 다운로드
                    downloadImg()
                })
                .catch((error) => {
                    console.error(error.message);
                });
            }
        })
    }
    
    return <MypageScreen 
                email={email} 
                nickname={nickname} 
                navi={props.navigation}
                url = {url}
                importFromAlbum = {importFromAlbum}
                importFromCamera = {importFromCamera}
                updateNickname = {updateNickname}
                downloadImg = {downloadImg}
                withdrawal = {withdrawal}
                signOut = {signOut}

            /> //{...contactData} {...props} 
}