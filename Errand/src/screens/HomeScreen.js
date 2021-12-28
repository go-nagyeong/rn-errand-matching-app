import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Container from '../components/Container';

export default HomeScreen = (props) => {
  return (
    <Container>
      <View style={styles.centerView}>
        <Text style={{alignSelf:'center', fontSize:30, marginBottom: 30}}>메인 화면</Text>
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