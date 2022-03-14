import 'moment/locale/ko';
import { default as React, useEffect, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View,Text, Modal, RefreshControl, ActivityIndicator } from 'react-native';
// import "react-native-gesture-handler";
import { TabView } from "react-native-tab-view";
import RenderItem from './RenderItem';

export default MyCompletedErrandScreen = (props) => {
  const {erranderPostsFunc, writerPostsFunc, writerPosts, erranderPosts, moreErranderPosts, moreWriterPosts} = props;
  const {isListEndA, refreshingA, loadingA} = props;
  const {isListEndB, refreshingB, loadingB} = props;
  const [reportButtonVisible, setReportButtonVisible] = useState(true); // 신고버튼 활성화/비활성화
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
      { key: "first", title: "내가 작성자" },
      { key: "second", title: "내가 심부름꾼" },
  ]);

  useEffect(() => {
    // errandejrPostsFunc(); // 본인이 심부름꾼인...
    // writerPostsFunc(); // 본인이 작성자인...
  },[])

  const renderFooterA = () => {
    if (loadingA) {
        return <ActivityIndicator style={{ marginTop: 10 }} />
    } else {
        return null
    }
  }

  const renderFooterB = () => {
    if (loadingB) {
        return <ActivityIndicator style={{ marginTop: 10 }} />
    } else {
        return null
    }
  }

  const renderItem = ({ item }) => {
      return <RenderItem 
                item={item} 
                reportButtonVisible={reportButtonVisible}
              />
  }

  const renderScene = ({ route }) => {
      switch (route.key) {
          case "first":
              return (
                  <View style={styles.boardView}>
                    <FlatList
                      keyExtractor={item => item.id}
                      data={writerPosts}
                      renderItem={renderItem}
                      refreshControl={<RefreshControl refreshing={refreshingB} onRefresh={writerPostsFunc} />}
                      ListFooterComponent={renderFooterB}
                      onEndReached={!isListEndB && moreWriterPosts}
                    />
                  </View>
              )
          case "second":
              return (
                <View style={styles.boardView}>
                  <FlatList
                    keyExtractor={item => item.id}
                    data={erranderPosts}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshingA} onRefresh={erranderPostsFunc} />}
                    ListFooterComponent={renderFooterA}
                    onEndReached={!isListEndA && moreErranderPosts}
                  />
                </View>
              )
          default:
              return null;
      }
  };

  return (
  //   <View style={styles.boardView}>
  //   <FlatList
  //     keyExtractor={(item, index) => String(index)}
  //     data={props.erranderPosts}
  //     renderItem={renderItem}
  //     refreshControl={<RefreshControl refreshing={props.refreshingA} onRefresh={props.erranderPostsFunc} />}
  //     ListFooterComponent={renderFooter}
  //     onEndReached={!props.isListEndA && props.moreErranderPosts}
  //   />
  // </View>

      //   <View style={styles.boardView}>
  //     <FlatList
  //       keyExtractor={(item, index) => String(index)}
  //       data={props.erranderPosts}
  //       renderItem={renderItem}
  //       refreshControl={<RefreshControl refreshing={props.refreshingA} onRefresh={props.erranderPostsFunc} />}
  //       ListFooterComponent={renderFooter}
  //       onEndReached={!props.isListEndA && props.moreErranderPosts}
  //     />
  //   </View>
    // <>
      <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}                    
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
      /> 
    // </>
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
