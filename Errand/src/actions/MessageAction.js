import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Firebase from '../utils/Firebase';
import MessageScreen from '../screens/Message/MessageScreen';

export default MessageAction = () => {
    const [myChats, setMyChats] = useState([])
    const [myChatCount, setMyChatCount] = useState([])

    const storeBannerOption = async (postId) => {
        try {
            const value = await AsyncStorage.getItem(postId)
            if (value == null) {
                await AsyncStorage.setItem(postId, JSON.stringify(true))
            }
        } catch (e) {
          console.log(e)
        }
    }

    useEffect(() => {
        const unsubscribe = Firebase.chatsRef
            .orderBy('createdAt')
            .orderBy('_id')
            .onSnapshot(querySnapshot => {
                if (querySnapshot) {
                    let docCount = {}
                    let documentData = {}

                    querySnapshot.forEach(doc => {
                        var postId = doc.data().post;
                        var user = doc.data().user;
                        var opponent = doc.data().opponent;
                        var unread = doc.data().unread;

                        if (user._id == Firebase.currentUser.email) {
                            storeBannerOption(postId)

                            // 글을 보낸 사람이 나면
                            // 채팅 상대: 글을 받는 사람 => opponent
                            documentData[postId] = {...doc.data(), chatImage: opponent.avatar, chatTitle: opponent.name}
                            
                        } else if (opponent._id == Firebase.currentUser.email) {
                            storeBannerOption(postId)

                            if (unread == 0) {
                                // 안 읽은 채팅 개수 (상대방이 나면서 안 읽은 채팅)
                                docCount[postId] = (docCount[postId] || 0) + 1
                            }
                            // 채팅 상대: 글을 적은 사람 => user.name
                            documentData[postId] = {...doc.data(), chatImage: user.avatar, chatTitle: user.name}
                        }
                    })

                    setMyChatCount(docCount)
                    setMyChats(documentData)
                }
            })

        return unsubscribe
    }, [])

    return <MessageScreen 
                myChats={myChats}
                myChatCount={myChatCount}
            />
    
}