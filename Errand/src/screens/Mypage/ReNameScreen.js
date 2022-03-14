import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Fontisto';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from '../../components/Container';

export default ReNameScreen = (props) => {
    const [nickname, setNickname] = useState('');
    const [nicknameFocus, setNicknameFocus] = useState(false);

    useEffect(() => {
      if(nicknameFocus) {
        props.validateName(nickname);
      }
    }, [nickname]);

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Change{"\n"}Name?</Text>
                <Text style={styles.textArea}>변경할 이름을 입력해주세요.{"\n"}</Text>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    placeholder="Name"
                    value={nickname}
                    autoCapitalize='none'
                    autoCorrect={false}
                    blurOnSubmit={false}
                    onFocus={() => {setNicknameFocus(true);}}
                    onBlur={() => {setNicknameFocus(false);}}
                    onChangeText={text => {setNickname(text)}}
                    onSubmitEditing={() => {props.changeName(nickname)}}
                    selectionColor="#292929"
                    // react-native-paper
                    activeUnderlineColor='#53B77C'
                    left={<TextInput.Icon name={() => <Icon name="email" size={20} color="#53B77C" />} />}
                    right={
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

                {/* <Text style={{
                    fontSize: 14,
                    // marginBottom: props.err ? 30 : 0, 
                    // color: props.err.charAt(0) === "비" ? 'green' : 'red'
                }}>
                {props.err}
                </Text> */}
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity style={styles.squareButton} onPress={() => {props.changeName(nickname)}}>
                    <Text style={styles.squareButtonText}>{nickname && !props.err ? "전송" : "이름 변경하기"}</Text>
                </TouchableOpacity>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    titleWrapper: {
        marginLeft: 30,
        marginTop: Platform.OS === "ios" ? "15%" : "10%",
        marginBottom: 40,
    },
    title: {
        fontFamily: 'Roboto-Medium',
        color: 'black',
        fontSize: 32,
        lineHeight: 45,        
    },
    textArea: {
        fontFamily: 'Roboto-Light',
        color: 'black',
        fontSize: 16,
        marginTop: 25,
    },
    inputWrapper: {
        paddingHorizontal: 35,
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
})