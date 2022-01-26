import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Container from '../../components/Container';
import storage from '@react-native-firebase/storage';

export default WriteContent = (props) => {
  const [content, setContent] = useState("");
  
  const [contentFocus, setContentFocus] = useState("");
  
  const { category, price, title } = props.route.params;

  const onPress = () => {
    if(content){
      props.navigation.navigate('SelectStartDate', {category: category, price: price, title: title, content: content, })
    }
    else{
      alert("최소 한글자 이상 작성해 주세요.")
    }
  }

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const selectImage =  async () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    await launchImageLibrary(options, response => {
      if (response["didCancel"]) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = response['assets'][0]['uri']; 
        const filename = source.substring(source.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? source.replace('file://', '') : source;

        const task = storage()
            .ref('Posts/'+ title) // storage에 저장될 경로
            .putFile(uploadUri); // 보낼 이미지의 경로
                // set progress state
        task.on('state_changed', taskSnapshot => {
            console.log(taskSnapshot.state);
        });
        task.then(() => {
            console.log('Task complete');
            // firebase에서 이미지 다운로드
            //downloadImg()
        })
        .catch((error) => {
            console.error(error.message);
        });
      } 
    });
  };

  return (
    <Container>
      <View style={styles.titleMargin}>
        <View style={styles.titleWrapper}>
            <Text style={styles.title}>내용</Text>
            <Text style={styles.subTitle}>게시글의 내용을 작성해 주세요.</Text>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[contentFocus ? styles.focusedInput : styles.input, {height:200, }]}
            textAlignVertical="top"
            multiline={true}
            numberOfLines={4}
            placeholder="Title"
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
            blurOnSubmit={false}
            onFocus={() => {setContentFocus(true)}}
            onBlur={() => {setContentFocus(false)}}
            onChangeText={text => setContent(text)}
            selectionColor="#292929"
            // react-native-paper
            underlineColor='transparent'
            activeUnderlineColor="transparent"
            theme={{ roundness: 7, colors: {text: setContentFocus ? "black" : "#999899", placeholder: setContentFocus ? "transparent" : "#999899"} }}
            left={<TextInput.Icon name={() => <AntDesignIcon name="right" size={20} color="#53B77C" />} />}
          />
              <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
                <Text style={styles.buttonText}>Pick an image</Text>
              </TouchableOpacity>
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