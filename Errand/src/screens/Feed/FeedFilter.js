import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';

export default FeedFilter = (props) => {
    const [sortBy, setSortBy] = useState(['id', 'desc'])
    useEffect(() => {
        props.sortFilter(sortBy)
    }, [sortBy])

    const onSort = (col) => {
        let sortByColumn, sortOrder;

        if (sortBy[0] == col) {
            sortByColumn = sortBy[1] == 'desc' ? col : 'id';
            sortOrder = sortBy[1] == 'desc' ? 'asc' : 'desc';
        } else {
            sortByColumn = col;
            sortOrder = 'desc'
        }

        setSortBy([sortByColumn, sortOrder])
    };

    const columns = [
        {en: 'id', ko: '작성순'},
        {en: 'price', ko: '금액순'}, 
        {en: 'views', ko: '조회순'}, 
        {en: 'hearts', ko: '하트순'}, 
    ]
    const sortButton = columns.map((col, index) => {
        return (
            sortBy[0] == col.en
                ? 
                <TouchableOpacity key={index} style={styles.filterOnButton} onPress={() => onSort(col.en)}>
                    <Text style={{fontWeight: '600', color: Colors.linearGradientLeft, marginRight: 5}}>{col.ko}</Text>
                    <Icon color={Colors.linearGradientLeft} name={sortBy[1] == 'desc' ? 'caretdown':'caretup'} size={10} />
                </TouchableOpacity>
                :
                <TouchableOpacity key={index} style={styles.filterOffButton} onPress={() => onSort(col.en)}>
                    <Text style={{fontWeight: '600', color: Colors.white}}>{col.ko}</Text>
                </TouchableOpacity>
        )
    })

    return (
        <View style={styles.filterContainer}>
            {sortButton}
        </View>
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterOffButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Platform.OS == 'ios' ? 10:8,
        borderRadius: 30,
        marginHorizontal: 2,
        
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: Colors.white,
    },
    filterOnButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Platform.OS == 'ios' ? 10:8,
        borderRadius: 30,
        marginHorizontal: 4,
        
        paddingHorizontal: 14,
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
              shadowOpacity: 0.2,
              shadowRadius: 5,
              shadowOffset: {width: 1, height: 3},
            },
            android: {
              elevation: 6,
            },
        })
    },
})