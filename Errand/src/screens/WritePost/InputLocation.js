import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';
import Container from '../../components/Container';
import MiniSubmitButton from '../../components/MiniSubmitButton';
import SpeechBalloon from '../../components/SpeechBalloon';

export default InputLocation = (props) => {
    const { color, category, price } = props.route.params;

    const InputLocation = () => {
        if (price) {
            props.navigation.navigate('WriteTitle', { color: color, category: category, price: price, arrive: arrive, destination : destination })
        } else {
            setMessage('금액을 입력해주세요.')
        }
    }

    const [title, setTitle] = useState("");
    const [titleFocus, setTitleFocus] = useState(false);

    const [destination, setDestination] = useState("");
    const [dFocus, setDFocus] = useState("");

    const [arrive, setArrive] = useState("");
    const [aFocus, setAFocus] = useState("");

    return (
        <Container>
            <View style={styles.previousState}>
                <SpeechBalloon prev='category' content={category} />
                <SpeechBalloon prev='price' content={price} />
            </View>

            <View style={styles.centerView}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>목적지</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <Icon name='right' size={20} color={titleFocus ? color : 'black'} />
                    <TextInput
                        style={[styles.input2, dFocus && { fontWeight: '600' }]}
                        placeholder="수행 목적지를 알려주세요."
                        value={destination}
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoFocus={true}
                        blurOnSubmit={true}
                        onSubmitEditing={() => this.secondTextInput.focus()}
                        onFocus={() => setDFocus(true)}
                        onBlur={() => setDFocus(false)}
                        onChangeText={text => setDestination(text)}
                    />
                </View>

                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>도착지</Text>
                </View>
                <View style={[styles.inputWrapper, {marginBottom: 70}]}>
                    <Icon name='right' size={20} color={titleFocus ? color : 'black'} />
                    <TextInput
                        style={[styles.input2, aFocus && { fontWeight: '600' }]}
                        placeholder="수행후 도착지를 알려주세요."
                        value={arrive}
                        autoCapitalize='none'
                        autoCorrect={false}
                        blurOnSubmit={true}
                        ref={(input) => this.secondTextInput = input}
                        returnKeyType="done"
                        onSubmitEditing={() => InputLocation()}
                        onFocus={() => setAFocus(true)}
                        onBlur={() => setAFocus(false)}
                        onChangeText={text => setArrive(text)}
                    />
                </View>

                <MiniSubmitButton
                    title={(destination !== "" || arrive !== "") ? 'OK' : 'SKIP'} 
                    backgroundColor={color}
                    onPress={() => InputLocation()} />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    previousState: {
        flex: 1,
        paddingTop: 20,
        marginBottom: 15,
    },

    centerView: {
        flex: 1,
        paddingHorizontal: 30,
    },
    titleWrapper: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontWeight: '600',
        color: Colors.black,
        fontSize: 24,
        padding: 10,
    },
    inputWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 20 : 10,
        marginBottom: 30,

        backgroundColor: Colors.white,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.3,
                shadowRadius: 5,
                shadowOffset: { width: 6, height: 3 },
            },
            android: {
                elevation: 3,
            },
        })
    },
    input: {
        width: '85%',
        fontSize: 16,
        marginHorizontal: 10,
    },
    input2: {
        width: '85%',
        height: 150,
        fontSize: 16,
        marginHorizontal: 10,
        maxHeight: 50,
    },
});