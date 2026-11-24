import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigation from './MainNavigation';
import SplashScreen from '../Screens/SplashScreen';
// LOGIN
import LoginScreen from '../Screens/Auth/LoginScreen';
import ForgetPasswordScreen from '../Screens/Auth/ForgetPasswordScreen';
import OTPVerificationScreen from '../Screens/Auth/OTPVerificationScreen';
import NewPasswordScreen from '../Screens/Auth/NewPasswordScreen';
import MiddleWareScreen from '../Screens/Auth/MiddleWareScreen';
import FingerPrintAuthentication from '../Screens/Auth/FingerPrintAuthentication';
const Stack = createStackNavigator();

const AutNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="FingerPrintAuthentication" component={FingerPrintAuthentication} />

      <Stack.Screen
        name="ForgetPasswordScreen"
        component={ForgetPasswordScreen}
      />
      <Stack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
      />
      <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AutNavigator;
