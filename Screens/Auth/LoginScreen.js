import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';
import Color from '../../Constants/Color';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import SubHeading from '../../Components/UI-Support/SubHeading';
import NumberInput from '../../Components/UI-Support/NumberInput';
import MyFormInputTile from '../../Components/UI-Support/MyFormInputTile';
import AuthButton from '../../Components/UI-Support/AuthButton';
import PopUpModel from '../../Components/UI-Support/PopUpModel';
import * as AuthAction from '../../Store/Auth/AuthAction';
import CountryPicker from 'react-native-country-picker-modal';
import * as DataAction from '../../Store/Data/DataAction';
import { useDispatch, useSelector } from 'react-redux';
//import Loader from '../../Components/UI-Support/Loader';
import ErrorPopUpModel from '../../Components/UI-Support/ErrorPopUpModel';
// import {BaseUrl, } from '../../Components/BaseUrl';
import { request, PERMISSIONS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import { commonStylying } from '../../Constants/AddWrapper';
import { FontFamily } from '../../Constants/fonts';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HardCode } from '../../Constants/texting';
import DeviceInfo from 'react-native-device-info';
import { _setBaseUrlToggle, BaseUrl, SetUrlConst } from '../../Components/BaseUrl';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthBrandPane from '../../Components/UI-Support/AuthBrandPane';
import useLayout from '../../Components/useLayout';
import { C, F, B } from '../../Constants/tokens';
import { setNavBarTone } from '../../Components/NavBarFrame';

