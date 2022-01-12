import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FeedScreen from '../screens/FeedScreen';

export default FeedAction = () => {
    const user = auth().currentUser;
    const users = firestore().collection('Users');
    const board = firestore().collection('Board');

    const [posts, setPosts] = useState([]);

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
        board
        .orderBy('date', 'desc')
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

            setPosts(posts);
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
            posts={posts}
            searchKeyword={searchKeyword}
            selectCategory={selectCategory}
            />
}