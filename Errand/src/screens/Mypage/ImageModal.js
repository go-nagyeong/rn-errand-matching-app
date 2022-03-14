import React, { useState, useCallback, useEffect, useLayoutEffect,  } from 'react'
import {TouchableOpacity, View, Button, Modal, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native'


export default ImageModal = (props) => {
  const {visible, setVisible, importFromCamera, importFromAlbum} = props;
  return (
    <Modal
      visible={visible}
      onRequestClose={() => {setVisible(false);}}
      transparent={true}
      animationType='fade'
    >
      <View style={styles.background}
                onStartShouldSetResponder={() => {setVisible(false);}}
                >
      </View>
      <View style={styles.content}
      >
        <Text>Hi</Text>
        <Button onPress={() => {importFromCamera();}} title={'사진 촬영'}/>
        <Button onPress={() => {importFromAlbum();}} title={'앨범 선택'}/>
      </View>
    </Modal>

  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  content: {
    width: 400, // 기기 별 사이즈 조정 필요
    height: 300, // 기기 별 사이즈 조정 필요
    backgroundColor: '#fff', padding: 20,
  }
})