import React, { useState } from 'react';
import {StyleSheet, Platform, Modal, View, Text, TouchableOpacity, Animated} from 'react-native';
import { Avatar } from 'react-native-elements';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default ErrandRating = (props) => {
    const navigation = useNavigation()

    const [rating, setRating] = useState([4.5])
    const [grade, setGrade] = useState('')

    const [opacityAnim, setOpacityAnim] = useState(new Animated.Value(0));
    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(3));

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


    const addScore = (score) => {
        firestore()
            .collection('Users')
            .doc(props.erranderEmail)
            .get()
            .then(documentSnapshot => {
                let grade_t = documentSnapshot.data()['grade_t']
                let grade_n = documentSnapshot.data()['grade_n']
                let newGrade = Math.round(((grade_t + score) / (grade_n + 1)) * 100) / 100
                giveGrades(score, newGrade)
            })
    }
    const giveGrades = (score, newGrade) => {
        const grade_t_increment = firestore.FieldValue.increment(score);
        const grade_n_increment = firestore.FieldValue.increment(1);

        firestore()
            .collection('Users')
            .doc(props.erranderEmail)
            .update({
                grade_t: grade_t_increment,
                grade_n: grade_n_increment,
                grade: newGrade,
            })
            .then(() => {
                console.log('errand grade updated')
                finishErrand()
            })
    }
    const finishErrand = () => {
        firestore()
            .collection('Posts')
            .doc(props.id.toString())
            .update({
              process: "finished",
            })
            .then(() => {
                props.onRequestClose()
                navigation.navigate('MyErrand')
            })
            .catch(err => { console.log(err) })
    }

    return (
        <Modal 
            visible={props.visible}
            onRequestClose={props.onRequestClose}
            animationType="fade"
            transparent={true}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={props.onRequestClose}>
                            <Icon name='close' size={26} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileWrap}>
                        <View style={{flexDirection: 'row', marginRight: 80, alignItems: 'center'}}>
                            {/* Errander 프로필 사진 */}
                            <Avatar 
                                rounded
                                size="medium"
                                source={{uri: props.erranderImage}} 
                                overlayContainerStyle={{backgroundColor: 'lightgray'}}
                                containerStyle={{marginRight: 12}}
                            /> 

                            {/* Errander 닉네임, 등급 */}
                            <View style={{flexDirection: 'column'}}>
                                <Text style={{fontSize: 16, fontWeight: '700', color: '#090909', marginBottom: 8}}>
                                    {props.errander}
                                </Text>
                                <View style={{flexDirection: 'row'}}>
                                    <FIcon name="graduation-cap" size={16} color="#4CA374" style={{marginRight: 4}}/>
                                    <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', color: 'black'}}>
                                        {props.erranderGrade}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* 심부름 금액 */}
                        <View style={{flexDirection: 'column'}}>
                            <Text style={{fontSize: 14, color: "gray", marginBottom: 9}}>
                                금액
                            </Text>
                            <Text style={{fontSize: 15, fontWeight: '600', color: "black"}}>
                                {props.errandPrice}
                            </Text>
                        </View>
                        
                        {/* 심부름 소요 시간 */}
                        <View style={{flexDirection: 'column'}}>
                            <Text style={{fontSize: 14, color: "gray", marginBottom: 9}}>
                                소요시간
                            </Text>
                            <Text style={{fontSize: 15, fontWeight: '600', color: "black"}}>
                                27m
                            </Text>
                        </View>
                    </View>

                    <View style={styles.ratingWrap}>
                        <Text style={{fontSize: 17, fontWeight: '600', color: "black", marginBottom: 15}}>
                            Errander의 점수를 매겨주세요!
                        </Text>
                        <MultiSlider 
                            values={rating}
                            onValuesChange={value => setRating(value)}
                            onValuesChangeStart={() => resetMarks()}
                            onValuesChangeFinish={() => giveMarks()}
                            sliderLength={200}
                            min={0.5}
                            max={4.5}
                            step={0.5}
                            snapped={true}
                            // enableLabel={true}
                            trackStyle={{height: 30, backgroundColor: '#d1d1d1'}}
                            selectedStyle={{backgroundColor: 'orange'}}
                            unselectedStyle={{backgroundColor: '#e0e0e0'}}
                            customMarker={() => (<Icon name="edit" size={34} color='black' style={styles.ratingSliderBar}/>)}
                            // customLabel={CustomLabel}
                        />

                        <Animated.View style={{opacity: opacityAnim, transform: [{scale: scaleAnim}]}}>
                            <Text style={styles.grade}>{grade}</Text>
                        </Animated.View>
                    </View>

                    <View style={styles.submitWrap}>
                        <TouchableOpacity style={styles.submitButton} onPress={() => addScore(rating[0])}>
                            <Text style={styles.submitButtonText}>심부름 완료</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },
    modalView: {
        flex: Platform.OS == 'ios' ? 0.6 : 0.75,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
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
        marginBottom: 10,
    },
    ratingWrap: {
        padding: 18,
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingSliderBar: {
        backgroundColor: 'transparent',
        bottom: -15,
        right: -13,
        transform: [{ rotate: '90deg'}]
    },
    grade: {
        minWidth: 80,
        fontSize: 60,
        fontFamily: 'Caveat-Bold', 
        color: 'red',
        textAlign: 'center',
    },
    submitWrap: {
        paddingHorizontal: 40,
    },
    submitButton: {
        backgroundColor: '#53B77C',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})