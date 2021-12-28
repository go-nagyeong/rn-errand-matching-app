import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './src/screens/HomeScreen';
import Mypage from './src/screens/MypageScreen';
// import Login from './src/screens/LoginScreen';
import LoginAction from './src/actions/LoginAction';
// import Register from './src/screens/RegisterScreen';
import RegisterAction from './src/actions/RegisterAction';
// import FindPw from './src/screens/FindPassword';
import FindPwAction from './src/actions/FindPwAction';

const Stack = createStackNavigator();

export default App = () => {
  return (
    <NavigationContainer> 
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={({navigation}) => ({
          headerRight: () => (
            <Button title="Mypage" onPress={() => navigation.navigate('Mypage')} />
          )
        })}/>
        <Stack.Screen name="Mypage" component={Mypage} />
        <Stack.Screen name="Login" component={LoginAction} />
        <Stack.Screen name="Register" component={RegisterAction} />
        <Stack.Screen name="FindPw" component={FindPwAction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}