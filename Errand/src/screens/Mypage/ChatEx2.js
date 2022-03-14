import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
// import AsyncStorage from '@react-native-community/async-storage'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import storage from '@react-native-firebase/storage';
import { Avatar } from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; // Migration from 2.x.x to 3.x.x => showImagePicker API is removed.
import ImageModal from './ImageModal'
import ImageResizer from 'react-native-image-resizer';



// YellowBox.ignoreWarnings(['Setting a timer for a long period of time'])

const db = firestore()
const chatsRef = db.collection('Chats')

export default function Chat(props) {
  // const postId = 11;
  const postId = props.route.params.id; // 게시글 ID
  const [messages, setMessages] = useState([])
  const [url, setUrl] = useState("");
  const [imgSelectVisible, setImgSelectVisible] = useState(false);

  const userInfo = {
    _id: auth().currentUser.email, // email
    name: auth().currentUser.displayName, // nickname
    avatar: url, // profileImg 'https://placeimg.com/140/140/anydss'
  }

  const options = { 
    mediaType: "photo",
    // maxWidth: 100,
    // maxHeight: 100,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };



  // 채팅 메시지 update
  useEffect(() => {
    const unsubscribe = chatsRef.where('post', '==', postId).onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot
            .docChanges()
            .filter(({ type }) => type === 'added')
            .map(({ doc }) => {
                const message = doc.data()
                return { ...message, createdAt: message.createdAt.toDate() }
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        appendMessages(messagesFirestore)
    })
    return () => unsubscribe()
  }, [])

  // download profile img
  useEffect(() => {
    storage()
        .ref('Users/' + auth().currentUser.email) //name in storage in firebase console
        .getDownloadURL()
        .then((url) => {
            console.log('프로필 이미지를 다운로드 하였습니다')
            setUrl(url)
        })
        .catch((e) => console.log('Errors while downloading => ', e));
  }, [])
  
  const appendMessages = useCallback(
      (messages) => {
          setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
      }, [messages]
  )

  async function handleSend(messages) {
      const { _id, createdAt, text, user, } = messages[0];
      chatsRef
      .add({
        post: postId, // 수정
        _id: _id,
        createdAt: createdAt,
        text: text,
        user: user,
      })
      .then(() => {
        console.log('메시지 전송 완료');
      })
  }

  // download img url from storage & add img post in firestore/Chats
  const downloadImg = (randomId) => {
    setImgSelectVisible(false); // BottomSheet 닫기

    storage()
    .ref(`Chats/${postId}/`+ randomId)
    .getDownloadURL()
    .then((url) => {
      console.log('storage에서 이미지를 가져왔습니다')
      setUrl(url)
      // firestore Chats에 이미지 게시글 생성
      firestore()
      .collection('Chats')
      .add({
        post: postId, 
        _id: randomId, 
        createdAt: new Date(),
        text: '',
        user: userInfo,
        image: url,
      })
      .then(() => {console.log('채팅방(firestore)에 이미지를 저장했습니다')})
      .catch((e) => {console.log('채팅방(firestore)에 이미지를 저장하지 못하였습니다', e)})
    })
    .catch((e) => console.log('Errors while downloading => ', e));
  }

  const resizeImg = (source, width, height) => {
    console.log(source)

    const resizeOptions = {
      newWidth: width * 0.10,
      newHeight: height * 0.10,
      compressFormat: 'PNG',
      quality: 100,
      rotation: 0,
      outputPath: null,
    }

    ImageResizer.createResizedImage(
      source,
      resizeOptions.newWidth,
      resizeOptions.newHeight,
      resizeOptions.compressFormat,
      resizeOptions.quality,
      resizeOptions.rotation,
      resizeOptions.outputPath
    )
      .then((response) => {
        //resized image uri
        let uri = response.uri;
        //generating image name
        let imageName = '';
        let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        console.log(uploadUri)

        // 이미지 이름
        const randomId = Math.random().toString(36).substring(7)
        console.log('img Id is', randomId);
        // storage에 이미지 저장
        const task = storage()
          .ref(`Chats/${postId}/`+ randomId)
          .putFile(uploadUri);
        
        task.on('state_changed', taskSnapshot => {
          console.log(taskSnapshot.state);
        });
        task.then(() => {
          console.log('이미지 storage에 업로드 완료');
          // firebase에서 이미지 다운로드
          downloadImg(randomId)
        })
        .catch((error) => {
          console.error(error.message);
        });
      })
      .catch((err) => {
        console.log('image resizing error => ', err);
      });
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
            resizeImg(source, response.assets[0].width, response.assets[0].height);
          }
      });
    }

    const importFromAlbum = () => {
      launchImageLibrary(options, (response) => {
          if (response["didCancel"] !== true) { // 뒤로가기 시 에러 처리
              const source = response['assets'][0]['uri']; 
              resizeImg(source, response.assets[0].width, response.assets[0].height);  
          }
      })
    }

    return (
      <>
        <GiftedChat 
          messages={messages} 
          user={userInfo} 
          onSend={handleSend} 
          renderActions={() => { return (
            <View style={{ height: '100%', justifyContent: 'center', left: 5 }}>
              <TouchableOpacity 
                onPress={() => {setImgSelectVisible(true);}}>
                <Avatar
                  size={35}
                  rounded
                  icon={{ name: 'plus', type: 'antdesign' }}
                  containerStyle={{ backgroundColor: '#ff7f00',}}
                />
              </TouchableOpacity>
            </View>
          )}}
        />
        <ImageModal visible={imgSelectVisible} setVisible={setImgSelectVisible} importFromCamera={importFromCamera} importFromAlbum={importFromAlbum}/>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderColor: 'gray',
    },
})