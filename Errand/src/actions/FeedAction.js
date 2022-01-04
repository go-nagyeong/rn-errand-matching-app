import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FeedScreen from '../screens/FeedScreen';

export default FeedAction = () => {
    const user = auth().currentUser;
    const users = firestore().collection('Users');
    const board = firestore().collection('Board');

    const [posts, setPosts] = useState([]);

    const getFeed = () => {
        board
        .onSnapshot(querySnapshot => {
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
    
    return <FeedScreen 
            getFeed={getFeed}
            posts={posts}
            />
}