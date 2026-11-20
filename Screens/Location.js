import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StatusBar,
  SafeAreaView,
  Text,
  Linking,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';

import Color from '../Constants/Color';
// import {BaseUrl} from '../Components/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import * as AuthAction from '../Store/Auth/AuthAction';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';
import listeners from '../Constants/listeners';
import * as DataAction from '../Store/Data/DataAction';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
// import {getDistance, getPreciseDistance} from 'geolib';
import AuthButton from '../Components/UI-Support/AuthButton';
import IoIcon from '../Components/Icon/IoIcon';
import {fontSize, scalableheight} from '../Components/resposnevaraiable';
import FocusAwareStatusBar from '../Components/UI-Support/customStatusBar';
import {HardCode} from '../Constants/texting';

const Location = props => {
  //   console.log(props?.route?.params?.locationlat);
  //   console.log(props?.route?.params?.locationlong);
  //   console.log(route?.params?.id)

  return (
    <View style={Styles.main}>
      <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={{
          top: Platform.OS === 'ios' ? '7%' : '3%',
          ...Styles.touchable,
        }}>
        <IoIcon
          name="arrow-back"
          size={fontSize.twenty}
          color={Color.iconBlackColor}
        />
        <FocusAwareStatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
      </TouchableOpacity>

      <View style={Styles.mainView}>
        <MapView
          // provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          region={{
            latitude: props?.route?.params?.locationlat,
            longitude: props?.route?.params?.locationlong,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: props?.route?.params?.locationlat,
              longitude: props?.route?.params?.locationlong,
            }}></Marker>
        </MapView>
        {/* <TouchableOpacity >

        </TouchableOpacity> */}
        <View style={Styles.authBtnView}>
          <AuthButton
            onPress={() =>
              Linking.openURL(
                `http://www.google.com/maps/place/${props?.route?.params?.locationlat},${props?.route?.params?.locationlong}`,
              )
            }
            title={HardCode.DIRECTION}
          />
        </View>
      </View>
    </View>
  );
};

export default Location;
const Styles = StyleSheet.create({
  main: {flex: 1, backgroundColor: Color.bgColor},
  touchable: {
    left: '3%',
    position: 'absolute',
    zIndex: 1,
    padding: scalableheight.one,
  },
  mainView: {flex: 1},
  authBtnView: {
    padding: scalableheight.four,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
