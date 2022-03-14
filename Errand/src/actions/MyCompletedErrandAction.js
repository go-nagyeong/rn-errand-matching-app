import React, { Component, useState, useEffect, useCallback } from 'react'
import { SafeAreaView, ScrollView, Switch, StyleSheet, Text, View, RefreshControl, TouchableOpacity } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import MyCompletedErrandScreen from '../screens/Mypage/MyCompletedErrandScreen'


export default MyCompletedErrandAction = (props) => {
    const myEmail = auth().currentUser.email
    const query = firestore().collection('Posts').where('process.title', '==', 'finished'); //auth().currentUser.email
    
    const [writerPosts, setWriterPosts] = useState([]); // 본인이 작성자인 게시글
    const [erranderPosts, setErranderPosts] = useState([]); // 본인이 심부름꾼인 게시글

    const [refreshingA, setRefreshingA] = useState(false);
    const [lastVisibleA, setLastVisibleA] = useState(false);
    const [isListEndA, setIsListEndA] = useState(false);
    const [loadingA, setLoadingA] = useState(false);

    const [refreshingB, setRefreshingB] = useState(false);
    const [lastVisibleB, setLastVisibleB] = useState(false);
    const [isListEndB, setIsListEndB] = useState(false);
    const [loadingB, setLoadingB] = useState(false);

    const erranderData = query.where('erranderEmail', '==', myEmail).orderBy('id', 'desc')
    const writerData = query.where('writerEmail', '==', myEmail).orderBy('id', 'desc')


    useEffect(() => {
      const unsubscribe = props.navigation.addListener('focus', () => {
        erranderPostsFunc();
        writerPostsFunc();
      })
      return unsubscribe;
    }, [props.navigation]);

    // 본인이 심부름꾼인 게시글
    const erranderPostsFunc = () => {
        setRefreshingA(true);
        
        erranderData
        .limit(5)
        .get()
        .then(querySnapshot => {
            let documentData = [];
    
            querySnapshot.forEach(documentSnapshot => {
                documentData.push({
                    ...documentSnapshot.data(),
                });
            })
            setErranderPosts(documentData);
            setRefreshingA(false);

            if(querySnapshot.size > 0) {
                let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['id'];
                setLastVisibleA(lastVisible);
                setIsListEndA(false);
            } else {
              setIsListEndA(true);
            }
        })
        .catch(err => {console.log('에러 발생', err)})
    }

    // 본인이 작성자인 게시글
    const writerPostsFunc = () => {
        setRefreshingB(true);
        let data = query.where('writerEmail', '==', myEmail).orderBy('id', 'desc')
        data
        .limit(5)
        .get()
        .then(querySnapshot => {
            let documentData = [];
    
            querySnapshot.forEach(documentSnapshot => {
                documentData.push({
                    ...documentSnapshot.data(),
                });
            })
            setWriterPosts(documentData);
            setRefreshingB(false);

            if(querySnapshot.size > 0) {
                let lastVisible = querySnapshot.docs[querySnapshot.size-1].data()['id'];
                setLastVisibleB(lastVisible);
                setIsListEndB(false);
            } else {
              setIsListEndB(true);
            }
        })
        .catch(err => {console.log('에러 발생', err)})

    }

    const moreErranderPosts = () => {
      setLoadingA(true);

      erranderData
      .startAfter(lastVisibleA)
      .limit(4)
      .get()
      .then(querySnapshot => {
        const documentData = [];

        querySnapshot.forEach(documentSnapshot => {
          documentData.push({
            ...documentSnapshot.data(),
          });
        })

        if (querySnapshot.size > 0) {
          let lastVisible = querySnapshot.docs[querySnapshot.size - 1].data()['id']
          setErranderPosts([...erranderPosts, ...documentData]);
          setLoadingA(false);
          setLastVisibleA(lastVisible);
          setIsListEndA(false);
        } else {
          setLoadingA(false);
          setIsListEndA(true);
        }
      })
    }

    const moreWriterPosts = () => {
      setLoadingB(true);

      writerData
      .startAfter(lastVisibleB)
      .limit(4)
      .get()
      .then(querySnapshot => {
        const documentData = [];

        querySnapshot.forEach(documentSnapshot => {
          documentData.push({
            ...documentSnapshot.data(),
          });
        })

        if (querySnapshot.size > 0) {
          let lastVisible = querySnapshot.docs[querySnapshot.size - 1].data()['id']
          setWriterPosts([...writerPosts, ...documentData]);
          setLoadingB(false);
          setLastVisibleB(lastVisible);
          setIsListEndB(false);
        } else {
          setLoadingB(false);
          setIsListEndB(true);
        }
      })
    }

    return <MyCompletedErrandScreen
              erranderPostsFunc={erranderPostsFunc}
              writerPostsFunc={writerPostsFunc}
              myEmail={myEmail}

              writerPosts={writerPosts}
              erranderPosts={erranderPosts}

              loadingA={loadingA}
              refreshingA={refreshingA}
              isListEndA={isListEndA}

              loadingB={loadingB}
              refreshingB={refreshingB}
              isListEndB={isListEndB}

              moreErranderPosts={moreErranderPosts}
              moreWriterPosts={moreWriterPosts}
            />
}