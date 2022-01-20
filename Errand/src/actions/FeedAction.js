import React, {useCallback, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FeedScreen from '../screens/FeedScreen';

export default FeedAction = (props) => {
    const [data, setData] = useState([]);

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastVisible, setLastVisible] = useState(null)
    const [isListEnd, setIsListEnd] = useState(false)

    const [isSelectCategory, setSelectCategory] = useState(false)
    const [category, setCategory] = useState('');
    
    const posts = isSelectCategory 
        ? firestore().collection('Posts').where('category', '==', category).orderBy('id', 'desc')
        : firestore().collection('Posts').orderBy('id', 'desc')
            
    useEffect(() => {
        getFeed()
    }, [category])
    
    const getFeed = () => {
        setRefreshing(true)

        posts
        .limit(5)
        .get()
        .then(querySnapshot => {
            const documentData = [];

            querySnapshot.forEach(documentSnapshot => {
                documentData.push({
                    ...documentSnapshot.data(),
                });
            });

            setData(documentData);
            setRefreshing(false);

            if(querySnapshot.size > 0) {
                let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['id'];
                setLastVisible(lastVisible);
                setIsListEnd(false);
            } else {
                setIsListEnd(true);
            }
        });
    }

    const getMoreFeed = () => {
        setLoading(true)

        posts
        .startAfter(lastVisible)
        .limit(5)
        .get()
        .then(querySnapshot => {
            const documentData = [];

            querySnapshot.forEach(documentSnapshot => {
                documentData.push({
                    ...documentSnapshot.data(),
                });
            });

            if(querySnapshot.size > 0) {
                let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['id'];
                setData([...data, ...documentData]);
                setLoading(false);
                setLastVisible(lastVisible);
                setIsListEnd(false)
            } else {
                setLoading(false);
                setIsListEnd(true);
            }
        });
    }

    const selectCategory = (category) => {
        if(category == '전체보기') {
            setSelectCategory(false)
        } else {
            setSelectCategory(true)
        }

        setCategory(category)
    }
    
    return <FeedScreen 
                data={data}
                loading={loading}
                refreshing={refreshing}
                getFeed={getFeed}
                getMoreFeed={getMoreFeed}
                selectCategory={selectCategory}
                isListEnd={isListEnd}
                navi={props.navigation}
                />
}