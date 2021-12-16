import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from '../components/Container';
import AuthTextInput from '../components/AuthTextInput';

export default LoginScreen = (props) => {
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Container>
      <View style={styles.titleWrapper}>
        <FontAwesomeIcon name="user-circle-o" size={100} color="#F3F2F2" />
        <Text style={styles.title}>Welcome Back</Text>
      </View>

      <View style={styles.inputWrapper}>
        {/* <AuthTextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          returnKeyType="next"
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
          left={<TextInput.Icon name={() => <AntDesignIcon name="user" size={20} color="#53B77C" />} />}
        />
        <AuthTextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
          ref={(input) => { this.secondTextInput = input; }}
          left={<TextInput.Icon name={() => <AntDesignIcon name="lock" size={20} color="#53B77C" />} />}
        /> */}
        <TextInput
          style={emailFocus ? styles.focusedInput : styles.input}
          autoCorrect={false}
          autoCapitalize='none'
          underlineColor='transparent'
          activeUnderlineColor="transparent"
          selectionColor="#292929"
          onFocus={() => {setEmailFocus(true)}}
          onBlur={() => {setEmailFocus(false)}}
          theme={{ roundness: 7, colors: {text: emailFocus ? "black" : "#999899", placeholder: emailFocus ? "transparent" : "#999899"} }}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          returnKeyType="next"
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
          left={<TextInput.Icon name={() => <AntDesignIcon name="user" size={20} color="#53B77C" />} />}
        />
        <TextInput 
          style={pwFocus ? styles.focusedInput : styles.input}
          autoCorrect={false}
          autoCapitalize='none'
          underlineColor='transparent'
          activeUnderlineColor="transparent"
          selectionColor="#292929"
          onFocus={() => {setPwFocus(true)}}
          onBlur={() => {setPwFocus(false)}}
          theme={{ roundness: 7, colors: {text: pwFocus ? "black" : "#999899", placeholder: pwFocus ? "transparent" : "#999899"} }}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
          ref={(input) => { this.secondTextInput = input; }}
          left={<TextInput.Icon name={() => <AntDesignIcon name="lock" size={20} color="#53B77C" />} />}
          />

        <Text style={{
          fontSize: 14, 
          marginLeft: 10, 
          marginBottom: props.err ? 30 : 0, 
          color: 'red'
        }}>
        {props.err}
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={{alignSelf: 'flex-end', marginBottom: 30}} onPress={() => props.navi.navigate('FindPw')} >
          <Text style={styles.textButtonText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.squareButton, {marginBottom: 35}]} onPress={() => {props.signIn(email, password)}}>
          <Text style={styles.squareButtonText}>LOGIN</Text>
        </TouchableOpacity>
      
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={{fontSize: 16}}>Don't have account? </Text>
          <TouchableOpacity onPress={() => props.navi.navigate('Register')}>
            <Text style={styles.textButtonText}>Create a new accont</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    alignItems: 'center',
    marginTop: Platform.OS === "ios" ? "18%" : "8%",
    marginBottom: Platform.OS === "ios" ? "7%" : "5%",
  },
  title: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: 32,
    padding: 10,
  },
  inputWrapper: {
    paddingHorizontal: 35,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
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
});