import React from 'react';
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
// Intro 이미지
import id from '../assets/img/id-card.png';
import medal from '../assets/img/medal.png';
import test from '../assets/img/test.png';
import whistle from '../assets/img/whistle.png';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default Intro = (props) => {
  const slides = [
    {
      key: '1',
      title: '학교 계정을 사용해 \n믿을 수 있는 심부름',
      text: '',
      image: id,
      backgroundColor: '#59b2ab',
    },
    {
      key: '2',
      title: '원하는 글에 \n심부름 요청',
      text: '',
      image: test,
      backgroundColor: '#febe29',
    },
    {
      key: '3',
      title: '더 안전한 심부름을 위한 \n평가 서비스',
      text: '',
      image: whistle,
      backgroundColor: '#59b2ab',
    },
    {
      key: '4',
      title: '심부름꾼으로 활동하며 \n투잡으로 수익창출',
      text: '',
      image: medal,
      backgroundColor: '#22bcb5',
    },

  ];
  
  _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, {backgroundColor: item.backgroundColor} ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={{width: 200, height: 200}} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }

  _onDone = async () => {
    try {
      await AsyncStorage.setItem('intro', '1').then(() => console.log('AsyncStorage Saved'))
      props.navigation.navigate('Login')
    } catch (e) {
      console.log('At Intro.js', e)
    }
  }


  return (
    <View style={{flex: 1}}>
      {/* backgroundColor="transparent" */}
      <StatusBar translucent /> 
      <AppIntroSlider 
        renderItem={_renderItem} 
        data={slides} 
        onDone={_onDone}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  }
})