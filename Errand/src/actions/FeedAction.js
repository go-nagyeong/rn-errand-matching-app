import React, { useEffect, useState } from 'react';

import * as Firebase from '../utils/Firebase';
import FeedScreen from '../screens/Feed/FeedScreen';

export default FeedAction = (props) => {
    const [data, setData] = useState([]);

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastVisible, setLastVisible] = useState(null)
    const [isListEnd, setIsListEnd] = useState(false)

    const [isSelectCategory, setSelectCategory] = useState(false)
    const [category, setCategory] = useState('');

    const [sortByColumn, setSortByColumn] = useState('id')
    const [sortOrder, setSortOrder] = useState('desc')

    const posts = Firebase.postsRef.where('process.title', 'in', ['regist', 'request'])
    const filteredPosts = isSelectCategory 
        ? (sortByColumn == 'id'
            ? posts.where('category', '==', category).orderBy(sortByColumn, sortOrder)
            : posts.where('category', '==', category).orderBy(sortByColumn, sortOrder).orderBy('id', 'desc'))
        : (sortByColumn == 'id'
            ? posts.orderBy(sortByColumn, sortOrder)
            : posts.orderBy(sortByColumn, sortOrder).orderBy('id', 'desc'))
            
    useEffect(() => {
        getFeed()
    }, [category, sortByColumn, sortOrder])

    // 해당 화면에 focus가 있을 때 수행하는 작업
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getFeed()
        });
      
        return unsubscribe;
    }, [props.navigation]);
    
    const getFeed = () => {
        setRefreshing(true)

        filteredPosts
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
                    let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()[sortByColumn];
                    setLastVisible(lastVisible);
                    setIsListEnd(false);
                } else {
                    setIsListEnd(true);
                }
            });
    }

    const getMoreFeed = () => {
        setLoading(true)

        filteredPosts
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
                    let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()[sortByColumn];
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

    const sortFilter = (sort) => {
        setSortByColumn(sort[0])
        setSortOrder(sort[1])
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
                sortFilter={sortFilter}
                />
}