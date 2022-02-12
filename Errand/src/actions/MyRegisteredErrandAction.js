import React, { Component, useState, useEffect, useCallback } from 'react'
import { SafeAreaView, ScrollView, Switch, StyleSheet, Text, View, LogBox, RefreshControl, TouchableOpacity } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import MyRegisteredErrandScreen from '../screens/MyRegisteredErrandScreen'



export default MyRegisteredErrandAction = (props) => {
    const query = firestore().collection('Posts').where('writerEmail', '==', auth().currentUser.email); //auth().currentUser.email
    
    const [registeredPosts, setRegisteredPosts] = useState();
    const [completedPosts, setCompletedPosts] = useState();
    
    const CompletedErrand = () => {
        let data = query.where('process', '==', 'completed')
        
        data
        .limit(7)
        .get()
        .then(querySnapshot => {
            let documentData = [];
    
            querySnapshot.forEach(documentSnapshot => {
                documentData.push({
                    ...documentSnapshot.data(),
                });
            })
            setCompletedPosts(documentData);
        })
    }
    
    const RegisteredErrand = () => {
        let data = query.where('process', '==', 'regist')
        
        data
        .limit(7)
        .get()
        .then(querySnapshot => {
            let documentData = [];
    
            querySnapshot.forEach(documentSnapshot => {
                documentData.push({
                    ...documentSnapshot.data(),
                });
            })
            setRegisteredPosts(documentData);
        })
    }

    return <MyRegisteredErrandScreen
                completedPosts={completedPosts}
                registeredPosts={registeredPosts}

                CompletedErrand={CompletedErrand}
                RegisteredErrand={RegisteredErrand}
            />
}