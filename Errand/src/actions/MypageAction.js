import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';

import MypageScreen from '../screens/MypageScreen';

export default MypageAction = (props) => {
    const signOut = () => {
        auth()
        .signOut()
        .then(() => {
            console.log('User signed out!');
        });
    }

    return <MypageScreen signOut={signOut} />
}
