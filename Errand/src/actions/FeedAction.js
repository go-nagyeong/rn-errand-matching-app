import React, {useCallback, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FeedScreen from '../screens/FeedScreen';

export default FeedAction = () => {
    const [data, setData] = useState([]);

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastVisible, setLastVisible] = useState(null)
    const [isListEnd, setIsListEnd] = useState(false)

    const [isSelectCategory, setSelectCategory] = useState(false)
    const [category, setCategory] = useState('');
    const [isSearchKeyword, setSearchKeyword] = useState(false)
    const [keyword, setKeyword] = useState([])
    
    const board = isSelectCategory 
        ? (isSearchKeyword
            ? firestore().collection('Board').where('category', '==', category).where('title', 'array-contains', keyword)
            : firestore().collection('Board').where('category', '==', category))
        : (isSearchKeyword
            ? firestore().collection('Board').where('title', 'array-contains', keyword)
            : firestore().collection('Board'))

    useEffect(() => {
        setSearchKeyword(false)
        setKeyword('')
        getFeed()
    }, [category])
    
    useEffect(() => {
        getFeed()
    }, [keyword])
    
    const getFeed = () => {
        setRefreshing(true)

        board
        .orderBy('date', 'desc')
        .limit(4)
        .get()
        .then(querySnapshot => {
            const posts = [];

            querySnapshot.forEach(documentSnapshot => {
                posts.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });

            if(querySnapshot.size > 0) {
                let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['date'];
                setData(posts);
                setRefreshing(false);
                setLastVisible(lastVisible);
                setIsListEnd(false);
            } else {
                setRefreshing(false);
                setIsListEnd(true);
            }
        });
    }

    const getMoreFeed = () => {
        setLoading(true)

        board
        .orderBy('date', 'desc')
        .startAfter(lastVisible)
        .limit(4)
        .get()
        .then(querySnapshot => {
            const posts = [];

            querySnapshot.forEach(documentSnapshot => {
                posts.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });

            if(querySnapshot.size > 0) {
                let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['date'];
                setData([...data, ...posts]);
                setLoading(false);
                setLastVisible(lastVisible);
                setIsListEnd(false)
            } else {
                setLoading(false);
                setIsListEnd(true);
            }
        });
    }

    const searchKeyword = (keyword) => {
        if(keyword) {
            setSearchKeyword(true)
        } else {
            setSearchKeyword(false)
        }

        setKeyword(keyword)
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
            searchKeyword={searchKeyword}
            selectCategory={selectCategory}
            isListEnd={isListEnd}
            />
}