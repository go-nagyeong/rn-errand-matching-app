/*
    작업자 : shan
    
    수행 리스트
    게시물 자세히 보기
*/
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Container from '../../components/Container';
import { Avatar, ListItem } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default ShowDetailPerformList = (props) => {
  const { id, writerEmail, errandPrice, writer, errandProcess } = props.route.params;

  const [writerGrade, setWriterGrade] = useState(0)
  const [wrtierImage, setWriterImage] = useState('')

  const [showRatingModal, setShowRatingModal] = useState(false);

  const [btnErrandRating, setBtnErrandRating] = useState(true);

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

  
    storage()
      .ref('Users/' + writerEmail)
      .getDownloadURL()
      .then(url => {
        setWriterImage(url)
      })
      .catch(e => console.log("에러"));

  console.log("hello", writerEmail);
      
  


  // 내가 요청한 상태 -> 취소
  const requestCancle = () => {

    Alert.alert(
      "심부름 요청 취소",
      "정말로 진행하시겠습니까?",
      [{
        text: "확인",
        onPress: () => {
          // 프로세스 matching 변경, errander 추가
          firestore()
            .collection('Posts')
            .doc(id.toString())
            .update({
              process: "regist",
              errander: "",
              erranderEmail: "",
            })
            .then(() => {
              console.log('OK')
            })

          props.navigation.navigate('MyErrand');
        },
        style: "default",
      },
      {
        text: "취소",
        style: "default",
      }],
    )
  }


  return (
    <Container>

      {/* 매칭 요청 상태 */}
      {errandProcess == 'request' &&
        <>
        
          <Text style={{ fontSize: 16 }}> 상대방의 연락 정보는 매칭후에 확인 가능합니다.</Text>

          <TouchableOpacity onPress={() => requestCancle()}>
            <Text> 요청취소 </Text>
          </TouchableOpacity>

        </>
      }

      {/* 매칭 상태 */}
      {errandProcess == 'matching' &&
        <>
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
            erranderEmail={writerEmail}
            errandPrice={errandPrice}
            errander={writer}
            erranderGrade={writerGrade}
            erranderImage={wrtierImage}
            errandProcess={errandProcess}
            calculateGrade={calculateGrade}
            btnErrandRating={btnErrandRating}
          />
        </>
      }

      {/* 완료 요청 */}
      {errandProcess == 'finishRequest' &&
        <>
        
          <Text style={{ fontSize: 16 }}> 완료 요청 상태 입니다.</Text>
          <Text style={{ fontSize: 16 }}> 완료 수락시 페이지가 사라집니다.</Text>

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