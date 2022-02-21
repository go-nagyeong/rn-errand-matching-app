import 'moment/locale/ko';
import { default as React, useEffect } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import "react-native-gesture-handler";
import { TabView } from "react-native-tab-view";
import RenderItem from '../Mypage/RenderItem';

export default MyRegisteredErrandScreen = (props) => {
    useEffect(() => {
        props.RegisteredErrand();
        props.CompletedErrand();
    },[])
    
    const renderItem = ({ item }) => {
        return <RenderItem item={item} />
    }

    const layout = useWindowDimensions();
    
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "first", title: "진행중인 심부름" },
        { key: "second", title: "완료된 심부름" }
    ]);
    
    const FirstRoute = () => (
        <View style={styles.boardView} >
            <FlatList
                keyExtractor={item => item.id}
                data={props.registeredPosts}
                renderItem={renderItem}
            />
        </View>
        
    );
    
    const SecondRoute = () => (
        <View style={styles.boardView}>
            <FlatList
                keyExtractor={item => item.id}
                data={props.completedPosts}
                renderItem={renderItem}
            />
        </View>
    );
    
    const renderScene = ({ route }) => {
        switch (route.key) {
            case "first":
                return <FirstRoute props={props} renderItem={renderItem}/>;
            case "second":
                return <SecondRoute props={props} renderItem={renderItem}/>;
            default:
                return null;
        }
    };
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
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

