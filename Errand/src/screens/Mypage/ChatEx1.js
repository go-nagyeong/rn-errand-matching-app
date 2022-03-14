import React, {useEffect, useState} from 'react';
import base64 from 'react-native-base64';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";



export default ChatEx1 = () => {
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);

  const db = firestore();
  const chatsRef = db.collection('Chats');

  useEffect(() => {
    getUser();
    const subscribe = chatsRef.onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            let data = change.doc.data();
            try { // doc 초기화 후 try 삭제
              data.createdAt = data.createdAt.toDate();
            } catch (e) {console.log(e)}
            setMessages((prevMessage) => GiftedChat.append(prevMessage, data));
          }
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      })
    return () => {subscribe()};
  }, []);

  // load & set ID of img post (in firestore/Chats)
  useEffect(() => {
    // load id of image post
    firestore()
    .collection('Chats')
    .doc('img_id')
    .get()
    .then((snapshot) => {
      // set id of img post 
      setIncrementId(snapshot.data()['incrementID'])
      console.log('id updated')
    })
    .catch((err) => {console.log(err, 'incrementID를 불러오는데 실패하였습니다')})
  }, [trigger])

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

  async function getUser() {
    setUser({
      _email: auth().currentUser.email,
      _id: auth().currentUser.displayName,
      avatar: "",
    });
  };

  const onSend = (messages) => {
    chatsRef
    .doc(Date.now().toString())
    .set(messages[0])
    .then(() => {console.log('success');})
    .catch(err => console.log('failed', err))
  }

  return (
    <View style={styles.container}>
      <GiftedChat 
        messages={messages} 
        onSend={(messages) => {onSend(messages)}}
        user={user}/>
    </View>
  )



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bakcgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }

})