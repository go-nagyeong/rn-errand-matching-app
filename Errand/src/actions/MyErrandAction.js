import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import MyErrandScreen from '../screens/MyErrand/MyErrandScreen';

export default MyErrandAction = () => {
    const user = auth().currentUser;

    const [erranderEmail, setErranderEmail] = useState('')
    const [erranderName, setErranderName] = useState('')
    const [erranderGradeNum, setErranderGradeNum] = useState()
    const [erranderGrade, setErranderGrade] = useState('')
    const [erranderImage, setErranderImage] = useState('')

    const [errandPrice, setErrandPrice] = useState()

    useEffect(() => {
        getErrandInfo()
    }, [])
    useEffect(() => {
        getErranderInfo()
    }, [erranderEmail])

    
    const calculateGrade = (gradeNum) => {
        if (gradeNum >= 4.1) {
            return 'A+';
        } else if (gradeNum >= 3.6) {
            return 'A0';
        } else if (gradeNum >= 3.1) {
            return 'B+';
        } else if (gradeNum >= 2.6) {
            return 'B0';
        } else if (gradeNum >= 2.1) {
            return 'C+';
        } else if (gradeNum >= 1.6) {
            return 'C0';
        } else if (gradeNum >= 1.1) {
            return 'D+';
        } else if (gradeNum >= 0.6) {
            return 'D0';
        } else {
            return 'F';
        }
    }

    const getErrandInfo = () => {
        firestore()
        .collection('Posts')
        .where('writer', '==', user.displayName)
        .where('process', '==', 'matching')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                setErranderEmail(documentSnapshot.data()['erranderEmail'])
                setErranderName(documentSnapshot.data()['errander'])

                setErrandPrice(documentSnapshot.data()['price'])
            });
        })
    }
    const getErranderInfo = () => {
        firestore()
        .collection('Users')
        .doc(erranderEmail)
        .get()
        .then(documentSnapshot => {
            if(documentSnapshot.exists) {
                let gradeNum = documentSnapshot.data()['grade']
                setErranderGradeNum(gradeNum)
                setErranderGrade(calculateGrade(gradeNum))
            }
        })
        
        storage()
        .ref('Users/' + erranderEmail)
        .getDownloadURL()
        .then(url => {
            setErranderImage(url)
        })
        .catch(e => console.log(e));
    }


    const addScore = (score) => {
        firestore()
        .collection('Users')
        .doc(erranderEmail)
        .get()
        .then(documentSnapshot => {
            let grade_t = documentSnapshot.data()['grade_t']
            let grade_n = documentSnapshot.data()['grade_n']
            let newGrade = Math.round(((grade_t+score) / (grade_n+1)) * 100) / 100
            giveGrades(score, newGrade)
        })
    }
    const giveGrades = (score, newGrade) => {
        const grade_t_increment = firestore.FieldValue.increment(score);
        const grade_n_increment = firestore.FieldValue.increment(1);

        firestore()
        .collection('Users')
        .doc(erranderEmail)
        .update({
            grade_t: grade_t_increment,
            grade_n: grade_n_increment,
            grade: newGrade,
        })
        .then(() => {
            console.log('errand grade updated')
        })
    }

    return <MyErrandScreen 
                erranderInfo={[erranderName, erranderGrade, erranderImage]}
                errandPrice={errandPrice}
                calculateGrade={calculateGrade}
                addScore={addScore}
            />
}