import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  FlatList,
  ActivityIndicator,
  Text,
  Platform,
  BackHandler,
  Alert,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  Keyboard,
} from 'react-native';
import BackHeader from '../../Components/UI-Support/BackHeader';
import SubHeading from '../../Components/UI-Support/SubHeading';
import Color from '../../Constants/Color';
import AuthButton from '../../Components/UI-Support/AuthButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Heading from '../../Components/UI-Support/Heading';
import RadioButtonRN from 'radio-buttons-react-native';
// import { BaseUrl } from '../../Components/BaseUrl';
import { useSelector, useDispatch } from 'react-redux';
import OrderDeatilTile from '../../Components/UI-Support/OrderDeatilTile';
import Pickpop from '../../Components/UI-Support/Pickpop';
import Reasonpopup from '../../Components/UI-Support/Reasonpopup';
import IoIcon from '../../Components/Icon/IoIcon';
import MaIcons from '../../Components/Icon/MaIcon';
import Icon from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Paragraph from '../../Components/UI-Support/Paragraph';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import * as DataAction from '../../Store/Data/DataAction';
import { commonStylying } from '../../Constants/AddWrapper';
import { FontFamily } from '../../Constants/fonts';
import { HardCode } from '../../Constants/texting';
import { Safeareacontext } from '../../Components/SafeAreaContext';
import { width } from 'react-native-dimension';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import Qrpopup from '../../Components/UI-Support/Qrpopup';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { showLocation } from 'react-native-map-link';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import BottomBar from '../../Components/UI-Support/BottomBar';
import DeliveredSuccess from '../../Components/UI-Support/DeliveredSuccess';
import { IconTile, dialogStyles, useDialogMetrics } from '../../Components/UI-Support/Dialog';
import { useDevice, useBottomInset } from '../../Components/useLayout';
import { useRootInsets } from '../../Components/NavBarFrame';
import { C, F, B } from '../../Constants/tokens';

let RiderID = 0;
const data = [
  { label: HardCode.Confirmed },
  { label: HardCode.Pending },
  { label: HardCode.Ready },
];

