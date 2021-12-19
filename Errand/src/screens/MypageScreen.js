import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import auth from '@react-native-firebase/auth';

import Container from '../components/Container';

export default MypageScreen = (props) => {
  return (
    <Container>
      <View style={styles.centerView}>
        <Text>마이페이지 화면 입니다.</Text>
        <Button
          title="로그인 화면으로 가기"
          onPress={() => {props.navigation.navigate('Login')}} />
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