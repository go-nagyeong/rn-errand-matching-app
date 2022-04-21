import React, { useEffect, useState } from 'react';

import * as Firebase from '../utils/Firebase';
import MyErrandScreen from '../screens/MyErrand/MyErrandScreen';

export default MyErrandAction = (props) => {
    const [myErrandBadgeNum, setMyErrandBadgeNum] = useState(0);
    const [myPerformErrandBadgeNum, setMyPerformErrandBadgeNum] = useState(0);
  
    useEffect(() => {
        const unsubscribe1 = Firebase.postsRef
            .where("writerEmail", "==", Firebase.currentUser.email)
            .where("process.title", "in", ["request", "finishRequest"])
            .onSnapshot((querySnapshot) => {
                setMyErrandBadgeNum(querySnapshot.size);
            });
        const unsubscribe2 = Firebase.postsRef
            .where("erranderEmail", "==", Firebase.currentUser.email)
            .where("process.title", "==", "matching")
            .onSnapshot((querySnapshot) => {
                setMyPerformErrandBadgeNum(querySnapshot.size);
            });
        
        return unsubscribe1, unsubscribe2;
    }, [])


    const [refreshingL, setRefreshingL] = useState(false)
    const [refreshingR, setRefreshingR] = useState(false)
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


    const getMyErrand = () => {
        setRefreshingL(true)
        
        Firebase.postsRef
            .where('writerEmail', '==', Firebase.currentUser.email)
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

                setRefreshingL(false)
            })
    }
    const getMyPerformErrand = () => {
        setRefreshingR(true)

        Firebase.postsRef
            .where('erranderEmail', '==', Firebase.currentUser.email)
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
                
                setRefreshingR(false)
            })
    }

    return <MyErrandScreen
                myErrandBadgeNum={myErrandBadgeNum}
                myPerformErrandBadgeNum={myPerformErrandBadgeNum}
                getMyErrand={getMyErrand}
                getMyPerformErrand={getMyPerformErrand}
                myErrand={myErrand}
                myPerformErrand={myPerformErrand}
                refreshingL={refreshingL}
                refreshingR={refreshingR}
            />
}