import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Container from '../../components/Container';
import SpeechBalloon from '../../components/SpeechBalloon';
import PostSubmitButton from '../../components/PostSubmitButton';

export default WriteTitle = (props) => {
  const [title, setTitle] = useState("");
  const [titleFocus, setTitleFocus] = useState(false);

  const { color, category, price } = props.route.params;

  const writeTitle = () => {
    if (title) {
      props.navigation.navigate('WriteContent', {color: color, category: category, price: price, title: title, })  
    } else {
      alert("제목을 최소 한 글자 이상 작성해 주세요.")
    }
  }

  return (
    <Container>
      <View style={styles.previousState}>
        <SpeechBalloon prev='category' content={category} />
        <SpeechBalloon prev='price' content={price} />
      </View>

      <View style={styles.centerView}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>심부름 제목/내용</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Icon name='right' size={20} color={titleFocus ? color : 'black'} />

          <TextInput 
            style={[styles.input, titleFocus && {fontWeight: '600'}]}
            placeholder="제목 입력"
            value={title}
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
            blurOnSubmit={true}
            onFocus={() => setTitleFocus(true)}
            onBlur={() => setTitleFocus(false)}
            onChangeText={text => setTitle(text)}
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={() => writeTitle()}
          />
        </View>

        <PostSubmitButton backgroundColor={color} onPress={() => writeTitle()}/>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  previousState: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 20,
  },

  centerView: {
    flex: 1,
    paddingHorizontal: 30,
  },
  titleWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontFamily: 'NotoSansKR-Medium',
    color: 'black',
    fontSize: 24,
    padding: 10,
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 20:10,
    marginBottom: 70,

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
    width: '85%',
    fontSize: 16,
    marginHorizontal: 10,
  },
});