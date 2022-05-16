import React, { useState, useEffect, useLayoutEffect } from "react";
import { LogBox, StyleSheet, View, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view'

import Colors from "./src/constants/Colors";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// 피드(홈)
import FeedAction from "./src/actions/FeedAction";
import ShowDetailPost from "./src/screens/Feed/ShowDetailPost";

// 나의심부름
import MyErrandAction from "./src/actions/MyErrandAction";
import Chat from "./src/screens/Chat/ChatScreen";
// import ShowDetailMyList from "./src/screens/MyErrand/ShowDetailMyList";
// import ShowDetailPerformList from "./src/screens/MyErrand/ShowDetailPerformList";

// 채팅 알림
import MessageAction from "./src/actions/MessageAction";

// 마이페이지
import MypageAction from "./src/actions/MypageAction";
import LoginAction from "./src/actions/LoginAction";
import RegisterAction from "./src/actions/RegisterAction";
import ResetPwScreen from "./src/screens/Mypage/ResetPwScreen";
import ReNameScreen from "./src/screens/Mypage/ReNameScreen";
import EditProfileAction from "./src/actions/EditProfileAction";
import MyCompletedErrand from "./src/actions/MyCompletedErrandAction";
import Faq from './src/screens/Mypage/FaqScreen';
// import CompletedDetailPost from "./src/screens/Mypage/CompletedDetailPost"
import MyHeartList from "./src/actions/MyHeartListAction";
// 게시물 작성
import SelectCategory from "./src/screens/WritePost/SelectCategory";
import InputPrice from "./src/screens/WritePost/InputPrice";
import InputLocation from "./src/screens/WritePost/InputLocation";
import WriteTitle from "./src/screens/WritePost/WriteTitle";
// 인트로
import Intro from './src/actions/Intro'

// import WriteContent from "./src/screens/WritePost/TEMP_WriteContent";
// import SelectStartDate from "./src/screens/WritePost/TEMP_SelectStartDate";
// import SelectLocation from "./src/screens/WritePost/SelectLocation";

LogBox.ignoreAllLogs();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const user = auth().currentUser;

  const [myErrandBadgeNum, setMyErrandBadgeNum] = useState(0);
  const [myPerformErrandBadgeNum, setMyPerformErrandBadgeNum] = useState(0);
  const [unreadChatNum, setUnreadChatNum] = useState(0);

  const posts = firestore().collection("Posts");
  const chats = firestore().collection("Chats");
  
  useEffect(() => {
    posts
      .where("writerEmail", "==", user.email)
      .where("process.title", "in", ["request", "finishRequest"])
      .onSnapshot((querySnapshot) => {
        setMyErrandBadgeNum(querySnapshot.size);
      });
    posts
      .where("erranderEmail", "==", user.email)
      .where("process.title", "==", "matching")
      .onSnapshot((querySnapshot) => {
        setMyPerformErrandBadgeNum(querySnapshot.size);
      });

    chats
      .where('opponent._id', '==', user.email)
      .where('unread', '==', 0)
      .onSnapshot((querySnapshot) => {
        setUnreadChatNum(querySnapshot.size)
      })
  }, [])


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MyErrand") {
            iconName = focused
              ? "rocket"
              : "rocket-outline";
          } else if (route.name === "Message") {
            iconName = focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline";
          } else if (route.name === "Mypage") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <MaskedView maskElement={<Ionicons name={iconName} size={size} />}>
              <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}>
                <Ionicons name={iconName} size={size} color={color} />
              </LinearGradient>
            </MaskedView>
          )
        },
        tabBarActiveTintColor: Colors.transparent,
        tabBarInactiveTintColor: Colors.gray,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={FeedAction} />
      <Tab.Screen
        name="MyErrand"
        component={MyErrandAction}
        options={(myErrandBadgeNum || myPerformErrandBadgeNum) != 0 && { tabBarBadge: myErrandBadgeNum + myPerformErrandBadgeNum }}
        />
      <Tab.Screen 
        name="Message"
        component={MessageAction}
        options={unreadChatNum != 0 && { tabBarBadge: unreadChatNum }}
      />
      <Tab.Screen name="Mypage" component={MypageAction} />
    </Tab.Navigator>
  );
};

export default App = () => {
  // [Intro 화면, AsyncStorage] 가장 처음 접속 시 0, Intro 마치면 1
  const [state, setState] = useState(null);
  const [user, setUser] = useState(null);

  // 1이면 로그인 실행, 0이면 Intro 화면 실행
  useEffect(() => {
    const getDb = async () => {
      try {
        const value = await AsyncStorage.getItem('intro')
        if(value !== null) {
          setState(value)
        }
        else {
          console.log('존재하지 않습니다 생성합니다')
          await AsyncStorage.setItem('intro', '0')
        }
      } catch(e) {
        console.log(e)
      }
    }
    getDb();
  }, [])

  const insertDb = async (value) => {
    try {
      await AsyncStorage.setItem('intro', value)
    } catch (e) {
      console.log(e)
    }
  }
  // insertDb('0')

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

  return (
    <NavigationContainer> 
      <Stack.Navigator screenOptions={{ headerBackTitle: null }}>
        {user ? (
          <>
            {/* privacy-tip  help    emoji-objects campaign     */}
            {/* <Stack.Screen name="MyErrand" component={MyErrandAction} /> */}
            {/* <Stack.Screen name="Mypage" component={MypageAction} /> */}
            <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false}} />
            <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }}  />
            <Stack.Screen name="MyCompletedErrand" component={MyCompletedErrand} options={{title: "심부름 내역" }} />
            <Stack.Screen name="Faq" component={Faq} options={{title: 'FAQ'}} />
            {/* <Stack.Screen name="CompletedDetailPost" component={CompletedDetailPost} /> */}
            <Stack.Screen name="ShowDetailPost" component={ShowDetailPost} />
            {/* <Stack.Screen name="ShowDetailMyList" component={ShowDetailMyList} /> */}
            {/* <Stack.Screen name="ShowDetailPerformList" component={ShowDetailPerformList} /> */}
            {/* <Stack.Screen name="SelectLocation" component={SelectLocation} /> */}
            <Stack.Screen name="ResetPw" component={ResetPwScreen} />
            <Stack.Screen name="ReName" component={ReNameScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileAction} />
            <Stack.Screen name="Heart" component={MyHeartList} />

            <Stack.Screen name="SelectCategory" component={SelectCategory} />
            <Stack.Screen name="InputPrice" component={InputPrice} />
            <Stack.Screen name="InputLocation" component={InputLocation} />
            <Stack.Screen name="WriteTitle" component={WriteTitle} />
            {/* <Stack.Screen name="WriteContent" component={WriteContent} /> */}
            {/* <Stack.Screen name="SelectStartDate" component={SelectStartDate} /> */}
          </>
        ) : (
          // 처음 실행 조건 트리거 + 다시 한번 메뉴얼을 볼 수 있는 메뉴
          parseInt(state) ? 
          <>
            <Stack.Screen name="Login" component={LoginAction} />
            <Stack.Screen name="Register" component={RegisterAction} />
            <Stack.Screen name="ResetPw" component={ResetPwScreen} />
            <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false}} />
          </>
          : 
          <>
            <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} /> 
            <Stack.Screen name="Login" component={LoginAction} />
            <Stack.Screen name="Register" component={RegisterAction} />
            <Stack.Screen name="ResetPw" component={ResetPwScreen} />
            <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false}} />
          </>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};