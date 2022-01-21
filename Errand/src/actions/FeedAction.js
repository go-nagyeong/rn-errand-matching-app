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

    const [sortByColumn, setSortByColumn] = useState('id')
    const [sortOrder, setSortOrder] = useState('desc')

    // const [priceRange, setPriceRange] = useState([0,5000])
    const [priceRange, setPriceRange] = useState([0,1000,2000,3000,4000,5000])

    const post = firestore().collection('Posts')
    // .where('price', '>=', priceRange[0]).where('price', '<=', priceRange[1])
    // .where('price', 'in', priceRange)
    const posts = isSelectCategory 
        ? (sortByColumn == 'id'
            ? post.where('category', '==', category).orderBy(sortByColumn, sortOrder)
            : post.where('category', '==', category).orderBy(sortByColumn, sortOrder).orderBy('id', 'desc'))
        : (sortByColumn == 'id'
            ? post.orderBy(sortByColumn, sortOrder)
            : post.orderBy(sortByColumn, sortOrder).orderBy('id', 'desc'))
            
    useEffect(() => {
        getFeed()
    }, [category, sortByColumn, sortOrder, priceRange])
    
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

    const priceFilter = (range) => {
        // setPriceRange(range[0])
        // setPriceRange(range[1])
        var priceRange = [];

        for(var i=range[0]; i<=range[1]; i+=500) {
            priceRange.push(i)
        }

        setPriceRange(priceRange)
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
                priceFilter={priceFilter}
                />
}