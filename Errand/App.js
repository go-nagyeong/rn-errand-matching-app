import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FeedAction from './src/actions/FeedAction';
import ShowDetailPost from './src/screens/Feed/ShowDetailPost';

import MyErrandAction from './src/actions/MyErrandAction';

import MypageAction from './src/actions/MypageAction';
import LoginAction from './src/actions/LoginAction';
import RegisterAction from './src/actions/RegisterAction';
import FindPwAction from './src/actions/FindPwAction';
import ReNameAction from './src/actions/ReNameAction';

import SelectCategory from './src/screens/WritePost/SelectCategory';
import InputPrice from './src/screens/WritePost/InputPrice';
import WriteTitle from './src/screens/WritePost/WriteTitle';
import WriteContent from './src/screens/WritePost/WriteContent';
import SelectStartDate from './src/screens/WritePost/SelectStartDate';

import MyRegisteredErrand from './src/actions/MyRegisteredErrandAction';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={FeedAction} />
      <Tab.Screen name="MyErrand" component={MyErrandAction} />
      <Tab.Screen name="Mypage" component={MypageAction} />
    </Tab.Navigator>
  )
}

export default App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null)
      }
    })
  });

  return (
    <NavigationContainer> 
      <Stack.Navigator screenOptions={{headerBackTitle: null}}>
        {user 
          ? <>
              <Stack.Screen name="Tab" component={TabNavigator} options={{headerShown: false}} />
              <Stack.Screen name="ShowDetailPost" component={ShowDetailPost} />

              <Stack.Screen name="MyRegisteredErrand" component={MyRegisteredErrand} />
              <Stack.Screen name="FindPw" component={FindPwAction} />
              <Stack.Screen name="ReName" component={ReNameAction} />
      
              <Stack.Screen name="SelectCategory" component={SelectCategory} />
              <Stack.Screen name="InputPrice" component={InputPrice} />
              <Stack.Screen name="WriteTitle" component={WriteTitle} />
              <Stack.Screen name="WriteContent" component={WriteContent} />
              <Stack.Screen name="SelectStartDate" component={SelectStartDate} />
            </>
          : <>
              <Stack.Screen name="Login" component={LoginAction} />
              <Stack.Screen name="Register" component={RegisterAction} />
              <Stack.Screen name="FindPw" component={FindPwAction} />
            </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}