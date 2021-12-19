import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from '../components/Container';
import AuthTextInput from '../components/AuthTextInput';

export default RegisterScreen = (props) => {
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  return (
    <Container>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Register</Text>
      </View>

      <View style={styles.inputWrapper}>
        <AuthTextInput 
          placeholder="이름(별칭)"
          value={nickname}
          onChangeText={text => {setNickname(text)}}
          ref={(input) => { this.fourthTextInput = input; }}
          returnKeyType="next"
          onSubmitEditing={() => { this.fifthTextInput.focus(); }}
          blurOnSubmit={false}
          right={props.submit && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.nameErr ? "warning":"checkcircleo"} 
                size={15} 
                color={props.nameErr ? "red":"green"} 
              />} 
            />
          }
          underlineColor={props.submit ? (props.nameErr ? 'red':'#57BBC') : null}
        />
        <Text style={{fontSize: 14, marginBottom: props.nameErr ? 10 : -10, color: 'red'}}>{props.nameErr}</Text>

        <AuthTextInput 
          placeholder="안동대학교 이메일"
          value={email}
          onChangeText={text => {setEmail(text)}}
          returnKeyType="next"
          onSubmitEditing={() => { this.secondTextInput.focus(); }}
          blurOnSubmit={false}
          right={props.submit && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.emailErr ? "warning":"checkcircleo"} 
                size={15} 
                color={props.emailErr ? "red":"green"} 
              />} 
            />
          }
          underlineColor={props.submit ? (props.emailErr ? 'red':'#57BBC') : null}
        />
        <Text style={{fontSize: 14, marginBottom: props.emailErr ? 10 : -10, color: 'red'}}>{props.emailErr}</Text>

        <AuthTextInput 
          placeholder="비밀번호"
          value={password}
          onChangeText={text => {setPassword(text)}}
          secureTextEntry={true}
          ref={(input) => { this.secondTextInput = input; }}
          returnKeyType="next"
          onSubmitEditing={() => { this.thirdTextInput.focus(); }}
          blurOnSubmit={false}
          right={props.submit && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.pwErr ? "warning":"checkcircleo"} 
                size={15} 
                color={props.pwErr ? "red":"green"} 
              />} 
            />
          }
          underlineColor={props.submit ? (props.pwErr ? 'red':'#57BBC') : null}
        />
        <Text style={{fontSize: 14, marginBottom: props.pwErr ? 10 : -10, color: 'red'}}>{props.pwErr}</Text>

        <AuthTextInput 
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChangeText={text => {setConfirmPassword(text)}}
          secureTextEntry={true}
          ref={(input) => { this.thirdTextInput = input; }}
          returnKeyType="next"
          onSubmitEditing={() => { this.fourthTextInput.focus(); }}
          blurOnSubmit={false}
          right={props.submit && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.rePwErr ? "warning":"checkcircleo"} 
                size={15} 
                color={props.rePwErr ? "red":"green"} 
              />} 
            />
          }
          underlineColor={props.submit ? (props.rePwErr ? 'red':'#57BBC') : null}
        />
        <Text style={{fontSize: 14, marginBottom: props.rePwErr ? 10 : -10, color: 'red'}}>{props.rePwErr}</Text>

        <Text style={{
          fontSize: 14, 
          marginLeft: 10, 
          marginBottom: props.err ? 20 : 0, 
          color: 'red'
        }}>
        {props.err}
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={[styles.squareButton, {marginBottom: 30}]} onPress={() => {props.createUser(nickname, email, password, confirmPassword)}}>
          <Text style={styles.squareButtonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: 30,
    marginTop: Platform.OS === "ios" ? "10%" : "5%",
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: 30,
  },
  inputWrapper: {
    paddingHorizontal: 30,
    marginBottom: 10,
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