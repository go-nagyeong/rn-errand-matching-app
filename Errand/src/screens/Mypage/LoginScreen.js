import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../constants/Colors';
import Container from '../../components/Container';
import SubmitButton from '../../components/SubmitButton';

export default LoginScreen = (props) => {
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Container>
      <View style={styles.titleWrapper}>
        <FIcon name="map-marker-alt" size={58} color={Colors.cyan} style={{position: 'absolute', top: -12, zIndex: 1}} />
        <FIcon name="map" size={90} color={Colors.lightGray} />
        <Text style={styles.title}>AN-SIM</Text>
        <Text style={styles.subTitle}>안 동 대 학 교   심 부 름</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={emailFocus ? styles.focusedInput : styles.input}
          placeholder="ID or Email"
          value={email}
          autoCapitalize='none'
          autoCorrect={false}
          blurOnSubmit={false}
          onFocus={() => {setEmailFocus(true)}}
          onBlur={() => {setEmailFocus(false)}}
          onChangeText={text => setEmail(text)}
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          returnKeyType="next"
          selectionColor={Colors.darkGray2}
        />
        <TextInput 
          style={pwFocus ? styles.focusedInput : styles.input}
          placeholder="Password"
          value={password}
          autoCapitalize='none'
          autoCorrect={false}
          blurOnSubmit={false}
          onFocus={() => {setPwFocus(true)}}
          onBlur={() => {setPwFocus(false)}}
          onChangeText={text => setPassword(text)}
          onSubmitEditing={() => { props.signIn(email, password) }}
          selectionColor={Colors.darkGray2}
          secureTextEntry={true}
          ref={(input) => { this.secondTextInput = input; }}
        />

        <Text style={{
          fontSize: 14, 
          marginLeft: 10, 
          marginBottom: props.err ? 20 : 0, 
          color: Colors.red,
        }}>
        {props.err}
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => props.navi.navigate('ResetPw', {withdrawal: false})} >
          <Text style={styles.textButtonText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonWrapper}>
        <SubmitButton title='LOGIN' onPress={() => props.signIn(email, password)} />
      </View>
      
      <View style={styles.footer}>
        <Text style={{fontSize: 16, color: Colors.midGray}}>계정이 없으신가요? </Text>
        <TouchableOpacity onPress={() => props.navi.navigate('Register')}>
          <Text style={styles.textButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    alignItems: 'center',
    marginTop: Platform.OS === "ios" ? "20%" : "16%",
    marginBottom: Platform.OS === "ios" ? "7%" : "5%",
  },
  title: {
    marginTop: 8,
    fontWeight: '700',
    color: Colors.black,
    fontSize: 32,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.darkGray,
    fontSize: 21,
  },
  inputWrapper: {
    paddingHorizontal: 35,
  },
  input: {
    backgroundColor: Colors.white,
    marginBottom: 12,
    padding: 20,
    fontSize: 16,
    color: Colors.gray,
  },
  focusedInput: {
    backgroundColor: Colors.white,
    marginBottom: 12,
    padding: 20,
    fontSize: 16,
    color: Colors.black,
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
  buttonWrapper: {
    paddingHorizontal: 35,
    marginBottom: 34,
  },
  footer: {
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonText: {
    color: Colors.darkGray,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});