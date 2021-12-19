import React, { useState } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';

export default LogoutAction = () => {
    const signOut = () => {
        auth()
        .signOut()
        .then(() => {
            console.log('User signed out!');
        });
    }

    return <Button title="로그아웃" onPress={() => signOut()} />
}
