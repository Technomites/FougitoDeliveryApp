import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import BackHeader from '../../Components/UI-Support/BackHeader';
import ActiveRequestTile from '../../Components/UI-Support/ActiveRequestTile';
import { useSelector, useDispatch } from 'react-redux';
import SubHeading from '../../Components/UI-Support/SubHeading';
// import { BaseUrl } from '../../Components/BaseUrl';
import DateBackHeader from '../../Components/UI-Support/DateBackHeader';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from '../../Constants/Color';
import { commonStylying } from '../../Constants/AddWrapper';
import { FontFamily } from '../../Constants/fonts';
import { HardCode } from '../../Constants/texting';
import { Safeareacontext } from '../../Components/SafeAreaContext';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import { useGrid, useBottomInset } from '../../Components/useLayout';
import { C, F, refreshControlColors } from '../../Constants/tokens';

export default function DeliveredOrders(props) {
  const [noorderData, setnoorderData] = useState(false);
  const [date, setDate] = useState(new Date(), 'day');
  const [filterDate, setFilterDate] = useState(false);
  const [isFetchingLoader, setIsFetchingLoader] = useState(false);

  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [allorders, setallorders] = useState([]);
  const [allDelivireis, setAllDelivireis] = useState([]);

  const dispatch = useDispatch();
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const userInfo = useSelector(state => state.auth.userInfo);
  const userSuccessData = useSelector(state => state.auth.userSuccessData);

  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );

  useEffect(() => {
    GetAlloldOrders();
  }, []);

  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

  const GetAlloldOrders = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      paging: {
        search: '',
        pageNumber: 1,
        pageSize: 100,
      },

      deliveryStaffId: userSuccessData?.Result?.RestaurantDeliveryStaff?.Id,

      requireNewOrders: false,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}Partner/DeliveryStaff/Order`, requestOptions)
      .then(response => response.json())
      .then(async result => {
        setIsFetching(false);
        setIsFetchingLoader(false);
        if (result.Status === 'Success') {
          const toadyDate = new Date();
          console.log(JSON.stringify(result), 'YAHOOOO');

          if (result?.Result.length === 0) {
            setnoorderData(true);
          } else {
            setnoorderData(false);
          }

          // let resdata = await result?.Result.filter(i =>
          //   moment(i.OrderPlacementDateTime).isSame(new Date(), 'day'),
          // );
          setAllDelivireis(result?.Result);
        }
        console.log(JSON.stringify(allDelivireis) + 'njdjjd');
      })

      .catch(error => {
        setIsFetching(false);
        console.log('error', error);
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
      });
  };

  const onRefresh = () => {

    setIsFetching(true);
    setIsFetchingLoader(true);
    setAllDelivireis([]);
    GetAlloldOrders();
  };

  const grid = useGrid();
  const bottomInset = useBottomInset();

  return (
    <View style={[style.animatedView, props.drawerAnimationStyle]}>
      <SafeAreaView style={style.mainView}>

        <FocusAwareStatusBar
          style={style.statusStrip}
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />

        <BackHeader
          onPress={() => props.navigation.goBack()}
          title={HardCode.MyDeliveries}
          // refresh={true}
          onClick={() => {
            setIsFetching(true);

            GetAlloldOrders();
          }}
          filter={false}
        />
        {allDelivireis.length === 0 ? (
          !isFetchingLoader ? (
            <TouchableOpacity
              onPress={onRefresh}
              style={style.noorderDataView}>
              <SubHeading
                style={style.subHeading}
                text={HardCode.ThereAreNoDelieveredOrdersInTheList}
              />
              <FontAwesome
                name="refresh"
                size={20}
                color={C.muted}
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
          <View style={style.flatListView}>
            <FlatList
              key={`delivered-grid-${grid.columns}`}
              numColumns={grid.columns}
              columnWrapperStyle={grid.columns > 1 ? { gap: grid.gap } : undefined}
              ItemSeparatorComponent={() => <View style={{ height: grid.gap }} />}
              contentContainerStyle={{
                paddingHorizontal: grid.gutter,
                paddingTop: grid.padTop,
                paddingBottom: 24 + bottomInset,
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
              data={allDelivireis}
              showsVerticalScrollIndicator={false}
              style={style.flatlist}
              renderItem={({ item, i }) => (
                <ActiveRequestTile
                  style={{ width: grid.tileW }}
                  onModelPopUp={() => {
                    props.navigation.navigate('OrderDetail', {
                      orderId: item.Id,
                      pastOrde: true,
                    });
                  }}
                  status={
                    item.Status === 'Delivered'
                      ? HardCode.Delivered
                      : HardCode.NotDelivered
                  }
                  onPress={() =>
                    props.navigation.navigate('OrderDetail', {
                      orderId: item.Id,
                      pastOrde: true,
                    })
                  }
                  deatils={item}
                  Currency={userInfo?.Result?.RestaurantBranch?.Currency}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
        <DateTimePickerModal
          isVisible={filterDate}
          mode="date"
          maximumDate={new Date(Date.now())}
          onConfirm={time => {
            setDate(time);
            onRefresh();
            setFilterDate(false);
          }}
          onCancel={() => {
            setFilterDate(false);
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const style = StyleSheet.create({
  animatedView: { flex: 1, overflow: 'hidden', backgroundColor: C.ground },
  mainView: { flex: 1, backgroundColor: C.ground },
  statusStrip: { backgroundColor: C.surface },
  noorderDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 24,
  },
  subHeading: {
    fontFamily: F.medium,
    fontSize: 16,
    letterSpacing: 0,
    color: C.muted,
    textAlign: 'center',
    alignSelf: 'center',
  },
  flatListView: {
    width: '100%',
    flex: 1,
  },

  flatlist: {
    width: '100%',
  },
});
