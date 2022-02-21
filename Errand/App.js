import React, { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 피드(홈)
import FeedAction from './src/actions/FeedAction';
import ShowDetailPost from './src/screens/Feed/ShowDetailPost';

// 나의심부름
import MyErrandScreen from './src/screens/MyErrand/MyErrandScreen';
import ShowAcceptPost from './src/screens/MyErrand/ShowAcceptPost';

// 마이페이지
import MypageAction from './src/actions/MypageAction';
import LoginAction from './src/actions/LoginAction';
import RegisterAction from './src/actions/RegisterAction';
import FindPwAction from './src/actions/FindPwAction';
import ReNameAction from './src/actions/ReNameAction';
import MyRegisteredErrand from './src/actions/MyRegisteredErrandAction';

// 게시물 작성
import SelectCategory from './src/screens/WritePost/SelectCategory';
import InputPrice from './src/screens/WritePost/InputPrice';
import WriteTitle from './src/screens/WritePost/WriteTitle';
import WriteContent from './src/screens/WritePost/WriteContent';
import SelectStartDate from './src/screens/WritePost/SelectStartDate';

LogBox.ignoreAllLogs();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const user = auth().currentUser;

  const [badgeNum, setBadgeNum] = useState(0)

  useEffect(() => {
    firestore()
    .collection('Posts')
    .where('writerEmail', '==', user.email)
    .onSnapshot(querySnapshot => {
      let count = 0

      querySnapshot.forEach(doc => {
        if (doc.exists) { 
          if (doc.data()['process'] === 'request') {
            count += 1
          }
        }
      })

      setBadgeNum(count)
    })
  }, []);

  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'ios-home' : 'ios-home-outline';
        } else if (route.name === 'MyErrand') {
          iconName = focused ? 'ios-chatbox-ellipses' : 'ios-chatbox-ellipses-outline';
        } else if (route.name === 'Mypage') {
          iconName = focused ? 'ios-person' : 'ios-person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: false,
    })}>
      <Tab.Screen name="Home" component={FeedAction} />
      <Tab.Screen name="MyErrand" component={MyErrandScreen} options={badgeNum!=0 && { tabBarBadge: badgeNum }} />
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
      <Stack.Navigator screenOptions={{ headerBackTitle: null }}>
        {user 
          ? <>
              <Stack.Screen name="Tab" component={TabNavigator} options={{headerShown: false}} />
              <Stack.Screen name="ShowDetailPost" component={ShowDetailPost} />
              <Stack.Screen name="ShowAcceptPost" component={ShowAcceptPost} />
              <Stack.Screen name="FindPw" component={FindPwAction} />
              <Stack.Screen name="ReName" component={ReNameAction} />
              <Stack.Screen name="MyRegisteredErrand" component={MyRegisteredErrand} />
      
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