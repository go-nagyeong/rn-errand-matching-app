import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, KeyboardAvoidingView, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/Feather';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';
import Container from '../../components/Container';
import ErrandStartButton from '../../components/ErrandStartButton';

export default ShowDetailPost = (props) => {
  const navigation = useNavigation()

  const { title, content, writerName, writerGrade, price, writerEmail, id, image, writerImage, views, arrive, destination, date } = props.route.params;

  const negativeGrades = new Array('F', 'D+', 'D0')
  const gradeStyle = writerGrade in negativeGrades ? ['frown', Colors.red] : ['smile', Colors.green]

  // 해당 게시물에 다른 사람의 요청이 들어가있는지 체크
  const [processIsRequested, setProcessIsRequested] = useState(false)
  // 본인 게시물인지 체크
  const [confirmMyPost, setConfirmMyPost] = useState(false)
  // 신고 횟수가 많은 작성자인지 체크
  const [isReported, setIsReported] = useState(false)

  // 좋아요(버튼) 상태 변수
  const [heart, setHeart] = useState(false);
  const [heartNumber, setHeartNumber] = useState(null);

  useEffect(() => {
    // 해당 심부름의 진행 상태와 작성자 확인
    const unsubscribe = Firebase.postsRef
      .doc(id + "%" + writerEmail)
      .onSnapshot(doc => {
        if (doc.exists) {
          // 해당 게시물에 다른 사람의 요청이 들어가있는지 체크
          if (doc.data().process.title === 'request') {
            setProcessIsRequested(true)
          } else {
            setProcessIsRequested(false)
          }
          // 본인 게시물인지 체크
          if (doc.data()['writerEmail'] === Firebase.currentUser.email) {
            setConfirmMyPost(true)
          } else {
            setConfirmMyPost(false)
          }

          setHeartNumber(parseInt(doc.data().hearts))
        }
      })
    
    // 신고 횟수가 많은 작성자인지 체크
    Firebase.usersRef
      .doc(writerEmail)
      .get()
      .then(doc => {
        if (doc.exists) {
          Object.entries(doc.data().data).map((entrie, idx) => {
            if (entrie[1] >= 10) {
              setIsReported(true)
            } 
          });
        }
      })

    // 조회수 자동 증가
    Firebase.postsRef
      .doc(id + "%" + writerEmail)
      .update({
        'views': firestore.FieldValue.increment(1),
      })
      .then(() => {
        console.log('조회수 변경');
      })
      .catch(err => { console.log(err) })

    // 내가 좋아요한 게시물인지 체크
    Firebase.heartsRef
      .where("who", "==", Firebase.currentUser.email)
      .where("postId", "==", id + "%" + writerEmail)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size >= 1) {
          setHeart(true);
        }
      })
      .catch(err => { console.log('에러 발생', err) })

    return unsubscribe
  }, [])


  const heartsDocId = id + "%" + writerEmail + "%" + Firebase.currentUser.email

  const opacity = useRef(new Animated.Value(0)).current;

  // 하트 채우기
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

  // 하트 토글
  const toggleHeart = () => {
    if (heart) {
      // 하트 취소 ----------------------------------------------
      setHeart(false)
      Firebase.postsRef
        .doc(id + "%" + writerEmail)
        .update({
          'hearts': firestore.FieldValue.increment(-1),
        })
        .then(() => {
          console.log('하트 취소');
        })
        .catch(err => { console.log(err) })

        Firebase.heartsRef
          .doc(heartsDocId)
          .delete()

    } else {
      // 하트 활성화 ----------------------------------------------
      setHeart(true)
      Firebase.postsRef
        .doc(id + "%" + writerEmail)
        .update({
          'hearts': firestore.FieldValue.increment(1),
        })
        .then(() => {
          console.log('하트 활성화');
        })
        .catch(err => { console.log(err) })

      Firebase.heartsRef
        .doc(heartsDocId)
        .set({
          'postId': id + "%" + writerEmail,
          // 'state': "1",  // (V1과 다를 점) 그래서 말인데 state 필드가 필요한가?
          'who': Firebase.currentUser.email,
        })
        .catch(err => { console.log(err) })
    }

    fillHeart();
  }


  // 심부름 요청하기
  const requestErrand = () => {
    Firebase.postsRef
      .doc(id + "%" + writerEmail)
      .update({
        process: {
          title: 'request',         // regist > request > matching > finishRequest > finished
          myErrandOrder: 1,         // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
          myPerformErrandOrder: 2,  // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
        },
        erranderEmail: Firebase.currentUser.email,
        errander: Firebase.currentUser.displayName,
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

  // 게시물 상태 업데이트
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
        "다른 사용자가 요청 중인 심부름입니다.\n다른 심부름을 이용해 주세요.",
        [{
          text: "확인",
          onPress: () => props.navigation.navigate('Home'),
          style: "cancel",
        }],
      );
    }
  }


  // edit mode -----------------------------------------------------------------------
  const [isEditMode, setEditMode] = useState(false)
  const toggleEdit = () => {
    if (isEditMode) {
      setEditMode(updateTitle() || updateContent() || updatePrice())
    } else {
      setEditMode(true)
    }
  }

  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [editedPrice, setEditedPrice] = useState(price);

  const updateTitle = () => {
    if (editedTitle.length < 2) {
      Alert.alert(
        "오류",
        "제목은 최소 2글자 이상 입니다.",
        [{
          text: "확인",
          style: "cancel",
        }],
      );

      return true

    } else {
      Firebase.postsRef
        .doc(id + "%" + writerEmail)
        .update({
          title: editedTitle
        })
        .catch(err => { console.log(err) })

      return false
    }
  }
  const updateContent = () => {
    if (editedContent.length < 2) {
      Alert.alert(
        "오류",
        "내용은 최소 2글자 이상 입니다.",
        [{
          text: "확인",
          style: "cancel",
        }],
      );

      return true

    } else {
      Firebase.postsRef
        .doc(id + "%" + writerEmail)
        .update({
          content: editedContent
        })
        .catch(err => { console.log(err) })

      return false
    }
  }
  const updatePrice = () => {
    if (editedPrice >= 100000) {
      Alert.alert(
        "오류",
        "10만원 이상의 거래를 불가능합니다.",
        [{
          text: "확인",
          style: "cancel",
        }],
      );

      return true

    } else {
      Firebase.postsRef
        .doc(id + "%" + writerEmail)
        .update({
          price: editedPrice
        })
        .catch(err => { console.log(err) })

      return false
    }
  }
  // ----------------------------------------------------------------------------


  // 게시물 삭제
  const deletePost = () => {
    Alert.alert(
      "심부름 삭제",
      "정말로 삭제하시겠습니까?",
      [{
        text: "확인",
        onPress: async () => {
          await Firebase.heartsRef
            .where('postId', '==', id + '%' + writerEmail)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.delete()
              })
            })
            .catch(err => console.log(err));

          Firebase.postsRef
            .doc(id + '%' + writerEmail)
            .delete()
            .then(() => props.navigation.navigate('Home'))
            .catch(err => console.log(err));
        },
        style: "default",
      },
      {
        text: "취소",
        style: "default",
      }],
    );
  }

  // 이미지 원본보기 활성화 여부
  const [visible, setVisible] = useState(false);

  // 이미지 원본보기 할 때 필요
  const images = [{
    // Simplest usage.
    url: image,

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
      // headers: ...
    }
  }, {
    url: '',
    props: {
      // Or you can set source directory.
      // source: require('../background.png')
    }
  }]

  const toggleVisible = () => {
    if (visible) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }

  // (V1과 다른 점 => 전체적인 UI)
  return (
    <>
      <Container>
        <Modal visible={visible} transparent={true}>
          <ImageViewer imageUrls={images} enableSwipeDown={true} onSwipeDown={toggleVisible} />
        </Modal>

        {/* 게시물 이미지 여부 확인 */}
        {image != ""
          ?
            <TouchableOpacity onPress={toggleVisible}>
              <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
          :
            <View style={styles.nonImage}>
              <Text style={{color: Colors.white, fontSize: 20}}>No Image</Text>
            </View>
        }

        <View style={styles.contents}>
          {/* 신고 횟수가 많은 작성자 경고문 */}
          {(isReported && !confirmMyPost) &&
            <View style={styles.warning}>
              <Icon style={{ marginLeft: "3%" }} name='infocirlceo' size={15} color={Colors.red} />
              <Text style={styles.warningText}>신고 이력이 많은 이용자 입니다.</Text>
            </View>
          }

          {/* 게시물 수정 버튼 */}
          {confirmMyPost &&
            <TouchableOpacity style={styles.editButton} onPress={() => toggleEdit()}>
              <Text style={styles.editButtonText}>{isEditMode ? '완료' : '수정'}</Text>
            </TouchableOpacity>
          }

          {/* 작성자 프로필 */}
          <View style={styles.userRow}>
            <View style={styles.userImage}>
              <Avatar
                rounded
                size={52}
                source={{ uri: writerImage }}
              />
            </View>

            <View>
              <Text style={{ color: Colors.black, fontSize: 15, fontWeight: '600', marginBottom: 8 }}>{writerName}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FIcon name={gradeStyle[0]} size={16} color={gradeStyle[1]} style={{ marginRight: 4 }} />
                <Text style={{fontSize: 14, color: Colors.darkGray}}>{writerGrade}</Text>
              </View>
            </View>
          </View>

          {/* 타이틀 텍스트 */}
          {!isEditMode
            ?
              <Text style={styles.title}>{editedTitle}</Text>
            :
              <TextInput
                style={[styles.input, styles.title]}
                value={editedTitle}
                autoCapitalize='none'
                autoCorrect={false}
                blurOnSubmit={true}
                onChangeText={(text) => setEditedTitle(text)}
                maxLength={30}
              />
          }

          {/* 날짜, 가격, 조회수, 하트 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: Colors.midGray, marginRight: 20 }}>
                {Moment(date.toDate()).diff(Moment(), 'days') >= -2
                  ? Moment(date.toDate()).fromNow()
                  : Moment(date.toDate()).format('YY/MM/DD')}
              </Text>

              <Icon name='eyeo' size={14} color={Colors.gray} />
              <Text style={{marginLeft: 4, marginRight: 18, fontSize: 13, color: Colors.darkGray2}}>{views}</Text>

              <Icon name='heart' size={13} color={Colors.gray} />
              <Text style={{marginLeft: 4, fontSize: 13, color: Colors.darkGray2}}>{heartNumber}</Text>
            </View>

            <Text style={{fontSize: 17, color: Colors.black}}>{price}원</Text>
          </View>

          {/* 내용 텍스트*/}
          {!isEditMode
            ? 
              <Text style={styles.content}>{editedContent}</Text>
            :
              <TextInput
                style={[styles.input, styles.content]}
                value={editedContent}
                autoCapitalize='none'
                autoCorrect={false}
                blurOnSubmit={true}
                onChangeText={(text) => setEditedContent(text)}
                maxLength={1000}
                multiline={true}
              />
          }

          {/* 목적지, 도착지 */}
          {arrive !== "" &&
            <View style={styles.location}>
              <Text style={styles.locationText}>목적지 : {arrive}</Text>
            </View>
          }
          {destination !== "" &&
            <View style={styles.location}>
              <Text style={styles.locationText}>도착지 : {destination}</Text>
            </View>
          }

          {/* 게시물 삭제 버튼 */}
          {confirmMyPost &&
            <TouchableOpacity style={[styles.deleteButton, {backgroundColor: Colors.red}]} onPress={() => deletePost()}>
              <Text style={[styles.deleteButtonText, {color: Colors.white}]}>삭제</Text>
            </TouchableOpacity>
          }
        </View>
      </Container>

      <View style={styles.footer}>
        {/* 테스트를 위해 내 심부름도 일단 요청 가능하게 */}
        {/* <TouchableOpacity onPress={() => updatePostState()} disabled={confirmMyPost} > */}
        <TouchableOpacity onPress={toggleHeart}>
          {/* heart값에 따른 아이콘 변경 */}
          {heart ? <Icon name="heart" size={25} color={Colors.red}></Icon> : <Icon name="hearto" size={25} color={Colors.black}></Icon>}
        </TouchableOpacity>

        {/* 심부름 시작 버튼 */}
        <ErrandStartButton onPress={() => updatePostState()} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contents: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  image: {
    width: '100%',
    height: 300,
  },
  nonImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning: {
    flexDirection: 'row',
    marginHorizontal: "10%",
    marginVertical: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fffce6"
  },
  warningText: {
    marginLeft: "3%",
    color: "#5e5200"
  },
  editButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
    marginRight: 6,
  },
  editButtonText: {
    fontWeight: '600',
    color: Colors.black,
    fontSize: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.midGray,
    marginBottom: 20,
  },
  userImage: {
    marginRight: 12,
  },
  title: {
    fontWeight: '600',
    color: Colors.black,
    fontSize: 18,
    marginBottom: 12,
  },
  content: {
    color: Colors.darkGray2,
    fontSize: 15,
    marginVertical: 38,
  },
  input: {
    paddingVertical: 4,
    // paddingHorizontal: 12,
    // backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray2,
  },
  location: {
    marginHorizontal: "8%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginBottom: '3%',
  },
  locationText: {
    color: Colors.black,
    fontSize: 14,
  },
  deleteButton: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: '30%',
    borderRadius: 20,
    marginTop: '7%',
  },
  deleteButtonText: {
    fontWeight: '700',
    color: Colors.black,
    fontSize: 16,
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    height: "12%",
    paddingBottom: '6%',
    alignItems: "center",
    // justifyContent: "center",
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightGray2,
  }
});