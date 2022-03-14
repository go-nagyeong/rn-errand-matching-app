import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from '../../components/Container';
import SpeechBalloon from '../../components/SpeechBalloon';
import PostSubmitButton from '../../components/PostSubmitButton';
import PriceButton from '../../components/PriceButton';

export default InputPrice = (props) => {
  const [price, setPrice] = useState('');
  const [minusIsDisabled, setMinusIsDisabled] = useState(false)

  const [message, setMessage] = useState("")

  const { color, category } = props.route.params;

  const inputPrice = () => {
    if (price) {
      props.navigation.navigate('WriteTitle', { color: color, category: category, price: price, })
    } else {
      setMessage('금액을 입력해주세요.')
    }
  }


  // 최소/최대 금액을 제한하는 부분
  useEffect(() => {
    let priceNum = Number(price.replace(',', ''))
    setMessage('')
    if (priceNum <= 0) {
      setMinusIsDisabled(true)
    } else if (priceNum >= 100000) {
      onChangePrice('99,999')
    } else {
      setMinusIsDisabled(false)
    }
  }, [price])


  const onChangePrice = (text) => {
    let text1 = text.replace(/[^0-9]/g, '')  // 숫자 외 입력 제한
    let text2 = text1.replace(/\B(?=(\d{3})+(?!\d))/g, ",")  // 금액 단위(,) 표시
    setPrice(text2)
  }

  const upAndDownPrice = (upAndDown) => {
    let priceNum = Number(price.replace(',', ''))

    if (upAndDown === 'minus') {
      return (priceNum - 500).toString()
    } else if (upAndDown === 'plus') {
      return (priceNum + 500).toString()
    }
  }

  return (
    <Container>
      <View style={styles.previousState}>
        <SpeechBalloon prev='category' content={category} />
      </View>

      <View style={styles.centerView}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>심부름 가격</Text>
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesomeIcon name='won' size={20} color='black' />

          <TextInput
            style={styles.input}
            keyboardType='numeric'
            placeholder="금액 입력"
            value={price}
            autoCapitalize='none'
            autoCorrect={false}
            blurOnSubmit={true}
            onChangeText={text => onChangePrice(text)}
            maxLength={6}
            returnKeyType="done"
            onSubmitEditing={() => inputPrice()}
          />


          <TouchableOpacity disabled={minusIsDisabled} style={{ marginRight: 8 }} onPress={() => onChangePrice(upAndDownPrice('minus'))}>
            <AntDesignIcon name='minuscircleo' size={24} color={minusIsDisabled ? 'gray' : color} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onChangePrice(upAndDownPrice('plus'))}>
            <AntDesignIcon name='pluscircleo' size={24} color={color} />
          </TouchableOpacity>
        </View>

        {message !== "" && <Text style={styles.message} >{message}</Text>}

        <View style={{flexDirection: 'row', marginBottom: 70}}>
          <PriceButton price='1000' borderColor={color} onPress={() => onChangePrice('1000')} />
          <PriceButton price='2000' borderColor={color} onPress={() => onChangePrice('2000')} />
          <PriceButton price='3000' borderColor={color} onPress={() => onChangePrice('3000')} />
          <PriceButton price='5000' borderColor={color} onPress={() => onChangePrice('5000')} />
        </View>

        <PostSubmitButton backgroundColor={color} onPress={() => inputPrice()} />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 20 : 10,
    marginBottom: 15,
  },
  input: {
    width: '65%',
    fontSize: 18,
    marginHorizontal: 10,
  },
  message: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 20,
    color: 'red'
  }
});