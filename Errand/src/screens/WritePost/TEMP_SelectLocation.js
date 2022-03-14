import Postcode from '@actbase/react-daum-postcode';
import React, { useState } from 'react';
import { Modal, Platform, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PostSubmitButton from '../../components/PostSubmitButton';
import PostSkipButton from '../../components/PostSkipButton';
import { RadioButton, Checkbox } from 'react-native-paper'
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

export default SelectLocation = (props) => {

    const { color, category, price } = props.route.params;

    const [destinationLocation, setDestinationLocation] = useState("");
    const [arriveLocation, setArriveLocation] = useState("");

    const [isDestinationModal, setIsDestinationModal] = useState(false);
    const [isArriveModal, setIsArriveModal] = useState(false);
    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(false);

    const [isSelected, setSelection] = useState(false);
    const inputLocation = () => {
        props.navigation.navigate('WriteTitle', { color: color, category: category, price: price, destinationLocation: destinationLocation, arriveLocation: arriveLocation })

    }

    const [selectedId, setSelectedId] = useState(1);
    const categories = [
        { id: 1, text: '목적지 선택' },
        { id: 2, text: '도착지 선택' },
    ]
    const CategoryBox = ({ opacity, onPress, item }) => (
        <TouchableOpacity style={[styles.categoryBox, opacity]} onPress={onPress}>
            <Text style={styles.categoryText}>{item.text}</Text>
            <Icon name={item.icon} size={30}></Icon>
        </TouchableOpacity>
    )

    const renderCategoryBox = ({ item }) => {
        const opacity = item.id === selectedId ? 0.7 : 1;
        return (
            <CategoryBox
                opacity={{ opacity }}
                onPress={() => {
                    setSelectedId(item.id)
                    props.selectCategory(item.text);
                }}
                item={item}
            />
        )
    }


    return (
        <Container>
            <View style={styles.previousState}>
                <SpeechBalloon prev='category' content={category} />
                <SpeechBalloon prev='price' content={price} />
            </View>
            <View style={styles.centerView}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>목적지/도착지 설정</Text>
                </View>

                <TouchableOpacity onPress={() => setIsDestinationModal(true)}>
                    <View style={styles.elem}>

                        {destinationLocation == "" && <>
                            <Text> 목적지 주소를 설정해 주세요.</Text>
                        </>}

                        {destinationLocation != "" && <>
                            <Text>{destinationLocation}  </Text>
                        </>}

                        <Checkbox
                            value="destination"
                            status={checked ? 'checked' : 'unchecked'}
                            disabled={true}
                        />
                    </View>
                </TouchableOpacity>


                <Modal
                    visible={isDestinationModal}
                    onRequestClose={true}
                    animationType="fade"
                    transparent={true}
                >
                    <View style={styles.postcodeWrapper}>
                        <View style={styles.postcodeView}>
                            <TouchableOpacity onPress={() => setIsDestinationModal(false)}>
                                <Text>x</Text>
                            </TouchableOpacity>


                            <Postcode
                                style={{ width: 320, height: 500 }}
                                jsOptions={{ animation: true, hideMapBtn: true }}
                                onSelected={data => {
                                    setChecked(true)
                                    setDestinationLocation(JSON.stringify(data["roadAddress"]));
                                    setIsDestinationModal(false);
                                }}
                            />

                            <Text> 심부름을 수행해야할 목적지 주소를 입력해주세요.</Text>


                        </View>
                    </View>
                </Modal>



                <TouchableOpacity onPress={() => setIsArriveModal(true)}>
                    <View style={styles.elem}>
                        {arriveLocation == "" && <>
                            <Text> 도착지 주소를 설정해 주세요.</Text>
                        </>}

                        {arriveLocation != "" && <>
                            <Text>{arriveLocation}  </Text>
                        </>}

                        <Checkbox
                            value="arrive"
                            status={checked2 ? 'checked' : 'unchecked'}
                            disabled={true}
                        />
                    </View>
                </TouchableOpacity>

                <Modal
                    visible={isArriveModal}
                    onRequestClose={true}
                    animationType="fade"
                    transparent={true}
                >
                    <View style={styles.postcodeWrapper}>
                        <View style={styles.postcodeView}>
                            <TouchableOpacity onPress={() => setIsArriveModal(false)}>
                                <Text>x</Text>
                            </TouchableOpacity>
                            <Postcode
                                style={{ width: 320, height: 500 }}
                                jsOptions={{ animation: true, hideMapBtn: true }}
                                onSelected={data => {
                                    setChecked2(true)
                                    setArriveLocation(JSON.stringify(data["roadAddress"]));
                                    setIsArriveModal(false);
                                }}
                            />
                        </View>
                    </View>
                </Modal>


                


            </View>

            <View style={styles.header}>
                <LinearGradient start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['#36D1DC', '#5B86E5']} style={{borderRadius: 30}}>
                    <FlatList
                        contentContainerStyle={{ padding: 18 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id}
                        data={categories}
                        renderItem={renderCategoryBox}
                        extraData={selectedId}
                    />
                </LinearGradient>
                </View>

            {arriveLocation == "" && destinationLocation == "" && <>
                <PostSkipButton backgroundColor={color} onPress={() => inputLocation()} />
            </>}
            {arriveLocation != "" && destinationLocation == "" && <>
                <PostSubmitButton backgroundColor={color} onPress={() => inputLocation()} />
            </>}
            {arriveLocation == "" && destinationLocation != "" && <>
                <PostSubmitButton backgroundColor={color} onPress={() => inputLocation()} />
            </>}
            {arriveLocation != "" && destinationLocation != "" && <>
                <PostSubmitButton backgroundColor={color} onPress={() => inputLocation()} />
            </>}





        </Container >

    );
}


const styles = StyleSheet.create({
    titleWrapper: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontFamily: 'NotoSansKR-Medium',
        color: 'black',
        fontSize: 24,
        padding: 10,
    },
    previousState: {
        flex: 1,
        paddingTop: 20,
        marginBottom: 40,
    },
    elem: {
        // width: '100%',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#eee',
        borderBottomWidth: 0.5,
        padding: 5,
        margin: 15,
        backgroundColor: "#eee",

    },
    checkView: {
        flex: 1,
        flexDirection: 'column', // 혹은 'column'
    },
    centerView: {
        flex: 1,
        paddingHorizontal: 30,
    },
    postcodeWrapper: {
        backgroundColor: "#fff",
        flex: 1,
    },
    postcodeView: {
        marginTop: "40%",
        paddingHorizontal: 30,
    },
    inputWrapper: {
        // alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginBottom: 15,

        backgroundColor: "#fff",
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowOpacity: 0.3,
                shadowRadius: 5,
                shadowOffset: { width: 6, height: 3 },
            },
            android: {
                elevation: 6,
            },
        })
    },
    input: {
        top: Platform.OS === 'ios' ? '-1.1%' : '-0.5%',
        width: '85%',
        fontSize: 16,
        marginHorizontal: 10,
        padding: 0,  // input 높이 맞추기 위해 안드로이드에만 있는 기본 padding 제거
    },

    imageUploadButton: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center',
        marginBottom: 40,
        marginRight: 3,
        borderRadius: 30,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    header: {
        flex: 1,
    },
    categoryBox: {
        backgroundColor: '#fff',
        padding: 17,
        borderRadius: 30,
        width: 150,
        height: 200,
        marginRight: 15,
    },
    categoryText: {
        color: 'black',
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        marginBottom: 3,
    },
    boardView: {
        flex: Platform.OS === 'ios' ? 2.6 : 1.9,
        backgroundColor: '#EDF1F5',
        paddingHorizontal: 12,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    postButton: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#1bb55a',
    },
});
