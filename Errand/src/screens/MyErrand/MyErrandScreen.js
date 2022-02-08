import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, useColorScheme, StatusBar, View, Text, TouchableOpacity} from 'react-native';

import ErrandRating from './ErrandRating';

export default MyErrandScreen = (props) => {
    const isDarkMode = useColorScheme() === 'dark';

    const [showRatingModal, setShowRatingModal] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            
            <TouchableOpacity 
                style={{backgroundColor: '#fff', marginHorizontal: 100, padding: 10, alignItems: 'center'}}
                onPress={() => {setShowRatingModal(true)}}
            >
                <Text>완료</Text>
            </TouchableOpacity>

            <ErrandRating 
                visible={showRatingModal}
                onRequestClose={() => setShowRatingModal(false)}
                erranderInfo={props.erranderInfo}
                errandPrice={props.errandPrice}
                calculateGrade={props.calculateGrade}
                addScore={props.addScore}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#53B77C',
    },
})