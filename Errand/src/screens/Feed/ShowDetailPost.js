import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, Fragment } from 'react';
import { Alert, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';


export default ShowDetailPost = (props) => {
  const navigation = useNavigation()

  const { title, content, writerName, writerGrade, price, writerEmail, id } = props.route.params;

  const [url, setUrl] = useState("")

  const [profileUrl, setProfileUrl] = useState(null)

  // 해당 게시물에 다른 사람의 요청이 들어가있는지 체크
  const [processIsRequested, setProcessIsRequested] = useState(false)
  // 본인 게시물인지 체크
  const [confirmMyPost, setConfirmMyPost] = useState(false)

  const isDarkMode = useColorScheme() === 'dark';


  useEffect(() => {
    // 게시물 사진과 작성자 사진 로드
    storage()
      .ref('Posts/' + id + "%" + writerEmail)
      .getDownloadURL()
      .then((url) => {
        console.log('게시물 이미지를 다운로드 하였습니다')
        setUrl(url)
      })
      .catch((e) => console.log('게시물 사진 다운로드 실패 => ', e));

    storage()
      .ref('Users/' + writerEmail)
      .getDownloadURL()
      .then((url) => {
        console.log('사용자 이미지를 다운로드 하였습니다')
        setProfileUrl(url)
      })
      .catch((e) => console.log('사용자 사진 다운로드 실패 => ', e));

    // 해당 심부름의 진행 상태와 작성자 확인
    firestore()
      .collection('Posts')
      .doc(id + "%" + writerEmail)
      .onSnapshot(doc => {
        if (doc.exists) {
          if (doc.data().process.title === 'request') {
            setProcessIsRequested(true)
          } else {
            setProcessIsRequested(false)
          }
          if (doc.data()['writerEmail'] === auth().currentUser.email) {
            setConfirmMyPost(true)
  
          } else {
            setConfirmMyPost(false)
          }
        }
      })
  }, [])


  const requestErrand = () => {
    firestore()
      .collection('Posts')
      .doc(id + "%" + writerEmail)
      .update({
        process: {
          title: 'request',         // regist > request > matching > finishRequest > finished
          myErrandOrder: 1,         // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
          myPerformErrandOrder: 2,  // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
        },
        erranderEmail: auth().currentUser.email,
        errander: auth().currentUser.displayName,
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
  }


  const updatePostState = () => {
    if (!processIsRequested) {
      Alert.alert(
        "심부름 수행 요청",
        "심부름 요청을 수행하셨습니다.\n정말로 진행하시겠습니까?",
        [{
          text: "확인",
          onPress: () => requestErrand(),
          style: "default",
        }, {
          text: "취소",
          style: "default",
        }],
      );
    } else {
      Alert.alert(
        "심부름 수행 요청 실패",
        "다른 사용자가 요청중인 심부름입니다.\n다른 심부름을 이용해 주세요.",
        [{
          text: "확인",
          onPress: () => props.navigation.navigate('Home'),
          style: "cancel",
        }],
      );
    }
  }

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={-200} behavior="padding">
          <View style={styles.mainView}>
            <ScrollView>


              {url != "" && <>
                <Image source={{ uri: url }} style={styles.image} />
              </>}
              {url == "" && <>
                <Text style={{ color: 'gray', fontSize: 16, }} >
                  게시물 이미지 없음
                </Text>
                <Image style={styles.image} />

              </>}


              <View style={styles.userRow}>
                <View style={styles.userImage}>
                  <Avatar
                    rounded
                    size="large"
                    source={{ uri: profileUrl }}
                  />
                </View>
                <View>
                  <Text style={{ fontSize: 16 }}>{writerName} </Text>
                  <Text style={{ color: 'gray', fontSize: 16, }} >
                    {writerGrade}
                  </Text>
                </View>
              </View>

              <Text style={styles.title}>{title} </Text>
              <Text style={{ padding: 10, fontSize: 20 }}>{price}원</Text>

              <View style={styles.titleWrapper}>
                <Text style={{ padding: 10, fontSize: 18 }}>{content}</Text>
              </View>

              <View style={styles.inputWrapper}>
                <View style={{ alignItems: "center", justifyContent: "center", }}>

                </View>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.footer} >
          {/* 테스트를 위해 내 심부름도 일단 요청 가능하게 */}
          {/* <TouchableOpacity onPress={() => updatePostState()} disabled={confirmMyPost} > */}
          <TouchableOpacity onPress={() => updatePostState()} >
            <Text style={{ color: 'white', fontSize: 16 }}> 시작하기 </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>

  );
};

const styles = StyleSheet.create({
  mainView: {
    height: "100%",
    backgroundColor: "#fff",
  },
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
  container: {
    flex: 1,
    backgroundColor: '#5B86E5',
  },
  footer: {
    height: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
});