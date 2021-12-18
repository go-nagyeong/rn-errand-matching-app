import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, useColorScheme } from 'react-native';

export default Container = (props) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={-200} behavior="padding">
        <ScrollView>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          {props.children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
})