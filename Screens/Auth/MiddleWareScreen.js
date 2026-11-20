import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Button, StyleSheet, Platform, PermissionsAndroid, Alert } from 'react-native';
import Color from '../../Constants/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
// import {BaseUrl} from '../../Components/BaseUrl';
import * as AuthAction from '../../Store/Auth/AuthAction';
import { checkInternetConnection } from '../../Components/checkInternetConnection';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import { _setBaseUrlToggle, SetUrlConst, SetUrlConstuk } from '../../Components/BaseUrl';
import GetLocation from 'react-native-get-location';

const MiddleWareScreen = props => {
  //alert(internetConnectionStatus);
  const [refData, setRefData] = useState();
  const [localData, setLocalData] = useState();
  const [checkinterent, setcheckinterent] = useState(false);

  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const token = useSelector(state => state.auth.userSuccessData);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const region = useSelector(state => state.auth.region);

  const internetConnectionStatus = useSelector(
    state => state.data.internetConnectionStatus,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    refreshing()
  }, [])
  const refreshing = async () => {
    try {
      const BaseUrlserver = JSON.parse(await AsyncStorage.getItem('serverurl'));
      const code = JSON.parse(await AsyncStorage.getItem('CountryCodeAsync'));
      const country = JSON.parse(await AsyncStorage.getItem('CountryAsync'));
      const localData = await AsyncStorage.getItem('AuthData');
      const userdata = await JSON.parse(localData);
      if (userdata !== null) {
        _setBaseUrlToggle(BaseUrlserver);
        dispatch(AuthAction.resetuserurl(BaseUrlserver));
        dispatch(AuthAction.SetRegionAction({ country: country, countryCode: code }));
        GetRefreshTokenhit(userdata?.Result?.AuthData?.TokenInfo);
        setLocalData(userdata);
      } else {
        if (!BaseUrlserver) {
          _setBaseUrlToggle('https://api.fougito.com/api/');
          await AsyncStorage.setItem('serverurl', JSON.stringify('https://api.fougito.com/api/'));
          await AsyncStorage.setItem('CountryCodeAsync', JSON.stringify('971'));
          await AsyncStorage.setItem('CountryAsync', JSON.stringify('AE'));
          dispatch(AuthAction.SetRegionAction({ country: 'AE', countryCode: '971' }));
          dispatch(AuthAction.resetuserurl('https://api.fougito.com/api/'));
        } else if (BaseUrlserver === 'https://api.fougitodemo.com/api/') {
          if (code == '44') {
            _setBaseUrlToggle('https://api.fougito.uk/api/');
            await AsyncStorage.setItem('serverurl', JSON.stringify('https://api.fougito.uk/api/'));
            dispatch(AuthAction.resetuserurl('https://api.fougito.uk/api/'));


          }
          else {
            _setBaseUrlToggle('https://api.fougito.com/api/');
            await AsyncStorage.setItem('serverurl', JSON.stringify('https://api.fougito.com/api/'));
            dispatch(AuthAction.resetuserurl('https://api.fougito.com/api/'));


          }
          dispatch(AuthAction.SetRegionAction({ country: country, countryCode: code }));
        }
        else {
          // alert(code)
          _setBaseUrlToggle(BaseUrlserver);
          dispatch(AuthAction.resetuserurl(BaseUrlserver));
          dispatch(AuthAction.SetRegionAction({ country: country, countryCode: code }));

        }
        if (internetConnectionStatus === true) {

          props.navigation.replace('Auth');
        }
      }
    } catch (error) {
      props.navigation.replace('Auth');
    }
  }
  // useEffect(() => {

  //   const requestLocationPermission = async () => {
  //     try {
  //       if (Platform.OS === 'android') {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //         );
  //         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //           console.warn('Location permission denied');
  //           await handleRegionFallback('AE');
  //           return;
  //         }
  //       }
  //       fetchUserLocation();
  //     } catch (err) {
  //       console.log('Permission error', err);
  //       await handleRegionFallback('AE');
  //     }
  //   };

  //   const fetchUserLocation = () => {
  //     GetLocation.getCurrentPosition({
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //     })
  //       .then(async location => {
  //         const { latitude, longitude } = location;
  //         console.log('User Location:', latitude, longitude);



  //         console.log('Fetching region via coordinates...');
  //         // await fetchRegionData(51.515617, -0.141150); // Pakistan lat long for testing

  //          await fetchRegionData(latitude, longitude);
  //       })
  //       .catch(async error => {
  //         console.error('Error fetching location:', error);

  //         if (error.code === 'UNAVAILABLE') {
  //           Alert.alert(
  //             'Location Services Disabled',
  //             'To continue, enable location services in settings.',
  //             [
  //               { text: 'Cancel', style: 'cancel', onPress: () => handleRegionFallback('AE') },
  //               { text: 'Open Settings', onPress: () => openLocationSettings() },
  //             ]
  //           );
  //         } else if (error.code === 'TIMEOUT') {
  //           Alert.alert(
  //             'Location Timeout',
  //             'Unable to fetch location, please try again.',
  //             [{ text: 'OK', onPress: () => handleRegionFallback('AE') }]
  //           );
  //         } else {
  //           await handleRegionFallback('AE');
  //         }
  //       });
  //   };



  //   const fetchRegionData = async (latitude, longitude) => {
  //     try {
  //       const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  //       // const fetchOptions = Platform.OS === 'android' ? {
  //       //   headers: {
  //       //     'User-Agent': 'FougitoPartnerApp/1.0 (contact@fougito.com)',
  //       //     'Accept': 'application/json'
  //       //   }
  //       // } : {};
  //       // const response = await fetch(url, fetchOptions);
  //       const response = await fetch(url, { headers: { 'User-Agent': 'FougitoPartnerApp/1.0 (contact@fougito.com)', 'Accept': 'application/json' } });
  //       const data = await response.json();


  //       const countryCodeRaw = data.address?.country_code?.toUpperCase() || 'AE';
  //       // console.log(countryCodeRaw, 'vvvv');
  //       const country = countryCodeRaw === 'GB' ? 'GB' : 'AE';
  //       const countryCode = country === 'GB' ? '44' : '971';

  //       console.log('Detected Region:', country, countryCode);

  //       dispatch(AuthAction.SetRegionAction({ country: country, countryCode: countryCode }));

  //       let baseUrl = country === 'GB' ? SetUrlConstuk : SetUrlConst;
  //       _setBaseUrlToggle(baseUrl);
  //       await AsyncStorage.setItem('liveurl', JSON.stringify(baseUrl));
  //       const baseUrlStr = await AsyncStorage.getItem('serverurl');
  //       const BaseUrlserver = baseUrlStr ? JSON.parse(baseUrlStr) : null;
  //       const localData = await AsyncStorage.getItem('AuthData');
  //       const userdata = await JSON.parse(localData);
  //       if (BaseUrlserver == 'https://api.fougitodemo.com/api/' && userdata !== null) {
  //         dispatch(
  //           AuthAction.resetuserurl(
  //             'https://api.fougitodemo.com/api/',
  //           ),
  //         );
  //         dispatch(AuthAction.SetRegionAction({ country: 'AE', countryCode: '971' }));
  //         _setBaseUrlToggle('https://api.fougitodemo.com/api/');
  //       } else {
  //         await AsyncStorage.setItem('serverurl', JSON.stringify(baseUrl));
  //         dispatch(
  //           AuthAction.resetuserurl(
  //             baseUrl,
  //           ),
  //         );
  //       }





  //       if (userdata !== null) {
  //         GetRefreshTokenhit(userdata?.Result?.AuthData?.TokenInfo);
  //         setLocalData(userdata);
  //       } else {
  //         if (internetConnectionStatus === true) {

  //           props.navigation.replace('Auth');
  //         }
  //       }

  //       // const localDataStr = await AsyncStorage.getItem('AuthData');
  //       // const localData = localDataStr ? JSON.parse(localDataStr) : null;

  //       // const baseUrlStr = await AsyncStorage.getItem('serverurl');
  //       // const BaseUrlserver = baseUrlStr ? JSON.parse(baseUrlStr) : null;

  //       // const token = localData?.Result?.AuthData?.TokenInfo?.Token;
  //       // const countryasync = await AsyncStorage.getItem('country');
  //       // const countryasync1 = countryasync ? JSON.parse(countryasync) : null;



  //       // if (token && countryasync1 == country) {
  //       //   const code = country === 'GB' ? '44' : '971';
  //       //   dispatch(AuthAction.SetRegionAction({ country: country, countryCode: code }));
  //       //   console.log('Set Region from stored country:', country);
  //       //   return;
  //       // }
  //       // dispatch(AuthAction.SetRegionAction({ country: country, countryCode: countryCode }));

  //       // const baseUrl = country === 'GB' ? SetUrlConstuk : SetUrlConst;
  //       // _setBaseUrlToggle(baseUrl);

  //       // await AsyncStorage.multiSet([
  //       //   ['serverurl', JSON.stringify(baseUrl)],
  //       //   ['country', JSON.stringify(country)],
  //       //   ['countryCode', JSON.stringify(countryCode)],
  //       // ]);
  //     } catch (error) {
  //       console.error('Error fetching region:', error);
  //       await handleRegionFallback('AE');
  //     }
  //   };

  //   const handleRegionFallback = async (country) => {

  //     const countryCode = country === 'GB' ? '44' : '971';
  //     console.log('Fallback Region:', country);

  //     dispatch(AuthAction.SetRegionAction({ country: country, countryCode: countryCode }));

  //     const baseUrl = country === 'GB' ? SetUrlConstuk : SetUrlConst;
  //     await AsyncStorage.setItem('liveurl', JSON.stringify(baseUrl));
  //     _setBaseUrlToggle(baseUrl);
  //     await AsyncStorage.setItem('serverurl', JSON.stringify(baseUrl));
  //     dispatch(
  //       AuthAction.resetuserurl(
  //         baseUrl,
  //       ),
  //     );

  //   };

  //   const openLocationSettings = () => {
  //     if (Platform.OS === 'android') {
  //       Linking.openSettings();
  //     } else {
  //       Linking.openURL('App-Prefs:root=LOCATION_SERVICES');
  //     }
  //   };

  //   requestLocationPermission();
  // }, []);




  useEffect(() => {
    // saveserver();
    if (refData) {
      //alert('call');
      ValidationFunction();
    }
  }, [refData]);

  const GetRefreshTokenhit = async tokenObj => {
    AuthAction.GetRefreshToken(tokenObj, props, async (result) => {
      if (result.Status === 'Success') {

        setRefData(result.Result);
        console.log(result.Result, 'abab');
      }

    },()=>{})


    // console.log(tokenObj?.Token, '====================================');

    // // return
    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');
    // myHeaders.append('Accept', 'text/plain');
    // // myHeaders.append('Authorization', `Bearer ${tokenObj?.Token}`);

    // var raw = JSON.stringify(tokenObj);
    // // var raw = {
    // //   tokenObj
    // // };

    // console.log(raw, 'user data>>>>>>><<<<<<<');
    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow',
    // };

    // fetch(`${BaseUrl}partner/Account/RefreshToken`, requestOptions)
    //   .then(response => response.json())
    //   .then(async result => {
    //     console.log(result);
    //     if (result.Status === 'Success') {
    //       setRefData(result.Result);
    //     } else {
    //        dispatch(AuthAction.LogoutAction());
    //      // LogoutAction();
    //       await AsyncStorage.clear();
    //       dispatch(AuthAction.resetuserurl('https://api.fougito.com/api/'));
    //       await AsyncStorage.setItem(
    //         'serverurl',
    //         JSON.stringify('https://api.fougito.com/api/'),
    //       );
    //       props.navigation.replace('Auth', {
    //         screen: 'LoginScreen',
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     if (error instanceof Error) {
    //       //alert('usoama error');
    //     } else {
    //     }
    //   });
  };

  const LogoutAction = async Token => {
    const id = await DeviceInfo.getUniqueId();

    console.log(id, 'deviceid');

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${Token}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    await fetch(
      `${BaseUrl}partner/Account/Logout?DeviceId=${id}`,
      requestOptions,
    )
      .then(response =>
        response.status == 200
          ? lougoutfunction()
          : console.log('hahahhah' + response.status),
      )
      .catch(error => console.log('error', error));
  };

  async function lougoutfunction() {
    console.log('start');
         const code = JSON.parse(await AsyncStorage.getItem('CountryCodeAsync'));
      const country = JSON.parse(await AsyncStorage.getItem('CountryAsync'));
      const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
      const fingerprintvalue = JSON.parse(await AsyncStorage.getItem('fingerprint'));
      await AsyncStorage.clear();
      await AsyncStorage.setItem('fingerprint', JSON.stringify(fingerprintvalue));
      await AsyncStorage.setItem('serverurl', JSON.stringify(BaseUrl));
      await AsyncStorage.setItem('CountryCodeAsync', JSON.stringify(code));
      await AsyncStorage.setItem('CountryAsync', JSON.stringify(country));
    props.navigation.replace('Auth', {
      screen: 'LoginScreen',
    });
    // };
  }

  const saveserver = async () => {
    const BaseUrlserver = JSON.parse(await AsyncStorage.getItem('serverurl'));
    console.log(BaseUrlserver, 'BaseUrlserverBaseUrlserver Sameed');
    // alert(BaseUrlserver)

    if (BaseUrlserver == 'https://api.fougitodemo.com/api/') {
      dispatch(AuthAction.resetuserurl('https://api.fougitodemo.com/api/'));
      AsyncStorage.setItem(
        'serverurl',
        JSON.stringify('https://api.fougitodemo.com/api/'),
      );
    }
    else {
      const baseUrl = region.country === 'GB' ? SetUrlConstuk : SetUrlConst;

      dispatch(AuthAction.resetuserurl(baseUrl));
      AsyncStorage.setItem(
        'serverurl',
        JSON.stringify(baseUrl),
      );
    }
    //  else {
    //   dispatch(AuthAction.resetuserurl('https://api.fougitodemo.com/api/'));

    //   AsyncStorage.setItem(
    //     'serverurl',
    //     JSON.stringify('https://api.fougitodemo.com/api/'),
    //   );
    // }
  };

  const saveDataIntoStorage = async AuthData => {
    await AsyncStorage.setItem('AuthData', JSON.stringify(AuthData));
  };

  const saveUserIdIntoLocal = async userId => {
    await AsyncStorage.setItem('UserId', JSON.stringify(userId));
  };

  const ValidationFunction = async () => {
    let isToUpdate = localData;

    isToUpdate.Result.AuthData.TokenInfo = refData;

    dispatch(AuthAction.SaveUserDataIntoRedux(isToUpdate));

    setLocalData(isToUpdate);
    saveDataIntoStorage(isToUpdate);
    saveUserIdIntoLocal(isToUpdate?.Result?.RestaurantServiceStaff?.Id);
    // alert(isToUpdate?.Result?.RestaurantServiceStaff?.Id)
    props.navigation.replace('Drawer');
  };

  useEffect(() => {
    setNavBarTone(C.accent);
    if (Platform.OS === 'android') {
      changeNavigationBarColor(Color.btnBgColor, false);
    }
  }, []);

  return (
    <BrandField style={styles.main}>
      <FocusAwareStatusBar
        barStyle={'light-content'}
        backgroundColor="transparent"
      />
      <ActivityIndicator size={'large'} color={C.surface} />
    </BrandField>
  );
};

import { BrandField } from '../../Components/UI-Support/AuthBrandPane';
import { C } from '../../Constants/tokens';
import { setNavBarTone } from '../../Components/NavBarFrame';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
export default MiddleWareScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
