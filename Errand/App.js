import React, { useState, useEffect } from "react";
import { LogBox, StyleSheet, View, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// 피드(홈)
import FeedAction from "./src/actions/FeedAction";
import ShowDetailPost from "./src/screens/Feed/ShowDetailPost";

// 나의심부름
import MyErrandAction from "./src/actions/MyErrandAction";
import Chat from "./src/screens/Mypage/ChatEx2"
// import ShowDetailMyList from "./src/screens/MyErrand/ShowDetailMyList";
// import ShowDetailPerformList from "./src/screens/MyErrand/ShowDetailPerformList";

// 마이페이지
import MypageAction from "./src/actions/MypageAction";
import LoginAction from "./src/actions/LoginAction";
import RegisterAction from "./src/actions/RegisterAction";
import FindPwAction from "./src/actions/FindPwAction";
import ReNameAction from "./src/actions/ReNameAction";
import MyCompletedErrand from "./src/actions/MyCompletedErrandAction";
import CompletedDetailPost from "./src/screens/Mypage/CompletedDetailPost"

// 게시물 작성
import SelectCategory from "./src/screens/WritePost/SelectCategory";
import InputPrice from "./src/screens/WritePost/InputPrice";
import WriteTitle from "./src/screens/WritePost/WriteTitle";
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

  const posts = firestore().collection("Posts");
  posts
    .where("writerEmail", "==", user.email)
    .where("process", "in", ["request", "finishRequest"])
    .onSnapshot((querySnapshot) => {
      setMyErrandBadgeNum(querySnapshot.size);
    });
  posts
    .where("erranderEmail", "==", user.email)
    .where("process", "==", "matching")
    .onSnapshot((querySnapshot) => {
      setMyPerformErrandBadgeNum(querySnapshot.size);
    });

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "MyErrand") {
            iconName = focused
              ? "ios-chatbox-ellipses"
              : "ios-chatbox-ellipses-outline";
          } else if (route.name === "Mypage") {
            iconName = focused ? "ios-person" : "ios-person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={FeedAction} />
      <Tab.Screen
        name="MyErrand"
        component={MyErrandAction}
        options={(myErrandBadgeNum || myPerformErrandBadgeNum) != 0 && { tabBarBadge: myErrandBadgeNum + myPerformErrandBadgeNum }}
      />
      <Tab.Screen name="Mypage" component={MypageAction} />
    </Tab.Navigator>
  );
};

export default App = () => {
  const [user, setUser] = useState(null);

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
            {/* <Stack.Screen name="MyErrand" component={MyErrandScreen} /> */}
            {/* <Stack.Screen name="Mypage" component={MypageAction} /> */}
            <Stack.Screen name="Tab" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="MyCompletedErrand" component={MyCompletedErrand} />
            <Stack.Screen name="CompletedDetailPost" component={CompletedDetailPost} />
            <Stack.Screen name="ShowDetailPost" component={ShowDetailPost} />
            {/* <Stack.Screen name="ShowDetailMyList" component={ShowDetailMyList} /> */}
            {/* <Stack.Screen name="ShowDetailPerformList" component={ShowDetailPerformList} /> */}
            {/* <Stack.Screen name="SelectLocation" component={SelectLocation} /> */}
            <Stack.Screen name="FindPw" component={FindPwAction} />
            <Stack.Screen name="ReName" component={ReNameAction} />

            <Stack.Screen name="SelectCategory" component={SelectCategory} />
            <Stack.Screen name="InputPrice" component={InputPrice} />
            <Stack.Screen name="WriteTitle" component={WriteTitle} />
            {/* <Stack.Screen name="WriteContent" component={WriteContent} /> */}
            {/* <Stack.Screen name="SelectStartDate" component={SelectStartDate} /> */}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginAction} />
            <Stack.Screen name="Register" component={RegisterAction} />
            <Stack.Screen name="FindPw" component={FindPwAction} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
