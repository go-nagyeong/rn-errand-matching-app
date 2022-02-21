import React, { useState, useEffect } from 'react';
import {StyleSheet, Platform, View, Text, TouchableOpacity, Modal} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';

import CustomLabel from '../../components/CustomLabel';

export default ConfirmDetailPost = (props) => {
    return (
        <View style={styles.filter}>
            

                <View style={styles.modalContainer}>
                   

                    <View style={styles.filterWrap}>
                        <Text style={styles.filterTitle}>가격</Text>

                        <View style={styles.filterItem}>
                            {}
                        </View>
                    </View>

                   
                    <View style={styles.filterWrap}>
                        <Text style={styles.filterTitle}>마감 날짜</Text>

                        <View style={styles.filterItem}>
                        </View>
                    </View>

                    <View style={styles.filterRemoveButton}>
                        <TouchableOpacity style={styles.filterOffButton}>
                            
                            <Text style={{ color: '#76787A' }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </View>
    )

}
const styles = StyleSheet.create({
    filter: {
        flexDirection: 'row',
        paddingVertical: 15,
    },
    filterButton: {
        backgroundColor: 'tranparent',
        marginRight: 15,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: '#F6F8FA',
        padding: 12,
    },
    filterWrap: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        margin: 10,
        marginBottom: 25,
    },
    filterTitle: {
        color: 'black',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        marginBottom: 15,
    },
    filterItem: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 2,
        marginBottom: 30
    },
    filterOffButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Platform.OS == 'ios' ? 10 : 8,
        paddingHorizontal: 15,
        borderRadius: 30,
        marginRight: 10,
        marginBottom: 10,

        borderWidth: 1,
        borderColor: '#BDC0C4',
    },
    filterOnButton: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Platform.OS == 'ios' ? 10 : 8,
        paddingHorizontal: 15,
        borderRadius: 30,
        marginRight: 10,
        marginBottom: 10,

        backgroundColor: '#fff',
        ...Platform.select({
            ios: {
                shadowOpacity: 0.2,
                shadowRadius: 5,
                shadowOffset: { width: 1, height: 3 },
            },
            android: {
                elevation: 6,
            },
        })
    },
    filterRemoveButton: {
        marginBottom: 25,
    },
})