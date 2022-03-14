import React, {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native'
// Settings UI
import { Avatar} from 'react-native-elements'
import BaseIcon from '../../components/Icon'
import Chevron from '../../components/Chevron'
import InfoText from '../../components/InfoText'
// Edit profile menu
import { BottomSheet } from 'react-native-btr';

import Container from '../../components/Container'



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
        setwithdrawalVisible(!withdrawalVisible)
    };

    const launchSettings = () => {
        // ios settings 관련
        // WhatsApp://notifications
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings://')
        } else {
            Linking.openSettings();
        }
    }

    return (
        <Container>
            {/* Eit profile */}
            <BottomSheet
                visible={menuVisible}
                onBackButtonPress={toggleUpdateProfileView}
                onBackdropPress={toggleUpdateProfileView}
            >
                <View style={styles.panel}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.panelTitle}>Edit Profile</Text>
                        <Text style={styles.panelSubtitle}>버튼을 눌러 선택하세요!</Text>
                    </View>
                    <TouchableOpacity style={styles.panelButton} onPress={() => props.navi.navigate('ReName')}>
                        <Text style={styles.panelButtonTitle}>이름 수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.panelButton} onPress={() => { props.importFromCamera() }}>
                        <Text style={styles.panelButtonTitle}>카메라</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.panelButton} onPress={() => { props.importFromAlbum() }}>
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
                    <View style={{ alignItems: 'center' }}>
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

            <View>
                <TouchableOpacity onPress={() => props.navi.navigate('Chat')}>
                    <Text>채팅 테스트</Text>
                </TouchableOpacity>
            </View>

            {/* 프로필 */}
            <TouchableOpacity onPress={toggleUpdateProfileView}>
                <View style={styles.userRow}>
                    <View style={styles.userImage}>
                        <Avatar
                            rounded
                            size="large"
                            source={{ uri: props.url }}
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
                    <View style={{ textAlign: 'right', padding: 25 }}>
                        <Chevron />
                    </View>
                </View>
            </TouchableOpacity>

            {/* 메뉴 */}
            <InfoText text="Account" />
            <View>
              <TouchableOpacity onPress={() => { launchSettings(); }} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#FEA8A1'}}
                      icon={{
                          type: 'material',
                          name: 'notifications',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>알림 설정</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {props.navi.navigate('FindPw')}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#FEA8A1'}}
                      icon={{
                          type: 'material',
                          name: 'notifications',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>비밀번호 수정</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {props.signOut();}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#FEA8A1'}}
                      icon={{
                          type: 'material',
                          name: 'logout',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>로그아웃</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {togglewithdrawalView();}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#FEA8A1'}}
                      icon={{
                          type: 'material',
                          name: 'person-remove',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>회원 탈퇴</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>
          </View>



          <InfoText text="More" />




          <View>
              <TouchableOpacity onPress={() => {props.navi.navigate('MyCompletedErrand')}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#ff7f00'}}
                      icon={{
                          type: 'material',
                          name: 'list',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>완료된 심부름</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#A4C8F0'}}
                      icon={{
                          type: 'ionicon',
                          name: 'md-information-circle',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>About Us</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#C47EFF'}}
                      icon={{
                          type: 'entypo',
                          name: 'share',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>Share our App</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#FECE44'}}
                      icon={{
                          type: 'material',
                          name: 'star',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>Rate Us</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}} style={styles.content}>
                <View style={styles.element}>
                  <View style={{padding: 5}}>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#00C001'}}
                      icon={{
                          type: 'material',
                          name: 'feedback',
                      }}
                    />
                  </View>
                  <Text style={styles.name}>Send Feedback</Text>
                </View>
                <View style={styles.rightElement}>
                  <Chevron/>
                </View>
              </TouchableOpacity>
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
    // listItem 대체
    // elem: {
    //   width: '100%',
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'space-between',
    //   // borderColor: #ffff,
    //   borderBottomWidth: 0.5,
    //   padding: 5,
    // },
    // container: {
    //   flex: 1,
    // },
    // header: {
    //   height:60,
    //   backgroundColor:'green',
    // },
    // footer: {
    //   height:60,
    //   backgroundColor:'red',
    // },
    // content: {
    //   flex:1,
    // },
  
    content: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor:'#eee',
      // borderBottomWidth:0.5,
      borderWidth: 0.5,
      padding: 5,
    },
    element: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightElement: {
      padding:8,
      // backgroundColor:'yellow',
      // borderRadius:5,
    },
    // profile: {
    //   width: 50,
    //   height: 50,
    //   // borderRadius: 25,
    //   // backgroundColor: 'yellow',
    // },
    name: {
      fontSize: 15,
      paddingLeft: 10,
      color:'black',
    }
})
    // import {checkNotifications, requestNotifications, openSettings} from 'react-native-permissions';
    // import {PushNotificationPermissions, PushNotification} from 'react-native-push-notification';
    // import messaging from '@react-native-firebase/messaging';

    // Notification settings
    // const [pushNotifications, setPushNotifications] = useState(true)

    // [foreground] 알림 수신 되었을 때 alert
    // useEffect(() => {
    //     const unsubscribe = messaging().onMessage(async remoteMessage => {
    //       Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //     });

    //     return unsubscribe;
    //   }, []);

    // checkNotifications().then(({status, settings}) => {
    //         if (status == 'granted') {
    //         console.log(status, settings);
    //         this.setState({
    //             notification: false
    //         })
    //         console.log(status, settings);
    //     }
    // });

    // requestNotifications(['alert']).then(({status, settings}) => {
    //     if (status == 'granted') {
    //         console.log(status, settings);
    //         this.setState({
    //             notification: false
    //         })
    //         console.log(status, settings);
    //     }

    // });
    // 앱 설정 이동
    // openSettings().catch(() => console.warn('cannot open settings'));

    // PushNotificationPermissions();