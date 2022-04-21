import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View, SafeAreaView } from 'react-native';

import Colors from '../../constants/Colors';
import MyHeartListRenderItem from './MyHeartListRenderItem';

export default MyHeartList = (props) => {
    const { heartList, refreshing, getHeartList } = props;

    const renderItem = ({ item, index }) => {
        return <MyHeartListRenderItem item={item} index={index} />
    }
    return (
        <View style={styles.boardView}>
            <FlatList
                keyExtractor={item => item.id}
                data={heartList}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getHeartList} />}
            />
        </View>
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
