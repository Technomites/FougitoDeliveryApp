import React, {useState, useEffect} from 'react';
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
// import {BaseUrl} from '../../Components/BaseUrl';
import {useSelector, useDispatch} from 'react-redux';
import OrderDeatilTile from '../../Components/UI-Support/OrderDeatilTile';
import {fontSize} from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';

let RiderID = 0;
const data = [
  {label: HardCode.Confirmed},
  {label: HardCode.Pending},
  {label: HardCode.Ready},
];

export default function PastOrderDetail(props) {
  // alert(orderId);
  const [deatilsresult, setdeatilsresult] = useState(null);
  const [orderdeatils, setorderdeatils] = useState([]);
  const [orderMenudeatils, setorderMenudeatils] = useState(null);
  const [orderMenudeatilsOptions, setorderMenudeatilsOptions] = useState([]);
  const [deliveryRidersData, setdeliveryRidersData] = useState([]);
  const [selectedRidersDetails, setselectedRidersDetails] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderStatusInHold, setOrderStatusInHold] = useState('');
  const [orderDetailMdoalVisible, setOrderDetailMdoalVisible] = useState(false);
  const [infoMdoalVisible, setInfoMdoalVisible] = useState(false);
  const [statusMdoalVisible, setStatusMdoalVisible] = useState(false);
  const [assignDeliveryMdoalVisible, setAssignDeliveryMdoalVisible] =
    useState(false);
  const [deliveryMan, setDeliveryMan] = useState('');
  const [riderinfoMdoalVisible, setriderInfoMdoalVisible] = useState(false);
  const [itemQuamtity, setItemQuantity] = useState(0);
  const [selectItemOption, setSelectItemOption] = useState();
  const userInfo = useSelector(state => state.auth.userInfo);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const {orderId} = props.route.params;
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );
  //alert(orderId);
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      OrderDeatils();
      // getAllRiiders();
    });

    const subscribe = props.navigation.addListener('blur', () => {});
    return unsubscribe, subscribe;
  }, []);

  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

  const OrderDeatils = async () => {
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

    fetch(`${BaseUrl}partner/orders/${orderId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setdeatilsresult(result);
        setorderdeatils(result?.OrderDetails);
        setselectedRidersDetails(result?.DeliveryStaff);
        setOrderStatus(result?.Status);
        // if (result.Status === 'Success') {
        //   //alert('success');
        //   console.log(result?.Result);
        //   if (result.Result.length === 0 && allorders.length === 0) {
        //     // alert('length is 1');
        //     setnoorderData(true);
        //   }
        //   setallorders(result?.Result);
        // }
        console.log(result);
      })
      .catch(error =>{
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)});
  };

  const setStatus = async () => {
    let orderid = 0;
    // 'Confirmed'}, {label: 'Pending'}, {label: 'Ready'
    if (orderStatus === 'Confirmed') {
      orderid = 1;
    } else if (orderStatus === 'Pending' || orderStatus === 'Preperaing') {
      orderid = 2;
    } else if (orderStatus === 'Ready') {
      orderid = 3;
    }
    //alert(orderid);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      // body: raw,
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}partner/orders/${deatilsresult?.Id}/Status/${orderid}/`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result);
        // if (result.Status === 'Success') {
        //   //alert('success');
        //   console.log(result?.Result);
        //   if (result.Result.length === 0 && allorders.length === 0) {
        //     // alert('length is 1');
        //     setnoorderData(true);
        //   }
        //   setallorders(result?.Result);
        // }
        console.log(result);
      })
      .catch(error =>{
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)});
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <FocusAwareStatusBar
        barStyle={'dark-content'}
        backgroundColor="transparent"
      />
      <BackHeader
        onPress={() => props.navigation.goBack()}
        title={deatilsresult?.OrderNo}
        filter={false}
      />

      <View style={{maxHeight: '30%'}}>
        <FlatList
          onResponderEnd={() => alert('hit')}
          style={{padding: 12}}
          showsVerticalScrollIndicator={false}
          data={orderdeatils}
          //  img ={https://cdn.fougito.com/Images/Restaurant/Category/card_img.png}
          //onRefresh={() => onRefresh()}
          // refreshing={isFetching}
          renderItem={itemData => {
            return (
              <OrderDeatilTile
                onPress={() => {
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
                    `${BaseUrl}partner/orders/Details/${itemData.item.Id}/Options`,
                    requestOptions,
                  )
                    .then(response => response.json())
                    .then(result => {
                      if (result.Status === 'Success') {
                        setSelectItemOption(result?.Result);
                      }
                    })
                    .catch(error =>{
                      dispatch({
                        type: AUTHTOKENSTATEDISPATH,
                        payload: true,
                      });
                      console.log('error', error)});

                  setItemQuantity(itemData?.item?.Quantity);
                  console.log(JSON.stringify(itemData?.item?.MenuItems?.Item));
                  setorderMenudeatils(itemData?.item?.MenuItems?.Item);
                  setorderMenudeatilsOptions(
                    itemData?.item?.OrderDetailOptionValues,
                  );
                  setOrderDetailMdoalVisible(!orderDetailMdoalVisible);
                }}
                itemData={itemData}
                Currency={userInfo?.Result?.RestaurantBranch?.Currency}
              />
            );
          }}
        />
      </View>
      <View style={styles.view}>
        <View style={styles.subHeadingMainView}>
          <View style={styles.subHeadingSubView}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,
              }}
              text={HardCode.SubTotal}
            />
          </View>
          <View
            style={{
              ...styles.subHeadingSubView,
              alignItems: 'flex-end',
            }}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,
              }}
              text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.Amount}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 8}}>
          <View style={{...styles.subHeadingSubView}}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,
              }}
              text={HardCode.DeliveryCharges}
            />
          </View>
          <View
            style={{
              ...styles.subHeadingSubView,
              alignItems: 'flex-end',
            }}>
            <SubHeading
              style={{
                ...styles.subHeading,
                fontSize: fontSize.twelve,
              }}
              text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.DeliveryCharges}
            />
          </View>
        </View>
        <View style={styles.subHeadingMainView}>
          <View style={{...styles.subHeadingSubView}}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,
              }}
              text={`${HardCode.VATAmount} ( ${deatilsresult?.TaxPercent} )%`}
            />
          </View>
          <View
            style={{
              ...styles.subHeadingSubView,
              alignItems: 'flex-end',
            }}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,
              }}
              text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TaxAmount}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{...styles.subHeadingSubView}}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,
              }}
              text={HardCode.CouponDiscount}
            />
          </View>
          <View
            style={{
              ...styles.subHeadingSubView,
              alignItems: 'flex-end',
            }}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,
              }}
              text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.CouponDiscount}
            />
          </View>
        </View>
        <View style={styles.emptyView}></View>
        <View style={{flexDirection: 'row'}}>
          <View style={{...styles.subHeadingSubView}}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.sixteen,
              }}
              text={HardCode.Total}
            />
          </View>
          <View
            style={{
              ...styles.subHeadingSubView,
              alignItems: 'flex-end',
            }}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.sixteen,

                color: Color.btnBgColor,
              }}
              text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TotalAmount}
            />
          </View>
        </View>
        {deliveryMan !== '' && (
          <View style={styles.viewSubheading}>
            <View style={{...styles.subHeadingSubView}}>
              <SubHeading
                style={{
                  ...styles.subHeading,

                  fontSize: fontSize.sixteen,
                }}
                text={HardCode.OrderStatus}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <SubHeading
                style={{
                  ...styles.subHeading,

                  fontSize: fontSize.twelve,
                  color: Color.btnBgColor,
                }}
                text={orderStatus}
              />
            </View>
          </View>
        )}
        <View style={styles.viewSubheading}>
          <View style={{...styles.subHeadingSubView}}>
            <SubHeading
              style={{
                ...styles.subHeading,

                color: Color.btnBgColor,
              }}
              text={deatilsresult?.OrderNo}
            />
            <SubHeading
              style={{
                ...styles.subHeading,
                fontSize: fontSize.sixteen,
              }}
              text={deatilsresult?.CustomerName}
            />
            <SubHeading
              style={{
                ...styles.subHeading,
                fontSize: fontSize.twelve,
                opacity: 0.4,
              }}
              text={deatilsresult?.FormattedDate}
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setInfoMdoalVisible(!infoMdoalVisible)}
              style={styles.touchablesubheading}>
              <SubHeading
                style={{
                  ...styles.subHeading,

                  fontSize: fontSize.twelve,

                  color: '#757576',
                }}
                text={HardCode.ViewInfo}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewSubheading}>
          <View style={{...styles.subHeadingSubView}}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.sixteen,
              }}
              text={HardCode.OrderStatus}
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.twelve,

                color: Color.btnBgColor,
              }}
              text={orderStatus}
            />
          </View>
        </View>

        {selectedRidersDetails !== null ? (
          <View style={styles.viewSubheading}>
            <View style={{justifyContent: 'center'}}>
              <View style={styles.imgView}>
                <Image
                  source={require('../../assets/Images/ambur-biryani.png')}
                  style={styles.img}
                />
              </View>
            </View>
            <View style={{...styles.subHeadingSubView, marginLeft: 12}}>
              <SubHeading
                style={{
                  ...styles.subHeading,

                  color: Color.btnBgColor,
                }}
                text={HardCode.DELIVERYPERSON}
              />
              <SubHeading
                style={{
                  ...styles.subHeading,
                }}
                text={
                  selectedRidersDetails?.FirstName +
                  selectedRidersDetails?.LastName
                }
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setriderInfoMdoalVisible(!riderinfoMdoalVisible)}
                style={styles.touchablesubheading}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.twelve,

                    color: '#757576',
                  }}
                  text={HardCode.ViewInfo}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* {deliveryMan !== '' ? null : orderStatus === 'Ready' ? (
          <View style={{marginVertical: 12}}>
            <AuthButton
              onPress={() =>
                setAssignDeliveryMdoalVisible(!assignDeliveryMdoalVisible)
              }
              title="ASSIGN DELIVERY"
            />
          </View>
        ) : (
          <View style={{marginVertical: 12}}>
            <AuthButton
              onPress={() => setStatusMdoalVisible(!statusMdoalVisible)}
              title="CHANGE STATUS"
            />
          </View>
        )} */}
      </View>
      {/* ORDER DETAIL MODAL */}
      <Modal
        animationType="fade"
        statusBarTranslucent
        transparent={true}
        visible={orderDetailMdoalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}>
              <View style={{justifyContent: 'center'}}>
                <View style={styles.viewSubheading2}>
                  <SubHeading
                    style={{
                      ...styles.subHeading,

                      fontSize: fontSize.twelve,
                    }}
                    text={orderMenudeatils?.Id}
                  />
                </View>
              </View>
              <View style={styles.views}>
                <Image
                  source={require('../../assets/Images/ambur-biryani.png')}
                  style={styles.image}
                />
              </View>
              <View style={{...styles.subHeadingSubView, marginLeft: 14}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.twelve,
                  }}
                  text={orderMenudeatils?.Name}
                />
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.twelve,

                    color: '#A10404',
                  }}
                  text={''}
                />
              </View>
              <View style={{justifyContent: 'center'}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.twelve,
                  }}
                  text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + orderMenudeatils?.Price}
                />
              </View>
            </View>
            <View
              style={{
                ...styles.emptyView,
                marginVertical: 8,
              }}></View>
            <View>
              <SubHeading
                style={{
                  ...styles.subHeading,

                  fontSize: 15,
                }}
                text={orderMenudeatils?.Name}
              />
              <SubHeading
                style={{
                  ...styles.subHeading,

                  fontSize: fontSize.twelve,

                  opacity: 0.6,
                }}
                text={orderMenudeatils?.Description}
              />
            </View>
            <View style={styles.emptyView}></View>
            <View>
              <SubHeading
                style={{
                  ...styles.subHeading,

                  fontSize: fontSize.fifteen,
                }}
                text={orderMenudeatilsOptions.length >= 1 ? 'Option' : ''}
              />
              <ScrollView>
                {selectItemOption?.map((item, i) => {
                  return (
                    <View style={{marginTop: 4}}>
                      <View>
                        <SubHeading
                          style={{
                            ...styles.subHeading,

                            fontFamily: FontFamily.Bold,

                            fontSize: fontSize.fourteen,
                          }}
                          text={item.Option}
                        />
                      </View>

                      <View style={{width: '100%'}}>
                        {item?.OptionValues?.map(i => {
                          return (
                            <View style={styles.entypoView}>
                              <View style={{justifyContent: 'center'}}>
                                <Entypo
                                  name="dot-single"
                                  size={2}
                                  color="#303030"
                                />
                              </View>
                              <View style={{...styles.subHeadingSubView}}>
                                <SubHeading
                                  style={{
                                    fontSize: fontSize.twelve,
                                  }}
                                  text={i?.MenuItemOptionValue}
                                />
                              </View>
                              <View style={{justifyContent: 'center'}}>
                                <SubHeading
                                  style={{
                                    ...styles.subHeading,

                                    opacity: 0.6,
                                  }}
                                  text={`${userInfo?.Result?.RestaurantBranch?.Currency} ` + i?.Price}
                                />
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            {/* <View
              style={{
                borderBottomColor: '#707070',
                borderBottomWidth: 1,
                marginVertical: 16,
                opacity: 0.4,
              }}></View>
            <View>
              <SubHeading
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 15,
                  color: '#29262A',
                }}
                text={'Addon'}
              />
              <View style={{flexDirection: 'row', marginTop: 4}}>
                <View style={{justifyContent: 'center'}}>
                  <Entypo name="plus" size={16} color="#303030" />
                </View>
                <View
                  style={{flex: 1, justifyContent: 'center', marginLeft: 8}}>
                  <SubHeading
                    style={{
                      fontFamily: 'Inter-SemiBold',
                      fontSize: 14,
                      color: '#29262A',
                    }}
                    text={'Hot Sauce'}
                  />
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                <View style={{justifyContent: 'center'}}>
                  <Entypo name="plus" size={16} color="#303030" />
                </View>
                <View
                  style={{flex: 1, justifyContent: 'center', marginLeft: 8}}>
                  <SubHeading
                    style={{
                      fontFamily: 'Inter-SemiBold',
                      fontSize: 14,
                      color: '#29262A',
                    }}
                    text={'Barbeque Sauce'}
                  />
                </View>
                <View style={{justifyContent: 'center'}}>
                  <SubHeading
                    style={{
                      fontFamily: 'Inter-SemiBold',
                      fontSize: 13,
                      color: '#29262A',
                      opacity: 0.6,
                    }}
                    text={'AED 2.00'}
                  />
                </View>
              </View>
            </View> */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                setOrderDetailMdoalVisible(!orderDetailMdoalVisible)
              }
              style={{marginTop: 26}}>
              <Heading style={styles.heading} text={HardCode.CLOSE} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* INFO MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={infoMdoalVisible}
        statusBarTranslucent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}>
              <View style={{...styles.subHeadingSubView}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    color: Color.btnBgColor,
                  }}
                  text={deatilsresult?.OrderNo}
                />
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.sixteen,
                  }}
                  text={deatilsresult?.CustomerName}
                />
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.twelve,

                    opacity: 0.4,
                  }}
                  text={deatilsresult?.FormattedDate}
                />
              </View>
            </View>
            <View style={styles.emptyView}></View>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.eightteen,

                marginBottom: 4,
              }}
              text={HardCode.CustomerInfo}
            />
            <View style={styles.iconView}>
              <View style={{justifyContent: 'center', marginRight: 12}}>
                <FontAwesome name="user" size={16} color={Color.iconColor} />
              </View>
              <View style={{...styles.subHeadingSubView}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    opacity: 0.6,
                  }}
                  text={deatilsresult?.CustomerName}
                />
              </View>
            </View>
            <View style={styles.iconView}>
              <View style={{justifyContent: 'center', marginRight: 6}}>
                <Entypo name="phone" size={16} color={Color.iconColor} />
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    opacity: 0.6,
                  }}
                  text={deatilsresult?.CustomerContact}
                />
              </View>
            </View>
            <View style={styles.iconView}>
              <View style={{justifyContent: 'flex-start', marginRight: 6}}>
                <Ionicons
                  name="location-sharp"
                  size={16}
                  color={Color.iconColor}
                />
              </View>
              <View style={{flex: 1, justifyContent: 'flex-start'}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    opacity: 0.6,
                  }}
                  text={deatilsresult?.Address}
                />
              </View>
            </View>
            <View style={{marginTop: 16}}>
              <AuthButton
                onPress={() =>
                  Linking.openURL(`tel:${deatilsresult?.CustomerContact}`)
                }
                title={HardCode.CALL}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setInfoMdoalVisible(!infoMdoalVisible)}
              style={{marginTop: 16}}>
              <Heading style={styles.heading} text={HardCode.CLOSE} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* STATUS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={statusMdoalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.eightteen,

                marginBottom: 4,
                textAlign: 'center',
              }}
              text={HardCode.ChangeStatus}
            />
            <RadioButtonRN
              initial={
                orderStatus === 'Confirmed'
                  ? 1
                  : orderStatus === 'Pending' || orderStatus === 'Preperaing'
                  ? 2
                  : 3
              }
              data={data}
              circleSize={10}
              activeColor={Color.btnBgColor}
              boxStyle={styles.radiobtn}
              textStyle={{
                ...styles.subHeading,

                fontSize: fontSize.fourteen,
              }}
              selectedBtn={e => setOrderStatusInHold(e.label)}
            />
            <View style={{marginTop: 16}}>
              <AuthButton
                onPress={() => {
                  // setStatus();
                  setOrderStatus(orderStatusInHold);
                  setStatusMdoalVisible(!statusMdoalVisible);
                }}
                title={HardCode.UPDATE}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setStatusMdoalVisible(!statusMdoalVisible)}
              style={{marginTop: 16}}>
              <Heading style={styles.heading} text={HardCode.CANCEL} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ASSIGN DELIVERY MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={assignDeliveryMdoalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <SubHeading
              style={{
                ...styles.subHeading,
                fontSize: fontSize.eightteen,
                textAlign: 'center',
                marginBottom: 18,
              }}
              text={HardCode.AssignDelivery}
            />
            {deliveryRidersData.map((val, key) => {
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.7}
                  onPress={() => {
                    setDeliveryMan(val.name);
                    setOrderStatus('Pending');
                    setAssignDeliveryMdoalVisible(!assignDeliveryMdoalVisible);
                    RiderID = val.Id;
                    //assignRider();
                    // alert(RiderID)
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{justifyContent: 'center'}}>
                      <View style={{height: 52, width: 52, borderRadius: 0}}>
                        <Image
                          source={{
                            uri: val.Logo,
                          }}
                          style={styles.image2}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        ...styles.subHeadingSubView,
                        marginLeft: 12,
                      }}>
                      <SubHeading
                        style={{
                          ...styles.subHeading,
                          color: '#29262A',
                        }}
                        text={val.FirstName + val.LastName}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.emptyView,
                      marginVertical: 6,
                      opacity: 0.3,
                    }}></View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                setAssignDeliveryMdoalVisible(!assignDeliveryMdoalVisible)
              }
              style={{marginTop: 16}}>
              <Heading style={styles.heading} text={HardCode.CLOSE} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={riderinfoMdoalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}>
              <View style={{...styles.subHeadingSubView}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    color: Color.btnBgColor,
                  }}
                  text={HardCode.DeliveryPerson}
                />
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.sixteen,
                  }}
                  text={
                    selectedRidersDetails?.FirstName +
                    selectedRidersDetails?.LastName
                  }
                />
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    fontSize: fontSize.twelve,

                    opacity: 0.4,
                  }}
                  text={selectedRidersDetails?.CreationDate?.split('T')[0]}
                />
              </View>
            </View>
            <View style={styles.emptyView}></View>
            <SubHeading
              style={{
                ...styles.subHeading,

                fontSize: fontSize.eightteen,

                marginBottom: 4,
              }}
              text={HardCode.CustomerInfo}
            />
            <View style={styles.iconView}>
              <View style={styles.iconView2}>
                <FontAwesome name="user" size={16} color={Color.iconColor} />
              </View>
              <View style={{...styles.subHeadingSubView}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    opacity: 0.6,
                  }}
                  text={
                    selectedRidersDetails?.FirstName +
                    selectedRidersDetails?.LastName
                  }
                />
              </View>
            </View>
            <View style={styles.iconView}>
              <View style={{...styles.iconView2, marginRight: 6}}>
                <Entypo name="phone" size={16} color={Color.iconColor} />
              </View>
              <View style={{...styles.subHeadingSubView}}>
                <SubHeading
                  style={{
                    ...styles.subHeading,
                    opacity: 0.6,
                  }}
                  text={selectedRidersDetails?.PhoneNumber}
                />
              </View>
            </View>
            {/* <View style={{flexDirection: 'row', marginTop: 6}}>
              <View style={{justifyContent: 'flex-start', marginRight: 6}}>
                <Ionicons name="location-sharp" size={16} color={Color.btnBgColor} />
              </View>
              <View style={{flex: 1, justifyContent: 'flex-start'}}>
                <SubHeading
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 13,
                    color: '#29262A',
                    opacity: 0.6,
                  }}
                  text=""
                />
              </View>
            </View> */}
            <View style={{marginTop: 16}}>
              <AuthButton
                onPress={() =>
                  Linking.openURL(`tel:${selectedRidersDetails?.PhoneNumber}`)
                }
                title={HardCode.CALL}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setriderInfoMdoalVisible(!riderinfoMdoalVisible)}
              style={{marginTop: 16}}>
              <Heading style={styles.heading} text={HardCode.CLOSE} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000d4',
    paddingHorizontal: 30,
  },
  modalView: {
    backgroundColor: '#FFF',
    borderRadius: 0,
    padding: 16,
    width: '100%',
  },
  mainView: {flex: 1, backgroundColor: '#EFF1F3'},
  view: {paddingHorizontal: 18, paddingVertical: 6},
  subHeadingMainView: {flexDirection: 'row', marginBottom: 8},
  subHeadingSubView: {flex: 1, justifyContent: 'center'},
  subHeading: {
    fontFamily: FontFamily.Medium,
    fontSize: fontSize.thirteen,
    color: '#29262A',
  },
  emptyView: {
    borderBottomColor: '#707070',
    borderBottomWidth: 1,
    marginVertical: 16,
    opacity: 0.4,
  },
  viewSubheading: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 0,
    padding: 12,
    marginTop: 12,
  },
  touchablesubheading: {
    backgroundColor: '#d8d8d8',
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  imgView: {height: 56, width: 56, borderRadius: 0},
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 0,
  },
  viewSubheading2: {
    backgroundColor: 'red',
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  views: {justifyContent: 'center', marginLeft: 14},
  image: {height: 50, width: 50, resizeMode: 'cover'},
  entypoView: {width: '100%', flexDirection: 'row'},
  heading: {color: Color.black, textAlign: 'center'},
  iconView: {flexDirection: 'row', marginTop: 6},
  radiobtn: {
    borderWidth: 0,
    paddingTop: 6,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  image2: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 0,
  },
  iconView2: {justifyContent: 'center', marginRight: 12},
});
