import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Migration from 2.x.x to 3.x.x => showImagePicker API is removed.

import * as Firebase from '../utils/Firebase';
import MypageScreen from '../screens/Mypage/MypageScreen'

export default MypageAction = (props) => {
  const currentUser = Firebase.currentUser != null ? Firebase.currentUser : auth().currentUser
  const [nickname, setNickname] = useState(null)

  const [score, setScore] = useState(null)
  const [scorePosition, setScorePosition] = useState(null)
  const [grade, setGrade] = useState(null)
  const [nextGrade, setNextGrade] = useState(null)

  const [userImage, setUserImage] = useState(null)

  // 해당 화면에 focus가 있을 때 수행하는 작업
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      updateUserInfo();
      updateUserImage();
    });

    return unsubscribe;
  }, [props.navigation]);


  const calculateGrade = (gradeNum) => {
    let nonDecimal = gradeNum * 100;
    
    if (gradeNum >= 4.1) {
        return [nonDecimal-410, 'A+', null];
    } else if (gradeNum >= 3.6) {
        return [nonDecimal-360, 'A0', 'A+'];
    } else if (gradeNum >= 3.1) {
        return [nonDecimal-310, 'B+', 'A0'];
    } else if (gradeNum >= 2.6) {
        return [nonDecimal-260, 'B0', 'B+'];
    } else if (gradeNum >= 2.1) {
        return [nonDecimal-210, 'C+', 'B0'];
    } else if (gradeNum >= 1.6) {
        return [nonDecimal-160, 'C0', 'C+'];
    } else if (gradeNum >= 1.1) {
        return [nonDecimal-110, 'D+', 'C0'];
    } else if (gradeNum >= 0.6) {
        return [nonDecimal-60, 'D0', 'D+'];
    } else {
        return [nonDecimal, 'F', 'D0'];
    }
  }

  const updateUserInfo = () => {
    Firebase.usersRef
    .doc(currentUser.email)
    .get()
    .then(doc => {
      if (doc.exists) {
        let nickname = doc.data().nickname;
        let gradeNum = doc.data().grade;
        setNickname(nickname)
        setScore(gradeNum)
        setScorePosition(calculateGrade(gradeNum)[0])
        setGrade(calculateGrade(gradeNum)[1])
        setNextGrade(calculateGrade(gradeNum)[2])
      }
    })
  }
  const updateUserImage = () => {
    storage()
      .ref('Users/' + currentUser.email) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        Firebase.usersRef.doc(currentUser.email).update({ image: url });
        setUserImage(url)
      })
      .catch((e) => console.log('Errors while downloading => ', e));
  }


  const options = {
    mediaType: "photo",
    maxWidth: 100,
    maxHeight: 100,
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
    },
  };

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
          .ref('Users/' + currentUser.email) // storage에 저장될 경로
          .putFile(uploadUri); // 보낼 이미지의 경로
        // set progress state
        task.on('state_changed', taskSnapshot => {
          if (taskSnapshot.state === 'success') {
            updateUserImage()
          }
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
          .ref('Users/' + currentUser.email) // storage에 저장될 경로
          .putFile(uploadUri); // 보낼 이미지의 경로
        // set progress state
        task.on('state_changed', taskSnapshot => {
          if (taskSnapshot.state === 'success') {
            updateUserImage()
          }
        });
      }
    })
  }

  const signOut = () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?",
      [{
        text: "로그아웃",
        onPress: () => auth().signOut(),
        style: "default",
      },
      {
        text: "취소",
        style: "default",
      }],
    );
  }
  
  return <MypageScreen
    email={currentUser.email}
    nickname={nickname}
    score={score}
    scorePosition={scorePosition}
    grade={grade}
    nextGrade={nextGrade}
    userImage={userImage}

    navi={props.navigation}
    importFromAlbum={importFromAlbum}
    importFromCamera={importFromCamera}
    signOut={signOut}

  />
}