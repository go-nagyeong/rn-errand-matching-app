import 'moment/locale/ko';
import { default as React, useEffect, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View,Text, Modal, RefreshControl } from 'react-native';
import "react-native-gesture-handler";
import { TabView } from "react-native-tab-view";
import RenderItem from './RenderItem';

export default MyCompletedErrandScreen = (props) => {
  const {erranderPostsFunc, writerPostsFunc, writerPosts, erranderPosts, moreErranderPosts, moreWriterPosts} = props;
  const {isListEndA, refreshingA} = props;
  const {isListEndB, refreshingB} = props;
  useEffect(() => {
    erranderPostsFunc(); // 본인이 심부름꾼인...
    writerPostsFunc(); // 본인이 작성자인...
  },[])

  const [reportButtonVisible, setReportButtonVisible] = useState(true); // 신고버튼 활성화/비활성화
    
  const renderItem = ({ item }) => {
      return <RenderItem item={item} reportButtonVisible={reportButtonVisible}/>
  }

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
      { key: "first", title: "내가 작성자" },
      { key: "second", title: "내가 심부름꾼" },
  ]);

  // 본인이 작성자
  const FirstRoute = () => (
    <View style={styles.boardView} >
      <FlatList
        keyExtractor={item => item.id}
        data={writerPosts}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshingB} onRefresh={writerPostsFunc} />}
        onEndReached={!isListEndB && moreWriterPosts}
      />
    </View>
  );
  
  // 본인이 심부름꾼
  // 문제는 없지만 새로고침이 되지 않는다 + 내가 작성자 게시글 업데이트
  const SecondRoute = () => (
    <View style={styles.boardView}>
      <FlatList
        keyExtractor={item => item.id}
        data={erranderPosts}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshingA} onRefresh={erranderPostsFunc} />}
        onEndReached={!isListEndA && moreErranderPosts}
      />
    </View>
  );

  const renderScene = ({ route }) => {
      switch (route.key) {
          case "first":
              return <FirstRoute/> // props={props} renderItem={renderItem}
          case "second":
              return <SecondRoute/>; // props={props} renderItem={renderItem}
          default:
              return null;
      }
  };

  return (
    <>
      <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}                    
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
      />
    </>
  );
}

const styles = StyleSheet.create({
    boardView: {
        flex: Platform.OS === 'ios' ? 2.6 : 2,
        backgroundColor: '#EDF1F5',
        paddingHorizontal: 12,
        paddingTop: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#53B77C',
    },
})
