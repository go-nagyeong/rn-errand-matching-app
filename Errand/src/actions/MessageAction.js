import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Firebase from '../utils/Firebase';
import MessageScreen from '../screens/Message/MessageScreen';

export default MessageAction = () => {
    const currentUser = Firebase.currentUser != null ? Firebase.currentUser : auth().currentUser

    const [myChats, setMyChats] = useState([])
    const [myChatCount, setMyChatCount] = useState([])
    const [nickname, setNickname] = useState('')

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
            .where('isFinished', '==', 0)
            .orderBy('createdAt')
            .orderBy('_id')
            .onSnapshot(async querySnapshot => {
                if (querySnapshot) {
                    let docCount = {}
                    let documentData = {}

                    querySnapshot.forEach(async doc => {
                        var postId = doc.data().post;
                        var user = doc.data().user;
                        var opponent = doc.data().opponent;
                        var isRead = doc.data().isRead;

                        if (user._id == currentUser.email) {
                            storeBannerOption(postId)
                            documentData[postId] = {...doc.data(), opponentEmail: opponent._id, opponentName: nickname}
                            
                        } else if (opponent._id == currentUser.email) {
                            storeBannerOption(postId)
                            if (isRead == 0) {
                                // 안 읽은 채팅 개수 (상대방이 나면서 안 읽은 채팅)
                                docCount[postId] = (docCount[postId] || 0) + 1
                            }
                            documentData[postId] = {...doc.data(), opponentEmail: user._id, opponentName: nickname}
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