import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Fontisto';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';
import Container from '../../components/Container';
import SubmitButton from '../../components/SubmitButton';

export default EditProfileScreen = (props) => {
    const { err, reauthenticate } = props;

    const [password, setPassword] = useState('');

    return (
        <Container>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>회원정보 수정</Text>
                <Text style={styles.textArea}>회원정보 수정을 위해 비밀번호 인증을 해주세요.</Text>
            </View>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    label='Email'
                    value={Firebase.currentUser.email}
                    editable={false}
                />
                <TextInput 
                    style={styles.input}
                    label='Password'
                    value={password}
                    autoCapitalize='none'
                    autoCorrect={false}
                    blurOnSubmit={false}
                    autoFocus={true}
                    onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => reauthenticate(password)}
                    selectionColor={Colors.darkGray2}
                    secureTextEntry={true}
                    // react-native-paper
                    activeUnderlineColor={Colors.cyan}
                />
                <Text style={{fontSize: 14, color: Colors.red}}>{err}</Text>
            </View>
            
            <View style={styles.buttonWrapper}>
                <SubmitButton title="확인" onPress={() => reauthenticate(password)} />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    titleWrapper: {
        marginLeft: 30,
        marginTop: "10%",
        marginBottom: 34,
    },
    title: {
        includeFontPadding: false,
        fontWeight: '600',
        color: Colors.black,
        fontSize: 30,
        marginBottom: 14,
    },
    textArea: {
        fontWeight: '300',
        color: Colors.black,
        fontSize: 16,
    },
    inputWrapper: {
        paddingHorizontal: 35,
        marginBottom: 34,
    },
    input: {
        backgroundColor: Colors.white,
        marginBottom: 12,
    },
    buttonWrapper: {
        paddingHorizontal: 35,
        marginBottom: 34,
    },
})