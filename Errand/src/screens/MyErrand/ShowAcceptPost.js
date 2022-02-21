import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Container from '../../components/Container';
import { Avatar, ListItem } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default ShowAcceptPost = (props) => {
  const { id, erranderEmail, errandPrice, errander, errandProcess } = props.route.params;

  const [erranderGrade, setErranderGrade] = useState(0)
  const [erranderImage, setErranderImage] = useState('')

  const [showRatingModal, setShowRatingModal] = useState(false);

  const calculateGrade = (gradeNum) => {
    if (gradeNum >= 4.1) {
        return 'A+';
    } else if (gradeNum >= 3.6) {
        return 'A0';
    } else if (gradeNum >= 3.1) {
        return 'B+';
    } else if (gradeNum >= 2.6) {
        return 'B0';
    } else if (gradeNum >= 2.1) {
        return 'C+';
    } else if (gradeNum >= 1.6) {
        return 'C0';
    } else if (gradeNum >= 1.1) {
        return 'D+';
    } else if (gradeNum >= 0.6) {
        return 'D0';
    } else {
        return 'F';
    }
  }

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(erranderEmail)
      .get()
      .then(doc => {
        let grade = doc.data()['grade'];
        setErranderGrade(calculateGrade(grade))
      })
      .catch(e => console.log(e));

    storage()
      .ref('Users/' + erranderEmail)
      .getDownloadURL()
      .then(url => {
        setErranderImage(url)
      })
      .catch(e => console.log(e));
  }, [])


  const accept = () => {
    Alert.alert(
      "심부름 수락 요청",
      "심부름 수락 요청을 진행하셨습니다.\n정말로 진행하시겠습니까?",
      [{
        text: "확인",
        onPress: () => {
          // 프로세스 matching 변경, errander 추가
          firestore()
            .collection('Posts')
            .doc(id.toString())
            .update({
              process: "matching",
            })
            .then(() => {
              Alert.alert(
                "심부름 수락 완료",
                "요청이 전송되었습니다.\n상대방의 진행사항을 확인하세요.",
                [{
                  text: "확인",
                  onPress: () => props.navigation.navigate('MyErrand'),
                  style: "cancel",
                }],
              );
            })
            .catch(err => { console.log(err) })
        },
        style: "default",
      },
      {
        text: "취소",
        style: "default",
      }],
    )
  }

  const reject = () => {
    Alert.alert(
      "심부름 거절 요청",
      "심부름 거절 요청을 진행하셨습니다.\n정말로 진행하시겠습니까?",
      [{
        text: "확인",
        onPress: () => {
          // 프로세스 matching 변경
          firestore()
            .collection('Posts')
            .doc(id.toString())
            .update({
              process: "regist",
              errander: "",
              erranderEmail: "",
            })
            .then(() => {
              Alert.alert(
                "심부름 거절 완료",
                "요청이 전송되었습니다.\n다른 사람을 찾아보세요!.",
                [{
                  text: "확인",
                  onPress: () => props.navigation.navigate('MyErrand'),
                  style: "cancel",
                }],
              );
            })
            .catch(err => { console.log(err) })
        },
        style: "default",
      },
      {
        text: "취소",
        style: "default",
      }],
    );
  }
  

  return (
    <Container>
      {errandProcess == 'request' && 
      <>
        <Text style={{ fontSize: 16 }}>{errander} </Text>
        <Text style={{ fontSize: 16 }}>{erranderEmail} </Text>

        <TouchableOpacity onPress={() => accept()}>
          <Text> 허락하기 </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => reject()}>
          <Text> 거부하기 </Text>
        </TouchableOpacity>
      </>
      }

      {errandProcess == 'matching' && 
      <>
        <Text style={{ fontSize: 16 }}>{errander} </Text>
        <Text style={{ fontSize: 16 }}>{erranderEmail} </Text>
        
        <TouchableOpacity
          style={{ backgroundColor: '#fff', marginHorizontal: 100, padding: 10, alignItems: 'center' }}
          onPress={() => { setShowRatingModal(true) }}
        >
          <Text>완료</Text>
        </TouchableOpacity>

        <ErrandRating
          visible={showRatingModal}
          onRequestClose={() => setShowRatingModal(false)}
          id={id}
          erranderEmail={erranderEmail}
          errandPrice={errandPrice}
          errander={errander}
          erranderGrade={erranderGrade}
          erranderImage={erranderImage}
          calculateGrade={calculateGrade}
        />
      </>
      }
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