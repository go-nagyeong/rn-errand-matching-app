/* 
앱 처음 실행 시 하단 탭의 기능 알려주는 화면
FeedScreen.js에서 사용
*/
import React, { useState } from 'react';
import { StyleSheet, Modal, View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Colors from '../../constants/Colors';
import { DownSharp } from '../../components/Chevron'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default RenderInfo = (items) => {
  const [modalVisible, setModalVisible] = useState(true)
  const item = items.items.item
  const modalPage = items.modalPage
  const setModalPage = items.setModalPage
  const insertDb = async (value) => {
    try {
      await AsyncStorage.setItem('firstInstalled', value)
    } catch (e) {
      console.log(e)
    }
  }

  if (item.modalPage == modalPage) {
    return(
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(!modalVisible);}}
        >
          <TouchableWithoutFeedback onPress={() => setModalPage(++item.modalPage)}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback onPress={() => setModalPage(++item.modalPage)}>
                <View>
                  <View style={[styles.modalView, item.modalViewStyle]}>
                    <Text style={styles.modalText}>{item.text}</Text>
                  </View>
                  <DownSharp style={[styles.downSharp, item.downSharpStyle]}/>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
      </Modal> )
  }
  if (modalPage == 5) {insertDb('0');}
  return null;
}

const styles = StyleSheet.create({
  // 기능 설명 관련 스타일
  centeredView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.transparent,
  },
  // 말풍선
  modalView: {
    margin: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    ellevation: 5,
    top: Dimensions.get('window').height - 150,
  },
  // 말풍선 꼬리
  downSharp: {
    top: Dimensions.get('window').height - 170,
    color: Colors.lightGray
  },
})