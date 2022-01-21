import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';

import Container from '../../components/Container';

export default WriteTitle = (props) => {
  const [title, setTitle] = useState("");

  const [titleFocus, setTitleFocus] = useState(false);
  const { category, price } = props.route.params;

  const onPress = () => {
    if(title){
      props.navigation.navigate('WriteContent', {category: category, price: price, title: title, })  
    }
    else{
      alert("최소 한글자 이상 작성해 주세요.")
    }
  }

  return (
    <Container>
      <View style={styles.titleMargin}>
        <View style={styles.titleWrapper}>
            <Text style={styles.title}>제목</Text>
            <Text style={styles.subTitle}>게시글의 제목을 작성해 주세요.</Text>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={titleFocus ? styles.focusedInput : styles.input}

            placeholder="Title"
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
            blurOnSubmit={false}
            onFocus={() => {setTitleFocus(true)}}
            onBlur={() => {setTitleFocus(false)}}
            onChangeText={text => setTitle(text)}
            onSubmitEditing={() => onPress()}
            returnKeyType="next"
            selectionColor="#292929"
            // react-native-paper
            underlineColor='transparent'
            activeUnderlineColor="transparent"
            theme={{ roundness: 7, colors: {text: setTitleFocus ? "black" : "#999899", placeholder: setTitleFocus ? "transparent" : "#999899"} }}
            left={<TextInput.Icon name={() => <AntDesignIcon name="right" size={20} color="#53B77C" />} />}
          />

          <TouchableOpacity style={[{marginTop: 30, marginBottom: 100, alignItems: 'center', justifyContent: 'center'}]} onPress={() => onPress()}>
            <Image
              style = {styles.item}
              source={require('../../assets/img/Ok.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
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
  focusedInput: {
    backgroundColor: "#fff",
    marginBottom: 12,
    fontWeight: "600",
    borderRadius: 7,
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
  item: {
    marginTop: "10%",
    alignItems: "center",
    justifyContent: "center",
    width: 50, 
    height: 50, 
  },
});
  
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      height: 50, 
      width: 300, 
      color: '#000000',
      borderColor: '#000000', 
      borderRadius: 12,
      padding: 10
  },
  inputAndroid: {
      fontSize: 16,
      height: 50, 
      width: 300, 
      color: '#000000',
      borderColor: '#000000', 
      borderRadius: 12,
      padding: 10
  },
});