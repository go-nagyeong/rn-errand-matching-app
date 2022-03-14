import React, { useState, useEffect } from 'react';
import {StyleSheet, Platform, View, Text, TouchableOpacity, Modal} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/FontAwesome';
import IOIcon from 'react-native-vector-icons/Ionicons';

import CustomLabel from '../../components/CustomLabel';

export default FilterModal = (props) => {
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [sortBy, setSortBy] = useState(['id', 'desc'])
    useEffect(() => {
        props.sortFilter(sortBy)
    }, [sortBy])

    const [priceRange, setPriceRange] = useState([0, 5000])
    useEffect(() => {
        props.priceFilter(priceRange)
    }, [priceRange])


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
        {en: 'endDate', ko: '마감일순'}, 
        {en: 'price', ko: '금액순'}, 
    ]
    const sortButton = columns.map((col, index) => {
        return (
            sortBy[0] == col.en
                ? 
                <TouchableOpacity key={index} style={styles.filterOnButton} onPress={() => onSort(col.en)}>
                    <Text style={{color: '#1bb55a', marginRight: 5}}>{col.ko}</Text>
                    <Icon style={{color: '#1bb55a'}} name={sortBy[1] == 'desc' ? 'caretdown':'caretup'} size={10} />
                </TouchableOpacity>
                :
                <TouchableOpacity key={index} style={styles.filterOffButton} onPress={() => onSort(col.en)}>
                    <Text style={{color: '#76787A'}}>{col.ko}</Text>
                </TouchableOpacity>
        )
    })

    return (
        <View style={styles.filter}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
                <MaskedView maskElement={<IOIcon name='options-sharp' size={22} color="#000" />}>
                    <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#5B86E5', '#36D1DC']}>
                        <IOIcon name='options-sharp' size={24} color="transparent" />
                    </LinearGradient> 
                </MaskedView>
            </TouchableOpacity>

            <Modal 
                visible={showFilterModal}
                onRequestClose={() => setShowFilterModal(false)}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={{marginBottom: 30}}>
                        <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => setShowFilterModal(false)}>
                            <Icon style={{includeFontPadding: false,}} name='close' size={28} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.filterWrap}>
                        <Text style={styles.filterTitle}>SORT BY</Text>

                        <View style={styles.filterItem}>
                            {sortButton}
                        </View>
                    </View>

                    <View style={styles.filterWrap}>
                        <Text style={styles.filterTitle}>PRICE</Text>

                        <View style={[styles.filterItem, {justifyContent: 'center', marginBottom: 40}]}>
                            <MultiSlider 
                                values={[priceRange[0], priceRange[1]]}
                                onValuesChangeFinish={(price) => setPriceRange(price)}
                                sliderLength={Platform.OS == 'ios' ? 320:340}
                                min={0}
                                max={5000}
                                step={500}
                                snapped={true}
                                enableLabel={true}
                                trackStyle={{height: 3, backgroundColor: '#d1d1d1'}}
                                selectedStyle={{backgroundColor: '#53B77C'}}
                                unselectedStyle={{backgroundColor: '#d1d1d1'}}
                                customMarker={() => (<Icon name="pay-circle1" size={20} color='#53B77C' style={{backgroundColor: '#F6F8FA'}}/>)}
                                customLabel={CustomLabel}
                            />
                        </View>
                    </View>

                    <View style={styles.filterWrap}>
                        <Text style={styles.filterTitle}>KEYWORD SEARCH</Text>

                        <View style={styles.filterItem}>         
                        </View>
                    </View>

                    <View style={styles.filterRemoveButton}>
                        <TouchableOpacity style={styles.filterOffButton}>
                            <Icon style={{color: '#76787A', marginRight: 5}} name='delete' size={16} />
                            <Text style={{color: '#76787A'}}>필터 초기화</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    filter: {
        flexDirection: 'row',
        paddingVertical: 18, 
    },
    filterButton: {
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingVertical: 2,
        paddingLeft: 6,
        paddingRight: 2,
        ...Platform.select({
            ios: {
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: {width: 3, height: 3},
            },
            android: {
              elevation: 6,
            },
        }),
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
        paddingVertical: Platform.OS == 'ios' ? 10:8,
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
        paddingVertical: Platform.OS == 'ios' ? 10:8,
        paddingHorizontal: 15,
        borderRadius: 30,
        marginRight: 10,
        marginBottom: 10,

        backgroundColor: '#fff',
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
    filterRemoveButton: {
        marginBottom: 25,
    },
})