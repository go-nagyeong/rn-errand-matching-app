import React from 'react';
import { KeyboardAvoidingView, ScrollView, StatusBar, useColorScheme } from 'react-native';

export default Container = (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}} keyboardVerticalOffset={-200} behavior="padding">
      <ScrollView>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {props.children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};