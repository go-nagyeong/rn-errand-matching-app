import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from '../components/Container';

export default RegisterScreen = (props) => {
  const [nicknameFocus, setNicknameFocus] = useState(false);
  const [idFocus, setIdFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const [rePwFocus, setRePwFocus] = useState(false);

  const [nickname, setNickname] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 입력 항목을 실시간으로 감지 하면서 해당하는 함수를 호출
  useEffect(() => { 
    if(nicknameFocus) {
      props.validateName(nickname)
    }
  }, [nickname])

  useEffect(() => { 
    if(idFocus) {
      props.validateId(id)
    }
  }, [id])

  useEffect(() => { 
    if(pwFocus) {
      props.validatePassword(password)
    }
  }, [password])

  useEffect(() => { 
    if(rePwFocus) {
      props.validateRePassword(password, confirmPassword)
    }
  }, [confirmPassword])


  return (
    <Container>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Register</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput 
          style={styles.input}
          placeholder="이름(별칭)"
          value={nickname}
          autoCapitalize='none'
          autoCorrect={false}
          blurOnSubmit={false}
          onFocus={() => {setNicknameFocus(true)}}
          onBlur={() => {setNicknameFocus(false)}}
          onChangeText={text => {setNickname(text)}}
          onSubmitEditing={() => {this.secondTextInput.focus()}}
          selectionColor="#292929"
          // react-native-paper
          underlineColor={props.nameIsEdited ? (props.nameErr ? 'red':'#53B77C') : null}
          activeUnderlineColor={props.nameErr ? 'red':'#53B77C'}
          right={props.nameIsEdited && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.nameErr ? "warning":"checkcircleo"} 
                size={15} 
                color={props.nameErr ? "red":"green"} 
              />} 
            />
          }
        />
        <Text style={{fontSize: 14, marginBottom: props.nameErr ? 10 : -10, color: 'red'}}>{props.nameErr}</Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput 
            style={[styles.input, {width: '45%'}]}
            placeholder="학번"
            value={id}
            autoCapitalize='none'
            autoCorrect={false}
            blurOnSubmit={false}
            onFocus={() => {setIdFocus(true)}}
            onBlur={() => {setIdFocus(false)}}
            onChangeText={text => {setId(text)}}
            onSubmitEditing={() => {this.thirdTextInput.focus()}}
            selectionColor="#292929"
            ref={(input) => { this.secondTextInput = input; }}
            maxLength={8}
            // react-native-paper
            underlineColor={props.idIsEdited ? (props.idErr ? 'red':'#53B77C') : null}
            activeUnderlineColor={props.idErr ? 'red':'#53B77C'}
            right={props.idIsEdited && 
              <TextInput.Icon name={() => 
                <AntDesignIcon 
                  name={props.idErr ? "warning":"checkcircleo"} 
                  size={15} 
                  color={props.idErr ? "red":"green"} 
                />} 
              />
            }
          />
          <Text style={{fontSize: 16, paddingBottom: 12}}> @student.anu.ac.kr</Text>
        </View>
        <Text style={{fontSize: 14, marginBottom: props.idErr ? 10 : -10, color: 'red'}}>{props.idErr}</Text>

        <TextInput 
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          autoCapitalize='none'
          autoCorrect={false}
          blurOnSubmit={false}
          onFocus={() => {setPwFocus(true)}}
          onBlur={() => {setPwFocus(false)}}
          onChangeText={text => {setPassword(text)}}
          onSubmitEditing={() => {this.fourthTextInput.focus()}}
          selectionColor="#292929"
          secureTextEntry={true}
          ref={(input) => { this.thirdTextInput = input; }}
          // react-native-paper
          underlineColor={props.pwIsEdited ? (props.pwErr ? 'red':'#53B77C') : null}
          activeUnderlineColor={props.pwErr ? 'red':'#53B77C'}
          right={props.pwIsEdited && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.pwErr ? "warning":"checkcircleo"} 
                size={15} 
                color={props.pwErr ? "red":"green"} 
              />} 
            />
          }
        />
        <Text style={{fontSize: 14, marginBottom: props.pwErr ? 10 : -10, color: 'red'}}>{props.pwErr}</Text>

        <TextInput 
          style={styles.input}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          autoCapitalize='none'
          autoCorrect={false}
          blurOnSubmit={false}
          onFocus={() => {setRePwFocus(true)}}
          onBlur={() => {setRePwFocus(false)}}
          onChangeText={text => {setConfirmPassword(text)}}
          onSubmitEditing={() => {props.createUser(nickname, id, password, confirmPassword)}}
          selectionColor="#292929"
          secureTextEntry={true}
          ref={(input) => { this.fourthTextInput = input; }}
          // react-native-paper
          underlineColor={props.rePwIsEdited ? (props.rePwErr ? 'red':'#53B77C') : null}
          activeUnderlineColor={props.rePwErr ? 'red':'#53B77C'}
          right={props.rePwIsEdited && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.rePwErr ? "warning":"checkcircleo"} 
                size={15} 
                color={props.rePwErr ? "red":"green"} 
              />} 
            />
          }
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
        <TouchableOpacity style={[styles.squareButton, {marginBottom: 30}]} onPress={() => {props.createUser(nickname, id, password, confirmPassword)}}>
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
});