import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { useSelector } from 'react-redux';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import { C, F, B } from '../../Constants/tokens';
import { useDevice } from '../useLayout';
import IconSquare from './IconSquare';

// Home header: ink menu square, spacer, bell square with accent count badge.
const MainHeader = props => {
  const [Notifation, SetNotification] = useState();
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const { isPhone, gutter, homeHeader } = useDevice();

  useEffect(() => {
    GetNotification();
  }, []);

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

    fetch(`${BaseUrl}Notification/NewNotificationCount/ByUser`, requestOptions)
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

  return (
    <SafeAreaView style={Styles.safe}>
      <View
        style={[
          Styles.main,
          { height: homeHeader, paddingHorizontal: gutter },
        ]}>
        <IconSquare name="menu" variant="ink" onPress={props.onPress} />

        <View style={Styles.spacer} />

        <IconSquare
          name="bell"
          onPress={props.onNotification}
          style={Styles.bell}>
          {props?.Notifation >= 0 && (
            <View style={Styles.notifationView}>
              <Text style={Styles.notifationText}>{props?.Notifation}</Text>
            </View>
          )}
        </IconSquare>
      </View>
    </SafeAreaView>
  );
};
export default MainHeader;
const Styles = StyleSheet.create({
  safe: { backgroundColor: C.surface },
  main: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
  },
  spacer: { flex: 1 },
  bell: { overflow: 'visible' },
  notifationView: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    backgroundColor: C.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifationText: {
    fontSize: 12,
    fontFamily: F.black,
    color: C.surface,
    fontVariant: ['tabular-nums'],
  },
});
