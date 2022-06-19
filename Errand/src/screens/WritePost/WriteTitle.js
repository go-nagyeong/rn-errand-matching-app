import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';
import Container from '../../components/Container';
import SpeechBalloon from '../../components/SpeechBalloon';
import MiniSubmitButton from '../../components/MiniSubmitButton';
import Loader from '../../components/Loader';
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';

export default WriteTitle = (props) => {
  const navigation = useNavigation()

  const [isLoading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [titleFocus, setTitleFocus] = useState(false);
  const [content, setContent] = useState("");
  const [contentFocus, setContentFocus] = useState("");

  const { color, category, price, arrive, destination } = props.route.params;

  const [titleMessage, setTitleMessage] = useState("");
  const [contentMessage, setContentMessage] = useState("");

  const [docID, setDocID] = useState(0)

  //
  // const localImgs = []
  let postsDocId = docID.toString() + "%" + Firebase.currentUser.email;
  const [localImgs, setLocalImgs] = useState([])
  const [serverImgs, setServerImgs] = useState([])
  const [selectedImgsLen, setSelectedImgsLen] = useState(-999)

  useEffect(() => {
    // Storage에서 다운로드 한 이미지를 모두 serverImgs에 저장완료했을 때 실행
    if (serverImgs.length == selectedImgsLen) {
      addPostData2(postsDocId, serverImgs)
    }
  }, [serverImgs])

  useEffect(() => {
    const unsubscribe = Firebase.postsRef
      .doc('doc_id')
      .onSnapshot(doc => {
        setDocID(doc.data()['incrementID'])
      })

    return unsubscribe
  }, []);

  useEffect(() => {
    if (title.length >= 2) {
      setTitleMessage('')
    }
  }, [title]);

  useEffect(() => {
    if (content.length >= 2) {
      setContentMessage('')
    }
  }, [content]);

  const selectImage = () => {
    const options = {
      mediaType: "photo",
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      selectionLimit: 3,
    };

    launchImageLibrary(options, response => {
      if (response["didCancel"]) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        response['assets'].forEach((item, index) => {
          // localImgs.push(Platform.OS === 'ios' ? item['uri'].replace('file://', '') : item['uri'])
          url = Platform.OS === 'ios' ? item['uri'].replace('file://', '') : item['uri']
          setLocalImgs(localImgs => [...localImgs, url])
        })
      }
    });
  };

  const addPostData = () => {
    if (title.length >= 2) {
      if (content.length >= 2) {
        setLoading(true)

        if (localImgs != 0) {
          setSelectedImgsLen(localImgs.length) // 선택한 이미지 개수 저장
          localImgs.forEach((value, index) => {
            let storageId = Math.random().toString(36).substring(7);

            const task = storage().ref(`Posts/${postsDocId}/` + storageId).putFile(value)
            task.then(() => {
              console.log('Img downloaded from Storage')
              storage()
                .ref(`Posts/${postsDocId}/` + storageId)
                .getDownloadURL()
                .then((url) => {
                  // Post에 저장할 serverImgs 변수에 url 추가
                  setServerImgs(serverImgs => [...serverImgs, url])
                })
                .catch((e) => console.log('게시물 사진 다운로드 실패 => ', e));
            })
          })
        } else {
          addPostData2(postsDocId, "")
        }
      } else {
        setContentMessage("내용을 최소 두 글자 이상 작성해 주세요.")
      }
    } else {
      setTitleMessage("제목을 최소 두 글자 이상 작성해 주세요.")
    }
  }
  const addPostData2 = (postsDocId, url) => {
    console.log("게시글을 작성합니다")
    Firebase.postsRef
      .doc(postsDocId)
      .set({
        id: docID,
        category: category,
        price: price,
        title: title,
        content: content,
        date: new Date(Date.parse(new Date())),
        writerEmail: Firebase.currentUser.email,
        erranderEmail: "",
        views: 0,
        hearts: 0,
        image: url,
        arrive: arrive,
        destination: destination,
        process: {
          title: 'regist',          // regist > request > matching > finishRequest > finished
          myErrandOrder: 4,         // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
          myPerformErrandOrder: 4,  // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
        },
        reported: firestore.FieldValue.arrayUnion() // 게시글에 대한 신고 항목(배열) (신고한 사람 목록)
      })
      .then(() => {
        const increment = firestore.FieldValue.increment(1);
        Firebase.postsRef.doc('doc_id').update({ incrementID: increment });

        setLoading(false)
        props.navigation.navigate("Home")
      })
      .catch(error => {
        setLoading(false)
        console.error(error);
      })
  }


  return (
    <>
      <Container>
        <View style={styles.previousState}>
          <SpeechBalloon prev='category' content={category} />
          <SpeechBalloon prev='price' content={price} />
          {(destination !== "" && arrive !== "") && <SpeechBalloon prev='location' content={[destination, arrive]} />
            || destination !== "" && <SpeechBalloon prev='destination' content={destination} />
            || arrive !== "" && <SpeechBalloon prev='arrive' content={arrive} />
          }
        </View>

        <View style={styles.centerView}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>심부름 제목/내용</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Icon name='right' size={20} color={titleFocus ? color : 'black'} />

            <TextInput
              style={[styles.input, titleFocus && { fontWeight: '600' }]}
              placeholder="제목 입력"
              value={title}
              autoCapitalize='none'
              autoCorrect={false}
              autoFocus={true}
              blurOnSubmit={true}
              onSubmitEditing={() => this.secondTextInput.focus()}
              returnKeyType="next"
              onFocus={() => setTitleFocus(true)}
              onBlur={() => setTitleFocus(false)}
              onChangeText={text => setTitle(text)}
              maxLength={30}
            />
          </View>
          <Text style={styles.message}>{titleMessage}</Text>

          <View style={[styles.inputWrapper, { marginHorizontal: 0 }]}>
            <Icon name='right' size={20} color={contentFocus ? color : 'black'} />

            <TextInput
              style={[styles.input2, contentFocus && { fontWeight: '600' }]}
              placeholder="내용 입력"
              value={content}
              autoCapitalize='none'
              autoCorrect={false}
              ref={(input) => this.secondTextInput = input}
              onFocus={() => setContentFocus(true)}
              onBlur={() => setContentFocus(false)}
              onChangeText={text => setContent(text)}
              maxLength={1000}
              multiline={true}
            />
          </View>
          {contentMessage !== "" && <Text style={[styles.message, { marginLeft: 10, marginBottom: 10 }]}>{contentMessage}</Text>}

          <TouchableOpacity style={[styles.imageUploadButton, { borderColor: localImgs != 0 ? color : 'gray' }]} onPress={() => localImgs != 0 ? setLocalImgs([]) : selectImage()}>
            <Icon name='camera' size={20} color={localImgs != 0 ? color : 'gray'} style={{ marginLeft: 2, marginRight: 1 }} />
            <Icon name={localImgs != 0 ? 'check' : 'close'} size={16} color={localImgs != 0 ? color : 'gray'} />
          </TouchableOpacity>

          <MiniSubmitButton backgroundColor={color} onPress={() => addPostData()} />
        </View>
      </Container>

      <Loader isLoading={isLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  previousState: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 20,
  },

  centerView: {
    flex: 1,
    paddingHorizontal: 30,
  },
  titleWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontWeight: '600',
    color: Colors.black,
    fontSize: 24,
    padding: 10,
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 20 : 10,
    marginBottom: 15,

    backgroundColor: Colors.white,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 6, height: 3 },
      },
      android: {
        elevation: 3,
      },
    })
  },
  input: {
    width: '85%',
    fontSize: 16,
    marginHorizontal: 10,
  },
  input2: {
    width: '85%',
    height: 150,
    fontSize: 16,
    marginHorizontal: 10,
    maxHeight: 150,
  },
  message: {
    fontSize: 14,
    marginLeft: 30,
    marginBottom: 20,
    color: Colors.red,
  },

  imageUploadButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
    marginRight: 3,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
