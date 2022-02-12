import React, { Component, useState, useEffect, useCallback, setState } from 'react'
import { SafeAreaView, ScrollView, Switch, StyleSheet, Text, View, LogBox, RefreshControl, TouchableOpacity, Linking, Alert } from 'react-native'
// Settings UI
import { Avatar, ListItem } from 'react-native-elements'
import BaseIcon from '../components/Icon'
import Chevron from '../components/Chevron'
import InfoText from '../components/InfoText'
// Edit profile menu
import { BottomSheet } from 'react-native-btr';

import Container from '../components/Container'

// Ignore Warnings
LogBox.ignoreLogs(['Warning: ...']);

// Main
export default SettingsScreen = (props) => {
    console.log('설정 페이지 화면입니다')
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false); // edit profile Menu
    const [withdrawalVisible, setwithdrawalVisible] = useState(false) // withdrawal Menu

    // 프로필 수정 메뉴 (Bottom sheet)
    const toggleUpdateProfileView = () => {
        setMenuVisible(!menuVisible);
    };
    // 회원 탈퇴 메뉴
    const togglewithdrawalView = () => {
        console.log(!withdrawalVisible)
        setwithdrawalVisible(!withdrawalVisible)
    };

    return (
        <Container>
            {/* Eit profile */}
            <BottomSheet
                visible={menuVisible}
                onBackButtonPress={toggleUpdateProfileView}
                onBackdropPress={toggleUpdateProfileView}
            >
                <View style={styles.panel}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.panelTitle}>Edit Profile</Text>
                        <Text style={styles.panelSubtitle}>버튼을 눌러 선택하세요!</Text>
                    </View>
                    <TouchableOpacity style={styles.panelButton} onPress={() => props.navi.navigate('ReName')}> 
                        <Text style={styles.panelButtonTitle}>이름 수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.panelButton} onPress={() => {props.importFromCamera()}}>
                        <Text style={styles.panelButtonTitle}>카메라</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.panelButton} onPress={() => {props.importFromAlbum()}}>
                        <Text style={styles.panelButtonTitle}>앨범에서 가져오기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.panelButton}
                        onPress={toggleUpdateProfileView}>
                        <Text style={styles.panelButtonTitle}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>

            {/* Membership Withdrawal */}
            <BottomSheet
                visible={withdrawalVisible}
                onBackButtonPress={togglewithdrawalView}
                onBackdropPress={togglewithdrawalView}
            >
                <View style={styles.panel}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.panelTitle}>회원 탈퇴</Text>
                        <Text style={styles.panelSubtitle}>정말 탈퇴하시겠어요?</Text>
                    </View>
                    <TouchableOpacity style={styles.panelButton} onPress={() => props.withdrawal()}>
                        {/* props.withdrawal()  togglewithdrawalView */}
                        <Text style={styles.panelButtonTitle}>예</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.panelButton} onPress={() => togglewithdrawalView()}>
                        <Text style={styles.panelButtonTitle}>아니요</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
            
            <TouchableOpacity onPress={toggleUpdateProfileView}>
                <View style={styles.userRow}>
                    <View style={styles.userImage}>
                        <Avatar
                            rounded
                            size="large"
                            source={{uri: props.url}}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 16 }}>{props.nickname}</Text>
                        <Text
                        style={{
                            color: 'gray',
                            fontSize: 16,
                        }}
                        >
                        {props.email}
                        </Text>
                    </View>
                    <View style={{textAlign: 'right', padding: 40}}>
                        <Chevron  />
                    </View>
                </View>
            </TouchableOpacity>
        
            <InfoText text="Account" />
            <View>
                <ListItem
                hideChevron
                title="알림 설정"
                containerStyle={styles.listItemContainer}
                // rightElement={
                    // <Switch
                    //     onValueChange={() => {launchSettings(); console.log(1);}} //setPushNotifications(!pushNotifications)
                    //     value={pushNotifications}
                    // />
                // }
                rightIcon={<Chevron />}
                leftIcon={
                    <BaseIcon
                    containerStyle={{
                        backgroundColor: '#FFADF2',
                    }}
                    icon={{
                        type: 'material',
                        name: 'notifications',
                    }}
                    />
                }
                />
                <ListItem
                title="비밀번호 수정"
                rightTitleStyle={{ fontSize: 15 }}
                onPress={() => {props.navi.navigate('FindPw')}}
                containerStyle={styles.listItemContainer}
                leftIcon={
                    <BaseIcon
                    containerStyle={{ backgroundColor: '#FEA8A1' }}
                    icon={{
                        type: 'material',
                        name: 'language',
                    }}
                    />
                }
                rightIcon={<Chevron />}
                />
                <ListItem
                title="로그아웃"
                rightTitleStyle={{ fontSize: 15 }}
                onPress={() => props.signOut()}
                containerStyle={styles.listItemContainer}
                leftIcon={
                    <BaseIcon
                    containerStyle={{ backgroundColor: '#FEA8A1' }}
                    icon={{
                        type: 'material',
                        name: 'language',
                    }}
                    />
                }
                rightIcon={<Chevron />}
                />
                <ListItem
                title="회원 탈퇴"
                rightTitleStyle={{ fontSize: 15 }}
                onPress={togglewithdrawalView}
                containerStyle={styles.listItemContainer}
                leftIcon={
                    <BaseIcon
                    containerStyle={{ backgroundColor: '#FEA8A1' }}
                    icon={{
                        type: 'material',
                        name: 'language',
                    }}
                    />
                }
                rightIcon={<Chevron />}
                />
            </View>

            <InfoText text="More" />
            <View>
                <ListItem
                    title="게시물 목록"
                    onPress={() => {props.navi.navigate('MyRegisteredErrand')}}
                    containerStyle={styles.listItemContainer}
                    leftIcon={
                        <BaseIcon
                        containerStyle={{ backgroundColor: '#A4C8F0' }}
                        icon={{
                            type: 'ionicon',
                            name: 'md-information-circle',
                        }}
                        />
                    }
                    rightIcon={<Chevron />}
                />
                <ListItem
                    title="About US"
                    onPress={() => console.log('About US')}
                    containerStyle={styles.listItemContainer}
                    leftIcon={
                        <BaseIcon
                        containerStyle={{ backgroundColor: '#A4C8F0' }}
                        icon={{
                            type: 'ionicon',
                            name: 'md-information-circle',
                        }}
                        />
                    }
                    rightIcon={<Chevron />}
                />
                <ListItem
                title="Share our App"
                onPress={() => console.log('Share our App')}
                containerStyle={styles.listItemContainer}
                leftIcon={
                    <BaseIcon
                    containerStyle={{
                        backgroundColor: '#C47EFF',
                    }}
                    icon={{
                        type: 'entypo',
                        name: 'share',
                    }}
                    />
                }
                rightIcon={<Chevron />}
                />
                <ListItem
                title="Rate Us"
                onPress={() => console.log('Rate Us')}
                containerStyle={styles.listItemContainer}
                leftIcon={
                    <BaseIcon
                    containerStyle={{
                        backgroundColor: '#FECE44',
                    }}
                    icon={{
                        type: 'entypo',
                        name: 'star',
                    }}
                    />
                }
                rightIcon={<Chevron />}
                />
                <ListItem
                title="Send FeedBack"
                onPress={() => console.log('Send FeedBack')}
                containerStyle={styles.listItemContainer}
                badge={{
                    value: 123,
                    textStyle: { fontSize: 14, color: 'white' },
                }}
                leftIcon={
                    <BaseIcon
                    containerStyle={{
                        backgroundColor: '#00C001',
                    }}
                    icon={{
                        type: 'materialicon',
                        name: 'feedback',
                    }}
                    />
                }
                rightIcon={<Chevron />}
                />
            </View>
        </Container>
    )
}
const styles = StyleSheet.create({
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    panelHeader: {
        alignItems: 'center',
      },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#53B77C',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userRow: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
    },
    userImage: {
        marginRight: 12,
    },
    listItemContainer: {
        height: 55,
        borderWidth: 0.5,
        borderColor: '#ECECEC',
    },
})