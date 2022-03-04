import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Container from '../../components/Container';
import SpeechBalloon from '../../components/SpeechBalloon';
import PostSubmitButton from '../../components/PostSubmitButton';

export default WriteContent = (props) => {
  const [content, setContent] = useState("");
  const [contentFocus, setContentFocus] = useState("");
  
  const [image, setImage] = useState("");
  
  const { color, category, price, title } = props.route.params;

  const writeContent = () => {
    if (content) {
      props.navigation.navigate('SelectStartDate', {color: color, category: category, price: price, title: title, content: content, image: image, })
    } else {
      alert("내용을 최소 한 글자 이상 작성해 주세요.")
    }
  }


  const selectImage =  () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    launchImageLibrary(options, response => {
      if (response["didCancel"]) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response['assets'][0]['uri']; 
        const filename = source.substring(source.lastIndexOf('/') + 1);
        setImage(Platform.OS === 'ios' ? source.replace('file://', '') : source)
      } 
    });
  };

  const speechBallon = (content) => (
    <View style={styles.speechBalloon}>
      <View style={styles.triangle}></View>
      <View style={styles.oval}>
        <Text style={styles.speechBalloonText}>{content}</Text>
      </View>
    </View>
  )

  return (
    <Container>
       <View style={styles.previousState}>
        <SpeechBalloon prev='category' content={category} />
        <SpeechBalloon prev='price' content={price} />
        <SpeechBalloon prev='title' content={title} />
      </View>

      <View style={styles.centerView}>
        <View style={styles.inputWrapper}>
          <Icon name='right' size={20} color={contentFocus ? color : 'black'} />

          <TextInput 
            style={[styles.input, contentFocus && {fontWeight: '600'}]}
            placeholder="내용 입력"
            value={content}
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
            onFocus={() => setContentFocus(true)}
            onBlur={() => setContentFocus(false)}
            onChangeText={text => setContent(text)}
            multiline={true}
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity style={[styles.imageUploadButton, {borderColor: image ? color : 'gray'}]} onPress={() => selectImage()}>
          <Icon name='camera' size={20} color={image ? color : 'gray'} style={{marginLeft: 2, marginRight: 1}} />
          <Icon name={image ? 'check' : 'close'} size={16} color={image ? color : 'gray'} />
        </TouchableOpacity>

        <PostSubmitButton backgroundColor={color} onPress={() => writeContent()}/>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  previousState: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 40,
  },

  centerView: {
    flex: 1,
    paddingHorizontal: 30,
  },
  inputWrapper: {
    // alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 15,

    backgroundColor: "#fff",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {width: 6, height: 3},
      },
      android: {
        elevation: 6,
      },
    })
  },
  input: {
    top: Platform.OS === 'ios' ? '-1.1%':'-0.5%',
    width: '85%',
    fontSize: 16,
    marginHorizontal: 10,
    padding: 0,  // input 높이 맞추기 위해 안드로이드에만 있는 기본 padding 제거
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