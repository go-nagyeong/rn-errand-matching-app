import React, { useState } from 'react';
import { StyleSheet, Platform, Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view'
import Icon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

export default ErranderRequest = (props) => {
    const user = auth().currentUser;
    const navigation = useNavigation()

    const accept = () => {
      Alert.alert(
        "심부름 수락",
        "심부름 요청을 수락하셨습니다.\n정말로 진행하시겠습니까?",
        [{
          text: "확인",
          onPress: () => {
            firestore()
                .collection('Posts')
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
            firestore()
                .collection('Posts')
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
            firestore()
              .collection('Chats')
              .where('post', '==', props.id)
              .get()
              .then(querySnapshot => { 
                querySnapshot.forEach(doc => 
                  doc.ref.delete()
                  .then(() =>
                    console.log('채팅 삭제 완료')
                  ) 
                )
              });

            // 채팅 삭제 (storage에 있는 이미지 & 폴더)
            deleteFolder('Chats/' + props.id);
          },
          style: "default",
        },
        {
          text: "취소",
          style: "default",
        }],
      );
    }

    // 심부름 거부 시 채팅에 있는 Storage의 이미지 삭제 
    const deleteFile = (pathToFile, fileName) => {
      const ref = storage().ref(pathToFile);
      const childRef = ref.child(fileName);
      childRef.delete();
      console.log('파일이 삭제되었습니다 (in "Storage")')
    }

    // 심부름 거부 시 채팅에 있는 Storage의 이미지 삭제 
    const deleteFolder = (path) => {
      const ref = storage().ref(path);
      ref.listAll()
        .then(dir => {
          dir.items.forEach(fileRef => deleteFile(ref.fullPath, fileRef.name));
          dir.prefixes.forEach(folderRef => deleteFolder(folderRef.fullPath));
        })
        .catch(error => console.log(error));
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
                                <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']}>
                                    <Icon name="ios-arrow-redo-sharp" size={40} color="transparent" />
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
                                    overlayContainerStyle={{ backgroundColor: '#BDBDBD' }}
                                    containerStyle={{ right: -20 }}
                                />
                                <Avatar
                                    rounded
                                    size={60}
                                    overlayContainerStyle={{ backgroundColor: '#64A8DC' }}
                                    containerStyle={{ zIndex: -1 }}
                                />
                                <Avatar
                                    rounded
                                    size={90}
                                    icon={{ name: 'user', type: 'font-awesome' }}
                                    containerStyle={{ backgroundColor: '#BDBDBD', left: -20 }}
                                />
                            </View>

                            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                                <Text style={{ includeFontPadding: false, fontSize: 18, fontFamily: 'NotoSansKR-Medium', color: '#090909', marginBottom: 8 }}>
                                    {props.errander}, {props.erranderGrade}
                                </Text>
                                <Text style={{ includeFontPadding: false, fontSize: 16, fontFamily: 'NotoSansKR-Regular', color: '#333333'}}>
                                    심부름을 하고 싶어합니다!
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginBottom: 40 }}>
                                <TouchableOpacity style={{ alignItems: 'center', marginRight: 70 }} onPress={() => {props.onRequestClose(); navigation.navigate('Chat', {id: props.id}); console.log('채팅');}}>
                                    <Icon name="chatbubbles-outline" size={40} color="#64A8DC" />
                                    <Text style={styles.buttonText}>
                                        채팅
                                    </Text>
                                </TouchableOpacity>
                                {/* reject() */}
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => reject()}> 
                                    <Icon name="ios-exit-outline" size={40} color="#777" />
                                    <Text style={styles.buttonText}>
                                        거부
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.roundButton}>
                                <TouchableOpacity onPress={() => accept()}>
                                    <Text style={styles.roundButtonText}>
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
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: 'center',
    },

    modalView: {
        backgroundColor: '#fff',
        marginHorizontal: '8%',
        borderRadius: 15,
    },
    modalDecoration: {
        position: 'absolute',
        backgroundColor: '#fff',
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
        fontFamily: 'NotoSansKR-Regular',
        color: "#090909",
        fontSize: 14,
        marginTop: 5,
    },
    roundButton: {
        backgroundColor: '#64A8DC',
        width: '100%',
        alignItems: 'center',
        padding: 14,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    roundButtonText: {
        includeFontPadding: false,
        fontFamily: 'NotoSansKR-Medium',
        color: '#fff',
        fontSize: 16,
    },
})