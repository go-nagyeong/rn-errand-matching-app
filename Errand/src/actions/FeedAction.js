import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FeedScreen from '../screens/FeedScreen';

export default FeedAction = () => {
    const user = auth().currentUser;
    const users = firestore().collection('Users');
    const board = firestore().collection('Board');

    const [posts, setPosts] = useState([]);

    const [pressCategory, setPressCategory] = useState(false)
    const [feedCategory, setFeedCategory] = useState('');

    useEffect(() => {
        getFeed()
    }, [feedCategory])

    const getFeed = () => {
        board
        .orderBy('date', 'desc')
        .get()
        .then(querySnapshot => {
            const posts = [];

            querySnapshot.forEach(documentSnapshot => {
                if (pressCategory) {
                    var category = documentSnapshot.data()['category'];
                    if (category == feedCategory) {
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

    const search = (keyword) => {
        board
        .orderBy('date', 'desc')
        .get()
        .then(querySnapshot => {
            const posts = [];

            querySnapshot.forEach(documentSnapshot => {
                var title = documentSnapshot.data()['title'],
                    content = documentSnapshot.data()['content'];
                if (title.includes(keyword) || content.includes(keyword)) {
                    posts.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                }
            });

            setPosts(posts);
        });
    }

    const selectCategory = (category) => {
        if(category == '전체보기') {
            setPressCategory(false)
        } else {
            setPressCategory(true)
        }

        setFeedCategory(category)
    }
    
    return <FeedScreen 
            posts={posts}
            search={search}
            selectCategory={selectCategory}
            />
}