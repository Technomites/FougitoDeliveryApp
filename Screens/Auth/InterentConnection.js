import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Color from '../../Constants/Color';
import AuthButton from '../../Components/UI-Support/AuthButton';
import NetInfo from '@react-native-community/netinfo';
import {useSelector} from 'react-redux';
import SubHeading from '../../Components/UI-Support/SubHeading';
import {fontSize, scalableheight} from '../../Components/resposnevaraiable';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import Feather from 'react-native-vector-icons/Feather';
import useLayout from '../../Components/useLayout';
import { C, F, B } from '../../Constants/tokens';

const InterentConnection = props => {
  const internetConnectionStatus = useSelector(
    state => state.data.internetConnectionStatus,
  );

  const internetBackscreenname = useSelector(
    state => state.data.internetPerviousScreen,
  );
  //const [checkinterent, setcheckinterent] = useState(false);
  //const {screenname} = props.route.params;
  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     const unsubscribe = NetInfo.addEventListener(state => {
  //       if (state.isConnected === true) {
  //         setcheckinterent(true);
  //       }
  //     });
  //   });

  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   if (internetConnectionStatus === true) {
  //     props.navigation.replace(internetBackscreenname);
  //     //setcheckinterent(false);
  //   }
  //   //  setcheckinterent(false);
  // }, [internetConnectionStatus]);

  const layout = useLayout();
  const phone = layout === 'phone';
  const landscape = layout === 'tabletLandscape';
  const head = landscape ? 96 : phone ? 56 : 88;

  return (
    internetConnectionStatus == false && (
      <SafeAreaView style={style.mainView}>
        <FocusAwareStatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />

        <View
          style={[
            style.LottieMainView,
            landscape
              ? { paddingVertical: 48, paddingHorizontal: 56 }
              : phone
                ? { paddingVertical: 28, paddingHorizontal: 20 }
                : { paddingVertical: 56, paddingHorizontal: 48 },
          ]}>
          <Image
            source={require('../../assets/Images/fougito_logo.png')}
            resizeMode="contain"
            style={{ height: phone ? 24 : 32, width: (phone ? 24 : 32) * (150 / 70) }}
          />
          <View style={[style.subHeadingView]}>
            <View style={style.LottieSubView}>
              <Feather name="wifi-off" size={32} color={C.surface} />
            </View>
            <SubHeading
              style={[
                style.subHeading,
                { fontSize: head, lineHeight: head, letterSpacing: -0.03 * head },
              ]}
              text={HardCode.Offline}
            />
            <View style={style.rule} />
            <SubHeading
              style={style.subHeading2}
              text={HardCode.SlowOrNoInternetConnection}
            />
            <SubHeading
              style={style.subHeading3}
              text={HardCode.PleaseCheckYourInternetConnectionAndTryAgain}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  );
};
export default InterentConnection;

const style = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: C.ground,
  },
  LottieMainView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  LottieSubView: {
    width: 72,
    height: 72,
    backgroundColor: C.ink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeadingView: {
    gap: 20,
    maxWidth: 640,
  },
  subHeading: {
    fontFamily: F.black,
    color: C.ink,
  },
  rule: { height: B.rule, backgroundColor: C.ink, alignSelf: 'stretch' },
  subHeading2: {
    fontFamily: F.bold,
    fontSize: 20,
    letterSpacing: 0,
    color: C.ink,
  },
  subHeading3: {
    fontFamily: F.medium,
    fontSize: 16,
    letterSpacing: 0,
    color: C.muted,
  },
});
