import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StatusBar,
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
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Color from '../../Constants/Color';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import SubHeading from '../../Components/UI-Support/SubHeading';
import NumberInput from '../../Components/UI-Support/NumberInput';
import MyFormInputTile from '../../Components/UI-Support/MyFormInputTile';
import CountryPicker from 'react-native-country-picker-modal';
import AuthButton from '../../Components/UI-Support/AuthButton';
import PopUpModel from '../../Components/UI-Support/PopUpModel';
import * as AuthAction from '../../Store/Auth/AuthAction';
import * as DataAction from '../../Store/Data/DataAction';
import { useDispatch, useSelector } from 'react-redux';
//import Loader from '../../Components/UI-Support/Loader';
import ErrorPopUpModel from '../../Components/UI-Support/ErrorPopUpModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import { commonStylying } from '../../Constants/AddWrapper';
import { FontFamily } from '../../Constants/fonts';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HardCode } from '../../Constants/texting';
import { _setBaseUrlToggle, SetUrlConst } from '../../Components/BaseUrl';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AuthBrandPane from '../../Components/UI-Support/AuthBrandPane';
import useLayout from '../../Components/useLayout';
import { C, F, B } from '../../Constants/tokens';

const FingerPrintAuthentication = props => {
  const [role, setRole] = useState('Sta');
  const [phoneNumber, setphoneNumber] = useState('');
  const [secure, setSecure] = useState(false);
  const [hiddencounter, sethiddencounter] = useState(0);
  const [password, setPassword] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [succModal, setSuccModal] = useState(false);
  const [countryCode, setCountryCode] = useState('971');
  const [country, setCountry] = useState('AE');
  const [visible, setVisible] = useState(false);

  const [url, seturl] = useState('');
  const [sign, setSign] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const phoneInput = useRef(null);

  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.role);
  const loading = useSelector(state => state.auth.loading);
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const userErrorData = useSelector(state => state.auth.userErrorData);
  const region = useSelector(state => state.auth.region);

  useEffect(() => {

    setCountry(region?.country)
    setCountryCode(region?.countryCode)
  }, [region]);
  useEffect(() => {
    toggleUrl();
  }, [hiddencounter]);
  const toggleUrl = async () => {
    if (hiddencounter !== 10) return;
    const liveUrl1 = await AsyncStorage.getItem('liveurl');

    const liveUrl = JSON.parse(liveUrl1)
    //  const liveUrl = 
    //   originalRegion?.country === 'AE'
    //     ? 'https://api.fougito.com/api/'
    //     : 'https://api.fougito.uk/api/';

    const demoUrl = 'https://api.fougitodemo.com/api/';

    const isCurrentlyLive = SetUrlConst === liveUrl;

    const url = isCurrentlyLive ? demoUrl : liveUrl;
    const urlType = isCurrentlyLive ? 'DEMO' : 'LIVE';

    dispatch(
      AuthAction.SetRegionAction({
        country: isCurrentlyLive ? 'AE' : liveUrl === 'https://api.fougito.uk/api/' ? 'GB' : 'AE',
        countryCode: isCurrentlyLive ? '971' : liveUrl === 'https://api.fougito.uk/api/' ? '44' : '971',
      }),
    );
    console.log(url);

    _setBaseUrlToggle(url);
    dispatch(AuthAction.resetuserurl(url));

    await AsyncStorage.setItem('serverurl', JSON.stringify(url));

    dispatch(DataAction.ToastMessageSenderScreenAction(urlType));

    sethiddencounter(0);
  };
  const loginuser = async () => {
    AsyncStorage.setItem('keyFlag', countryCode);
    AsyncStorage.setItem('Flag', country);
    await AsyncStorage.setItem(
      'fingerprint',
      JSON.stringify({
        number: phoneNumber,
        password: password,
        code: countryCode
      }),
    );
  };
  const errFunc = () => {
    setErrorMessage(
      HardCode.FingerRegisterationFailedInvalidPhoneNumberOrPassword,
    );
    setErrorModal(true);
  };

  const sucFunc = () => {
    setSuccModal(true);
  };

  const fingerprint = () => {
    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics.createKeys().then(resultObject => {
      const { publicKey } = resultObject;
      console.log(publicKey);
    });
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    let payload = epochTimeSeconds + 'some message';
    rnBiometrics
      .createSignature({
        promptMessage: HardCode.SignIn,
        payload: payload,
      })
      .then(async resultObject => {
        const { success, signature } = resultObject;
        if (success) {
          loginuser();
          sucFunc();
          console.log(signature);
        }
      });
  };

  const confirm = () => {
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
      console.log(phoneNumber,
        password,
        fingerprint,
        errFunc,
        countryCode);

      dispatch(
        AuthAction.UserLoginActionFingerPrint(
          phoneNumber,
          password,
          fingerprint,
          errFunc,
          countryCode
        ),
      );
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
  const layout = useLayout();
  const landscape = layout === 'tabletLandscape';
  const phone = layout === 'phone';
  const topInset = getStatusBarHeight();

  return (
    <TouchableOpacity
      onPress={Keyboard.dismiss}
      activeOpacity={1}
      style={styles.maincontainer}>
      <View style={[styles.frame, landscape && styles.frameRow]}>
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
            onSelect={code => {
              console.log(code);
              setCountryCode(code.callingCode[0]);
              setCountry(code.cca2);
            }}
            visible={visible}
          />
        )}
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
              <Text style={[styles.title, { fontSize: phone ? 34 : 44 }]}>
                {HardCode.ConfigureFingerprint}
              </Text>

              {/* PHONE NUMBER INPUT */}
              <View style={styles.field}>
                <SubHeading style={styles.text} text={HardCode.PhoneNumber} />
                <NumberInput
                  ref={phoneInput}
                  value={phoneNumber}
                  countryCode={countryCode}
                  countryFlag={country}
                  // onChangeCountry={() => {
                  //   // setVisible(true);
                  // }}
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
              <TouchableOpacity
                style={[styles.configureBtn, loading && styles.configureBtnLoading]}
                onPress={() => {
                  confirm();
                }}>
                {loading ? (
                  <ActivityIndicator size={'large'} color={Color.loaderColor} />
                ) : (
                  <>
                    <Text style={styles.configure}>
                      {HardCode.ConfigureFingerprint}
                    </Text>
                    <FontAwesome5
                      name={'fingerprint'}
                      color={C.surface}
                      size={22}
                    />
                  </>
                )}
              </TouchableOpacity>
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
      <PopUpModel
        visible={succModal}
        yesPress={() => {
          setSuccModal(false);
          props.navigation.navigate('LoginScreen');
        }}
        message={HardCode.FingerPrintRegisteredSuccessfully}
        title={HardCode.LOGIN}
        noShow={true}
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
  },
  scrollTablet: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { width: '100%' },
  title: {
    fontFamily: F.black,
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
  configureBtn: {
    marginTop: 8,
    height: 56,
    alignSelf: 'stretch',
    backgroundColor: C.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  configureBtnLoading: {
    backgroundColor: C.transparent,
    justifyContent: 'center',
  },
  configure: {
    color: C.surface,
    fontFamily: F.bold,
    fontSize: 17,
  },
});
export default FingerPrintAuthentication;
