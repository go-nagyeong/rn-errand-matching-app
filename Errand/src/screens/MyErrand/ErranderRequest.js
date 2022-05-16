import React, { useState } from 'react';
import { StyleSheet, Platform, Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view'
import Icon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';

export default ErranderRequest = (props) => {
    const { item } = props;

    const navigation = useNavigation()

    const accept = () => {
      Alert.alert(
        "심부름 수락",
        "심부름 요청을 수락하셨습니다.\n정말로 진행하시겠습니까?",
        [{
          text: "확인",
          onPress: () => {
            Firebase.postsRef
                .doc(props.id + '%' + props.writerEmail)
                .update({
                    process: {
                        title: 'matching',          // regist > request > matching > finishRequest > finished
                        myErrandOrder: 3,           // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
                        myPerformErrandOrder: 1,    // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
                    },
                    matchingTime: new Date(),
                })
                .then(() => props.getMyErrand())
                .catch(err => console.log(err))
          },
          style: "default",
        },
        {
          text: "취소",
          style: "default",
        }],
      )
    }
  
    const reject = () => {
      Alert.alert(
        "심부름 거부",
        "심부름 요청을 거부하셨습니다.\n다른 Errander를 기다리시겠습니까?",
        [{
          text: "확인",
          onPress: () => {
            Firebase.postsRef
                .doc(props.id + '%' + props.writerEmail)
                .update({
                    process: {
                        title: 'regist',          // regist > request > matching > finishRequest > finished
                        myErrandOrder: 4,         // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
                        myPerformErrandOrder: 4,  // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
                    },
                    errander: "",
                    erranderEmail: "",
                })
                .then(() => props.getMyErrand())
                .catch(err => console.log(err));

            // 채팅 삭제 (firestore에 있는 텍스트)
            Firebase.chatsRef
                .where('post', '==', props.id + '%' + props.writerEmail)
                .get()
                .then(querySnapshot => { 
                    querySnapshot.forEach(doc => doc.ref.delete())
                })
                .catch(err => console.log(err));

            // 채팅 삭제 (storage에 있는 이미지 & 폴더)
            storage()
                .ref('Chats/' + props.id + '%' + props.writerEmail)
                .listAll()
                .then(dir => {
                    dir.items.forEach(fileRef => {
                        storage()
                            .ref(fileRef.path)
                            .delete()
                            .then(() => console.log('성공'))
                        
                    })
                })
                .catch(err => console.log(err));
          },
          style: "default",
        },
        {
          text: "취소",
          style: "default",
        }],
      );
    }

    return (
        <Modal
            visible={props.visible}
            onRequestClose={props.onRequestClose}
            animationType="fade"
            transparent={true}
        >
            <TouchableOpacity style={styles.modalBackground} onPress={props.onRequestClose}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                        <View style={styles.modalDecoration}>
                            <MaskedView maskElement={<Icon name="ios-arrow-redo-sharp" size={40} />}>
                                <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}>
                                    <Icon name="ios-arrow-redo-sharp" size={40} color={Colors.transparent} />
                                </LinearGradient> 
                            </MaskedView>
                        </View>

                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={props.onRequestClose}>
                                <AIcon name='close' size={26} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContents}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                <Avatar
                                    rounded
                                    size={90}
                                    source={{ uri: props.erranderImage }}
                                    containerStyle={{ backgroundColor: Colors.lightGray2, right: -20 }}
                                />
                                <Avatar
                                    rounded
                                    size={60}
                                    containerStyle={{ backgroundColor: Colors.cyan, zIndex: -1 }}
                                />
                                <Avatar
                                    rounded
                                    size={90}
                                    icon={{ name: 'user', type: 'font-awesome' }}
                                    containerStyle={{ backgroundColor: Colors.lightGray2, left: -20 }}
                                />
                            </View>

                            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                                <Text style={{ includeFontPadding: false, fontSize: 18, fontWeight: '500', color: Colors.black, marginBottom: 8 }}>
                                    {props.erranderName}, {props.erranderGrade}
                                </Text>
                                <Text style={{ includeFontPadding: false, fontSize: 16, color: Colors.darkGray}}>
                                    심부름을 하고 싶어합니다!
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginBottom: 40 }}>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', marginRight: 70 }}
                                    onPress={() => {
                                        props.onRequestClose();
                                        navigation.navigate('Chat', {
                                            id: props.id, writerEmail: props.writerEmail, erranderEmail: props.erranderEmail, errandInfo: item
                                        })
                                    }}
                                >
                                    <Icon name="chatbubbles-outline" size={40} color={Colors.cyan} />
                                    <Text style={styles.buttonText}>
                                        채팅
                                    </Text>
                                </TouchableOpacity>
                                {/* reject() */}
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => reject()}> 
                                    <Icon name="ios-exit-outline" size={40} color={Colors.gray} />
                                    <Text style={styles.buttonText}>
                                        거부
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} style={styles.fullButton}>
                                <TouchableOpacity onPress={() => accept()}>
                                    <Text style={styles.fullButtonText}>
                                        수락
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: Colors.translucent,
        justifyContent: 'center',
    },

    modalView: {
        backgroundColor: Colors.white,
        marginHorizontal: '8%',
        borderRadius: 15,
    },
    modalDecoration: {
        position: 'absolute',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        width: 80,
        height: 80,
        borderRadius: 60,
        top: -40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        ...Platform.select({
            ios: {
              shadowOpacity: 0.1,
              shadowRadius: 4,
              shadowOffset: {width: 2, height: 4},
            },
            android: {
              elevation: 6,
            },
        }),
    },

    modalHeader: {
        padding: 12,
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    modalContents: {
        alignItems: 'center',
    },

    buttonText: {
        includeFontPadding: false,
        color: Colors.black,
        fontSize: 14,
        marginTop: 5,
    },
    fullButton: {
        width: '100%',
        alignItems: 'center',
        padding: 14,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    fullButtonText: {
        includeFontPadding: false,
        fontWeight: '700',
        color: Colors.white,
        fontSize: 16,
    },
})