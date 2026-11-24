import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Color from '../../Constants/Color';
import IoIcon from '../../Components/Icon/IoIcon';
import SubHeading from '../../Components/UI-Support/SubHeading';
import Paragraph from '../../Components/UI-Support/Paragraph';
import BackHeader from '../../Components/UI-Support/BackHeader';
import MaIcon from '../../Components/Icon/MaIcon';
import { useDispatch, useSelector } from 'react-redux';
// import { BaseUrl } from '../../Components/BaseUrl';
import SuccessModalPopup from '../../Components/UI-Support/SuccessModalPopup';
import PopUpModel from '../../Components/UI-Support/PopUpModel';
import ErrorModel from '../../Components/UI-Support/ErrorPopUpModel';

import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import { FontFamily } from '../../Constants/fonts';
import { commonStylying } from '../../Constants/AddWrapper';
import { HardCode } from '../../Constants/texting';
import { Safeareacontext } from '../../Components/SafeAreaContext';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import Feather from 'react-native-vector-icons/Feather';
import { CountChip } from '../../Components/UI-Support/BackHeader';
import { useDevice, useBottomInset } from '../../Components/useLayout';
import { C, F, B, refreshControlColors } from '../../Constants/tokens';

const MyNotification = props => {
  const [offsetproperty, setOffsetproperty] = useState(1);
  const [myNotoficationData, setmyNotoficationData] = useState([]);
  const [notificationSet, setnotificationSet] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [refresh, setIsRefresh] = useState(false);
  const dispatch = useDispatch();

  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );

  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

  useEffect(() => {
    getNotification(offsetproperty);
  }, [offsetproperty]);

  useEffect(() => {
    // const subscribe = props.navigation.addListener('focus', () => {
    setIsRefresh(true);
    Notification();
    // });
    // return subscribe;
  }, []);

  const Notification = () => {
    try {
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

      fetch(`${BaseUrl}Notification/MarkAllSeen/ByUser`, requestOptions)
        .then(response => response.json())

        .then(result => {
          console.log(result, 'resultresult');
          if (result.Status === 'Success') {
            console.log(result, 'Notification api ');
          }
        })
        .catch(error => {
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          console.log('error', error)
        });
    } catch (error) {
      console.log(error);
    }
  };
  function LoadMoreNotfifcations() {
    // Only ask for the next page when the last one was full (pageSize 50).
    if (Array.isArray(notificationSet) && notificationSet.length >= 50) {
      setOffsetproperty(offsetproperty + 1);
    }
  }

  const getNotification = pageSize => {
    //alert(pageSize);
    // setIsRefresh(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var raw = JSON.stringify({
      paging: {
        search: '',
        pageNumber: pageSize,
        pageSize: 50,
      },
      period: 'Today',
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}Notification/GetAll/ByUser`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);

        if (result.Status === 'Success') {
          setIsRefresh(false);
          setnotificationSet(result.Result);
          // Functional update + de-dup by Id so paging/refresh never double-counts.
          setmyNotoficationData(prev => {
            const base = pageSize === 1 ? [] : prev;
            const seen = new Set(base.map(n => n.Id));
            return [...base, ...(result.Result || []).filter(n => !seen.has(n.Id))];
          });
          console.log(JSON.stringify(result.Result), 'HELLOWWW');
          //toast.current.hideAll();
          //toast.current.show(result?.Message);
        } else {
          setIsRefresh(false);
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

  const OnClickNotification = (id, index) => {
    let newArr = [...myNotoficationData];
    // alert(newArr[0].IsRead);
    //alert(index + 'id' + id);
    newArr[index] = { ...newArr[index], IsRead: true, IsSeen: true };

    setmyNotoficationData(newArr);
    notificationRead(id);
  };
  const notificationRead = id => {
    //  alert(id);

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );
    0;
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      //body: raw,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}Notification/MarkRead/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.Status === 'Success') {
          // alert('success');
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

  const fetchData = () => {
    setIsFetching(false);
    // Reload page 1 directly (setting the offset 10000 -> 1 got batched into a no-op).
    setOffsetproperty(1);
    getNotification(1);
  };

  const onRefresh = () => {
    setIsRefresh(true);
    setIsFetching(true);
    fetchData();
  };

  const { gutter, isPhone } = useDevice();
  const bottomInset = useBottomInset();
  const unseenCount = myNotoficationData.filter(n => !n.IsRead).length;

  const renderList = ({ item, index }) => {
    const unread = item.IsRead === false;
    return (
      <TouchableOpacity
        onPress={() => {
          OnClickNotification(item.Id, index);
          props.navigation.navigate('OrderDetail', {
            orderId: item.Notification.RecordId,
            pastOrde: true,
          });
        }}
        style={[style.renderlistTouchable, unread && style.unreadRow]}>
        <View
          style={[
            style.renderlistIconSubView,
            unread ? style.iconUnread : style.iconRead,
          ]}>
          <Feather
            name="bell"
            size={20}
            color={unread ? C.accentDeep : C.muted}
          />
        </View>
        <View style={style.renderlistParaMainView}>
          <SubHeading
            style={[
              style.renderlistsubHeading,
              { fontFamily: unread ? F.black : F.bold },
            ]}
            text={item.Notification.Title}
          />
          <Paragraph
            style={style.body}
            numberOfLines={2}
            text={item.Notification.Description}
          />
        </View>
        <View style={style.renderlistsubHeadingView}>
          <Paragraph
            style={style.time}
            text={item.Notification.FormattedDate}
          />
          {item.IsRead === false ? (
            <View style={style.renderlistEmptyView}></View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={style.mainView}>
      <FocusAwareStatusBar
        style={style.statusStrip}
        barStyle={'dark-content'}
        backgroundColor="transparent"
      />
      <BackHeader
        onPress={() => props.navigation.goBack()}
        title={HardCode.Notifications}
        right={unseenCount > 0 ? <CountChip value={unseenCount} /> : null}
        onClick={() => {
          setIsRefresh(true);
          onRefresh();
        }}
      />

      <View style={style.flatlistMainView}>
        {refresh === true ? (
          <View style={style.indicator}>
            <ActivityIndicator size={'large'} color={Color.loaderColor} />
          </View>
        ) : (
          <View style={style.flatlistSubView}>
            {myNotoficationData.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={myNotoficationData}
                refreshControl={
                  <RefreshControl
                    colors={refreshControlColors.colors}
                    tintColor={refreshControlColors.tintColor}
                    progressBackgroundColor={refreshControlColors.progressBackgroundColor}
                    refreshing={isFetching}
                    onRefresh={onRefresh}
                  />
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderList}
                onEndReached={() => LoadMoreNotfifcations()}
                onEndReachedThreshold={0.1}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{
                  paddingHorizontal: gutter,
                  paddingTop: isPhone ? 16 : 24,
                  paddingBottom: 24 + bottomInset,
                }}
              />
            ) : (
              <View style={style.noorderDataView}>
                <SubHeading
                  style={style.subHeading}
                  text={HardCode.ThereAreNoNotificationsInTheList}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default MyNotification;
const style = StyleSheet.create({
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderlistTouchable: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    borderLeftWidth: B.heavy,
    borderLeftColor: C.rule,
  },
  unreadRow: { borderLeftColor: C.accent },
  renderlistIconSubView: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconUnread: { backgroundColor: C.overdueBg },
  iconRead: { backgroundColor: C.disabled },
  renderlistParaMainView: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  renderlistsubHeadingView: {
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '32%',
  },
  renderlistsubHeading: {
    fontSize: 16,
    letterSpacing: 0,
    color: C.ink,
  },
  body: {
    color: C.muted,
    fontSize: 14,
    fontFamily: F.medium,
  },
  time: {
    color: C.muted,
    fontSize: 13,
    fontFamily: F.bold,
    textAlign: 'right',
  },
  renderlistEmptyView: {
    height: 8,
    width: 8,
    backgroundColor: C.accent,
  },
  mainView: { flex: 1, backgroundColor: C.ground },
  statusStrip: { backgroundColor: C.surface },
  flatlistMainView: {
    flex: 1,
    width: '100%',
  },
  flatlistSubView: {
    flex: 1,
    width: '100%',
  },
  subHeading: {
    fontFamily: F.medium,
    fontSize: 16,
    letterSpacing: 0,
    color: C.muted,
    textAlign: 'center',
    alignSelf: 'center',
  },
  noorderDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 24,
  },
});
