import 'moment/locale/ko';
import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, useWindowDimensions, View } from 'react-native';
import "react-native-gesture-handler";
import { TabView } from "react-native-tab-view";
import ErrandRating from './ErrandRating';
import RenderItemMyList from './RenderItemMyList';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default MyErrandScreen = (props) => {
    const isDarkMode = useColorScheme() === 'dark';
    
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "first", title: "나의 리스트" },
        { key: "second", title: "수행 리스트" },
    ]);
    

    // First Screen
    const [requestPosts, setRequestPosts] = useState();
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            firestore()
                .collection('Posts')
                .where('writerEmail', '==', auth().currentUser.email)
                .where('process', '!=', 'finished')
                .get()
                .then(querySnapshot => {
                    let documentData = [];
                    querySnapshot.forEach(documentSnapshot => {
                        documentData.push({
                            ...documentSnapshot.data()
                        })
                    })
                    setRequestPosts(documentData);
                })
        });
      
        return unsubscribe;
    }, [props.navigation]);
    
    const renderItemMyList = ({ item }) => {
        return <RenderItemMyList item={item} />
    }
    const FirstRoute = () => (
        <View style={styles.boardView} >
            <FlatList
                keyExtractor={item => item.id}
                data={requestPosts}
                renderItem={renderItemMyList}
            />
        </View>
    );


    // Second Screen
    const [title, setTitle] = useState("");
    const [writerEmail, setWriterEmail] = useState("");
    const [writerGrade, setWriterGrade] = useState("");
    const [writer, setWriter] = useState("");
    const [process, setProcess] = useState("");
    const [id, setId] = useState("");

    firestore()
        .collection('Posts')
        .where('erranderEmail', '==', auth().currentUser.email)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                setWriterEmail(documentSnapshot.data()["writerEmail"])
                setWriter(documentSnapshot.data()["writer"])
                setId(documentSnapshot.data()["id"])
                setProcess(documentSnapshot.data()["process"])
                setTitle(documentSnapshot.data()["title"])

            });
        })

    const requestCancle = () => {
        firestore()
        .collection('Posts')
        .doc(id.toString())
        .update({
            process: "regist",
            errander: "",
            erranderEmail: "",
        })
        .then(() => {
            console.log('errand grade updated')
        })
    }
    const ThirdRoute = () => (
        <View style={styles.boardView} >
            <Text> {title} </Text>
            <Text> {writerEmail} </Text>
            <Text> {writer} </Text>
            <Text> {process} </Text>

            {(process === 'request') &&
                <TouchableOpacity onPress={() => {
                    requestCancle()
                }} >

                    <Text> 요청 취소 </Text>
                </TouchableOpacity>
            }

            {(process === "matching") &&
                <TouchableOpacity onPress={() => {

                }} >

                    <Text> 진행 중 </Text>
                </TouchableOpacity>
            }

        </View>
    );

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "first":
                return <FirstRoute />;
            case "second":
                return <ThirdRoute />;
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
    container: {
        flex: 1,
        backgroundColor: '#53B77C',
    },
    boardView: {
        flex: Platform.OS === 'ios' ? 2.6 : 2,
        backgroundColor: '#EDF1F5',
        paddingHorizontal: 12,
        paddingTop: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
})