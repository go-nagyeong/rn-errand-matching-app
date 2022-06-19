import React, { useEffect, useState } from 'react'
import { Text, View, Modal, StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback, Button, Animated} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import SelectBox from 'react-native-multi-selectbox'
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';

const modalHeight = parseInt(Common.height/2.8);

const K_OPTIONS = [
  {
    item: '비매너 사용자예요.',
    id: '비매너',
  },
  {
    item: '사기를 당했어요.',
    id: '사기',
  },
  {
    item: '불건전한 만남 및 대화를 요구해요.',
    id: '성희롱',
  },
  {
    item: '욕설 및 비하를 해요.',
    id: '욕설',
  },
]

export default ReportDetail = (props) => {
  const navigation = useNavigation();

  const { visible, onRequestClose, postId, opponentEmail, getPosts } = props;
  
  // 모달 바텀시트로 만들기
  const [modalYAnim, setmodalYAnim] = useState(new Animated.Value(modalHeight));
  useEffect(() => {
    if (visible) {
      showModal()
    }
  }, [visible])
  const showModal = () => {
    Animated.timing(modalYAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  const hideModal = () => {
    Animated.timing(modalYAnim, {
      toValue: modalHeight,
      duration: 200,
      useNativeDriver: true
    }).start(() => onRequestClose());
  };
  

  const [selectedItem, setSelectedItem] = useState({});
  
  const updateReportCount = () => {
    if (Object.keys(selectedItem) != false) {
      let updateDate = {}
      updateDate[`data.${selectedItem.id}`] = firestore.FieldValue.increment(1);

      Firebase.usersRef
        .doc(opponentEmail)
        .update(updateDate)
        .then(() => {
          getPosts()

          // 신고 중복 여부 검사를 위한 필드 업데이트
          Firebase.postsRef
            .doc(postId)
            .update({
              reported: firestore.FieldValue.arrayUnion(Firebase.currentUser.email), // 신고한 유저 리스트에 자신의 이메일 추가
            })
            .then(() => console.log('이제 다시 신고할 수 없습니다'))
        })
        .catch(err => {
          console.log(err)
          if (err.code === 'firestore/not-found') {
            Alert.alert(
              "신고 불가",
              "탈퇴한 사용자입니다.",
              [{
                  text: "확인",
                  onPress: () => getPosts(),
                  style: "cancel",
              }],
            )
          } 
        })
    } else {
      Alert.alert(
        "신고 사유를 선택해주세요.",
        "",
        [{
            text: "확인",
            style: "cancel",
        }],
      )
    }
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={() => hideModal()}
      animationType='fade'
      transparent={true}
    >
      <TouchableOpacity style={styles.modalBackground} onPress={() => hideModal()}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.modalView, {transform: [{translateY: modalYAnim}]}]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => hideModal()}>
              <Icon name='close' size={26} />
            </TouchableOpacity>

            <View style={styles.selectBox}>
              <SelectBox
                label="신고 사유"
                options={K_OPTIONS}
                value={selectedItem}
                onChange={(val) => setSelectedItem(val)}
                hideInputFilter={true}
                containerStyle={{alignItems: 'center'}}
                labelStyle={{fontSize: 13}}
                optionsLabelStyle={{includeFontPadding: false, fontSize: 14}}
                selectedItemStyle={{includeFontPadding: false, fontSize: 15}}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={() => updateReportCount()}>
              <Text style={styles.buttonText}>완료</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: Colors.translucent,
    justifyContent: 'flex-end',
  },
  modalView: {
    height: modalHeight,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 40,
    padding: 22,
    overflow: 'hidden',
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  selectBox: {
    paddingHorizontal: 10,
    marginVertical: 24,
  },
  submitButton: {
    marginHorizontal: '32%',
    backgroundColor: Colors.white,
    borderWidth: 0.6,
    borderColor: Colors.red,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    includeFontPadding: false,
    color: Colors.red,
    fontSize: 15,
  }
})