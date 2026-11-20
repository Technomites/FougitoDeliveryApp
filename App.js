import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, Modal, Linking, Platform, PermissionsAndroid} from 'react-native';
import MainNavigation from './Navigaor/MainNavigation';
import MainNavigator from './Navigaor/MainNavigator';
import Color from './Constants/Color';
import AuthButton from './Components/UI-Support/AuthButton';
import {useSelector, useDispatch} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import AuthReducer from './Store/Auth/AuthReducer';
import {ToastProvider} from 'react-native-toast-notifications';
import {OrderDetail} from './Screens/Orders/OrderDetail';
import checkVersion from 'react-native-store-version';
import DeviceInfo from 'react-native-device-info';
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';
import DataReducer from './Store/Data/DataReducer';
import OTPVerificationScreen from './Screens/Auth/OTPVerificationScreen';
import InterentConnection from './Screens/Auth/InterentConnection';
import ToastMessage from './Components/UI-Support/Toast';
import {FontFamily} from './Constants/fonts';
import {HardCode} from './Constants/texting';
import {C, F, B} from './Constants/tokens';
import NavBarFrame from './Components/NavBarFrame';
import RefreshToken from './Screens/RefreshToken';
import LocationConnectionComponent from './Screens/Auth/LocationConnectionComponent';
import messaging from '@react-native-firebase/messaging'; 
import notifee, { AndroidImportance } from '@notifee/react-native';
const rootReducer = combineReducers({
  auth: AuthReducer,
  data: DataReducer,

  // STAFF
  // staffData: StaffDataReducer,
});

const Store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = () => {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const check = await checkVersion({
          version: DeviceInfo.getVersion(),
          iosStoreURL:
            'https://apps.apple.com/pk/app/fougito-deliver/id1635331954',
          androidStoreURL:
            'https://play.google.com/store/apps/details?id=com.fougitodeliver',
          country: 'jp', // default value is 'jp'
        });
        if (check.result === 'new') {
          //////// if app store version is new
          setModal(true);
        } else {
        }
      } catch (e) {
        console.log(e);
      }
    };

    init();
  }, []);

  useEffect(() => {
    // The nav bar is no longer hidden at launch: immersive-sticky mode let it
    // slide over the app on swipe. It stays visible and NavBarFrame reserves
    // its space; screens set the strip tone (red on Splash, white after).
  }, []);
    useEffect(() => {
    requestNotificationPermission();
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
      });
    });
      return unsubscribe;
  }, []);
async function requestNotificationPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission({
      alert: true,
      announcement: true,
      badge: true,
      sound: true,
    });
 
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
 
    console.log('iOS Permission Status:', enabled);
  }
 
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('Android Permission:', granted);
  }
 
  await notifee.createChannel({
    id: 'default',
    name: 'default',
    importance: AndroidImportance.HIGH,
  });
}
 

  const openUrl = (androidurl, iosurl) => {
    Platform.OS === 'ios'
      ? Linking.canOpenURL(iosurl).then(
          supported => {
            supported && Linking.openURL(iosurl);
          },
          err => console.log(err),
        )
      : Linking.openURL(androidurl).catch(err => console.error('Error', err));
  };

  return (
    <Provider store={Store}>
      <NavBarFrame>
      <ToastProvider>
        <MainNavigation />
        <InterentConnection />
        {/* <LocationConnectionComponent /> */}
        <ToastMessage />
      </ToastProvider>
      </NavBarFrame>
      <Modal visible={modal} transparent={true} statusBarTranslucent supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.modalMainContainer}>
          <View style={styles.modalCardView}>
            <View style={styles.modalImage}>
              <Image
                style={styles.image}
                resizeMode="contain"
                source={require('./assets/Images/downarrow.png')}
              />
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.modalText}>{HardCode.UpdateRequired}</Text>
              <Text
                style={[
                  styles.modalText,
                  {
                    fontFamily: FontFamily.Medium,
                    fontSize: 18,
                    marginBottom: 25,
                    paddingHorizontal: 13,
                  },
                ]}>
                {
                  HardCode.WeHaveAddedNewFeaturesAndFixSomeBugsToMakeYourExperienceSeamless
                }
              </Text>
            </View>
            <View>
              <AuthButton
                title={HardCode.UpdateApp}
                onPress={() => {
                  openUrl(
                    'https://play.google.com/store/apps/details?id=com.fougitodeliver',
                    'https://apps.apple.com/pk/app/fougito-deliver/id1635331954',
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Provider>
  );
};
const styles = StyleSheet.create({
  modalMainContainer: {
    flex: 1,
    backgroundColor: C.scrim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCardView: {
    backgroundColor: C.surface,
    width: '90%',
    maxWidth: 440,
    borderWidth: B.rule,
    borderColor: C.ink,
    padding: 20,
  },
  modalImage: {
    height: 79,
    width: 65,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  modalText: {
    fontFamily: F.black,
    fontSize: 24,
    marginBottom: 12,
    color: C.ink,
    textAlign: 'center',
  },
  image: {height: 79, width: 65},
});

export default App;
