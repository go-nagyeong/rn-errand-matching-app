import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { AirbnbRating } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import Moment from 'moment';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';
import MiniSubmitButton from '../../components/MiniSubmitButton';

export default ErrandRating = (props) => {
    const currentUser = Firebase.currentUser != null ? Firebase.currentUser : auth().currentUser

    const { visible, onRequestClose, postId, price, category, process, destination, arrive, opponentEmail, getErrand, matchingTime, finishTime } = props;
    const [opponentGrade, setOpponentGrade] = useState('');
    const [opponentName, setOpponentName] = useState('');
    // 상대방 닉네임과 등급 불러오기
    useEffect(() => {
        Firebase.usersRef
            .doc(opponentEmail)
            .get()
            .then(doc => {
                if (doc.exists) {
                    let gradeNum = doc.data().grade
                    setOpponentGrade(Common.calculateGrade(gradeNum))
                    setOpponentName(doc.data().nickname)
                }
            })
    }, [])

    // 심부름 소요 시간 계산
    const start = matchingTime && Moment(matchingTime.toDate())
    const end = finishTime && Moment(finishTime.toDate())
    const duration = end && end.diff(start, 'minutes')
    const errandDuration = duration && duration >= 60 ? parseInt(duration/60) + '시간 ' + duration%60 + '분' : duration + '분'


    const [rating, setRating] = useState(4.5)
    // 상대방 평점 작성
    const addScore = () => {
        Firebase.usersRef
            .doc(opponentEmail)
            .get()
            .then(documentSnapshot => {
                if(documentSnapshot.exists) {
                    let grade_t = documentSnapshot.data()['grade_t']
                    let grade_n = documentSnapshot.data()['grade_n']
                    let newGrade = Math.round(((grade_t + rating) / (grade_n + 1)) * 100) / 100
                    giveGrades(newGrade)
                }
            })
            .catch(err => console.log(err))
    }

    const giveGrades = (newGrade) => {
        const grade_t_increment = firestore.FieldValue.increment(rating);
        const grade_n_increment = firestore.FieldValue.increment(1);

        Firebase.usersRef
            .doc(opponentEmail)
            .update({
                grade_t: grade_t_increment,
                grade_n: grade_n_increment,
                grade: newGrade,
            })
            .then(() => {
                if (process === 'matching') {
                    finishRequestErrand()
                } else {
                    finishErrand()
                }
            })
            .catch(err => console.log(err))
    }

    // 심부름 프로세스 변경
    const finishRequestErrand = () => {
        Firebase.postsRef
            .doc(postId)
            .update({
                process: {
                    title: 'finishRequest',     // regist > request > matching > finishRequest > finished
                    myErrandOrder: 2,           // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
                    myPerformErrandOrder: 3,    // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
                },
                finishTime: new Date(),
                errander: currentUser.displayName  // 완료된 게시물에서는 최신 닉네임 반영 안되게 닉네임 필드 삽입
            })
            .then(() => getErrand())
            .catch(err => console.log(err))
    }
    const finishErrand = () => {
        Firebase.postsRef
            .doc(postId)
            .update({
                process: {
                    title: 'finished',          // regist > request > matching > finishRequest > finished
                    myErrandOrder: 5,           // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
                    myPerformErrandOrder: 5,    // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
                },
                errandDuration: errandDuration,
                writer: currentUser.displayName  // 완료된 게시물에서는 최신 닉네임 반영 안되게 닉네임 필드 삽입
            })
            .then(() => {
                getErrand()

                Firebase.chatsRef
                    .where('post', '==', postId)
                    .get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            doc.ref.update({isFinished: 1})
                        })
                    })
            })
            .catch(err => console.log(err))
    }


    categoryIconStyle = {
        마트: ['lightsalmon', 'cart'],
        과제: ['mediumaquamarine', 'pencil'],
        탐색: ['mediumpurple', 'search'],
        서류: ['lightskyblue', 'paperclip'],
        공구: ['burlywood', 'gear'],
        짐: ['steelblue', 'archive'],
        생각: ['lightcoral', 'comment'],
        기타: ['darkgray', 'question']
    }

    const ReceiptItem = (props) => {
        const {title, content, style} = props;
        return (
            <View style={styles.receiptItem}>
                <Text style={[styles.receiptTitle, style]}>{title}</Text>
                <Text style={[styles.receiptContent, style]}>{content}</Text>
            </View>
        )
    }
    return (
        <Modal
            visible={visible}
            onRequestClose={onRequestClose}
            animationType="fade"
            transparent={true}
        >
            <TouchableOpacity style={styles.modalBackground} onPress={onRequestClose}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                        <View style={[styles.modalDecoration, {bottom: -1}]}>
                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(i => 
                                <View style={styles.triangle} />
                            )}
                        </View>

                        <View style={styles.modalContents}>
                            <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
                                <Icon name='close' size={26} />
                            </TouchableOpacity>

                            <View style={styles.header}>
                                <Avatar
                                    rounded
                                    size={82}
                                    icon={{ name: categoryIconStyle[category][1], type: 'evilicon', size: 44 }}
                                    containerStyle={{ backgroundColor: categoryIconStyle[category][0], marginBottom: 4 }}
                                />
                            </View>

                            <View style={styles.contents}>
                                <Text style={styles.dottedLine} numberOfLines={1} ellipsizeMode="clip">
                                    ----------------------------------------------------
                                </Text>

                                <ReceiptItem title='매칭 상대 이름' content={opponentName} />
                                <ReceiptItem title='매칭 상대 등급' content={opponentGrade} />
                                {/* 수행지, 도착지 하나라도 있으면 일단 장소 정보 띄우기 */}
                                {(destination != "" || arrive != "") && (
                                    // 둘 다 있을 경우
                                    destination != "" && arrive != "" &&
                                        <ReceiptItem title='심부름 장소' content={destination + '\n' + arrive} />
                                    // 수행지만 있을 경우
                                    || destination != "" &&
                                        <ReceiptItem title='심부름 장소' content={destination} />
                                    // 도착지만 있을 경우
                                    || arrive != "" &&
                                        <ReceiptItem title='심부름 장소' content={arrive} />
                                )}
                                {/* Errander한테는 심부름 소요시간 안 뜨게 */}
                                {process == 'finishRequest' &&
                                    <ReceiptItem title='심부름 소요시간' content={errandDuration} />
                                }

                                <Text style={styles.dottedLine} numberOfLines={1} ellipsizeMode="clip">
                                    ----------------------------------------------------
                                </Text>

                                <ReceiptItem title='심부름 금액' content={price} style={{fontWeight: '700'}} />

                                <Text style={styles.dottedLine} numberOfLines={1} ellipsizeMode="clip">
                                    ----------------------------------------------------
                                </Text>

                                <Text style={[styles.receiptTitle, {fontSize: 15, fontWeight: '600'}]}>
                                    상대의 점수를 매겨주세요!
                                </Text>

                                <View style={{marginBottom: 24}}>
                                    <AirbnbRating
                                        count={9}
                                        reviews={["F", "D0", "D+", "C0", "C+", "B0", "B+", "A0", "A+"]}
                                        defaultRating={9}
                                        size={22}
                                        onFinishRating={rating => setRating(rating/2)}
                                    />
                                </View>

                                <TouchableOpacity style={[styles.roundButton, {borderColor: categoryIconStyle[category][0]}]} onPress={() => addScore()}>
                                    <Text style={styles.roundButtonText}>완료</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={[styles.modalDecoration, {transform: [{ rotate: "180deg" }]}]}>
                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(i => 
                                <View style={styles.triangle} />
                            )}
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        width: Platform.OS === 'ios' ? '85%' : '84%',
        overflow: 'hidden',
    },
    modalDecoration: {
        flexDirection: 'row',
    },
    triangle: {
        left: -11,
        borderWidth: 11,
        borderBottomWidth: 13,
        borderTopWidth: 0,
        borderLeftColor: Colors.transparent,
        borderRightColor: Colors.transparent,
        borderBottomColor: Colors.white,
    },

    modalContents: {
        backgroundColor: Colors.white,
        padding: 26,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    header: {
        alignItems: 'center',
        marginTop: 8,
    },
    
    contents: {
    },
    dottedLine: {
        includeFontPadding: false,
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        color: Colors.midGray,
        letterSpacing: 2,
        textAlign: 'center',
        marginVertical: 12,
    },
    receiptItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    receiptTitle: {
        includeFontPadding: false,
        color: Colors.gray,
        fontSize: 14,
    },
    receiptContent: {
        color: Colors.black,
        fontSize: 14,
        textAlign: 'right',
        lineHeight: 18,
    },
    roundButton: {
        alignSelf: 'center',
        width: '40%',
        backgroundColor: Colors.white,
        borderRadius: 30,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
    },
    roundButtonText: {
        includeFontPadding: false,
        fontSize: 16,
        color: Colors.darkGray2,
    },
})