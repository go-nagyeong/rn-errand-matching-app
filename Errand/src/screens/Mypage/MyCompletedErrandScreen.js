import 'moment/locale/ko';
import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, RefreshControl, ActivityIndicator, Animated } from 'react-native';
import { TabView, TabBar } from "react-native-tab-view";
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import RenderItem from './RenderItem';

export default MyCompletedErrandScreen = (props) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
      { key: "first", title: "나의 심부름" },
      { key: "second", title: "내가 했던 심부름" },
  ]);

  // renderItem에 보낼 함수 구분을 위한 변수 (true: 나의 심부름 / false: 내가 한 심부름)
  const [gettingPostsMethod, setGettingPostsMethod] = useState(true)
  // tab 바꿀 때 해당 탭의 리스트만 다시 새로고침
  useEffect(() => {
    if (index == 0) {
        props.writerPostsFunc()
        setGettingPostsMethod(true)
    } else {
        props.erranderPostsFunc()
        setGettingPostsMethod(false)
    }
  }, [index])


  const renderItem = ({ item, index }) => {
    // console.log(getPosts)
    return <RenderItem item={item} index={index} getPosts={gettingPostsMethod ? props.writerPostsFunc : props.erranderPostsFunc} />
  }

  const renderFooterA = () => {
    if (props.loadingA) {
      return <ActivityIndicator style={{ marginTop: 10 }} />
    } else {
      return null
    }
  }
  const FirstRoute = () => (
    <View style={styles.boardView}>
      <FlatList
        keyExtractor={item => item.id}
        data={props.writerPosts}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={props.refreshingB} onRefresh={props.writerPostsFunc} />}
        ListFooterComponent={renderFooterB}
        onEndReached={!props.isListEndB && props.moreWriterPosts}
        />
    </View>
  );
  
  const renderFooterB = () => {
    if (props.loadingB) {
      return <ActivityIndicator style={{ marginTop: 10 }} />
    } else {
      return null
    }
  }
  const SecondRoute = () => (
    <View style={styles.boardView}>
      <FlatList
        keyExtractor={item => item.id}
        data={props.erranderPosts}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={props.refreshingA} onRefresh={props.erranderPostsFunc} />}
        ListFooterComponent={renderFooterA}
        onEndReached={!props.isListEndA && props.moreErranderPosts}
      />
    </View>
  );


  const renderIndicator = (props) => {
      const { getTabWidth, layout, navigationState } = props;
      const width = getTabWidth();
      const translateX = Animated.multiply(navigationState.index, getTabWidth());

      return (
          <Animated.View style={{ width: width, height: 3, bottom: -layout.height+3, transform: [{ translateX: translateX }] }}>
              <LinearGradient
                  start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                  colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}
              >
                  <Text></Text>
              </LinearGradient>
          </Animated.View>
      )
  }
  const renderTabBar = (props) => (
      <TabBar
          {...props}
          labelStyle={{ color: Colors.black }}
          renderIndicator={renderIndicator}
          style={{ backgroundColor: Colors.white }}
      />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <FirstRoute />
      case "second":
        return <SecondRoute />
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: Common.width, height: Common.height }}
    />
  );
}

const styles = StyleSheet.create({
    boardView: {
      flex: 1,
      backgroundColor: Colors.backgroundGray,
      paddingHorizontal: 12,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
})
