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
      </Stack.Navigator>
    </NavigationContainer>
  );
}