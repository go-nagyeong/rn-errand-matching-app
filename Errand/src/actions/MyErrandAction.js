import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import MyErrandScreen from '../screens/MyErrand/MyErrandScreen';

export default MyErrandAction = (props) => {
    const user = auth().currentUser;

    const [myErrandBadgeNum, setMyErrandBadgeNum] = useState(0);
    const [myPerformErrandBadgeNum, setMyPerformErrandBadgeNum] = useState(0);
  
    const posts = firestore().collection("Posts");
    posts
        .where("writerEmail", "==", user.email)
        .where("process.title", "in", ["request", "finishRequest"])
        .onSnapshot((querySnapshot) => {
            setMyErrandBadgeNum(querySnapshot.size);
        });
    posts
        .where("erranderEmail", "==", user.email)
        .where("process.title", "==", "matching")
        .onSnapshot((querySnapshot) => {
            setMyPerformErrandBadgeNum(querySnapshot.size);
        });


    const [refreshing, setRefreshing] = useState(false)
    const [myErrand, setMyErrand] = useState();
    const [myPerformErrand, setMyPerformErrand] = useState();

    // 해당 화면에 focus가 있을 때 수행하는 작업
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getMyErrand()
            getMyPerformErrand()
        });
      
        return unsubscribe;
    }, [props.navigation]);


    const getMyErrand = async () => {
        setRefreshing(true)
        
        posts
            .where('writerEmail', '==', auth().currentUser.email)
            .where('process.myErrandOrder', '!=', 5)
            .orderBy('process.myErrandOrder', 'asc')
            .orderBy('id', 'desc')
            .get()
            .then(querySnapshot => {
                let documentData = [];

                querySnapshot.forEach(documentSnapshot => {
                    documentData.push({
                        ...documentSnapshot.data()
                    })
                })
                setMyErrand(documentData);

                setRefreshing(false)
            })
    }
    const getMyPerformErrand = () => {
        setRefreshing(true)

        posts
            .where('erranderEmail', '==', auth().currentUser.email)
            .where('process.myPerformErrandOrder', '<=', 3)
            .orderBy('process.myPerformErrandOrder', 'asc')
            .orderBy('id', 'desc')
            .get()
            .then(querySnapshot => {
                let documentData = [];

                querySnapshot.forEach(documentSnapshot => {
                    documentData.push({
                        ...documentSnapshot.data()
                    })
                })
                setMyPerformErrand(documentData);
                
                setRefreshing(false)
            })
    }

    return <MyErrandScreen
                myErrandBadgeNum={myErrandBadgeNum}
                myPerformErrandBadgeNum={myPerformErrandBadgeNum}
                getMyErrand={getMyErrand}
                getMyPerformErrand={getMyPerformErrand}
                myErrand={myErrand}
                myPerformErrand={myPerformErrand}
                refreshing={refreshing}
            />
}