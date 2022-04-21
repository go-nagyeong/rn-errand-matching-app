import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Animated, TouchableWithoutFeedback, Easing, Alert, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import LightBox from "react-native-lightbox-v2";
import Icon from 'react-native-vector-icons/AntDesign';
import ErrandStartButton from '../../components/ErrandStartButton';


export default ShowDetailPost = (props) => {
  const navigation = useNavigation()

  const { title, content, writerName, writerGrade, price, writerEmail, id, image, writerImage, views, arrive, destination } = props.route.params;

  // const [url, setUrl] = useState("")
  // const [profileUrl, setProfileUrl] = useState(null)

  // 해당 게시물에 다른 사람의 요청이 들어가있는지 체크
  const [processIsRequested, setProcessIsRequested] = useState(false)
  // 본인 게시물인지 체크
  const [confirmMyPost, setConfirmMyPost] = useState(false)

  const [heartNumber, setHeartNumber] = useState(null);

  const isDarkMode = useColorScheme() === 'dark';

  const [myHeartList, setMyHeartList] = useState([""]);

  // let myHeartList = [];

  const [isReported, setIsReported] = useState(false)

  const heartsDocId = id + "%" + writerEmail + "%" + auth().currentUser.email

  var lastTap = null;
  const [heart, setHeart] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 해당 심부름의 진행 상태와 작성자 확인, 조회수 확인
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
          setHeartNumber(parseInt(doc.data().hearts))
        }
      })

    // 조회수 자동 증가
    firestore()
      .collection('Posts')
      .doc(id + "%" + writerEmail)
      .update({ 'views': views + 1, })
      .then(() => {
        console.log('조회수 변경');
      })
      .catch(err => { console.log(err) })

    // 좋아요 불러오기
    firestore()
      .collection('Hearts')
      .where("who", "==", auth().currentUser.email)
      .where("postid", "==", id + "%" + writerEmail)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function (doc) {
          if (doc.data()["state"] === "1") {
            setHeart(true);
          }
        })
      })
      .catch(err => { console.log('에러 발생', err) })

    // 신고횟수 불러오기
    firestore()
      .collection('Users')
      .doc(writerEmail)
      .onSnapshot(doc => {
        if (doc.exists) {
          Object.entries(doc.data().data).map((entrie, idx) => {
            if (entrie[1] >= 10) {
              setIsReported(true)
            } else {
              setIsReported(false)
            }
          });
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



  const fillHeart = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.quad,
        useNativeDriver: true,
      }),
      Animated.delay(600),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }


  const toggleHeart = () => {

    if (heart) {
      // 하트 취소 ----------------------------------------------
      setHeart(false)

      firestore()
        .collection('Posts')
        .doc(id + "%" + writerEmail)
        .update(
          {
            'hearts': heartNumber - 1,
          })
        .then(() => {
          console.log('하트 취소');
        })
        .catch(err => { console.log(err) })

      firestore()
        .collection('Hearts')
        .doc(heartsDocId)
        .delete()



      // ----------------------------------------------

    } else {
      // 하트 활성화 ----------------------------------------------
      setHeart(true)


      firestore()
        .collection('Posts')
        .doc(id + "%" + writerEmail)
        .update({
          'hearts': heartNumber + 1,
        })
        .then(() => {
          console.log('하트 활성화');
        })
        .catch(err => { console.log(err) })

      firestore()
        .collection('Hearts')
        .doc(heartsDocId)
        .set(
          {
            'postid': id + "%" + writerEmail,
            'state': "1",
            'who': auth().currentUser.email,
          })
        .catch(err => { console.log(err) })
      // ----------------------------------------------
    }




    fillHeart();
  }

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={-200} behavior="padding">
          <View style={styles.mainView}>
            <ScrollView>


              {image != ""
                ?
                <LightBox>
                  <Image source={{ uri: image }} style={styles.image} />
                </LightBox>
                :
                <>
                  <Text style={{ color: 'gray', fontSize: 16, }} >
                    게시물 이미지 없음
                  </Text>
                  <Image style={styles.image} />
                </>}


              {isReported &&
                <>
                  <View style={styles.warning}>
                    <Icon style={{ marginLeft: "3%" }} name='infocirlceo' size={15} color='#d11515' />
                    <Text style={styles.warningText}>신고 이력이 많은 이용자 입니다.</Text>
                  </View>
                </>
              }


              <View style={styles.userRow}>
                <View style={styles.userImage}>
                  <Avatar
                    rounded
                    size="large"
                    source={{ uri: writerImage }}
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

              {arrive !== "" &&
                <>
                  <View style={styles.location}>
                    <Text style={styles.locationText}>목적지 : </Text>
                    {/* <Icon style={{ marginLeft: "3%" }} name='rightcircleo' size={15} color='#cc0' /> */}
                    <Text style={styles.locationText2}>{arrive}</Text>
                  </View>
                </>
              }

              {destination !== "" &&
                <>
                  <View style={styles.location}>
                    <Text style={styles.locationText}>도착지 : </Text>
                    {/* <Icon style={{ marginLeft: "3%" }} name='leftcircleo' size={15} color='#cc0' /> */}
                    <Text style={styles.locationText2}>{destination}</Text>
                  </View>
                </>
              }

            </ScrollView>
          </View>
        </KeyboardAvoidingView>



        <View style={styles.footer} >
          {/* 테스트를 위해 내 심부름도 일단 요청 가능하게 */}
          {/* <TouchableOpacity onPress={() => updatePostState()} disabled={confirmMyPost} > */}
          <View style={styles.heart}>
            <TouchableOpacity
              onPress={toggleHeart}
              style={{
                width: 30,
                height: 30,
              }}
            >
              {/* heart값에 따른 아이콘 변경 */}
              {heart ? <Icon name="heart" size={25} color={'#f00'}></Icon> : <Icon name="hearto" size={25} color={'#000'}></Icon>}
            </TouchableOpacity>
          </View>

          <ErrandStartButton onPress={() => updatePostState()} />


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
    backgroundColor: '#fff',
  },
  footer: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  heart: {
    marginRight: "50%",
    alignItems: "flex-start",
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: "10%",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fffce6"
  },
  warningText: {
    marginLeft: "3%",
    color: "#5e5200"
  },
  location: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: "5%",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#eee"
  },
  locationText: {
    marginLeft: "3%",
    color: "#000"
  },
  locationText2: {
    marginLeft: "3%",
    marginRight: "20%",
    // width:"",
    color: "#000"
  }
});