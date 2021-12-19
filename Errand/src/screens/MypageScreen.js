import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import auth from '@react-native-firebase/auth';

import Container from '../components/Container';
import LogoutAction from '../actions/LogoutAction';

export default MypageScreen = (props) => {
  const [user, setUser] = useState();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null)
      }
    })
  });

  return (
    <Container>
      <View style={styles.centerView}>
        <Text style={{alignSelf:'center', fontSize:30, marginBottom: 30}}>마이페이지</Text>
        {user && <Text>{`${user.email}님, 안녕하세요.\n`}</Text>}
        {user 
          ? <LogoutAction />
          : <Button
              title="로그인 화면으로 가기"
              onPress={() => {props.navigation.navigate('Login')}} />
        }
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});