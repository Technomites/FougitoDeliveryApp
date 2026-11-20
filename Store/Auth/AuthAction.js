import {
  AuthRoleActionConst,
  UserLoginActionConst,
  GetUserInformationActionConst,
  SaveLocalDataIntoReduxActionConst,
  LogoutActionConst,
  SaveServerURL,
  Loader,
  QRcode,
  AUTHTOKENSTATEDISPATH,
  SetRegion,
  LocationConnection,
} from './AuthActionConst';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
// import {BaseUrl} from '../../Components/BaseUrl';

export const AuthRoleAction = role => {
  return async dispatch => {
    dispatch({
      type: AuthRoleActionConst.AUTH_ROLE_ACTION_CONST,
      role: role,
    });
  };
};
export const SaveFCMTokenAction = (token, fbToken, dID) => {
  return async dispatch => {
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    var raw = JSON.stringify({
      firebaseToken: fbToken,
      deviceId: dID,
      // restaurantId: resId,
      // restaurantBranchId: resBranchId,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}FCM`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(
          result,
          'FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM FCM',
        );
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });
  };
};
export const UserLoginAction = (phoneNumber, password, deviceId, code) => {
  // const role = useSelector(state => state.auth.role);
  //alert('call');
  return async dispatch => {
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));

    dispatch({
      type: UserLoginActionConst.USER_LOGIN_REQ,
    });

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      //phoneNumber: '97164238497',
      phoneNumber: `${code}${phoneNumber}`,
      password: password,
      rememberMe: false,
      loginFor: 'RestaurantDeliveryStaff',
      DeviceId: deviceId
    });
    console.log(raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log('login action url' + JSON.stringify(BaseUrl));
    await fetch(`${BaseUrl}partner/Account/Login`, requestOptions)

      .then(response => response.json())
      .then(result => {
        // console.log(
        //   JSON.stringify(result?.Result?.AuthData?.TokenInfo?.Token),
        //   'rsrsrrsssssssssssssssssssssssssssssssss',
        // );
        if (result?.Status === 'Success') {
          dispatch({
            type: UserLoginActionConst.USER_LOGIN_SUCC,
            succData: result,
          });
          saveDataIntoStorage(result);
          saveUserIdIntoLocal(result?.Result?.RestaurantDeliveryStaff?.Id);
        } else {
          dispatch({
            type: UserLoginActionConst.USER_LOGIN_FAIL,
            errData: result,
          });
        }
      })
      .catch(error => {
        console.log('error', error);
        dispatch({
          type: UserLoginActionConst.USER_LOGIN_FAIL,
          errData: error,
        });
      });
  };
};
export const UserLoginActionFingerPrint = (phoneNumber, password, fingerprint, errorModal, code) => {
  return async dispatch => {
    // dispatch({
    //   type: Loader.LOADER,
    //   data: true,
    // });
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      //phoneNumber: '97164238497',
      phoneNumber: `${code}${phoneNumber}`,
      password: password,
      rememberMe: false,
      loginFor: 'RestaurantDeliveryStaff',
    });
    console.log(raw, BaseUrl);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log('login action url' + JSON.stringify(BaseUrl));
    await fetch(`${BaseUrl}partner/Account/Login`, requestOptions)

      .then(response => response.json())
      .then(result => {
        if (result?.Status === 'Success') {
          dispatch({
            type: Loader.LOADER,
            data: false,
          });
          fingerprint()
        } else {
          dispatch({
            type: Loader.LOADER,
            data: false,
          });
          errorModal()

        }
      })
      .catch(error => {
        console.log('errors', error);
        dispatch({
          type: Loader.LOADER,
          data: false,
        });
        errorModal()
      });
  };
};
export const UserInformationAction = userInfo => {
  return async dispatch => {
    dispatch({
      type: GetUserInformationActionConst.GET_USER_INFORMATION,
      userInfo: userInfo,
    });
  };
};
export const SaveUserDataIntoRedux = data => {
  return async dispatch => {
    dispatch({
      type: UserLoginActionConst.USER_LOGIN_SUCC,
      succData: data,
    });
  };
};
export const SetRegionAction = (data) => {
  return async dispatch => {
    dispatch({
      type: SetRegion.SET_REGION,
      data: data
    });
  };
};
export const LocationConnectionAction = bol => {
  return async dispatch => {
    dispatch({
      type: LocationConnection.LOCATION_CONNECTION,
      obj: bol,
    });
  };
};
export const resetuserurl = data => {
  return async dispatch => {
    dispatch({
      type: SaveServerURL.Save_Server_URL,
      succData: data,
    });
  };
};
export const SaveLocalDataIntoRedux = data => {
  return async dispatch => {
    console.log(data, 'ACTIONn');
    dispatch({
      type: SaveLocalDataIntoReduxActionConst.LOCAL_DATA_TO_REDUX,
      data: data,
    });
  };
};
const saveDataIntoStorage = async AuthData => {
  await AsyncStorage.setItem('AuthData', JSON.stringify(AuthData));
};
const saveUserIdIntoLocal = async userId => {
  await AsyncStorage.setItem('UserId', JSON.stringify(userId));
};
export const getQRcode = (orderId, token) => {
  console.log(orderId, 'order12');
  return async dispatch => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token} `);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    await fetch(
      `${BaseUrl}RestaurantOrder/${orderId}/Payment/QR`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        let data = JSON.parse(result);
        console.log(data, 'QRQRQRRQRQ')
        dispatch({
          type: QRcode.QRCODE,
          qrcode: data.Result.QR,
        });
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });
  };
};
export const shortPulling = (orderId, token, checkset) => {
  return async dispatch => {
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token} `);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}RestaurantOrder/${orderId}/PaymentStatus/ShortPool`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        // after work done by sameed open the below commit with set the condition for paid payment status and then call this function
        const json = JSON.parse(result);
        console.log(json?.Result, '========<>=========');
        if (json?.Result == 'Succss') {
          checkset();
        }
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });
  };
};
export const UpdateRiderCoordinatesApi = (lat, long, id, token, currentTime) => {
  return async dispatch => {
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token} `);
    const raw = JSON.stringify({

      lat: lat,
      lng: long,
      TimeStamp: currentTime

    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}DeliveryStaff/Rider/${id}/Coordinates`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result, 'NEW APIISISISIIS');
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.error(error)
      });
  };
};
export const GetRefreshToken = async (tokenObj, props, func, func2) => {

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Accept', 'text/plain');
  const BaseUrll = JSON.parse(await AsyncStorage.getItem('serverurl'));
  var raw = JSON.stringify({
    Token: tokenObj?.Token,
    RefreshToken: tokenObj?.RefreshToken,
    ExpiryDate: tokenObj?.ExpiryDate,
    Issuer: tokenObj?.Issuer,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  console.log(BaseUrll, 'BaseUrl ASYCNX');
  fetch(`${BaseUrll}partner/Account/RefreshToken`, requestOptions)
    .then(response => response.json())
    .then(async result => {

      console.log(result.Status, 'REFRESH TOKEN', result.Status === 'Success');
      func(result)
    })
    .catch(async error => {
      const code = JSON.parse(await AsyncStorage.getItem('CountryCodeAsync'));
      const country = JSON.parse(await AsyncStorage.getItem('CountryAsync'));
      const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
      const fingerprintvalue = JSON.parse(await AsyncStorage.getItem('fingerprint'));
      await AsyncStorage.clear();
      await AsyncStorage.setItem('fingerprint', JSON.stringify(fingerprintvalue));
      await AsyncStorage.setItem('serverurl', JSON.stringify(BaseUrl));
      await AsyncStorage.setItem('CountryCodeAsync', JSON.stringify(code));
      await AsyncStorage.setItem('CountryAsync', JSON.stringify(country));
      func2()
      props?.navigation?.replace('Auth', {
        screen: 'LoginScreen',
      });
      if (error instanceof Error) {
        //alert('usoama error');
      } else {
      }
    });
};
