import React, { useEffect, useState, useMemo } from 'react';

import * as Firebase from '../utils/Firebase';
import MyHeartList from '../screens/Mypage/MyHeartList';

let documentData = []

export default MyHeartListAction = (props) => {
  const [docData, setDocData] = useState(null)
  const [heartList, setHeartList] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getHeartList();
    })
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (docData) {
      documentData.push(docData)
    }
  }, [docData])

  const getHeartList = () => {
    setRefreshing(true)
    documentData = []

    Firebase.heartsRef
      .where('who', '==', Firebase.currentUser.email)
      .get()
      .then(async querySnapshot => {
        for await (const documentSnapshot of querySnapshot.docs) {
          let docId = documentSnapshot.data().postid
          
          await Firebase.postsRef
            .doc(docId)
            .get()
            .then(doc => {
              if (doc.exists) {
                setDocData({...doc.data(), docId: doc.id})
              }
            })
        }

        setHeartList(documentData)
        setRefreshing(false)
      })
      .catch(err => console.log('에러 발생', err))
  }

  return <MyHeartList
            heartList={heartList}
            refreshing={refreshing}
            getHeartList={getHeartList}
          />
}