export default function OrderDetail(props) {
  const pastOrde = props?.route?.params?.pastOrde;
  // Set by the Home / New Orders tiles: start pickup (QR or OTP) right away.
  const autoPickup = props?.route?.params?.autoPickup;
  const autoPickupDone = useRef(false);
  // Set by Home's Scan QR Code: the order's QR was already scanned there.
  const scannedOrderNo = props?.route?.params?.scannedOrderNo;
  const orderId = props?.route?.params?.orderId
    ? props?.route?.params?.orderId
    : NotificationDataObj?.OrderId;

  const [Pickedup, setPickedup] = useState(false);
  const [deatilsresult, setdeatilsresult] = useState(null);
  const [orderdeatils, setorderdeatils] = useState([]);
  const [resdeatils, setresdeatils] = useState([]);
  const [visible, setVisible] = useState(false);
  const [ShowMore, setShowMore] = useState(false);
  const [orderMenudeatils, setorderMenudeatils] = useState(null);
  const [orderMenudeatilsOptions, setorderMenudeatilsOptions] = useState([]);
  const [deliveryRidersData, setdeliveryRidersData] = useState([]);
  const [selectedRidersDetails, setselectedRidersDetails] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderStatusInHold, setOrderStatusInHold] = useState('');
  const [orderDetailMdoalVisible, setOrderDetailMdoalVisible] = useState(false);
  const [infoMdoalVisible, setInfoMdoalVisible] = useState(false);
  const [statusMdoalVisible, setStatusMdoalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [typeState, SetTypeState] = useState('pickup');
  const [loader, setLoader] = useState(false);
  const [MdoalVisible, setMdoalVisible] = useState(false);
  const [
    setelctedOrderDetailsOptionValues,
    setSetelctedOrderDetailsOptionValues,
  ] = useState(0);
  const [reason, setReason] = useState('');
  const [reasonLoader, setReasonLoader] = useState(false);
  const [Reasoningpopup, setReasoningPopup] = useState(false);
  const [assignDeliveryMdoalVisible, setAssignDeliveryMdoalVisible] =
    useState(false);
  const [deliveryMan, setDeliveryMan] = useState('');
  const [riderinfoMdoalVisible, setriderInfoMdoalVisible] = useState(false);
  const [itemQuamtity, setItemQuantity] = useState(0);
  const [selectItemOption, setSelectItemOption] = useState();
  const [Latitude, SetLatitude] = useState();
  const [Longitude, SetLongitude] = useState();
  const [latitudenew, setLatitudenew] = useState(0);
  const [longitudenew, setLongitudenew] = useState(0);
  const [loadin, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [customerNote, setCustomerNote] = useState();
  const [showqr, setshowqr] = useState(false);
  const [OrderId, setOrderId] = useState('');
  const [OTP, setOTP] = useState('');
  const [OTPmodal, setOTPmodal] = useState(0);
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const userInfo = useSelector(state => state.auth.userInfo);
  const restaurantLat = Number(deatilsresult?.RestaurantBranch?.Latitude);
  const restaurantLng = Number(deatilsresult?.RestaurantBranch?.Longitude);

  const customerLat = Number(deatilsresult?.Latitude);
  const customerLng = Number(deatilsresult?.Longitude);
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );
  const NotificationDataObj = useSelector(
    state => state.data.notificationDataObj,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    OrderDeatils();

    // getAllRiiders();
  }, [orderId]);
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
  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

  const OrderDeatils = async () => {
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      // body: raw,
      redirect: 'follow',
    };
    // alert(orderId)
    fetch(
      `${BaseUrl}partner/orders/${pastOrde == false ? NotificationDataObj?.OrderId : orderId
      }`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(
          result,
          'result?.OrderDetailsresult?.OrderDetails Mubashir1',
        );

        setdeatilsresult(result);
        setorderdeatils(result?.OrderDetails);
        setOrderStatus(result?.Status);
        SetLatitude(result?.Latitude);
        SetLongitude(result?.Longitude);
        setLoader(false);
        setresdeatils(result?.RestaurantBranch)
        // if (result.Status === 'Success') {
        //   //alert('success');
        //   console.log(result?.Result);
        //   if (result.Result.length === 0 && allorders.length === 0) {
        //     // alert('length is 1');
        //     setnoorderData(true);
        //   }
        //   setallorders(result?.Result);
        // }
        // console.log(result, 'totdaytotdaytotdaytotdaytotdaytotdaytotday');
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });
  };

  const ChangeStatusAPi = () => {
    setLoader(true);
    // Status 4 (picked up) is sent for these statuses; used for the confirmation message.
    const pickingUp =
      orderStatus === 'Pending' || orderStatus === 'Confirmed' || orderStatus === 'Preparing' || orderStatus === 'FoodReady';
    // Opened by Home's "Scan & pick up": the order was just assigned as well.
    const fromHomeScan =
      !!scannedOrderNo && String(scannedOrderNo).trim() == String(deatilsresult?.OrderNo).trim();

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
      `${BaseUrl}partner/orders/${orderId}/Status/${orderStatus === 'Pending' || orderStatus === 'Confirmed' || orderStatus === 'Preparing' || orderStatus === 'FoodReady' ? 4 : 5
      }`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result), 'change status 222222222');

        if (result?.Result) {
          setLoader(false);
          setPickedup(false);
          setMdoalVisible(false);

          if (result?.Result?.Status === 'Delivered') {
            setVisible(true);
          }
          if (pickingUp) {
            dispatch(
              DataAction.ToastMessageSenderScreenAction(
                `${HardCode.Order} ${deatilsresult?.OrderNo || ''} ${fromHomeScan ? HardCode.AssignedAndPickedUp : HardCode.OrderPickedUp}`,
              ),
            );
          }
          OrderDeatils();
          // onRefresh();
        } else {
          setLoader(false);
          setPickedup(false);
          setMdoalVisible(false);
          if (pickingUp) {
            dispatch(
              DataAction.ToastMessageSenderScreenAction(
                result?.Message || HardCode.PickupFailed,
              ),
            );
          }
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

  const onReasonApi = () => {
    if (reason === '') {
      // toast.current.hideAll();
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.PleaseEnterAReasonFirst,
        ),
      );

      // toast.current.show('Please enter a reason first');
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
        `${BaseUrl}partner/orders/${orderId}/NotDelivered?Reason=${reason}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          // console.log(result, 'REACON YAHHAHAHAHHAHAHAHAHHA');
          if (result.Status === 'Success') {
            setReasonLoader(false);
            setReason('');
            setReasoningPopup(false);
            props.navigation.goBack();
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

  const changestatus = () => {
    if (orderStatus === 'FoodReady') {
      SetTypeState('Picked up');
      setSelectedItem(orderStatus);
      setPickedup(true);
    } else {
      SetTypeState('delivered');
      setSelectedItem(orderStatus);
      setPickedup(true);
      // props.navigation.goBack();
    }
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData();
  };

  // const Markasdeliver = () => {
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

  //   fetch(
  //     `https://api.fougitodemo.com/api/partner/orders/${orderdeatils?.Id}/Status/5`,
  //     requestOptions,
  //   )
  //     .then(response => response.json())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('error', error));
  // };
  const getLocation = async () => {
    const hasLocationPermission = await hasLocationPermissions();
    if (!hasLocationPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        const { coords } = position;

        setLatitudenew(coords.latitude);
        setLongitudenew(coords.longitude);
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

    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {

    }
    return false;
  };
  const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        console.log('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

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

  // ---- Fougito layout (visual only; handlers and conditions unchanged) ----
  const { layout, isPhone, gutter } = useDevice();
  const landscape = layout === 'tabletLandscape';
  const tabletPortrait = layout === 'tabletPortrait';
  const dialog = useDialogMetrics(landscape ? 760 : 600);
  const otpDialog = useDialogMetrics();
  const bottomInset = useBottomInset();
  const rootInsets = useRootInsets();
  const modalPad = {
    paddingBottom: rootInsets.bottom,
    paddingLeft: rootInsets.left,
    paddingRight: rootInsets.right,
  };

  const isMine = deatilsresult?.DeliveryStaffId == userInfo?.Result?.Id;
  const statusColor =
    orderStatus === 'Pending' || orderStatus === 'Preparing' || orderStatus === 'Confirmed'
      ? C.amberDeep
      : orderStatus === 'FoodReady' || orderStatus === 'Delivered'
        ? C.green
        : C.accentDeep;
  const statusText =
    orderStatus === 'Pending' || orderStatus === 'Preparing' || orderStatus === 'Confirmed' ?
      HardCode.OrderIsPreparing :
      orderStatus === 'FoodReady'
        ? HardCode.ReadyForPickup
        : orderStatus == 'OnTheWay'
          ? HardCode.PickedUp
          : orderStatus === 'NotDelivered'
            ? HardCode.Canceled
            : orderStatus;

  // Which action buttons render (same conditions as the button block below).
  const actionsAllowed =
    loader == false && deatilsresult?.DeliveryStaffId == userInfo?.Result?.Id &&
    !(orderStatus === 'NotDelivered' || orderStatus === 'Canceled') &&
    orderStatus != 'Delivered';
  const showMarkDelivered =
    orderStatus !== 'FoodReady' && deatilsresult?.IsPaid === true && orderStatus !== 'Confirmed';
  const showPickupReceive =
    orderStatus === 'Pending' || orderStatus === 'Preparing' || orderStatus === 'Confirmed' || orderStatus === 'FoodReady' || orderStatus === 'OnTheWay';
  const hasActions =
    actionsAllowed && (showMarkDelivered || showPickupReceive || orderStatus === 'OnTheWay');

  const openItem = (itemData, priceValue) => {
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
      `${BaseUrl}partner/orders/Details/${itemData?.Id}/Options`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.Status === 'Success') {
          setSelectItemOption(result?.Result);
        }
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });

    setItemQuantity(itemData?.Quantity);
    setorderMenudeatils(itemData?.MenuItems?.Item);
    setorderMenudeatilsOptions(
      itemData?.item?.OrderDetailOptionValues,
    );
    setOrderDetailMdoalVisible(!orderDetailMdoalVisible);
    setPrice(priceValue);
    setCustomerNote(itemData?.CustomerNote);
    setSetelctedOrderDetailsOptionValues(
      itemData.OrderDetailOptionValues,
    );
  };

  const billRow = (label, value, key) => (
    <View key={key} style={styles.billRow}>
      <SubHeading style={styles.billText} text={label} />
      <SubHeading style={[styles.billText, styles.num]} text={value} />
    </View>
  );

  const itemsBlock = (
    <>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{HardCode.Order}</Text>
        <Text style={styles.sectionMeta}>{`${orderdeatils?.length || 0} ${HardCode.Items}`}</Text>
      </View>
      <View style={styles.table}>
        {orderdeatils?.map((itemData, index) => {
          console.log(orderdeatils, 'orderdeatils');
          return index <= 2 ? (
            <OrderDeatilTile
              key={index}
              onPress={() => openItem(itemData, itemData?.TotalPrice.toFixed(2))}
              index={index}
              itemData={itemData}
              customerNote={!itemData?.CustomerNote ? false : true}
              Currency={userInfo?.Result?.RestaurantBranch?.Currency}
            />
          ) : (
            ShowMore === true && (
              <OrderDeatilTile
                key={index}
                onPress={() => openItem(itemData, itemData?.TotalPrice)}
                itemData={itemData}
                customerNote={!itemData?.CustomerNote ? false : true}
                Currency={userInfo?.Result?.RestaurantBranch?.Currency}
              />
            )
          );
        })}
        {orderdeatils.length > 3 && (
          <TouchableOpacity
            style={styles.seeMore}
            onPress={() => {
              setShowMore(!ShowMore);
            }}>
            <SubHeading
              style={styles.seeMoreText}
              text={ShowMore === true ? HardCode.SeeLess : HardCode.SeeMore}
            />
            <Feather
              name={ShowMore === true ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={C.accentDeep}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  const billBlock = deatilsresult ? (
    <View style={styles.bill}>
      {billRow(HardCode.SubTotal, `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.Amount.toFixed(2), 'sub')}
      {billRow(
        HardCode.DeliveryCharges,
        `${userInfo?.Result?.RestaurantBranch?.Currency} ` +
        deatilsresult?.DeliveryCharges.toFixed(2),
        'del',
      )}
      {billRow(
        `${HardCode.VATAmount} (${deatilsresult?.TaxPercent})%`,
        `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TaxAmount.toFixed(2),
        'vat',
      )}
      {billRow(
        `${HardCode.Discount} (${deatilsresult?.DiscountPercent})%`,
        `- ${userInfo?.Result?.RestaurantBranch?.Currency} ` +
        deatilsresult?.DiscountAmount.toFixed(2),
        'disc',
      )}
      {deatilsresult?.CouponCode &&
        billRow(
          `${HardCode.CouponDiscount}`,
          `- ${userInfo?.Result?.RestaurantBranch?.Currency} ` +
          deatilsresult?.CouponDiscount.toFixed(2),
          'coupon',
        )}
      <View style={styles.totalRow}>
        <SubHeading style={styles.totalText} text={HardCode.Total} />
        <SubHeading
          style={[styles.totalText, styles.num]}
          text={
            `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TotalAmount.toFixed(2)
          }
        />
      </View>
    </View>
  ) : null;

  const pickupBlock = (
    <>
      {deliveryMan !== '' && (
        <View style={[styles.card, styles.rowBetween]}>
          <SubHeading style={styles.infoLabel} text={HardCode.OrderStatus} />
          <SubHeading style={styles.infoValue} text={orderStatus} />
        </View>
      )}
      {orderStatus === 'OnTheWay' &&
        <View style={styles.card}>
          <View style={styles.pickupHead}>
            <IconTile name="user" size={44} iconSize={20} />
            <View style={styles.flexMin}>
              <SubHeading
                style={styles.pickupName}
                text={deatilsresult?.CustomerName}
              />
              <SubHeading
                style={styles.pickupSub}
                text={deatilsresult?.FormattedDate}
              />
            </View>
          </View>
          <View style={tabletPortrait ? styles.btnRow : styles.btnStack}>
            <TouchableOpacity
              style={[styles.outlineBtn48, tabletPortrait ? styles.flexBtn : styles.stackBtn]}
              onPress={
                () =>
                  Linking.openURL(
                    `http://www.google.com/maps/place/${Latitude},${Longitude}`,
                  )
                // props.navigation.navigate('Location', {
                //   locationlat: Latitude,
                //   locationlong: Longitude,
                // })
              }>
              <SubHeading numberOfLines={1} style={styles.outlineBtnText} text={HardCode.GetDirection} />
              <View style={styles.btnIcon}>
                <Feather name="navigation" size={18} color={C.ink} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setInfoMdoalVisible(!infoMdoalVisible)}
              style={[styles.outlineBtn48, tabletPortrait ? styles.flexBtn : styles.stackBtn]}>
              <SubHeading numberOfLines={1} style={styles.outlineBtnText} text={HardCode.ViewInfo} />
              <View style={styles.btnIcon}>
                <Feather name="info" size={18} color={C.ink} />
              </View>
            </TouchableOpacity>
            {/* WhatsApp the customer (same message as the old Customer Info tile) */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                let URL =
                  'whatsapp://send?text=' +
                  `Hi! This is about your food delivery from ${deatilsresult?.RestaurantBranch?.NameAsPerTradeLicense}. Kindly share your location so I can deliver your order.` +
                  '&phone=' +
                  deatilsresult?.CustomerContact;
                Linking.openURL(URL);
              }}
              style={[styles.outlineBtn48, tabletPortrait ? styles.flexBtn : styles.stackBtn]}>
              <SubHeading numberOfLines={1} style={styles.outlineBtnText} text={HardCode.WhatsApp} />
              <View style={styles.btnIcon}>
                <FontAwesome name="whatsapp" size={20} color={'#25D366'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>}
    </>
  );

  // Info rows (Hotel / Room / Payment Method / Payment Status / Order Status).
  // Tablet portrait shows the last three as a 3-cell strip.
  const paymentMethodValue =
    deatilsresult?.PaymentMethod === 'Pending'
      ? '-'
      : deatilsresult?.PaymentMethod;
  const paidColor = deatilsresult?.PaidStatus === 'Paid' ? C.green : C.amberDeep;
  const orderStatusTouchable = (children, style) => (
    <TouchableOpacity
      style={style}
      disabled={pastOrde}
      onPress={() => {
        if (!pastOrde) {
          setPickedup(true);
          changestatus();
        }
      }}>
      {children}
    </TouchableOpacity>
  );
  const deliveryPersonBlock = (
    <View style={[styles.infoRow, styles.infoRowTop]}>
      <View style={{ justifyContent: 'center' }}>
        <Image
          source={require('../../assets/Images/ambur-biryani.png')}
          style={styles.img}
        />
      </View>
      <View style={styles.flexMin}>
        <SubHeading style={[styles.capsLabel, { color: C.accentDeep }]} text={HardCode.DELIVERYPERSON} />
        <SubHeading
          style={styles.infoValue}
          text={
            selectedRidersDetails?.FirstName +
            selectedRidersDetails?.LastName
          }
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          setriderInfoMdoalVisible(!riderinfoMdoalVisible)
        }
        style={styles.smallOutline}>
        <SubHeading style={styles.outlineBtnText} text={HardCode.View} />
      </TouchableOpacity>
    </View>
  );

  const infoBlock = (
    <>
      {(deatilsresult?.HotelsAndMallsRoomId || deatilsresult?.HotelRoomId) ? (
        <View style={styles.infoCard}>
          {deatilsresult?.HotelsAndMallsRoomId && (
            <View style={styles.infoRow}>
              <SubHeading style={styles.infoLabel} text={HardCode.HotelName} />
              <SubHeading
                style={[styles.infoValue, { color: C.accentDeep }]}
                text={deatilsresult?.HotelsAndMalls?.NameAsPerTradeLicense}
              />
            </View>
          )}
          {(deatilsresult?.HotelRoomId || deatilsresult?.HotelsAndMallsRoomId) && (
            <View style={[styles.infoRow, !!deatilsresult?.HotelsAndMallsRoomId && styles.infoRowTop]}>
              <SubHeading style={styles.infoLabel} text={HardCode.RoomNo} />
              <SubHeading
                style={[styles.infoValue, { color: C.accentDeep }]}
                text={deatilsresult?.HotelRoomId ? deatilsresult?.HotelRoomName : deatilsresult?.HotelsAndMallsRoomName}
              />
            </View>
          )}
        </View>
      ) : null}
      {tabletPortrait ? (
        <View style={[styles.infoCard, styles.strip]}>
          <View style={styles.stripCell}>
            <SubHeading style={styles.capsLabel} text={HardCode.PaymentMethod} />
            <SubHeading style={styles.infoValue} text={paymentMethodValue} />
          </View>
          <View style={[styles.stripCell, styles.stripCellRule]}>
            <SubHeading style={styles.capsLabel} text={HardCode.PaymentStatus} />
            <SubHeading style={[styles.infoValue, { color: paidColor }]} text={deatilsresult?.PaidStatus} />
          </View>
          {deliveryMan !== '' ? (
            <View style={[styles.stripCell, styles.stripCellRule]}>{deliveryPersonBlock}</View>
          ) : (
            orderStatusTouchable(
              <>
                <SubHeading style={styles.capsLabel} text={HardCode.OrderStatus} />
                <SubHeading style={[styles.infoValue, { color: statusColor }]} text={statusText} />
              </>,
              [styles.stripCell, styles.stripCellRule],
            )
          )}
        </View>
      ) : (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <SubHeading style={styles.infoLabel} text={HardCode.PaymentMethod} />
            <SubHeading style={styles.infoValue} text={paymentMethodValue} />
          </View>
          <View style={[styles.infoRow, styles.infoRowTop]}>
            <SubHeading style={styles.infoLabel} text={HardCode.PaymentStatus} />
            <SubHeading style={[styles.infoValue, { color: paidColor }]} text={deatilsresult?.PaidStatus} />
          </View>
          {/* <View style={{flexDirection: 'row'}}> */}
          {deliveryMan !== '' ? (
            deliveryPersonBlock
          ) : (
            orderStatusTouchable(
              <View style={[styles.infoRow, styles.infoRowTop]}>
                <SubHeading style={styles.infoLabel} text={HardCode.OrderStatus} />
                <SubHeading style={[styles.infoValue, { color: statusColor }]} text={statusText} />
              </View>,
            )
          )}
        </View>
      )}
    </>
  );

  // Action buttons: same conditions as before; stacked in the landscape panel,
  // side by side in the bottom bar on portrait / phone (Cancel left, primary right).
  const actionButtons = (
    <>
      {showMarkDelivered ? (
        <AuthButton
          onPress={() => {
            changestatus();
          }}
          container={landscape || isPhone ? styles.panelBtn : styles.barBtn}
          iconName="check"
          title={HardCode.MARKASDELIVERED}
        />
      ) : (
        <>
          {(orderStatus === 'Pending' || orderStatus === 'Preparing' || orderStatus === 'Confirmed' || orderStatus === 'FoodReady' || orderStatus === 'OnTheWay') &&
            <AuthButton
              onPress={() => {
                if (orderStatus != 'FoodReady' && orderStatus != 'Pending' && orderStatus != 'Preparing' && orderStatus != 'Confirmed') {
                  if (
                    userSuccessData?.Result?.Restaurant
                      ?.SupplierCode === null
                  ) {
                    setMdoalVisible(true);
                  } else {
                    props.navigation.navigate('PayToComplete', {
                      deatilsresult: deatilsresult,
                      orderId: orderId,
                    });
                  }
                } else {
                  if (deatilsresult?.RestaurantCashierStaffId == null && deatilsresult?.IsQRScan === false) {
                    setOTPmodal(true)

                  }
                  else {
                    setshowqr(!showqr);

                  }
                }
              }}
              container={landscape || isPhone ? styles.panelBtn : styles.barBtn}
              title={

                orderStatus === 'Pending' || orderStatus === 'Preparing' || orderStatus === 'Confirmed' || orderStatus === 'FoodReady'
                  ? HardCode.PICKUPORDER
                  : HardCode.RECEIVEPAYMENT
              }
            />
            // : null
          }
          {orderStatus === 'OnTheWay' && (
            <AuthButton
              variant="outline"
              iconName="x"
              container={landscape || isPhone ? styles.panelBtn : styles.barBtn}
              onPress={() => {
                setReasoningPopup(true);
              }}
              title={HardCode.CANCELORDER}
            />
          )}
        </>
      )}
    </>
  );

  // Same choice as the Pickup Order button (OTP when the order has no cashier
  // and no QR scan, otherwise the QR scanner), run once per visit from a tile.
  useEffect(() => {
    if (!autoPickup || autoPickupDone.current || loader || !deatilsresult) {
      return;
    }
    const prePickup =
      orderStatus === 'Pending' || orderStatus === 'Preparing' || orderStatus === 'Confirmed' || orderStatus === 'FoodReady';
    const scannedHere =
      !!scannedOrderNo && String(scannedOrderNo).trim() == String(deatilsresult?.OrderNo).trim();
    // From a tile: only when the Pickup Order button would show.
    // From Home's scan: any pre-pickup status (the QR is the proof of pickup).
    if (!actionsAllowed || !prePickup || (!scannedHere && showMarkDelivered)) {
      return;
    }
    autoPickupDone.current = true;
    if (deatilsresult?.RestaurantCashierStaffId == null && deatilsresult?.IsQRScan === false) {
      setOTPmodal(true);
    } else if (scannedHere) {
      ChangeStatusAPi();
    } else {
      setshowqr(true);
    }
  }, [autoPickup, scannedOrderNo, loader, deatilsresult, orderStatus, actionsAllowed, showMarkDelivered]);

  const statusChip =
    !isPhone && !loader && deatilsresult && isMine ? (
      <View style={styles.statusChip}>
        <Feather name="package" size={16} color={statusColor} />
        <Text style={[styles.statusChipText, { color: statusColor }]}>{statusText}</Text>
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.safeareaView}>
      <FocusAwareStatusBar
        style={styles.statusStrip}
        barStyle={showqr ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />
      <BackHeader
        onPress={() => props.navigation.goBack()}
        title={deatilsresult?.OrderNo}
        subtitle={deatilsresult?.FormattedDate}
        right={statusChip}
        filter={false}
      />

      {loader ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} color={Color.loaderColor} />
        </View>
      ) : (
        deatilsresult?.DeliveryStaffId == userInfo?.Result?.Id ?
          (landscape ? (
            <View style={styles.landscapeRow}>
              <ScrollView
                style={styles.flex1}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.column, { paddingHorizontal: gutter, paddingTop: 24, paddingBottom: 24 + bottomInset }]}>
                {itemsBlock}
                {billBlock}
              </ScrollView>
              <View style={styles.panel}>
                <ScrollView
                  style={styles.flex1}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[styles.column, { padding: 24, paddingBottom: 24 + (hasActions ? 0 : bottomInset) }]}>
                  {pickupBlock}
                  {infoBlock}
                </ScrollView>
                {hasActions && (
                  <View style={[styles.panelActions, { paddingBottom: 16 + bottomInset }]}>{actionButtons}</View>
                )}
              </View>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.column,
                {
                  paddingHorizontal: gutter,
                  paddingTop: isPhone ? 16 : 28,
                  paddingBottom: (isPhone ? 16 : 28) + (hasActions ? 0 : bottomInset),
                  gap: isPhone ? 14 : 20,
                },
              ]}>
              {pickupBlock}
              {infoBlock}
              {itemsBlock}
              {billBlock}
              {/* onPress={() =>
                    props.navigation.navigate('OrderDetail', {
                      orderId: item.Id,
                    })
                  } */}
            </ScrollView>
          )) :
          (
            <View style={[styles.reassigned, { paddingHorizontal: gutter }]}>
              <IconTile name="repeat" />
              <SubHeading
                style={styles.reassignedText}
                text={HardCode.OrderReassigned}
              />
            </View>
          )
      )}
      {!landscape && hasActions && (
        <BottomBar style={isPhone ? styles.barStack : styles.barReverse}>{actionButtons}</BottomBar>
      )}
      <Qrpopup
        state={showqr}
        codescanned={code => {
          if (String(code).trim() == String(deatilsresult?.OrderNo).trim()) {
            setshowqr(false);
            console.log('code' + code);
            // setPickedup(true);
            ChangeStatusAPi();

          }
          else {
            console.log('code' + code, orderId, 'pppppppppppppppp');
            setshowqr(false);
            dispatch(
              DataAction.ToastMessageSenderScreenAction(
                HardCode.InvalidQr
              ),
            );
          }
        }}
        pressback={code => {
          setshowqr(false);
        }}
      />
      <Modal
        animationType="fade"
        transparent
        visible={OTPmodal}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        navigationBarTranslucent>

        <TouchableWithoutFeedback onPress={() => setOTPmodal(false)}>
          <View style={[styles.centeredView, modalPad]}>
            <Pressable
              onPress={() => { }}
              style={[styles.dialogCard, { width: otpDialog.width }]}>
              <View style={styles.dialogHeader}>
                <Text style={[styles.dialogTitle, { fontSize: otpDialog.phone ? 22 : 26 }]}>
                  {HardCode.EnterOtp}
                </Text>
                {/* Cross icon top-right */}
                <TouchableWithoutFeedback onPress={() => setOTPmodal(false)}>
                  <View style={styles.inkSquare}>
                    <Feather name="x" size={22} color={C.surface} />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.dialogBody}>
                <TextInput
                  keyboardType="numeric"
                  placeholder={HardCode.OtpPlaceholder}
                  style={styles.otpInput}
                  placeholderTextColor={C.placeholder}
                  onChangeText={text => {
                    setOTP(text);
                  }}
                />
              </View>
              <View style={styles.dialogFooter}>
                {loader ? (
                  <View style={styles.loaderBox}>
                    <ActivityIndicator
                      size={'large'}
                      color={Color.loaderColor}
                    />
                  </View>
                ) : (
                  <AuthButton
                    title={HardCode.SUBMIT}
                    iconName="send"
                    container={styles.flexBtn}
                    onPress={() => {
                      Keyboard.dismiss();
                      if (deatilsresult?.OTP == OTP) {
                        setOTPmodal(false)
                        ChangeStatusAPi();

                      } else {
                        dispatch(
                          DataAction.ToastMessageSenderScreenAction(
                            HardCode.InvalidOtp,
                          ),
                        );
                      }
                    }}
                  />
                )}
              </View>
            </Pressable>
          </View>
          {/* { alert(dataSource?.OTP )} */}
        </TouchableWithoutFeedback>

      </Modal>
      {/* Payment Model if supplier code is null */}
      <Modal
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={MdoalVisible}>
        <View style={[styles.centeredView, modalPad]}>
          <View style={[styles.dialogCard, { width: otpDialog.width }]}>
            <View style={styles.dialogBody}>
              <View style={styles.amountBox}>
                <SubHeading style={styles.capsLabel} text={HardCode.ReceiveAmount} />
                <SubHeading
                  style={styles.amountBig}
                  text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TotalAmount}
                />
              </View>
              <Text style={styles.dialogCopy}>
                <SubHeading
                  style={styles.dialogCopy}
                  text={HardCode.ReceivingPaymentWillMark}
                />
                {' '}
                <SubHeading
                  style={styles.dialogCopy}
                  text={HardCode.YourOrderAsDelivered}
                />
              </Text>
            </View>
            <View style={[styles.dialogFooter, otpDialog.phone && styles.footerStack]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setMdoalVisible(!MdoalVisible)}
                style={[dialogStyles.outlineBtn, otpDialog.phone && styles.stackItem]}>
                <Heading style={dialogStyles.outlineText} text={HardCode.CLOSE} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
              {loader ? (
                <View style={[styles.loaderBox, otpDialog.phone && styles.stackItem]}>
                  <ActivityIndicator size={'large'} color={Color.loaderColor} />
                </View>
              ) : (
                <AuthButton
                  container={otpDialog.phone ? styles.panelBtn : styles.flexBtn}
                  onPress={() => {
                    ChangeStatusAPi();
                  }}
                  title={HardCode.RECEIVEPAYMENT}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* ORDER DETAIL MODAL */}
      <Pickpop
        loader={loader}
        visible={Pickedup}
        //  visible={true}
        type={typeState}
        yesPress={() => {
          ChangeStatusAPi();
        }}
        onNoPress={() => {
          setPickedup(false);
        }}
      />
      <Reasonpopup
        //  visible={true}
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={orderDetailMdoalVisible}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        navigationBarTranslucent
      // visible={true}
      >
        <View style={[styles.centeredView, modalPad]}>
          <View style={[styles.dialogCard, { width: dialog.width, maxHeight: dialog.maxHeight }]}>
            <View style={[styles.dialogHeader, styles.itemHead]}>
              <View style={styles.viewSubheading}>
                <SubHeading style={styles.capsLabel} text={HardCode.QTY} />
                <SubHeading style={styles.qtyValue} text={itemQuamtity} />
              </View>
              <View style={styles.img2View}>
                <Image
                  source={{ uri: orderMenudeatils?.Image }}
                  style={styles.img2}
                />
              </View>
              <View style={styles.flexMin}>
                <SubHeading
                  style={styles.itemName}
                  text={orderMenudeatils?.Name}
                />
              </View>
              <SubHeading
                style={styles.itemPrice}
                text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + price}
              />
            </View>

            <ScrollView contentContainerStyle={styles.dialogBody}>
              <View style={styles.dialogSection}>
                <SubHeading style={styles.capsLabel} text={HardCode.Description} />
                <SubHeading
                  style={styles.dialogCopy}
                  text={orderMenudeatils?.Description}
                />
              </View>

              {setelctedOrderDetailsOptionValues?.length > 0 && (
                <View style={styles.ruleLine}></View>
              )}

              {setelctedOrderDetailsOptionValues?.length > 0 && (
                <SubHeading style={styles.capsLabel} text={HardCode.Options} />
              )}

              {setelctedOrderDetailsOptionValues?.length > 0 && (
                <View>
                  <FlatList
                    scrollEnabled={false}
                    data={setelctedOrderDetailsOptionValues}
                    renderItem={itemData => {
                      return (
                        <View style={styles.flatlistView}>
                          <View style={styles.flatlistEmptyView}></View>
                          <Paragraph
                            style={styles.option}
                            text={`${itemData.item.MenuItemOption} -> `}
                          />

                          <Paragraph
                            style={styles.option}
                            text={itemData.item.MenuItemOptionValue}
                          />
                        </View>
                      );
                    }}
                  />
                </View>
              )}

              {selectItemOption?.map((item, i) => {
                return (
                  <View key={i} style={styles.dialogSection}>
                    <SubHeading style={styles.optionGroup} text={item.Option} />

                    <View style={styles.optionTable}>
                      {item?.OptionValues?.map((i, vi) => {
                        return (
                          <View key={vi} style={styles.optionRow}>
                            <View style={styles.flatlistEmptyView} />
                            <View style={styles.flexMin}>
                              <SubHeading
                                style={styles.optionText}
                                text={i?.MenuItemOptionValue}
                              />
                            </View>
                            <SubHeading
                              style={[styles.optionText, styles.num, { color: C.muted }]}
                              text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + i?.TotalPrice}
                            />
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}

              {/* {customerNote !== '' && customerNote && ( ...SpecialInstructions... )} */}
            </ScrollView>

            <View style={styles.dialogFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setOrderDetailMdoalVisible(!orderDetailMdoalVisible)
                }
                style={dialogStyles.outlineBtn}>
                <Heading style={dialogStyles.outlineText} text={HardCode.CLOSE} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* INFO MODAL (Customer Info): L two columns 760, P 600 centred, M bottom sheet */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={infoMdoalVisible}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        navigationBarTranslucent
      //visible={true}
      >
        <View style={[styles.centeredView, isPhone && styles.sheetScrim, modalPad]}>
          <View
            style={[
              styles.dialogCard,
              isPhone
                ? styles.sheet
                : { width: dialog.width, maxHeight: dialog.maxHeight },
            ]}>
            <View style={[styles.dialogHeader, { paddingHorizontal: dialog.padX }]}>
              <SubHeading
                style={[styles.dialogTitle, { fontSize: isPhone ? 22 : 26 }]}
                text={HardCode.CustomerInfo}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.inkSquare}
                onPress={() => setInfoMdoalVisible(!infoMdoalVisible)}>
                <Feather name="x" size={22} color={C.surface} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: dialog.padX, paddingVertical: isPhone ? 8 : 12 }}>
              <View style={styles.infoSummary}>
                <SubHeading style={styles.summaryOrder} text={deatilsresult?.OrderNo} />
                <SubHeading style={styles.summaryName} text={deatilsresult?.CustomerName} />
                <SubHeading style={styles.pickupSub} text={deatilsresult?.FormattedDate} />
              </View>
              <View style={landscape ? styles.twoCol : null}>
                <View style={[styles.entypoView, landscape && styles.colHalf]}>
                  <SubHeading style={styles.capsLabel} text={HardCode.Name} />
                  <SubHeading style={styles.rowValue} text={deatilsresult?.CustomerName} />
                </View>
                <View style={[styles.entypoView, landscape && styles.colHalf]}>
                  <SubHeading style={styles.capsLabel} text={HardCode.ContactNo} />
                  <SubHeading style={styles.rowValue} text={deatilsresult?.CustomerContact} />
                </View>
                <View style={[styles.entypoView, landscape && styles.colHalf]}>
                  <SubHeading style={styles.capsLabel} text={HardCode.Email} />
                  <SubHeading style={styles.rowValue} text={deatilsresult?.CustomerEmail} />
                </View>
                <View style={[styles.entypoView, landscape && styles.colHalf]}>
                  <SubHeading style={styles.capsLabel} text={HardCode.Address} />
                  <SubHeading style={styles.rowValue} text={deatilsresult?.Address} />
                </View>
                <View style={[styles.entypoView, landscape && styles.colHalf]}>
                  <SubHeading style={styles.capsLabel} text={HardCode.BuildingAndStreet} />
                  <SubHeading
                    style={styles.rowValue}
                    text={`${deatilsresult?.Street ? deatilsresult?.Street : '-'
                      }`}
                  />
                </View>
                <View style={[styles.entypoView, landscape && styles.colHalf]}>
                  <SubHeading style={styles.capsLabel} text={HardCode.FlatNoAndFloor} />
                  <SubHeading
                    style={styles.rowValue}
                    text={`${deatilsresult?.Floor ? deatilsresult?.Floor : '-'
                      }`}
                  />
                </View>
                <View style={[styles.entypoView, landscape && styles.colHalf]}>
                  <SubHeading style={styles.capsLabel} text={HardCode.NoteToRider} />
                  <SubHeading
                    style={styles.rowValue}
                    text={
                      deatilsresult?.NoteToRider
                        ? deatilsresult?.NoteToRider
                        : '-'
                    }
                  />
                </View>
              </View>
            </ScrollView>

            <View style={[styles.dialogFooter, { paddingHorizontal: isPhone ? 16 : 28 }]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={dialogStyles.outlineBtn}
                onPress={() => setInfoMdoalVisible(!infoMdoalVisible)}>
                <Heading style={dialogStyles.outlineText} text={HardCode.CLOSE} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
              <AuthButton
                container={styles.flexBtn}
                iconName="phone"
                onPress={() =>
                  Linking.openURL(`tel:${deatilsresult?.CustomerContact}`)
                }
                title={HardCode.CALL}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* STATUS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={statusMdoalVisible}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        navigationBarTranslucent
      //     visible={true}
      >
        <View style={[styles.centeredView, modalPad]}>
          <View style={[styles.dialogCard, { width: otpDialog.width }]}>
            <View style={styles.dialogHeader}>
              <SubHeading
                style={[styles.dialogTitle, { fontSize: otpDialog.phone ? 22 : 26 }]}
                text={HardCode.ChangeStatus}
              />
            </View>
            <View style={styles.dialogBody}>
              <RadioButtonRN
                initial={
                  orderStatus === 'Confirmed'
                    ? 1
                    : orderStatus === 'Pending' || orderStatus === 'Preparing'
                      ? 2
                      : 3
                }
                data={data}
                circleSize={11}
                activeColor={C.accent}
                boxStyle={styles.radioBtn}
                textStyle={styles.rowValue}
                selectedBtn={e => setOrderStatusInHold(e.label)}
              />
            </View>
            <View style={styles.dialogFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setStatusMdoalVisible(!statusMdoalVisible)}
                style={dialogStyles.outlineBtn}>
                <Heading style={dialogStyles.outlineText} text={HardCode.CANCEL} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
              <AuthButton
                container={styles.flexBtn}
                iconName="check"
                onPress={() => {
                  // alert(orderStatusInHold);
                  setOrderStatus(orderStatusInHold);
                  setStatusMdoalVisible(!statusMdoalVisible);
                  setStatus(orderStatusInHold);
                }}
                title={HardCode.UPDATE}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* ASSIGN DELIVERY MODAL */}
      <Modal
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={assignDeliveryMdoalVisible}>
        <View style={[styles.centeredView, modalPad]}>
          <View style={[styles.dialogCard, { width: otpDialog.width }]}>
            <View style={styles.dialogHeader}>
              <SubHeading
                style={[styles.dialogTitle, { fontSize: otpDialog.phone ? 22 : 26 }]}
                text={HardCode.AssignDelivery}
              />
            </View>
            <ScrollView contentContainerStyle={styles.dialogBody}>
              {deliveryRidersData.map((val, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    style={styles.riderRow}
                    onPress={() => {
                      setDeliveryMan(val.name);
                      setOrderStatus('Pending');
                      setAssignDeliveryMdoalVisible(!assignDeliveryMdoalVisible);
                      RiderID = val.Id;
                      assignRider();
                      // alert(RiderID)
                    }}>
                    <View style={styles.imgUpperView}>
                      <Image
                        source={{
                          uri: val.Logo,
                        }}
                        style={styles.images}
                      />
                    </View>
                    <View style={styles.flexMin}>
                      <SubHeading
                        style={styles.rowValue}
                        text={val.FirstName + val.LastName}
                      />
                    </View>
                    <Feather name="chevron-right" size={20} color={C.muted} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.dialogFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setAssignDeliveryMdoalVisible(!assignDeliveryMdoalVisible)
                }
                style={dialogStyles.outlineBtn}>
                <Heading style={dialogStyles.outlineText} text={HardCode.CLOSE} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        navigationBarTranslucent
        supportedOrientations={['portrait', 'landscape']}
        // visible={true}
        visible={riderinfoMdoalVisible}>
        <View style={[styles.centeredView, modalPad]}>
          <View style={[styles.dialogCard, { width: otpDialog.width }]}>
            <View style={styles.dialogHeader}>
              <View style={styles.flexMin}>
                <SubHeading style={styles.capsLabel} text={HardCode.DeliveryPerson} />
                <SubHeading
                  style={styles.dialogTitle}
                  text={
                    selectedRidersDetails?.FirstName +
                    selectedRidersDetails?.LastName
                  }
                />
                <SubHeading
                  style={styles.pickupSub}
                  text={selectedRidersDetails?.CreationDate?.split('T')[0]}
                />
              </View>
            </View>
            <View style={styles.dialogBody}>
              <SubHeading style={styles.capsLabel} text={HardCode.CustomerInfo} />
              <View style={styles.riderRow}>
                <FontAwesome name="user" size={18} color={C.accent} />
                <View style={styles.flexMin}>
                  <SubHeading
                    style={styles.rowValue}
                    text={
                      selectedRidersDetails?.FirstName +
                      selectedRidersDetails?.LastName
                    }
                  />
                </View>
              </View>
              <View style={styles.riderRow}>
                <Entypo name="phone" size={18} color={C.accent} />
                <View style={styles.flexMin}>
                  <SubHeading
                    style={styles.rowValue}
                    text={selectedRidersDetails?.PhoneNumber}
                  />
                </View>
              </View>
            </View>
            <View style={styles.dialogFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setriderInfoMdoalVisible(!riderinfoMdoalVisible)}
                style={dialogStyles.outlineBtn}>
                <Heading style={dialogStyles.outlineText} text={HardCode.CLOSE} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
              <AuthButton
                container={styles.flexBtn}
                iconName="phone"
                onPress={() =>
                  Linking.openURL(`tel:${selectedRidersDetails?.PhoneNumber}`)
                }
                title={HardCode.CALL}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delivered: full accent field (README 10) */}
      <DeliveredSuccess
        visible={visible}
        loader={loader}
        line={
          deatilsresult
            ? `${deatilsresult?.OrderNo} · ${deatilsresult?.CustomerName} · ${userInfo?.Result?.RestaurantBranch?.Currency} ${deatilsresult?.TotalAmount?.toFixed?.(2)}`
            : ''
        }
        onReturn={() => {
          setVisible(false);
          props.navigation.navigate('Drawer');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeareaView: { flex: 1, backgroundColor: C.ground },
  statusStrip: { backgroundColor: C.surface },
  loaderView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flex1: { flex: 1 },
  flexMin: { flex: 1, minWidth: 0 },
  column: { gap: 16 },
  landscapeRow: { flex: 1, flexDirection: 'row' },
  panel: {
    width: 440,
    backgroundColor: C.surface,
    borderLeftWidth: B.rule,
    borderLeftColor: C.ink,
  },
  panelActions: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: B.rule,
    borderTopColor: C.ink,
    gap: 12,
  },
  panelBtn: { height: 56, alignSelf: 'stretch', width: '100%' },
  barBtn: { flex: 1, width: undefined },
  barReverse: { flexDirection: 'row-reverse' },
  // Phone: actions stacked full width so long labels never truncate.
  barStack: { flexDirection: 'column', alignItems: 'stretch' },
  // Phone dialog footer: primary on top, Close below, both full width.
  footerStack: { flexDirection: 'column-reverse', alignItems: 'stretch' },
  stackItem: { flex: 0, alignSelf: 'stretch' },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
    paddingBottom: 8,
  },
  sectionTitle: { fontFamily: F.black, fontSize: 18, color: C.ink },
  sectionMeta: { fontFamily: F.bold, fontSize: 15, color: C.muted },
  table: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  seeMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  seeMoreText: {
    fontFamily: F.bold,
    fontSize: 15,
    letterSpacing: 0,
    color: C.accentDeep,
  },
  bill: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 5,
  },
  billText: {
    fontFamily: F.medium,
    fontSize: 15,
    letterSpacing: 0,
    color: C.body,
  },
  num: { fontVariant: ['tabular-nums'] },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: B.rule,
    borderTopColor: C.ink,
    marginTop: 8,
    paddingTop: 12,
  },
  totalText: {
    fontFamily: F.black,
    fontSize: 20,
    letterSpacing: 0,
    color: C.ink,
  },
  card: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    padding: 16,
    gap: 14,
  },
  cardTitle: { fontFamily: F.black, fontSize: 17, color: C.ink },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  capsLabel: {
    fontFamily: F.bold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.muted,
  },
  contactValue: { fontFamily: F.medium, fontSize: 15, color: C.ink },
  pickupHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  pickupName: {
    fontFamily: F.bold,
    fontSize: 17,
    letterSpacing: 0,
    color: C.ink,
  },
  pickupSub: {
    fontFamily: F.medium,
    fontSize: 14,
    letterSpacing: 0,
    color: C.muted,
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flexBtn: { flex: 1, width: undefined },
  outlineBtn48: {
    height: 48,
    alignSelf: 'stretch',
    borderWidth: B.rule,
    borderColor: C.ink,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 14,
  },
  outlineBtn48Fixed: { alignSelf: 'flex-start', width: 280 },
  btnStack: { gap: 8 },
  stackBtn: { alignSelf: 'stretch' },
  btnIcon: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  outlineBtnText: {
    flexShrink: 1,
    fontFamily: F.bold,
    fontSize: 15,
    letterSpacing: 0,
    color: C.ink,
  },
  hiddenInfo: { position: 'absolute', opacity: 0, right: 0, top: 0 },
  phoneTile: {
    width: 28,
    height: 28,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square48: {
    width: 48,
    height: 48,
    borderWidth: B.hair,
    borderColor: C.rule,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  infoRow: {
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoRowTop: { borderTopWidth: B.hair, borderTopColor: C.rule },
  infoLabel: {
    fontFamily: F.medium,
    fontSize: 15,
    letterSpacing: 0,
    color: C.muted,
  },
  infoValue: {
    fontFamily: F.bold,
    fontSize: 16,
    letterSpacing: 0,
    color: C.ink,
    flexShrink: 1,
    textAlign: 'right',
  },
  strip: { flexDirection: 'row' },
  stripCell: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  stripCellRule: { borderLeftWidth: B.hair, borderLeftColor: C.rule },
  smallOutline: {
    height: 40,
    paddingHorizontal: 14,
    borderWidth: B.rule,
    borderColor: C.ink,
    justifyContent: 'center',
  },
  img: {
    height: 44,
    width: 44,
    resizeMode: 'cover',
  },
  statusChip: {
    height: 36,
    paddingHorizontal: 12,
    borderWidth: B.hair,
    borderColor: C.rule,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChipText: { fontFamily: F.bold, fontSize: 14 },
  reassigned: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  reassignedText: {
    fontFamily: F.bold,
    fontSize: 18,
    letterSpacing: 0,
    color: C.ink,
    textAlign: 'center',
  },
  // dialogs
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.scrim,
  },
  sheetScrim: { justifyContent: 'flex-end', alignItems: 'stretch' },
  sheet: {
    width: '100%',
    maxHeight: '88%',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  dialogCard: {
    backgroundColor: C.ground,
    borderWidth: B.rule,
    borderColor: C.ink,
    overflow: 'hidden',
  },
  dialogHeader: {
    backgroundColor: C.surface,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dialogTitle: {
    flex: 1,
    fontFamily: F.black,
    fontSize: 22,
    letterSpacing: 0,
    color: C.ink,
  },
  dialogBody: { padding: 20, gap: 12 },
  dialogSection: { gap: 6 },
  dialogCopy: {
    fontFamily: F.medium,
    fontSize: 16,
    letterSpacing: 0,
    color: C.body,
  },
  dialogFooter: {
    backgroundColor: C.surface,
    borderTopWidth: B.rule,
    borderTopColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  loaderBox: { flex: 1, height: 56, justifyContent: 'center', alignItems: 'center' },
  inkSquare: {
    width: 44,
    height: 44,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    height: 56,
    borderWidth: B.hair,
    borderColor: C.rule,
    backgroundColor: C.surface,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: F.medium,
    color: C.ink,
  },
  amountBox: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 6,
  },
  amountBig: {
    fontFamily: F.black,
    fontSize: 40,
    letterSpacing: 0,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  itemHead: { alignItems: 'center' },
  viewSubheading: {
    width: 56,
    height: 56,
    backgroundColor: C.ground,
    borderWidth: B.hair,
    borderColor: C.rule,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: {
    fontFamily: F.black,
    fontSize: 18,
    letterSpacing: 0,
    color: C.ink,
  },
  img2View: { justifyContent: 'center' },
  img2: {
    height: 56,
    width: 56,
    resizeMode: 'cover',
    backgroundColor: C.disabled,
  },
  itemName: {
    fontFamily: F.bold,
    fontSize: 17,
    letterSpacing: 0,
    color: C.ink,
  },
  itemPrice: {
    fontFamily: F.black,
    fontSize: 17,
    letterSpacing: 0,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  ruleLine: { height: B.hair, backgroundColor: C.rule },
  optionGroup: {
    fontFamily: F.bold,
    fontSize: 15,
    letterSpacing: 0,
    color: C.ink,
  },
  optionTable: {
    width: '100%',
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  optionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: B.hair,
    borderBottomColor: C.rule,
  },
  optionText: {
    fontFamily: F.medium,
    fontSize: 15,
    letterSpacing: 0,
    color: C.ink,
  },
  option: {
    fontSize: 15,
    color: C.ink,
    marginLeft: 8,
  },
  flatlistView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  flatlistEmptyView: {
    height: 6,
    width: 6,
    backgroundColor: C.accent,
  },
  infoSummary: {
    gap: 2,
    paddingVertical: 12,
    borderBottomWidth: B.hair,
    borderBottomColor: C.rule,
  },
  summaryOrder: {
    fontFamily: F.black,
    fontSize: 18,
    letterSpacing: 0,
    color: C.accentDeep,
  },
  summaryName: {
    fontFamily: F.bold,
    fontSize: 16,
    letterSpacing: 0,
    color: C.ink,
  },
  twoCol: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 32 },
  colHalf: { width: '47%' },
  entypoView: {
    paddingVertical: 14,
    borderBottomWidth: B.hair,
    borderBottomColor: C.rule,
    gap: 4,
  },
  rowValue: {
    fontFamily: F.medium,
    fontSize: 17,
    letterSpacing: 0,
    color: C.ink,
  },
  radioBtn: {
    borderWidth: 0,
    borderRadius: 0,
    paddingTop: 8,
    paddingBottom: 0,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: B.hair,
    borderBottomColor: C.rule,
  },
  imgUpperView: {
    height: 44,
    width: 44,
    backgroundColor: C.disabled,
  },
  images: {
    height: 44,
    width: 44,
    resizeMode: 'cover',
  },
});
