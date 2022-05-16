import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';
import Container from '../../components/Container';
import SubmitButton from '../../components/SubmitButton';

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
        <Text style={styles.title}>회원가입</Text>
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
          selectionColor={Colors.darkGray2}
          // react-native-paper
          underlineColor={props.nameIsEdited ? (props.nameErr ? Colors.red : Colors.cyan) : null}
          activeUnderlineColor={props.nameErr ? Colors.red : Colors.cyan}
          right={props.nameIsEdited && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.nameErr ? "warning" : "checkcircleo"} 
                size={15} 
                color={props.nameErr ? Colors.red : Colors.cyan} 
              />} 
            />
          }
        />
        <Text style={{fontSize: 14, marginBottom: props.nameErr ? 10 : -10, color: Colors.red}}>{props.nameErr}</Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput 
            style={[styles.input, {width: '50%'}]}
            placeholder="학교 이메일"
            value={id}
            autoCapitalize='none'
            autoCorrect={false}
            blurOnSubmit={false}
            onFocus={() => {setIdFocus(true)}}
            onBlur={() => {setIdFocus(false)}}
            onChangeText={text => {setId(text)}}
            onSubmitEditing={() => {this.thirdTextInput.focus()}}
            selectionColor={Colors.darkGray2}
            ref={(input) => { this.secondTextInput = input; }}
            // react-native-paper
            underlineColor={props.idIsEdited ? (props.idErr ? Colors.red : Colors.cyan) : null}
            activeUnderlineColor={props.idErr ? Colors.red : Colors.cyan}
            right={props.idIsEdited && 
              <TextInput.Icon name={() => 
                <AntDesignIcon 
                  name={props.idErr ? "warning" : "checkcircleo"} 
                  size={15} 
                  color={props.idErr ? Colors.red : Colors.cyan} 
                />} 
              />
            }
          />
          <Text style={{fontSize: 16, paddingBottom: 12}}> @student.anu.ac.kr</Text>
        </View>
        <Text style={{fontSize: 14, marginBottom: props.idErr ? 10 : -10, color: Colors.red}}>{props.idErr}</Text>

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
          selectionColor={Colors.darkGray2}
          secureTextEntry={true}
          ref={(input) => { this.thirdTextInput = input; }}
          // react-native-paper
          underlineColor={props.pwIsEdited ? (props.pwErr ? Colors.red : Colors.cyan) : null}
          activeUnderlineColor={props.pwErr ? Colors.red : Colors.cyan}
          right={props.pwIsEdited && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.pwErr ? "warning" : "checkcircleo"} 
                size={15} 
                color={props.pwErr ? Colors.red : Colors.cyan} 
              />} 
            />
          }
        />
        <Text style={{fontSize: 14, marginBottom: props.pwErr ? 10 : -10, color: Colors.red}}>{props.pwErr}</Text>

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
          selectionColor={Colors.darkGray2}
          secureTextEntry={true}
          ref={(input) => { this.fourthTextInput = input; }}
          // react-native-paper
          underlineColor={props.rePwIsEdited ? (props.rePwErr ? Colors.red : Colors.cyan) : null}
          activeUnderlineColor={props.rePwErr ? Colors.red : Colors.cyan}
          right={props.rePwIsEdited && 
            <TextInput.Icon name={() => 
              <AntDesignIcon 
                name={props.rePwErr ? "warning" : "checkcircleo"} 
                size={15} 
                color={props.rePwErr ? Colors.red : Colors.cyan} 
              />} 
            />
          }
        />
        <Text style={{fontSize: 14, marginBottom: props.rePwErr ? 10 : -10, color: Colors.red}}>{props.rePwErr}</Text>

        <Text style={{
          fontSize: 14, 
          marginLeft: 10, 
          marginBottom: props.err ? 20 : 0, 
          color: Colors.red
        }}>
        {props.err}
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <SubmitButton title="REGISTER" onPress={() => props.createUser(nickname, id, password, confirmPassword)} />
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
    includeFontPadding: false,
    fontWeight: '600',
    color: Colors.black,
    fontSize: 28,
  },
  inputWrapper: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  input: {
    backgroundColor: Colors.white,
    marginBottom: 12,
  },
  buttonWrapper: {
    paddingHorizontal: 35,
  },
});