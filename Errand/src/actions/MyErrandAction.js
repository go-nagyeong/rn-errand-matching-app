import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import MyErrandScreen from '../screens/MyErrand/MyErrandScreen';

export default MyErrandAction = (props) => {
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


    const getMyErrand = () => {
        setRefreshing(true)
        
        firestore()
        .collection('Posts')
        .where('writerEmail', '==', auth().currentUser.email)
        .where('process', '!=', 'finished')
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

        firestore()
            .collection('Posts')
            .where('erranderEmail', '==', auth().currentUser.email)
            .where('process', '!=', 'finished')
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
                getMyErrand={getMyErrand}
                getMyPerformErrand={getMyPerformErrand}
                myErrand={myErrand}
                myPerformErrand={myPerformErrand}
                refreshing={refreshing}
            />
}