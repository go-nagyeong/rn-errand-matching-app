import React from 'react';
import { Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

import Colors from '../constants/Colors';

export default Container = (props) => {
  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: Colors.white}} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} behavior="padding">
      <ScrollView>
        {props.children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};