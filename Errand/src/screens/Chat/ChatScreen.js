import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import storage from '@react-native-firebase/storage';
import { GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';
import InfoBanner from './InfoBanner';
import RenderMessage from './RenderMessage';
import ChatSettingSheet from './ChatSettingSheet';

export default function ChatScreen(props) {
  const actionSheet = useRef(null)  // 헤더 오른쪽 버튼

  // 심부름 정보 배너 
  const [bannerVisible, setBannerVisible] = useState(true)
  const [bannerAlwaysVisible, setBannerAlwaysVisible] = useState(false)

  useEffect(() => {
      const getBannerAlwaysOption = async () => {
          try {
              const value = await AsyncStorage.getItem(postId)
              if (value !== null) {
                  setBannerAlwaysVisible(JSON.parse(value))
              }
          } catch(e) {
              console.log(e)
          }
      }
      getBannerAlwaysOption()
  }, [])
  const setBannerAlwaysOption = async (bool) => {
      try {
        await AsyncStorage.setItem(postId, JSON.stringify(bool))
      } catch (e) {
        console.log(e)
      }
  }

  // 채팅
  const { id, writerEmail, erranderEmail, errandInfo } = props.route.params;
  const postId = id + '%' + writerEmail;
  const opponentEmail = Firebase.currentUser.email == writerEmail ? erranderEmail : writerEmail;
  
  const [userImageUrl, setUserImageUrl] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [opponentImage, setOpponentImage] = useState("");

  const [messages, setMessages] = useState([])
  const [badges, setBadges] = useState();
  
  const userInfo = {
    _id: Firebase.currentUser.email, // email
    name: Firebase.currentUser.displayName, // nickname
    avatar: userImageUrl, // profileImg
  }
  const opponentInfo = {
    _id: opponentEmail,
    name: opponentName,
    avatar: opponentImage,
  }
  
  // 사용자 프로필 사진, 상대방 닉네임과 프로필 사진 불러오기
  useEffect(() => {
    Firebase.usersRef
      .doc(Firebase.currentUser.email)
      .get()
      .then(doc => {
        if (doc.exists) {
          setUserImageUrl(doc.data().image)
        }
      })

    Firebase.usersRef
      .doc(opponentEmail)
      .get()
      .then(doc => {
        if (doc.exists) {
          setOpponentName(doc.data().nickname)
          setOpponentImage(doc.data().image)
        }
      })
  }, [])


  // ------------------------- 메세지 가져오기 -------------------------
  // 메세지 실시간 불러오기 (1)
  useEffect(() => {
    const unsubscribe = Firebase.chatsRef
      .where('post', '==', postId)
      .onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot
          .docChanges()
          .filter(({ type }) => type === 'added')
          .map(({ doc }) => {
            const message = doc.data();

            if (message.opponent._id == Firebase.currentUser.email) {
              Firebase.chatsRef
                .doc(message._id)
                .update({
                  'unread': 1,
                })
                .then(() => console.log('메시지를 성공적으로 읽었습니다!'))
            }
    
            return { ...message, createdAt: message.createdAt.toDate() }
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        appendMessages(messagesFirestore)
      })
    
    return unsubscribe;
  }, [])

  // 메세지 실시간 불러오기 (2)
  const appendMessages = useCallback(
      (messages) => {
          setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
      }, [messages]
  )


  // ------------------------- 메세지 보내기 -------------------------
  // 보낸 메세지 저장
  function handleSend(messages) {
    const { _id, createdAt, text, user, } = messages[0];
    Firebase.chatsRef
      .doc(_id)
      .set({
        post: postId, // 수정
        _id: _id,
        createdAt: createdAt,
        text: text,
        user: user,
        opponent: opponentInfo,
        unread: 0,
      })
      .then(() => console.log('메시지 전송 완료'))
  }

  // 보낸 사진 저장 (1 - 보낼 사진 선택 옵션)
  const options = { 
    mediaType: "photo",
    maxWidth: 400,
    maxHeight: 400,
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };
  const importFromCamera = () => {
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response['assets'][0]['uri'];
        const imageUrl = Platform.OS === 'ios' ? source.replace('file://', '') : source;
        saveImage(imageUrl);
      }
    });
  }
  const importFromAlbum = () => {
    launchImageLibrary(options, (response) => {
      if (response["didCancel"] !== true) {
        const source = response['assets'][0]['uri'];
        const imageUrl = Platform.OS === 'ios' ? source.replace('file://', '') : source;
        saveImage(imageUrl);
      }
    })
  }

  // 보낸 사진 저장 (2)
  const saveImage = (imageUrl) => {
    const randomImageId = Math.random().toString(36).substring(7)

    const task = storage()
      .ref(`Chats/${postId}/`+ randomImageId)
      // .putFile(uploadUri);
      .putFile(imageUrl);
    task.on('state_changed', taskSnapshot => {
      console.log(taskSnapshot.state);
    });
    task.then(uploadedFile => {
      downloadImg(randomImageId)
    })
    .catch(err => console.log(err))
  }

  // 보낸 사진 저장 (3 - Chat의 도큐먼트에 저장)
  const downloadImg = (randomImageId) => {
    storage()
      .ref(`Chats/${postId}/`+ randomImageId)
      .getDownloadURL()
      .then((url) => {
        // firestore Chats에 이미지 게시글 생성
        Firebase.chatsRef
          .doc(randomImageId)
          .set({
            post: postId, 
            _id: randomImageId, 
            createdAt: new Date(),
            text: "",
            user: userInfo,
            image: url,
            opponent: opponentInfo,
            unread: 0,
          })
          .then(() => console.log('채팅방(firestore)에 이미지를 저장했습니다'))
          .catch((e) => console.log('채팅방(firestore)에 이미지를 저장하지 못하였습니다', e))
      })
      .catch((e) => console.log(e));
  }


  const renderActions = (props) => {
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={{marginRight: 12}} onPress={() => importFromCamera()}>
          <Icon name='camera' size={26} color={Colors.lightGray2} style={{includeFontPadding: false}}  />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => importFromAlbum()}>
          <Icon name='images' size={24} color={Colors.lightGray2} style={{includeFontPadding: false}} />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}>
        <SafeAreaView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity style={styles.headerButton} onPress={() => props.navigation.goBack()}>
            <FIcon name='chevron-left' size={30} color={Colors.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{opponentName}</Text>

          <TouchableOpacity style={styles.headerButton} onPress={() => actionSheet.current.show()}>
            <FIcon name='more-horizontal' size={30} color={Colors.white} />
          </TouchableOpacity>

          <ChatSettingSheet
            actionSheet={actionSheet}
            postId={postId}
            bannerAlwaysVisible={bannerAlwaysVisible}
            setBannerAlwaysOption={setBannerAlwaysOption}
          />
        </SafeAreaView>
      </LinearGradient>

      <InfoBanner
        postId={postId}
        errandInfo={errandInfo}
        bannerVisible={bannerVisible}
        bannerVisibleIsFalse={() => setBannerVisible(false)}
        bannerAlwaysVisible={bannerAlwaysVisible}
        setBannerAlwaysOption={setBannerAlwaysOption}
      />

      <View style={styles.contents}>
        <GiftedChat 
          messages={messages} 
          onSend={handleSend}
          user={userInfo} 
          
          alignTop={true}  // 채팅을 맨 위로 배치
          scrollToBottom={true}  // 채팅 맨 밑으로 바로 내려갈 수 있는 단축 버튼
          minComposerHeight={40}
          minInputToolbarHeight={52}

          renderMessage={(props) => <RenderMessage {...props} />}
          scrollToBottomComponent={() => 
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FIcon name='chevron-down' color={Colors.black} size={26} style={{includeFontPadding: false}} />
            </View>
          }
          renderInputToolbar={(props) => 
            <InputToolbar
              {...props}
              placeholder='메세지 입력'
              primaryStyle={styles.inputToolBar}
              textInputStyle={styles.messageTextInput}
            />
          }
          renderSend={(props) => 
            <Send {...props} containerStyle={styles.messageSendButton}>
              <Icon name='arrow-up-circle' color={Colors.cyan} size={38} style={{includeFontPadding: false}} />
            </Send>
          }
          renderActions={renderActions}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 14,
  },
  headerButton: {
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },

  contents: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inputToolBar: {
    paddingVertical: Platform.OS === 'android' ? 6 : 0,
    paddingLeft: 16,
    paddingRight: 4,
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  messageTextInput: {
    backgroundColor: '#F1F0F0',
    borderRadius: 20,
    fontSize: 16,
    lineHeight: 18,
    paddingLeft: 14,
    paddingRight: 44,
    paddingTop: '3%',
    marginRight: 12,
  },
  messageSendButton: {
    position: 'absolute',
    left: '25%',
    top: '8%',
    justifyContent: 'center',
  },
})