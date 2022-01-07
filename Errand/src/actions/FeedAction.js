import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FeedScreen from '../screens/FeedScreen';

export default FeedAction = () => {
    const user = auth().currentUser;
    const users = firestore().collection('Users');
    const board = firestore().collection('Board');

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getFeed()
    }, [])

    const getFeed = () => {
        board
        .orderBy('date', 'desc')
        .get()
        .then(querySnapshot => {
            const posts = [];

            querySnapshot.forEach(documentSnapshot => {
                posts.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
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
    
    return <FeedScreen 
            posts={posts}
            search={search}
            />
}