const LoginScreen = props => {
  const [role, setRole] = useState('Sta');
  const [phoneNumber, setphoneNumber] = useState('');
  const [secure, setSecure] = useState(false);
  const [hiddencounter, sethiddencounter] = useState(0);
  const [password, setPassword] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [url, seturl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const phoneInput = useRef(null);
  const [sign, setSign] = useState('');
  const [countryCode, setCountryCode] = useState('971');
  const [country, setCountry] = useState('AE');
  const [visible, setVisible] = useState(false);
  const region = useSelector(state => state.auth.region);

  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.role);
  const loader = useSelector(state => state.auth.loader);
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const userErrorData = useSelector(state => state.auth.userErrorData);
  const rnBiometrics = new ReactNativeBiometrics();


  useEffect(() => {

    setCountry(region?.country)
    setCountryCode(region?.countryCode)
  }, [region]);

  useEffect(() => {
    if (userErrorData) {
      setErrorModal(true);
      setErrorMessage(userErrorData?.Message);
    }
  }, [userErrorData]);

  useEffect(() => {
    if (userSuccessData) {
      AsyncStorage.setItem('keyFlag', countryCode);
      AsyncStorage.setItem('Flag', country);
      //  if (userRole === 'ServiceStaff') {
      //props.navigation.replace('StaffNavigator');
      props.navigation.replace('Drawer');
    }
  }, [userSuccessData]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (!hasPermission) {
            const result = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
            console.log('Notification permission:', result);
          }
        } catch (e) {
          console.log('Permission error:', e);
        }
        changeNavigationBarColor('#FFFFFF', true);
      }
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    toggleUrl();
  }, [hiddencounter]);

  // White strip + dark icons behind the nav bar on Login.
  useEffect(() => {
    const setTone = () => {
      setNavBarTone(C.surface);
      if (Platform.OS === 'android') {
        changeNavigationBarColor('#FFFFFF', true);
      }
    };
    setTone();
    return props.navigation.addListener('focus', setTone);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fingerPrintKeyChecker();
    });

    const subscribe = props.navigation.addListener('blur', () => { });
    return unsubscribe, subscribe;
  }, []);
  console.log(BaseUrl, 'p');

  const toggleUrl = async () => {
    const liveUrl = country === 'GB'
      ? 'https://api.fougito.uk/api/'
      : 'https://api.fougito.com/api/'
    if (hiddencounter === 10) {
      const url =
        BaseUrl === liveUrl
          ? 'https://api.fougitodemo.com/api/'
          : liveUrl;
      const urlType = url === liveUrl ? 'LIVE' : 'DEMO';
      _setBaseUrlToggle(url);
      console.log(url, 'URLLLRLLR');
      await AsyncStorage.setItem('serverurl', JSON.stringify(url));
      dispatch(AuthAction.resetuserurl(url));
      dispatch(DataAction.ToastMessageSenderScreenAction(urlType));
      sethiddencounter(0);
    }
  };


  const getFlagCode = async () => {
    let CountryFlag = await AsyncStorage.getItem('keyFlag');
    let Flag = await AsyncStorage.getItem('Flag');
    if (CountryFlag != null && CountryFlag != '') {
      setCountryCode(CountryFlag);
      setCountry(Flag && Flag ? Flag : 'AE');
    }
  };

  const fingerPrintKeyChecker = () => {
    rnBiometrics.biometricKeysExist().then(resultObject => {
      const { keysExist } = resultObject;
      if (keysExist) {
        console.log('Keys exist');
        fingerprint();
      }
    });
  };

  const loginuser = async () => {
    let deviceId = await DeviceInfo.getUniqueId();

    const fingerprintvalue = JSON.parse(
      await AsyncStorage.getItem('fingerprint'),
    );
    console.log(fingerprintvalue, 'fingerprintvaluefingerprintvalue');
    setphoneNumber(fingerprintvalue.number);
    setPassword(fingerprintvalue.password);
    console.log(fingerprintvalue);
    console.log(fingerprintvalue);

    dispatch(
      AuthAction.UserLoginAction(
        fingerprintvalue.number,
        fingerprintvalue.password,
        deviceId,
        fingerprintvalue.code,
      ),
    );
  };

  const fingerprint = async () => {
    rnBiometrics.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === BiometryTypes.TouchID) {
        console.log('TouchID is supported');
      } else if (available && biometryType === BiometryTypes.FaceID) {
        console.log('FaceID is supported');
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        rnBiometrics.biometricKeysExist().then(resultObject => {
          const { keysExist } = resultObject;
          if (keysExist) {
            console.log('Keys exist');
            rnBiometrics
              .simplePrompt({ promptMessage: HardCode.ConfirmFingerprint })
              .then(resultObject => {
                const { success } = resultObject;
                if (success) {
                  console.log('successful biometrics provided');
                  loginuser();
                } else {
                  console.log('user cancelled biometric prompt');
                }
              })
              .catch(() => {
                console.log('biometrics failed');
              });
          } else {
            props.navigation.navigate('FingerPrintAuthentication');
            console.log('Keys do not exist or were deleted');
          }
        });
        console.log('Biometrics is supported');
      } else {
        dispatch(
          DataAction.ToastMessageSenderScreenAction(
            HardCode.BiometricsNotSupported,
          ),
        );
        console.log('Biometrics not supported');
      }
    });
  };

  const layout = useLayout();
  const landscape = layout === 'tabletLandscape';
  const phone = layout === 'phone';
  // Real notch / Dynamic Island height (the lookup table misses new iPhones).
  const topInset = useSafeAreaInsets().top;

  return (
    <TouchableOpacity
      onPress={Keyboard.dismiss}
      activeOpacity={1}
      style={styles.maincontainer}>
      <View style={[styles.frame, landscape && styles.frameRow]}>
        <View style={styles.statusBarHolder}>
          <FocusAwareStatusBar
            barStyle={landscape ? 'dark-content' : 'light-content'}
            backgroundColor="transparent"
          />
        </View>
        <AuthBrandPane title={HardCode.Deliver} topInset={topInset} />

        <KeyboardAvoidingView
          style={styles.formSide}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {visible && (
            <CountryPicker
              withEmoji
              withFlag
              withFilter
              modalProps={{
                supportedOrientations: ['portrait', 'landscape'],
              }}
              withCallingCode
              onClose={() => {
                setVisible(false);
              }}
              onSelect={async code => {
                console.log(code);
                setphoneNumber('');
                dispatch(AuthAction.SetRegionAction({ country: code.cca2, countryCode: code.callingCode[0] }));


                await AsyncStorage.setItem('CountryCodeAsync', JSON.stringify(code.callingCode[0]));
                await AsyncStorage.setItem('CountryAsync', JSON.stringify(code.cca2));
                if (BaseUrl !== 'https://api.fougitodemo.com/api/') {
                  if (code.callingCode[0] == "44") {

                    console.log('change base url to', 'https://api.fougito.uk/api/');
                    await AsyncStorage.setItem('serverurl', JSON.stringify('https://api.fougito.uk/api/'));

                    _setBaseUrlToggle('https://api.fougito.uk/api/');
                    dispatch(AuthAction.resetuserurl('https://api.fougito.uk/api/'));

                  }
                  else {

                    console.log('change base url to', 'https://api.fougito.com/api/');
                    await AsyncStorage.setItem('serverurl', JSON.stringify('https://api.fougito.com/api/'));

                    _setBaseUrlToggle('https://api.fougito.com/api/');
                    dispatch(AuthAction.resetuserurl('https://api.fougito.com/api/'));


                  }
                }
              }}
              visible={visible}
            />
          )}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              phone
                ? styles.scrollPhone
                : [styles.scrollTablet, landscape && { paddingTop: 40 + topInset }],
            ]}>
            <View
              style={[
                styles.scroll,
                { gap: phone ? 18 : 24, maxWidth: landscape ? 480 : phone ? 9999 : 560 },
              ]}>
              {/* Logo tile carries the hidden 10-tap LIVE/DEMO counter */}
              <TouchableOpacity
                activeOpacity={1}
                style={styles.logoTile}
                onPress={async () => {
                  sethiddencounter(Number(hiddencounter) + 1);
                }}
              >
                <Image
                  style={styles.logo}
                  resizeMode="contain"
                  source={require('../../assets/Images/fougito_logo.png')}
                />
              </TouchableOpacity>

              <Text style={styles.title}>{HardCode.LOGIN}</Text>

              {/* PHONE NUMBER INPUT */}
              <View style={styles.field}>
                <SubHeading style={styles.text} text={HardCode.PhoneNumber} />
                <NumberInput
                  ref={phoneInput}
                  value={phoneNumber}
                  countryCode={countryCode}
                  countryFlag={country}
                  onChangeCountry={() => {
                    setVisible(true);
                  }}
                  onChangeText={text => {
                    setphoneNumber(text);
                  }}
                />
              </View>

              {/* Pass INPUT */}

              <View style={styles.field}>
                <SubHeading style={styles.text} text={HardCode.Password} />
                <MyFormInputTile
                  value={password}
                  onIconPress={() => setSecure(!secure)}
                  iconName={!secure ? 'eye-off' : 'eye'}
                  placeHolder={HardCode.EnterPasswordHere}
                  secure={!secure ? true : false}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                />
              </View>

              {/* FORGOT PASS (disabled in original) */}

              <View style={styles.loader}>
                {loader ? (
                  <ActivityIndicator size={'large'} color={Color.loaderColor} />
                ) : (
                  <>
                    <AuthButton
                      container={styles.loginBtn}
                      // disabled={userRole === 'DeliveryStaff' ? true : false}
                      onPress={async () => {
                        Keyboard.dismiss();
                        let deviceId = await DeviceInfo.getUniqueId();
                        if (phoneNumber.length < 8) {
                          dispatch(
                            DataAction.ToastMessageSenderScreenAction(
                              HardCode.PleaseEnterYourPhoneNumberFirst,
                            ),
                          );
                        } else if (password.length <= 0) {
                          dispatch(
                            DataAction.ToastMessageSenderScreenAction(
                              HardCode.PleaseEnterYourPasswordFirst,
                            ),
                          );
                        } else {
                          dispatch(
                            AuthAction.UserLoginAction(
                              phoneNumber,
                              password,
                              deviceId,
                              countryCode,
                            ),
                          );
                        }
                      }}
                      message={errorMessage}
                      title={HardCode.LOGIN}
                    />
                    <TouchableOpacity
                      style={
                        Platform.OS == 'android' ? styles.fingerSquare : null
                      }
                      onPress={() => {
                        fingerprint();
                      }}>
                      {Platform.OS == 'android' && (
                        <FontAwesome5
                          name={'fingerprint'}
                          color={C.accent}
                          size={26}
                        />
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <ErrorPopUpModel
        visible={errorModal}
        yesPress={() => {
          setErrorMessage('');
          setErrorModal(false);
        }}
        message={errorMessage}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  maincontainer: { height: '100%', width: '100%', backgroundColor: C.ground },
  frame: { flex: 1 },
  frameRow: { flexDirection: 'row' },
  statusBarHolder: { position: 'absolute', height: 0, overflow: 'hidden' },
  formSide: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  scrollPhone: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  scrollTablet: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { width: '100%' },
  logoTile: {
    width: 64,
    height: 64,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  logo: {
    height: 18,
    width: 18 * (150 / 70),
  },
  title: {
    fontFamily: F.black,
    fontSize: 44,
    letterSpacing: -0.5,
    color: C.ink,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
    paddingBottom: 12,
  },
  field: { gap: 8 },
  text: {
    fontFamily: F.bold,
    fontSize: 15,
    letterSpacing: 0,
    color: C.ink,
  },
  loader: {
    marginTop: 8,
    minHeight: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loginBtn: { flex: 1, width: undefined },
  fingerSquare: {
    width: 56,
    height: 56,
    borderWidth: B.rule,
    borderColor: C.ink,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default LoginScreen;
