import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,  Image, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Container from '../../components/Container';
import SelectDropdown from 'react-native-select-dropdown'
import storage from '@react-native-firebase/storage';


export default ShowDetailPost = (props  => {
  const { title, content, writerName, writergrade, price,} = props.route.params;

  const [url, setUrl] = useState(null)

  storage()
  .ref('Posts/' + title) 
  .getDownloadURL()
  .then((url) => {
      console.log('이미지를 다운로드 하였습니다')
      setUrl(url)
  })
  .catch((e) => console.log('Errors while downloading => ', e));
 

  useEffect(()=>{ 
    console.log(price);
  }, [price])

  return (
    <Container>
      <Image source={{url}} style={styles.image} />

      <View style={styles.gradeWrapper}>
        <Text style={{padding: 10, fontSize: 16}}>{writerName} 님</Text> 
        <Text style={{marginRight: 10, fontSize: 16,}}>점수 : {writergrade}</Text>
      </View>

      <Text style={styles.title}>{title}</Text> 
      <Text style={{padding: 10, fontSize: 20}}>{price}원</Text>

      <View style={styles.titleWrapper}>
        <Text style={{padding: 10, fontSize: 18}}>{content}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <View style={{alignItems: "center", justifyContent: "center",}}>

        </View>
      </View>

      <View>
        <TouchableOpacity style={[{marginTop: 30, marginBottom: 100, alignItems: 'center', justifyContent: 'center'}]} onPress={() => { }}>
          
        </TouchableOpacity>
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
    padding : 10,
  },
});