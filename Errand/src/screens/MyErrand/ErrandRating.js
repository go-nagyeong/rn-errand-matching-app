import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Platform, Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import MaskedView from '@react-native-community/masked-view'
import Icon from 'react-native-vector-icons/Ionicons';
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default ErrandRating = (props) => {
    const [rating, setRating] = useState([4.5])
    const [grade, setGrade] = useState('')

    const [opacityAnim, setOpacityAnim] = useState(new Animated.Value(0));
    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(3));
    
    // 평점 페이지(모달)에 접근하면 기본 별점인 A+ 마크 띄워지게
    useEffect(() => {
        if (props.visible && rating[0] == 4.5) {
            giveMarks()
        }
        setRating([4.5])  // 평점 작성 페이지를 끄면 다시 기본 별점으로 초기화
    }, [props.visible])
    
    
    // 애니메이션 효과
    const giveMarks = () => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true
            })
        ]).start();
        
        setGrade(props.calculateGrade(rating))
    };
    const resetMarks = () => {
        setOpacityAnim(new Animated.Value(0));
        setScaleAnim(new Animated.Value(3));
    }
    

    // 상대방 평점 작성
    const addScore = (score) => {
        let email = props.errandProcess === 'matching' ? props.writerEmail : props.erranderEmail;

        firestore()
            .collection('Users')
            .doc(email)
            .get()
            .then(documentSnapshot => {
                if(documentSnapshot.exists) {
                    let grade_t = documentSnapshot.data()['grade_t']
                    let grade_n = documentSnapshot.data()['grade_n']
                    let newGrade = Math.round(((grade_t + score) / (grade_n + 1)) * 100) / 100
                    giveGrades(score, email, newGrade)
                }
            })
            .catch(err => console.log(err))
    }

    const giveGrades = (score, email, newGrade) => {
        const grade_t_increment = firestore.FieldValue.increment(score);
        const grade_n_increment = firestore.FieldValue.increment(1);

        firestore()
            .collection('Users')
            .doc(email)
            .update({
                grade_t: grade_t_increment,
                grade_n: grade_n_increment,
                grade: newGrade,
            })
            .then(() => {
                if (props.errandProcess === 'matching') {
                    Alert.alert(
                        "심부름 완료 요청",
                        "요청이 전송되었습니다.",
                        [{
                            text: "확인",
                            onPress: () => finishRequestErrand(),
                            style: "cancel",
                        }],
                    );
                    
                } else {
                    Alert.alert(
                        "심부름 완료",
                        "심부름이 완료 되었습니다.",
                        [{
                            text: "확인",
                            onPress: () => finishErrand(),
                            style: "cancel",
                        }],
                    );
                }
            })
            .catch(err => console.log(err))
    }

    // 심부름 프로세스 변경
    const finishRequestErrand = () => {
        firestore()
            .collection('Posts')
            .doc(props.id + '%' + props.writerEmail)
            .update({
                process: {
                    title: 'finishRequest',     // regist > request > matching > finishRequest > finished
                    myErrandOrder: 2,           // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
                    myPerformErrandOrder: 3,    // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
                },
                finishTime: new Date(),
            })
            .then(() => props.getMyPerformErrand())
            .catch(err => console.log(err))
    }
    const finishErrand = () => {
        firestore()
            .collection('Posts')
            .doc(props.id + '%' + props.writerEmail)
            .update({
                process: {
                    title: 'finished',          // regist > request > matching > finishRequest > finished
                    myErrandOrder: 5,           // 4    > 1 > 3 > 2 > 5(X) (나의 심부름 정렬 기준)
                    myPerformErrandOrder: 5,    // 4(X) > 2 > 1 > 3 > 5(X) (내가 하고 있는 심부름 정렬 기준)
                },
            })
            .then(() => props.getMyErrand())
            .catch(err => console.log(err))
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
                                <Icon name='close' size={26} />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <View style={styles.profileWrap}>
                                {/* Errander 프로필 사진 + 닉네임 + 등급 */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar
                                        rounded
                                        size="medium"
                                        source={{ uri: props.erranderImage }}
                                        overlayContainerStyle={{ backgroundColor: 'lightgray' }}
                                        containerStyle={{ marginRight: 12 }}
                                    />

                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#090909', marginBottom: 8 }}>
                                            {props.errander}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <FIcon name="graduation-cap" size={16} color="#4CA374" style={{ marginRight: 4 }} />
                                            <Text style={{ includeFontPadding: false, fontSize: 14, fontFamily: 'Roboto-Medium', color: 'black' }}>
                                                {props.erranderGrade}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* 심부름 금액 + 소요 시간 */}
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 15 }}>
                                        <Text style={{ fontSize: 14, color: "gray", marginBottom: 9 }}>
                                            금액
                                        </Text>
                                        <Text style={{ fontSize: 15, fontWeight: '600', color: "black" }}>
                                            {props.errandPrice}
                                        </Text>
                                    </View>

                                    {props.errandProcess === 'finishRequest' && 
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 14, color: "gray", marginBottom: 9 }}>
                                                소요시간
                                            </Text>
                                            <Text style={{ fontSize: 15, fontWeight: '600', color: "black" }}>
                                                {props.errandDuration}
                                            </Text>
                                        </View>
                                    }
                                </View>
                            </View>

                            <View style={styles.ratingWrap}>
                                <Text style={{ includeFontPadding: false, fontSize: 17, fontFamily: 'NotoSansKR-Medium', color: "black", marginBottom: 20 }}>
                                    {props.errandProcess === 'matching' && 'Errandee'
                                    || props.errandProcess === 'finishRequest' && 'Errander'}
                                    의 점수를 매겨주세요!
                                </Text>

                                <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={{overflow: 'visible', marginBottom: 15}} >
                                    <MultiSlider
                                        containerStyle={{height: 30}}
                                        values={rating}
                                        onValuesChange={value => setRating(value)}
                                        onValuesChangeStart={() => resetMarks()}
                                        onValuesChangeFinish={() => giveMarks()}
                                        sliderLength={200}
                                        min={0.5}
                                        max={4.5}
                                        step={0.5}
                                        snapped={true}
                                        trackStyle={{ height: 30, backgroundColor: '#d1d1d1' }}
                                        selectedStyle={{ backgroundColor: 'transparent' }}
                                        unselectedStyle={{ backgroundColor: '#e0e0e0' }}
                                        customMarker={() => (<AIcon name="edit" size={34} color='#090909' style={styles.ratingSliderBar} />)}
                                    />
                                </LinearGradient>

                                <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
                                    <Text style={styles.grade}>{grade}</Text>
                                </Animated.View>
                            </View>

                            <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']} style={styles.roundButton}>
                                <TouchableOpacity onPress={() => addScore(rating[0])}>
                                    <Text style={styles.roundButtonText}>
                                        {props.errandProcess === 'matching' && '완료 요청'
                                        || props.errandProcess === 'finishRequest' && '완료'}
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
        marginHorizontal: '4%',
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

    profileWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#D1D1D6',
        marginBottom: 25,
    },
    ratingWrap: {
        alignItems: 'center',
        marginBottom: 15,
    },
    ratingSliderBar: {
        backgroundColor: 'transparent',
        bottom: -15,
        right: -13,
        transform: [{ rotate: '90deg' }]
    },
    grade: {
        minWidth: 80,
        fontSize: 60,
        fontFamily: 'Caveat-Bold',
        color: 'red',
        textAlign: 'center',
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