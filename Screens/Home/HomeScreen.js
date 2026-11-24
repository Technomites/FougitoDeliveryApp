import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,

  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  PermissionsAndroid,
  Dimensions,
  Platform,
  ActivityIndicator,
  BackHandler,
  RefreshControl,
} from 'react-native';
import Color from '../../Constants/Color';
import Geolocation from '@react-native-community/geolocation';
import MainHeader from '../../Components/UI-Support/MainHeader';
import SubHeading from '../../Components/UI-Support/SubHeading';
import ActiveRequestTile from '../../Components/UI-Support/ActiveRequestTile';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
// import { BaseUrl } from '../../Components/BaseUrl';
import * as ProfileAction from '../../Store/Auth/AuthAction';
import * as DataAction from '../../Store/Data/DataAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import NotificationAlert from '../../Components/UI-Support/NotificationAlert';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import listeners from '../../Constants/listeners';
import DeviceInfo from 'react-native-device-info';
import Pickpop from '../../Components/UI-Support/Pickpop';
import Reasonpopup from '../../Components/UI-Support/Reasonpopup';
import Qrpopup from '../../Components/UI-Support/Qrpopup';
import SelfAssignpopup from '../../Components/UI-Support/SelfAssignpopup';

import Sound from 'react-native-sound';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import {
  createDrawerNavigator,
  DrawerItemList,
  useDrawerProgress,
  useDrawerStatus,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { commonStylying } from '../../Constants/AddWrapper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { FontFamily } from '../../Constants/fonts';
import { HardCode } from '../../Constants/texting';
import { Safeareacontext } from '../../Components/SafeAreaContext';
import { AUTHTOKENSTATEDISPATH, LogoutActionConst } from '../../Store/Auth/AuthActionConst';
import * as AuthAction from '../../Store/Auth/AuthAction';
import { useWindowDimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AuthButton from '../../Components/UI-Support/AuthButton';
import BottomBar from '../../Components/UI-Support/BottomBar';
import { useDevice } from '../../Components/useLayout';
import { C, F, B, refreshControlColors } from '../../Constants/tokens';

const audio = require('../../android/app/src/main/res/raw/sound_popup.wav');
async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

const HomeScreen = props => {
  const [allorders, setallorders] = useState([]);
  const [showqr, setshowqr] = useState(false);
  const [noorderData, setnoorderData] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingLoader, setIsFetchingLoader] = useState(false);
  const isDrawerOpen = useDrawerStatus() === 'open';

  const [selectedItem, setSelectedItem] = useState();
  const [notiOrderId, setNotiOrderId] = useState();
  const [Pickedup, setPickedup] = useState(false);
  const [Reasoningpopup, setReasoningPopup] = useState(false);
  const [SelfAssignpopupRider, setSelfAssignpopupRider] = useState(false);
  const [typeState, SetTypeState] = useState('pickup');
  const [loader, setLoader] = useState(false);
  const [reason, setReason] = useState('');
  const [OrderId, setOrderId] = useState('');
  const [reasonLoader, setReasonLoader] = useState(false);
  const [Assignorderloader, setAssignorderloader] = useState(false);
  const [sound, setSound] = useState();
  const [Notifation, SetNotification] = useState();
  const dispatch = useDispatch();
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const userInfo = useSelector(state => state.auth.userInfo);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const NotificationPopUp = useSelector(state => state.data.NotificationPopUp);
  const NotificationDataObj = useSelector(
    state => state.data.notificationDataObj,
  );
  // Drawer: plain slide (drawerType='slide'); the old scale/translate animatedStyle is retired.
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );



  useEffect(() => {
    getLocation()
    const GetUserProfileInformation = () => {
      console.log(
        JSON.stringify(userSuccessData),
        'BaseUrl HOME after refresh MUBSAGJIR',
      );
      var myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        `Bearer ${userSuccessData.Result.AuthData.TokenInfo.Token}`,
      );
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${BaseUrl}Partner/DeliveryStaff/ByUser`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(
            result,
            '====================================================>>>',
          );
          if (result.Result) {
            dispatch(ProfileAction.UserInformationAction(result));
          }
        })
        .catch(error => console.log('error', error));
    };

    if (userSuccessData) {
      GetUserProfileInformation();
      FcmTokenHandler();
    }
  }, [userSuccessData]);


  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      hasAndroidPermission();
      GetNotification();

      GetAllNewOrders();
      dispatch(DataAction.InternetConnectionBackScreenAction('Drawer'));
    });

    const subscribe = props.navigation.addListener('blur', () => { });
    return unsubscribe, subscribe;
  }, []);

  useEffect(() => {
    let whoosh;

    if (NotificationPopUp) {
      whoosh = new Sound('sound_popup.wav', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }

        whoosh.setNumberOfLoops(-1);
        whoosh.play();
      });

      setSound(whoosh);
    } else {
      sound?.stop();
      sound?.release();
      setSound(null);
    }

    return () => {
      whoosh?.stop();
      whoosh?.release();
    };
  }, [NotificationPopUp]);
  useEffect(() => {
    if (userSuccessData) {
      UpdateRiderCoordinates2()

    }
  }, [userInfo]);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(remoteMessage, 'background');

      if (remoteMessage) {
        GetNotification();
        GetAllNewOrders();
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(remoteMessage, 'onNotificationOpenedApp');

      if (remoteMessage) {
        if (remoteMessage?.notification?.title == 'Session has been Expired') {
          LogoutAction();
        } else {
          dispatch(DataAction.NotificationDataAction(remoteMessage?.data));
          dispatch(DataAction.NotificationPoPUpAction(true));
        }

        // alert('Notification caused app to open from background state:');
        // GetNotification();
        // GetAllNewOrders();
      }

      //navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(remoteMessage, 'getInitialNotification');

        if (remoteMessage) {
          console.log(remoteMessage, 'REMOTE BASEEEEE=======');
        }
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        console.log(remoteMessage, 'On Screen messafe');
        if (remoteMessage?.notification?.title == 'Session has been Expired') {
          LogoutAction();
        } else {
          if (remoteMessage?.notification?.title != 'Status updated') {
            dispatch(DataAction.NotificationDataAction(remoteMessage?.data));
            dispatch(DataAction.NotificationPoPUpAction(true));
          }
          GetNotification();
          GetAllNewOrders();
        }
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      UpdateRiderCoordinates2()
    }, 30000);

    return () => clearInterval(intervalId);
  }, [userSuccessData]);

  useEffect(() => {
    GetAllNewOrders();
  }, []);

  useEffect(() => {
    if (showqr === true) {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );

      return () => {
        subscription.remove();
      };
    }
  }, [showqr]);


  function handleBackButtonClick() {
    setshowqr(false);
    return true;
  }

  async function lougoutfunction() {

    dispatch({
      type: LogoutActionConst.LOGOUT_ACTION,
    });

    const code = JSON.parse(await AsyncStorage.getItem('CountryCodeAsync'));
    const country = JSON.parse(await AsyncStorage.getItem('CountryAsync'));
    const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    const fingerprintvalue = JSON.parse(await AsyncStorage.getItem('fingerprint'));
    await AsyncStorage.clear();
    await AsyncStorage.setItem('fingerprint', JSON.stringify(fingerprintvalue));
    await AsyncStorage.setItem('serverurl', JSON.stringify(BaseUrl));
    await AsyncStorage.setItem('CountryCodeAsync', JSON.stringify(code));
    await AsyncStorage.setItem('CountryAsync', JSON.stringify(country)); dispatch(AuthAction.resetuserurl(BaseUrl));

    props.navigation.replace('Auth', {
      screen: 'LoginScreen',
    });

  }

  const LogoutAction = async () => {
    const id = await DeviceInfo.getUniqueId();
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

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
          : console.log(response.status),
      )
      .catch(error => {
        console.log('error', error);
      });
  };

  const getLocation = async () => {
    const hasLocationPermission = await hasLocationPermissions();
    if (!hasLocationPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        const { coords } = position;


      },
      error => {
        console.log(error.message);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  };
  const hasLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      dispatch(ShowToast(HardCode.LocationPermissionDeniedByUser));
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      dispatch(ShowToast(HardCode.LocationPermissionRevokedByUser));
    }
    return false;
  };
  const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        console.log('Unable to open settings');
      });
    };
    // const status = await Geolocation.requestAuthorization('whenInUse');
    const status = await Geolocation.requestAuthorization();

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      console.log('Location permission denied');
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

  const GetAllNewOrders = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var raw = JSON.stringify({
      paging: {
        search: '',
        pageNumber: 1,
        pageSize: 100,
      },
      deliveryStaffId: userSuccessData?.Result?.RestaurantDeliveryStaff?.Id,
      // deliveryStaffId: 10019,
      requireNewOrders: true,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log(raw, 'rawrawrawrawrawraw')

    fetch(`${BaseUrl}Partner/DeliveryStaff/Order`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.Status === 'Success') {
          //alert('success');
          setIsFetching(false);
          setIsFetchingLoader(false);
          if (result?.Result.length === 0 && allorders.length === 0) {
            setnoorderData(true);
          } else {
            setnoorderData(false);
          }
          console.log(result?.Result, 'allresult');
          setallorders(result?.Result);
          console.log(allorders, 'allorders allorders HomeScreen');
        }
      })
      .catch(error => {
        setIsFetching(false);
        setIsFetchingLoader(false);
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error);
      });
  };
  const onReasonApi = () => {
    if (reason === '') {
      // toast.current.hideAll();
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.PleaseEnterAReasonFirst,
        ),
      );
    } else {
      setReasonLoader(true);
      var myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
      );

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `${BaseUrl}partner/orders/${selectedItem?.Id}/NotDelivered?Reason=${reason}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(result, 'REACON YAHHAHAHAHHAHAHAHAHHA');
          if (result.Status === 'Success') {
            setReasonLoader(false);
            setReason('');
            setReasoningPopup(false);
          }
        })
        .catch(error => {
          setReasonLoader(false);
          setReason('');
          setReasoningPopup(false);
          // toast.current.show(error);
          dispatch(DataAction.ToastMessageSenderScreenAction(error));
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          console.log('error', error);
        });
    }
  };
  const ChangeStatusAPi = () => {
    setLoader(true);

    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}partner/orders/${selectedItem?.Id}/Status/${selectedItem?.Status === 'FoodReady' ? 4 : 5
      }`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result?.Result) {
          setLoader(false);
          setPickedup(false);
          onRefresh();
        } else {
          setLoader(false);
          setPickedup(false);
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
  // After a QR self-assign from Home, find the scanned order in this rider's
  // orders and open it so Order Detail picks it up (or asks for its OTP).
  const startPickupAfterScan = (orderNo, assigned) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        paging: { search: '', pageNumber: 1, pageSize: 100 },
        deliveryStaffId: userSuccessData?.Result?.RestaurantDeliveryStaff?.Id,
        requireNewOrders: true,
      }),
      redirect: 'follow',
    };
    fetch(`${BaseUrl}Partner/DeliveryStaff/Order`, requestOptions)
      .then(response => response.json())
      .then(result => {
        const order = (result?.Result || []).find(
          o => String(o?.OrderNo).trim() === String(orderNo).trim(),
        );
        if (order) {
          props.navigation.navigate('OrderDetail', {
            orderId: order.Id,
            pastOrde: true,
            autoPickup: true,
            scannedOrderNo: orderNo,
          });
        } else if (assigned) {
          // Assigned but not in the list yet: tell the rider how to finish.
          dispatch(
            DataAction.ToastMessageSenderScreenAction(
              `${HardCode.Order} ${orderNo} ${HardCode.OpenToPickUp}`,
            ),
          );
        }
      })
      .catch(error => console.log('error', error));
  };

  const SelfassignOrder = async (id, pickupAfter) => {
    if (id === '') {
      dispatch(
        DataAction.ToastMessageSenderScreenAction(HardCode.PleaseEnterAOrderNo),
      );
    } else {
      setAssignorderloader(true);
      console.log(id + 'id');
      var myHeaders = new Headers();

      myHeaders.append(
        'Authorization',
        `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
      );

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `${BaseUrl}Partner/DeliveryStaff/Order/${id}/SelfSign`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result), 'NOTIFICATIONS');
          console.log(result);
          // alert("yes")
          if (result.Status === 'Success') {

            setAssignorderloader(false);
            setOrderId('');
            setSelfAssignpopupRider(false);
            dispatch(
              DataAction.ToastMessageSenderScreenAction(
                pickupAfter
                  ? `${HardCode.PickingUpOrder} ${id}…`
                  : `${HardCode.Order} ${id} ${HardCode.AssignedSuccessfully}`,
              ),
            );
            onRefresh();
            if (pickupAfter) {
              startPickupAfterScan(id, true);
            }
          } else if (result.Status === 'Error') {
            setAssignorderloader(false);
            setOrderId('');
            setSelfAssignpopupRider(false);
            // toast.current.show(result.Message);
            onRefresh();
            dispatch(
              DataAction.ToastMessageSenderScreenAction(result.Message),
            );
            // e.g. already assigned to this rider: still continue to pickup
            if (pickupAfter) {
              startPickupAfterScan(id, false);
            }
          }
        })
        .catch(error => {
          // alert("yes2")

          setAssignorderloader(false);
          setOrderId('');
          setSelfAssignpopupRider(false);
          dispatch(
            DataAction.ToastMessageSenderScreenAction(HardCode.SomethingWentWrong),
          );
          console.log('error', error);
          // dispatch({
          //   type: AUTHTOKENSTATEDISPATH,
          //   payload: true,
          // });
        });
    }
  };
  const FcmTokenHandler = async () => {
    const userToken = userSuccessData?.Result?.AuthData?.TokenInfo?.Token;
    // const ResId = userInfo?.Result?.RestaurantId;
    // const ResBranId = userInfo?.Result?.RestaurantBranchId;
    const fcmToken = await messaging().getToken();
    const DeviceId = await DeviceInfo.getUniqueId();
    console.log(DeviceId, 'DeviceIdDeviceIdDeviceId');

    dispatch(
      ProfileAction.SaveFCMTokenAction(
        userToken,
        fcmToken,
        DeviceId,
        // ResId,
        // ResBranId,
      ),
    );
  };
  const GetNotification = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}Notification/NewNotificationCount/ByUser?period=Today`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.Status === 'Success') {
          SetNotification(result?.Result);
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
  const onRefresh = () => {
    setIsFetching(true);
    setIsFetchingLoader(true);
    setallorders([]);
    GetAllNewOrders();
    // fetchData();
  };


  const UpdateRiderCoordinates2 = () => {

    Geolocation.getCurrentPosition(data => {
      const { latitude, longitude } = data.coords;
      const RiderId = userSuccessData?.Result?.RestaurantDeliveryStaff?.Id;
      const AccessToken = userSuccessData?.Result?.AuthData?.TokenInfo?.Token;
      const currentTime = Date.now();
      dispatch(ProfileAction.UpdateRiderCoordinatesApi(latitude,
        longitude,
        RiderId,
        AccessToken, currentTime))
    });
  };



  // const Notification = () => {
  //   //console.log(userSuccessData?.Result?.AuthData?.TokenInfo?.Token,'userSuccessData?.Result?.AuthData?.TokenInfo?.Token')
  //   var myHeaders = new Headers();
  //   myHeaders.append(
  //     'Authorization',
  //     `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
  //   );

  //   var requestOptions = {
  //     method: 'PUT',
  //     headers: myHeaders,
  //     redirect: 'follow',
  //   };

  //   //     console.log(BaseUrl,'BaseUrl')
  //   // return
  //   fetch(`${BaseUrl}Notification/MarkAllSeen/ByUser`, requestOptions)
  //     .then(response => response.json())

  //     .then(result => {
  //       if (result.Status === 'Success') {
  //         console.log(result, 'Notification api ');

  //       }
  //     })
  //     .catch(error => console.log('error', error));
  // };
  const { width: winW } = useWindowDimensions();
  const { layout, isPhone, gutter, columns } = useDevice();
  const gridGap = 12;
  const tileW = (winW - gutter * 2 - gridGap * (columns - 1)) / columns;

  return (
    <View style={style.animatedView}>
      {/* <SafeAreaView style={{height: '100%', width: '100%'}}> */}
      <FocusAwareStatusBar
        style={style.statusStrip}
        barStyle={
          isDrawerOpen || showqr ? 'light-content' : 'dark-content'
        }
        backgroundColor="transparent"
      />
      <MainHeader
        onNotification={() => {
          props.navigation.navigate('MyNotification');
        }}
        drawer
        onPress={() => {

          props.navigation.openDrawer()
        }}
        Notifation={Notifation}
      />

      <View
        style={[
          style.settleView,
          {
            paddingHorizontal: gutter,
            paddingTop: isPhone ? 20 : 28,
            gap: isPhone ? 16 : 20,
          },
        ]}>
        <View style={style.welcomeBlock}>
          <Text
            style={[
              style.welcome,
              { fontSize: isPhone ? 26 : 36, lineHeight: isPhone ? 30 : 40 },
            ]}>
            {userInfo?.Result?.FirstName && (
              <>
                <Text>{HardCode.Welcome}</Text>
                <Text style={style.welcomeName}>
                  {` ${userInfo?.Result?.FirstName
                    ? userInfo?.Result?.FirstName
                    : ''
                    } ${userInfo?.Result?.LastName
                      ? userInfo?.Result?.LastName
                      : ''
                    },`}
                </Text>
              </>
            )}
          </Text>
          <SubHeading
            style={[style.tagline, { fontSize: isPhone ? 14 : 16 }]}
            text={
              HardCode.GetThingsDoneFasterAndEasierTapOnTilesGotAWholeLotBetter
            }
          />
        </View>

        {/* {noorderData === true ? null : ( */}
        <View style={style.textMainView}>
          <Text style={style.sectionTitle}>
            {HardCode.NewOrders}
            <Text style={style.count}>{` (${allorders.length})`}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('NewOrders')}
            style={style.textTouchable}>
            <Text style={style.viewAll}>{HardCode.VIEWALL}</Text>
            <Feather name="chevron-right" size={18} color={C.ink} />
          </TouchableOpacity>
        </View>
        {/* )} */}
      </View>

      <View style={style.listArea}>
        {allorders.length === 0 ? (
          !isFetchingLoader ? (
            <TouchableOpacity style={style.noorderDataView} onPress={onRefresh}>
              <SubHeading
                style={style.emptyText}
                text={HardCode.ThereAreNoOrdersInTheList}
              />
              <FontAwesome
                name="refresh"
                size={20}
                color={C.accent}
                style={{ marginTop: 12 }}
              />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              size={'large'}
              color={Color.loaderColor}
              style={style.noorderDataView}
            />
          )
        ) : (
          <FlatList
            key={`home-grid-${columns}`}
            data={allorders}
            numColumns={columns}
            showsVerticalScrollIndicator={false}
            style={style.flatlist}
            columnWrapperStyle={columns > 1 ? { gap: gridGap } : undefined}
            ItemSeparatorComponent={() => <View style={{ height: gridGap }} />}
            contentContainerStyle={{
              paddingHorizontal: gutter,
              paddingTop: isPhone ? 16 : 20,
              paddingBottom: 24,
            }}
            renderItem={({ item, i }) => {

              return (
                <ActiveRequestTile
                  style={{ width: tileW }}
                  onPress={() =>
                    props.navigation.navigate('OrderDetail', {
                      orderId: item.Id,
                      pastOrde: true,
                      autoPickup: true,
                    })
                  }
                  Currency={userInfo?.Result?.RestaurantBranch?.Currency}
                  deatils={item}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                colors={refreshControlColors.colors}
                tintColor={refreshControlColors.tintColor}
                progressBackgroundColor={refreshControlColors.progressBackgroundColor}
                refreshing={isFetching}
                onRefresh={onRefresh}
              />
            }
            onEndReached={() => setPage(page + 1)}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      {/* </SafeAreaView> */}

      {/* The round QR FAB becomes a bottom-bar button (same setshowqr handler). */}
      <BottomBar>
        <AuthButton
          title={HardCode.ScanToPickUp}
          container={isPhone ? style.qrBtnPhone : style.qrBtnTablet}
          rightIcon={
            <FontAwesome5 name="qrcode" size={20} color={C.surface} />
          }
          onPress={() => {
            setshowqr(!showqr);
            // setSelfAssignpopupRider(true);
          }}
        />
      </BottomBar>

        <NotificationAlert
          onPress={() => {
            // SelfassignOrder(NotificationDataObj?.OrderNo);
            dispatch(DataAction.NotificationPoPUpAction(false));
          }}
          visible={NotificationPopUp}
          orderNo={NotificationDataObj?.OrderNo}
          details={NotificationDataObj}
        />

        <Pickpop
          loader={loader}
          visible={Pickedup}
          type={typeState}
          yesPress={() => {
            ChangeStatusAPi();
          }}
          onNoPress={() => {
            if (selectedItem.Status === 'OnTheWay') {
              setReasoningPopup(true);
              setPickedup(false);
            } else {
              setPickedup(false);
            }

            // setPickedup(false);
          }}
        />
        <Reasonpopup
          loader={reasonLoader}
          visible={Reasoningpopup}
          onChangeText={text => {
            setReason(text);
          }}
          onSubmit={onReasonApi}
          onNoPress={() => {
            setReasoningPopup(false);
          }}
        />
        <SelfAssignpopup
          loader={Assignorderloader}
          visible={SelfAssignpopupRider}
          value={OrderId}
          onChangeText={text => {
            setOrderId(text);
          }}
          onSubmit={() => {
            SelfassignOrder(OrderId);
          }}
          onNoPress={() => {
            setSelfAssignpopupRider(false);
          }}
        />
      <Qrpopup
        state={showqr}
        codescanned={code => {
          setshowqr(false);
          setOrderId(code);
          console.log('code' + code);
          SelfassignOrder(code, true);
        }}
        pressback={code => {
          setshowqr(false);
        }}
      />
    </View>
  );
};
export default HomeScreen;

const style = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: C.ground,
  },
  animatedView: {
    flex: 1,
    backgroundColor: C.ground,
    overflow: 'hidden',
  },
  statusStrip: { backgroundColor: C.surface },
  settleView: {},
  welcomeBlock: { gap: 6 },
  welcome: {
    fontFamily: F.black,
    letterSpacing: -0.5,
    color: C.ink,
  },
  welcomeName: { color: C.accentDeep },
  tagline: {
    fontFamily: F.medium,
    color: C.muted,
    letterSpacing: 0,
  },
  textMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: F.black,
    fontSize: 18,
    color: C.ink,
  },
  count: {
    fontFamily: F.black,
    color: C.accentDeep,
  },
  textTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAll: {
    fontFamily: F.bold,
    fontSize: 15,
    color: C.ink,
  },
  listArea: { flex: 1 },
  noorderDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 24,
  },
  emptyText: {
    fontFamily: F.medium,
    fontSize: 16,
    color: C.muted,
    letterSpacing: 0,
    textAlign: 'center',
  },
  flatlist: {
    width: '100%',
  },
  qrBtnPhone: { width: '100%' },
  qrBtnTablet: { width: 360 },
});
