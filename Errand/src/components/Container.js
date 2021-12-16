import React, { useState, useRef } from 'react';
import { SafeAreaView, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { TextInput } from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

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