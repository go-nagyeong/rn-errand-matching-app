import React, { useState, useRef, useEffect } from 'react'
import { Linking, StyleSheet, SafeAreaView, ScrollView, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Avatar, Tooltip } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Feather';
import F5Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
// UI 관련
import Colors from '../../constants/Colors';
import Chevron from '../../components/Chevron'
import Loader from '../../components/Loader';
import Header from '../../components/Header';
// 1:1 문의
import Mailer from 'react-native-mail';

export default MypageScreen = (props) => {
  const scorePosition = (props.scorePosition / 50) * 100;
  const gradeStyle = props.score < 1.6 ? ['frown', Colors.red] : ['smile', Colors.green];
  
  const tooltipRef = useRef(null);
  const userImageSheet = useRef(null);
  // 가변 tooltip 크기 조절
  const [tooltipSize, setTooltipSize] = useState({width: 200, height: 50})
  const tooltipClone = React.cloneElement(
    <Text style={{fontSize: 14}}> 매칭된 상대에게 지금까지 받아온 평점들을 토대로 계산한 당신의 심부름 및 매너 성적입니다. </Text>,
    {onLayout: (e) => setTooltipSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
  )

  const SettingMenu = (props) => {
    const {title, onPress} = props;

    return (
      <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <Text style={{includeFontPadding: false, fontWeight: '600', fontSize: 16, color: Colors.black}}>
          {title}
        </Text>
        <Chevron />
      </TouchableOpacity>
    )
  }

  const launchSettings = () => {
    Platform.OS === 'ios' ? Linking.openURL('app-settings://') : Linking.openSettings()
  }

  const handleEmail = () => {
    Mailer.mail({
      subject: '', // 제목
      recipients: ['support@errand.com'], // 받는 사람
      body: '<b></b>', // 내용
      isHTML: true,
    }, (error, event) => {
      Alert.alert(
        error,
        event,
        [
          {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
          {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
        ],
        { cancelable: true }
      )
    });
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header title='마이페이지' titleColor={Colors.black} />

        <ScrollView>
          <View style={styles.profile}>
            <View style={{flex: 1}}>
              {/* 닉네임 */}
              <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}} onPress={() => props.navi.navigate('ReName')}>
                <Text style={{fontSize: 20, color: Colors.black, fontWeight: '600', marginRight: 12}}>{props.nickname}</Text>
                <F5Icon name='pen' size={12} color={Colors.darkGray2} />
              </TouchableOpacity>

              {/* 이메일 */}
              <Text style={{fontSize: 14, color: Colors.darkGray, marginBottom: 20}}>{props.email}</Text>
              
              {/* 등급 */}
              <View style={{width: '90%'}}>
                <TouchableWithoutFeedback onPress={() => tooltipRef.current.toggleTooltip()}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                    <Text style={{fontSize: 15, fontWeight: '600', color: Colors.darkGray2, marginRight: 4}}>성적</Text>
                    <Icon name="information-circle-outline" size={18} color={Colors.darkGray2} style={{includeFontPadding: false}} />
                    <Tooltip
                      ref={tooltipRef}
                      overlayColor={Colors.translucent}
                      backgroundColor={Colors.white}
                      width={tooltipSize.width + 30} 
                      height={tooltipSize.height + 30}
                      popover={tooltipClone}
                      skipAndroidStatusBar={true}
                    >
                    </Tooltip>
                  </View>
                </TouchableWithoutFeedback>

                <View style={styles.scoreBar}>
                  <LinearGradient style={[styles.currentScore, {width: scorePosition + '%'}]} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]} />
                </View>

                <View style={styles.gradeLabel}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FIcon name={gradeStyle[0]} size={20} color={gradeStyle[1]} style={{ marginRight: 4 }} />
                    <Text style={{fontSize: 16, fontWeight: '500', color: gradeStyle[1]}}>{props.grade}</Text>
                  </View>
                  <Text style={{fontSize: 14, color: Colors.black}}>{props.nextGrade}</Text>
                </View>
              </View>
            </View>

            {/* 사용자 이미지 */}
            <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={() => userImageSheet.current.show()}>
             {props.userImage
                ?
                <Avatar
                  rounded
                  size={100}
                  source={{ uri:  props.userImage }}
                />
                :
                <Avatar
                  rounded
                  size={100}
                  icon={{ name: 'user-alt', type: 'font-awesome-5', size: 50 }}
                  containerStyle={{ backgroundColor: Colors.lightGray2 }}
                />
              }
              <View style={[styles.editButton, {position: 'absolute', bottom: 1, right: 1}]}>
                <F5Icon name='camera' size={12} color={Colors.darkGray2} style={{includeFontPadding: false}} />
              </View>
            </TouchableOpacity>

            {/* 사용자 이미지 변경 BottomSheet */}
            <ActionSheet
              ref={userImageSheet}
              options={['사진 찍기', '앨범에서 선택', '취소']}
              cancelButtonIndex={2}
              onPress={(index) => {
                if (index == 0) {
                  props.importFromCamera()
                } else if (index == 1) {
                  props.importFromAlbum()
                }
              }}
            />
          </View>

          {/* 계정 설정 */}
          <View style={styles.setting}>
            <SettingMenu title="알림 설정" onPress={() => launchSettings()} />
            <SettingMenu title="회원정보 수정" onPress={() => props.navi.navigate('EditProfile')} />
          </View>
          <View style={styles.setting}>
            <SettingMenu title="심부름 내역" onPress={() => props.navi.navigate('MyCompletedErrand')} />
            <SettingMenu title="찜 리스트" onPress={() => props.navi.navigate('Heart')} />
          </View>

          {/* 설정 */}
          <View style={styles.setting}>
            {/* <SettingMenu title="공지사항" onPress={() => console.log('공지사항 이런 것들')} /> */}
            <SettingMenu title="1:1 문의하기" onPress={handleEmail} />
            <SettingMenu title="FAQ" onPress={() => props.navi.navigate('Faq')} />
            <SettingMenu title="앱 평가하기" onPress={() => console.log('번거로운 것 같으면 안해도 됨')} />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => props.signOut()}>
              <Text style={styles.textButton}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Loader isLoading={props.isLoading} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  profile: {
    margin: 25,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreBar: {
    backgroundColor: Colors.lightGray,
    height: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  currentScore: {
    height: 10,
    borderRadius: 10,
  },
  gradeLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.midGray,
  },

  setting: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightGray,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },

  footer: {
    marginHorizontal: 20,
    paddingVertical: 30,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 15,
    color: Colors.midGray,
    textDecorationLine: 'underline',
  },
})