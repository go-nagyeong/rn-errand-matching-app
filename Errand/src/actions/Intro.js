import React, {useState} from 'react';
import { StyleSheet, View, Text, Image, StatusBar, AsyncStorage, RefreshControl } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';


export default Intro = (props) => {
  const slides = [
    {
      key: '1',
      title: '학교 계정을 사용해 \n믿을 수 있는 심부름',
      text: '',
      image: require('./3.png'),
      backgroundColor: '#59b2ab',
    },
    {
      key: '2',
      title: '원하는 글에 \n심부름 요청',
      text: '',
      image: require('./3.png'),
      backgroundColor: '#febe29',
    },
    {
      key: '3',
      title: '더 안전한 심부름을 위한 \n평가 서비스',
      text: '',
      image: require('./3.png'),
      backgroundColor: '#59b2ab',
    },
    {
      key: '4',
      title: '심부름꾼으로 활동하며 \n투잡으로 수익창출',
      text: '',
      image: require('./3.png'),
      backgroundColor: '#22bcb5',
    },

  ];
  
  _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, {backgroundColor: item.backgroundColor} ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
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
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
})