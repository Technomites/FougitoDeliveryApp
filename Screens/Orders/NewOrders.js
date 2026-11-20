import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import BackHeader from '../../Components/UI-Support/BackHeader';
import SubHeading from '../../Components/UI-Support/SubHeading';
import ActiveRequestTile from '../../Components/UI-Support/ActiveRequestTile';
import DatePicker from '../../Components/UI-Support/DatePicker';
import AuthButton from '../../Components/UI-Support/AuthButton';
import { useSelector, useDispatch } from 'react-redux';
// import { BaseUrl } from '../../Components/BaseUrl';
import Pickpop from '../../Components/UI-Support/Pickpop';
import Reasonpopup from '../../Components/UI-Support/Reasonpopup';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from '../../Constants/Color';
import { commonStylying } from '../../Constants/AddWrapper';
import * as DataAction from '../../Store/Data/DataAction';
import { FontFamily } from '../../Constants/fonts';
import { HardCode } from '../../Constants/texting';
import { Safeareacontext } from '../../Components/SafeAreaContext';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import { CountChip } from '../../Components/UI-Support/BackHeader';
import { useGrid, useBottomInset } from '../../Components/useLayout';
import { C, F, refreshControlColors } from '../../Constants/tokens';

export default function NewOrders(props) {
  const userInfo = useSelector(state => state.auth.userInfo);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [allorders, setallorders] = useState([]);
  const [Pickedup, setPickedup] = useState(false);
  const [Reasoningpopup, setReasoningPopup] = useState(false);
  const [isFetchingLoader, setIsFetchingLoader] = useState(false);

  const [typeState, SetTypeState] = useState('pickup');
  const [loader, setLoader] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonLoader, setReasonLoader] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [noorderData, setnoorderData] = useState(false);

  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     GetAllNewOrders();
  //   });

  //   const subscribe = props.navigation.addListener('blur', () => {
  //     setPage(1);
  //     setallorders([]);
  //   });
  //   return unsubscribe, subscribe;
  // }, []);

  useEffect(() => {
    GetAllNewOrders();
  }, []);

  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

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

    fetch(`${BaseUrl}Partner/DeliveryStaff/Order`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.Status === 'Success') {
          setIsFetching(false);
          setIsFetchingLoader(false);
          //alert('success');

          // if (result.Result.length === 0 && allorders.length === 0) {
          //   // alert('length is 1');
          //   setnoorderData(true);
          // }
          if (result?.Result.length === 0 && allorders.length === 0) {
            // alert('length is 1');
            setnoorderData(true);
          } else {
            setnoorderData(false);
          }
          //setallorders(result?.Result);
          setallorders(result?.Result);
          // console.log(
          //   allorders,
          //   'allorders allorders allorders allorders allorders',
          // );
        }
      })

      .catch(error => {
        setIsFetching(false);
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
      // toast.current.show('Please enter a reason first');
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
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          // toast.current.show(error);
          dispatch(DataAction.ToastMessageSenderScreenAction(error));

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
      .catch(error =>{
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)});
  };

  // const fetchData = () => {
  //   // dispatch(DataAction.ClearALlSparePart());
  //   setallorders([]);
  //   setIsFetching(false);
  //   setPage(10000);
  //   setTimeout(() => {
  //     setPage(page * 0 + 1);
  //   }, 700);
  // };

  const onRefresh = () => {
    setIsFetching(true);
    setIsFetchingLoader(true);
    setallorders([]);
    GetAllNewOrders();
  };

  const grid = useGrid();
  const bottomInset = useBottomInset();

  return (
    <View style={[style.animatedView, props.drawerAnimationStyle]}>
      <SafeAreaView style={style.safeareaView}>

        <FocusAwareStatusBar
          style={style.statusStrip}
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
        <BackHeader
          onPress={() => props.navigation.goBack()}
          title={HardCode.NewOrders}
          // refresh={true}
          onClick={() => {
            setIsFetching(true);
            GetAllNewOrders();
          }}
          filter={false}
          right={<CountChip value={allorders.length} />}
        />

        {allorders.length === 0 ? (
          !isFetchingLoader ? (
            <TouchableOpacity
              style={style.subheadingView}
              onPress={onRefresh}>
              <SubHeading
                style={style.subheading}
                text={HardCode.ThereAreNoNewOrdersInTheList}
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
              style={style.subheadingView}
            />
          )
        ) : (
          <View style={style.flatlistView}>
            <FlatList
              key={`new-grid-${grid.columns}`}
              data={allorders}
              numColumns={grid.columns}
              //data={dummydata}
              showsVerticalScrollIndicator={false}
              style={style.flatlist}
              columnWrapperStyle={grid.columns > 1 ? { gap: grid.gap } : undefined}
              ItemSeparatorComponent={() => <View style={{ height: grid.gap }} />}
              contentContainerStyle={{
                paddingHorizontal: grid.gutter,
                paddingTop: grid.padTop,
                paddingBottom: 24 + bottomInset,
              }}
              renderItem={({ item, i }) => {
                const changestatus = () => {
                  if (item?.Status === 'FoodReady') {
                    SetTypeState('Picked up');
                    setSelectedItem(item);
                    setPickedup(true);
                  } else {
                    SetTypeState('delivered');
                    setSelectedItem(item);
                    setPickedup(true);
                  }
                };
                return (
                  <ActiveRequestTile
                    style={{ width: grid.tileW }}
                    onPress={() =>
                      props.navigation.navigate('OrderDetail', {
                        orderId: item.Id,
                        pastOrde: true,
                      })
                    }
                    onModelPopUp={changestatus}
                    deatils={item}
                    Currency={userInfo?.Result?.RestaurantBranch?.Currency}
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
          </View>
        )}
      </SafeAreaView>
      <Pickpop
        loader={loader}
        visible={Pickedup}
        // visible={true}
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
        // visible={true}
        onChangeText={text => {
          setReason(text);
        }}
        onSubmit={onReasonApi}
        onNoPress={() => {
          setReasoningPopup(false);
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  animatedView: { height: '100%', overflow: 'hidden', backgroundColor: C.ground },
  safeareaView: { height: '100%', width: '100%', backgroundColor: C.ground },
  statusStrip: { backgroundColor: C.surface },
  subheadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 24,
  },
  subheading: {
    fontFamily: F.medium,
    fontSize: 16,
    color: C.muted,
    letterSpacing: 0,
    textAlign: 'center',
    alignSelf: 'center',
  },
  flatlistView: {
    width: '100%',
    flex: 1,
  },
  flatlist: {
    width: '100%',
    height: '100%',
  },
});
