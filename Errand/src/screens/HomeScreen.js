import React from 'react';
import {
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  Text,
  Button} from 'react-native';

export default HomeScreen = (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.centerView}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Text>홈 화면 입니다.</Text>
        <Button
          title="로그인 화면으로 가기"
          onPress={() => {props.navigation.navigate('Login')}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});