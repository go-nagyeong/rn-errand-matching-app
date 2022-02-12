import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Avatar } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

import Container from '../../components/Container';

export default ShowDetailPost = (props) => {
  const navigation = useNavigation()

  const { title, content, writerName, writergrade, price, email, id, } = props.route.params;

  const [url, setUrl] = useState(null)

  const [profileUrl, setProfileUrl] = useState(null)

  const [confirmProcess, setConfirmProcess] = useState("")

  const [confirmMyPost, setConfirmMyPost] = useState("")

  const updatePostState = () => {
    if (confirmProcess !== "matching" && confirmProcess == "regist") {
      if (confirmMyPost !== auth().currentUser.email) {
        Alert.alert(
          "심부름 수행 요청",
          "심부름 요청을 수행하셨습니다.\n정말로 진행하시겠습니까?",
          [{
            text: "확인",
            onPress: () => {
              // 프로세스 matching 변경, errander 추가
              firestore()
                .collection('Posts')
                .doc(id.toString())
                .update({
                  'process': "matching",
                  'erranderEmail': auth().currentUser.email,
                })
                .then(() => {
                  Alert.alert(
                    "심부름 수행 요청 완료",
                    "요청이 전송되었습니다.\n심부름을 진행해 주세요!",
                    [{
                      text: "확인",
                      onPress: () => props.navigation.navigate('Home'),
                      style: "cancel",
                    }],
                  );
                })
                .catch(err => { console.log(err) })
            },
            style: "default",
          }, {
            text: "취소",
            onPress: () => { 
              Alert.alert(
                "심부름 수행 요청 취소",
                "요청을 취소 하였습니다.",
                [{
                  text: "확인",
                  style: "cancel",
                }],
              );
            },
            style: "default",
          }
          ],
        );
      }
      else {
        Alert.alert(
          "나의 심부름은 진행할 수 없습니다.",
          "심부름을 진행하기 위해서\n다른 심부름을 진행해 주세요.",
          [{
            text: "확인",
            onPress: () => props.navigation.navigate('Home'),
            style: "cancel",
          }],
        );
      }
    }
    else {
      Alert.alert(
        "심부름 수행 요청 실패",
        "이미 매칭된 심부름 입니다.\n다른 심부름을 이용해 주세요.",
        [{
          text: "확인",
          onPress: () => props.navigation.navigate('Home'),
          style: "cancel",
        }],
      );
    }
  }

  // 프로세스 확인, 나의 게시글인지 확인
  useEffect(() => {
    firestore()
    .collection('Posts')
    .doc(id.toString())
    .onSnapshot(doc => {
      setConfirmProcess(doc.data()['process'])
      setConfirmMyPost(doc.data()['writerEmail'])
    })

    storage()
    .ref('Posts/' + title)
    .getDownloadURL()
    .then((url) => {
      console.log('이미지를 다운로드 하였습니다')
      setUrl(url)
    })
    .catch((e) => console.log('게시물 사진 다운로드 실패 => ', e));

    storage()
    .ref('Users/' + email)
    .getDownloadURL()
    .then((url) => {
      console.log('이미지를 다운로드 하였습니다')
      setProfileUrl(url)
    })
    .catch((e) => console.log('사용자 사진 다운로드 실패 => ', e));
  }, [])

  useEffect(() => {
    console.log('프로세스 진행 여부 :', confirmProcess)
  }, [confirmProcess])
  useEffect(() => {
    console.log('나의 게시글 확인 용도 :', confirmMyPost)
  }, [confirmMyPost])

  return (
    <Container>
      <Image source={{ uri: url }} style={styles.image} />

      <View style={styles.userRow}>
        <View style={styles.userImage}>
          <Avatar
            rounded
            size="large"
            source={{ uri: profileUrl }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 16 }}>{writerName} {writergrade}</Text>
          <Text style={{ color: 'gray', fontSize: 16, }} >
            {email}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{title} {id}</Text>
      <Text style={{ padding: 10, fontSize: 20 }}>{price}원</Text>

      <View style={styles.titleWrapper}>
        <Text style={{ padding: 10, fontSize: 18 }}>{content}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <View style={{ alignItems: "center", justifyContent: "center", }}>

        </View>
      </View>
      
      <View style={styles.titleWrapper}>
        <TouchableOpacity onPress={() => {
          updatePostState()
        }} >

          <Text> 심부름 수행하기 </Text>
        </TouchableOpacity>
      </View>
    </Container >
  );
};

const styles = StyleSheet.create({
  titleMargin: {
    marginTop: "20%"
  },
  titleWrapper: {
    marginTop: Platform.OS === "ios" ? "10%" : "5%",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: 24,
    padding: 10,
  },
  subTitle: {
    marginBottom: 20,
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 18,
    padding: 10,
  },
  inputWrapper: {
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  buttonWrapper: {
    paddingHorizontal: 35,
  },
  squareButton: {
    backgroundColor: '#53B77C',
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 5,
  },
  squareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textButtonText: {
    color: "#53B77C",
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    marginTop: "10%",
    alignItems: "center",
    justifyContent: "center",

    width: 50,
    height: 50,
  },

  image: {
    width: '100%',
    height: 300,
  },

  gradeWrapper: {
    alignItems: "flex-end",
    padding: 10,
  },

  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
});