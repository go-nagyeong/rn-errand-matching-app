import React, {useCallback, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FeedScreen from '../screens/FeedScreen';

export default FeedAction = () => {
    const board = firestore().collection('Board');

    const [data, setData] = useState([]);

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastVisible, setLastVisible] = useState(null)
    const [isListEnd, setIsListEnd] = useState(false)

    const [isSelectCategory, setSelectCategory] = useState(false)
    const [category, setCategory] = useState('');
    const [isSearchKeyword, setSearchKeyword] = useState(false)
    const [keyword, setKeyword] = useState('')

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
                if (isSelectCategory) {
                    var cat = documentSnapshot.data()['category'],
                        title = documentSnapshot.data()['title'],
                        content = documentSnapshot.data()['content'];
                    if (isSearchKeyword) {
                        if (cat == category && (title.includes(keyword) || content.includes(keyword))) {
                            posts.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        }
                    } else {
                        if (cat == category) {
                            posts.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        }
                    }

                } else if (isSearchKeyword) {
                    var title = documentSnapshot.data()['title'],
                        content = documentSnapshot.data()['content'];
                    if (title.includes(keyword) || content.includes(keyword)) {
                        posts.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }

                } else {
                    posts.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                }
            });

            let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['date'];

            setData(posts);
            setRefreshing(false);
            setLastVisible(lastVisible);
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
                if (isSelectCategory) {
                    var cat = documentSnapshot.data()['category'],
                        title = documentSnapshot.data()['title'],
                        content = documentSnapshot.data()['content'];
                    if (isSearchKeyword) {
                        if (cat == category && (title.includes(keyword) || content.includes(keyword))) {
                            posts.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        }
                    } else {
                        if (cat == category) {
                            posts.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });
                        }
                    }

                } else if (isSearchKeyword) {
                    var title = documentSnapshot.data()['title'],
                        content = documentSnapshot.data()['content'];
                    if (title.includes(keyword) || content.includes(keyword)) {
                        posts.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    }

                } else {
                    posts.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                }
            });

            if(querySnapshot.size > 0) {
                let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['date'];
                setData([...data, ...posts]);
                setLoading(false);
                setLastVisible(lastVisible);
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