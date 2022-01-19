import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import Feed from './src/screens/FeedScreen';
import FeedAction from './src/actions/FeedAction';

import Mypage from './src/screens/MypageScreen';
// import Login from './src/screens/LoginScreen';
import LoginAction from './src/actions/LoginAction';
// import Register from './src/screens/RegisterScreen';
import RegisterAction from './src/actions/RegisterAction';
// import FindPw from './src/screens/FindPassword';
import FindPwAction from './src/actions/FindPwAction';

import SelectCategory from './src/screens/WritePost/SelectCategory';
import InputPrice from './src/screens/WritePost/InputPrice';
import WriteTitle from './src/screens/WritePost/WriteTitle';
import WriteContent from './src/screens/WritePost/WriteContent';
import SelectStartDate from './src/screens/WritePost/SelectStartDate';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={FeedAction} />
      <Tab.Screen name="Mypage" component={Mypage} />
    </Tab.Navigator>
  )
}

export default App = () => {
  return (
    <NavigationContainer> 
      <Stack.Navigator screenOptions={{headerBackTitle: null}}>
        <Stack.Screen name="Tab" component={TabNavigator} options={{headerShown: false}}/>

        <Stack.Screen name="Login" component={LoginAction} />
        <Stack.Screen name="Register" component={RegisterAction} />
        <Stack.Screen name="FindPw" component={FindPwAction} />

        <Stack.Screen name="SelectCategory" component={SelectCategory} />
        <Stack.Screen name="InputPrice" component={InputPrice} />
        <Stack.Screen name="WriteTitle" component={WriteTitle} />
        <Stack.Screen name="WriteContent" component={WriteContent} />
        <Stack.Screen name="SelectStartDate" component={SelectStartDate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}