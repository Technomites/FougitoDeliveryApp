import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Linking,
  Platform,
  PermissionsAndroid,
  AppState,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Color from '../Constants/Color';
// import {BaseUrl} from '../Components/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import * as AuthAction from '../Store/Auth/AuthAction';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';
import listeners from '../Constants/listeners';
import * as DataAction from '../Store/Data/DataAction';
import { totalSize, height } from 'react-native-dimension';
import FocusAwareStatusBar from '../Components/UI-Support/customStatusBar';
import { fontSize, scalableheight } from '../Components/resposnevaraiable';
import { _setBaseUrlToggle, SetUrlConst, SetUrlConstuk } from '../Components/BaseUrl';
import Geolocation from 'react-native-geolocation-service';
import { Text } from 'react-native';
import { BrandField, WhiteLogo } from '../Components/UI-Support/AuthBrandPane';
import useLayout from '../Components/useLayout';
import { HardCode } from '../Constants/texting';
import { C, F } from '../Constants/tokens';
import { setNavBarTone } from '../Components/NavBarFrame';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SplashScreen = props => {
  const [refData, setRefData] = useState();
  const dispatch = useDispatch();

  const [permissionGranted, setPermissionGranted] = useState(false);
  // const firstRun = useRef(true);
  // useEffect(() => {
  //   requestLocationPermission();

  //   const subscription = AppState.addEventListener('change', state => {
  //     if (!firstRun.current && state === 'active') {
  //       requestLocationPermission();
  //     }
  //     firstRun.current = false;
  //   });

  //   return () => subscription.remove();

  // }, []);
  const checkLocationEnabled = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert(HardCode.UnableToOpenSettings);
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      console.log('Error', 'Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        HardCode.TurnOnLocationServicesToAllowBakeryAppToDetermineYourLocation,
        '',
        [
          { text: HardCode.GoToSettings, onPress: openSetting },
          { text: HardCode.DontUseLocation, onPress: () => { } },
        ],
      );
    }
    return false;
  };
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          dispatch(AuthAction.LocationConnectionAction({
            msg: "Location Permission Denied splash",
            bol: false
          }));


          return;
        }

      } else {

        const isLocationEnabled = await checkLocationEnabled();

        if (!isLocationEnabled) {
          dispatch(AuthAction.LocationConnectionAction({
            msg: "Location Permission Denied splash",
            bol: false
          }));
          return;

        }
      }

      setPermissionGranted(true);

    } catch (err) {
      console.log('Permission error', err);
    }

  };
  // const getuserDeatils = async () => {
  // const GetRefreshToken = tokenObj => {
  //   var myHeaders = new Headers();
  //   myHeaders.append('Content-Type', 'application/json');
  //   myHeaders.append('Accept', 'text/plain');

  //   var raw = JSON.stringify(tokenObj);

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow',
  //   };

  //   fetch(`${BaseUrl}partner/Account/RefreshToken`, requestOptions)
  //     .then(response => response.json())
  //     .then(result => {
  //       if (result) {
  //         setRefData(result.Result);
  //       }
  //     })
  //     .catch(error => console.log('error', error));
  // };

  //   try {
  //     const value = await AsyncStorage.getItem('AuthData');

  //     const data = await JSON.parse(value);

  //     if (data !== null) {
  // dispatch(AuthAction.SaveUserDataIntoRedux(data));
  // GetRefreshToken(data.Result.AuthData.TokenInfo);
  //       // console.log(data.Result.AuthData.TokenInfo, 'Data');
  // setTimeout(() => props.navigation.replace('Drawer'), 1000); //Mytab
  //     } else {
  //       //alert('null');
  //       setTimeout(() => props.navigation.replace('Auth'), 1000);
  //     }
  //   } catch (e) {
  //     console.log('error');
  //     //console.log(e + ' oama');
  //     //alert('error');
  //   }
  // };
  useEffect(() => {
    dispatch(DataAction.InternetConnectionBackScreenAction('MiddleWareScreen'));
    const unsubscribe = NetInfo.addEventListener(state => {
      // if (state.isConnected === false) {
      //   props.navigation.replace('InterentConnection', {
      //     screenname: 'MiddleWareScreen',
      //   });
      // }
      //alert(state.isConnected);
      console.log(
        state.isConnected + 'Interneent connected>>>>>>><<<<<<<<<<>>>>>>><',
      );

      //alert(JSON.stringify(internetConnection));
      dispatch(DataAction.InternetConnectionAction(state.isConnected));
    });

    //return unsubscribe;
  }, []);
  useEffect(() => {
    listeners();
  }, []);
  // useEffect(() => {
  //   notificationHandle();
  //   setTimeout(() => props.navigation.replace('MiddleWareScreen'), 3400);
  // }, []);

  const notificationHandle = () => {
    listeners();
  };
  async function navigatetogettingstarted() {
    props.navigation.replace('MiddleWareScreen');
  }
  // Red strip behind the nav bar so the splash stays full-bleed.
  useEffect(() => {
    setNavBarTone(C.accent);
    if (Platform.OS === 'android') {
      changeNavigationBarColor(Color.btnBgColor, false);
    }
  }, []);
  // Static splash (video removed): navigate after 2500 ms, cleared on unmount.
  useEffect(() => {
    const timer = setTimeout(() => {
      navigatetogettingstarted();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const layout = useLayout();
  const phone = layout === 'phone';
  const landscape = layout === 'tabletLandscape';
  const headSize = landscape ? 96 : phone ? 52 : 84;
  // iOS: keep logo clear of the clock/battery (Android pads via FocusAwareStatusBar).
  const insets = useSafeAreaInsets();
  const iosTop = Platform.OS === 'ios' ? insets.top : 0;

  return (
    //     <View
    //       style={{
    //         flex: 1,
    //         backgroundColor: Color.white,
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //       }}>
    //       <FocusAwareStatusBar
    //         barStyle={'dark-content'}
    //         backgroundColor="transparent"
    //       />
    //       {/* <StatusBar
    //       translucent
    //       barStyle="dark-content"
    //       backgroundColor={'transparent'}
    //     /> */}

    //       <View
    //         style={{
    //           height: height(45),
    //           width: height(45),

    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}>
    //         {/* <LottieView
    // source={require('../assets/Images/lootie2.json')}
    // autoPlay
    // loop={false}
    // /> */}
    //         <Image
    //           style={styles.logoimg}
    //           source={require('../assets/Images/logo.png')}
    //         />
    //       </View>
    //     </View>
    <BrandField tile={phone ? 240 : 360} style={{ flex: 1 }}>
      <FocusAwareStatusBar
        barStyle={'light-content'}
        backgroundColor="transparent"
      />
      <View
        style={[
          styles.content,
          landscape
            ? { paddingTop: 56 + iosTop, paddingBottom: 96, paddingHorizontal: 64 }
            : phone
              ? { paddingTop: 28 + iosTop, paddingBottom: 72, paddingHorizontal: 24 }
              : { paddingTop: 64 + iosTop, paddingBottom: 112, paddingHorizontal: 56 },
        ]}>
        <View style={styles.topRow}>
          <WhiteLogo height={phone ? 32 : 40} />
          <Text style={styles.caps}>{HardCode.Deliver}</Text>
        </View>
        <Text
          style={[
            styles.headline,
            {
              fontSize: headSize,
              lineHeight: Math.round(headSize * 0.96),
              letterSpacing: -0.04 * headSize,
              maxWidth: landscape ? 820 : phone ? 320 : 680,
            },
          ]}>
          {HardCode.PickedUpHotDroppedOffOnTime}
        </Text>
      </View>
    </BrandField>
  );
};
const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  caps: {
    fontFamily: F.bold,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.surface,
  },
  headline: {
    fontFamily: F.black,
    color: C.surface,
    includeFontPadding: false,
  },
});

export default SplashScreen;
