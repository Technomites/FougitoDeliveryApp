import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import {Safeareacontext} from '../../Components/SafeAreaContext';

import AuthButton from '../../Components/UI-Support/AuthButton';
import MyFormInputTile from '../../Components/UI-Support/MyFormInputTile';
import BackHeader from '../../Components/UI-Support/BackHeader';
import {useSelector, useDispatch} from 'react-redux';
// import {BaseUrl} from '../../Components/BaseUrl';
import SuccessModalPopup from '../../Components/UI-Support/SuccessModalPopup';
import PopUpModel from '../../Components/UI-Support/PopUpModel';
import ErrorModel from '../../Components/UI-Support/ErrorPopUpModel';
import {fontSize, scalableheight} from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {commonStylying} from '../../Constants/AddWrapper';
import * as DataAction from '../../Store/Data/DataAction';
import {FontFamily} from '../../Constants/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HardCode} from '../../Constants/texting';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import { ScrollView } from 'react-native';
import BottomBar from '../../Components/UI-Support/BottomBar';
import { useDevice } from '../../Components/useLayout';
import { C, F } from '../../Constants/tokens';

const ChangePassword = props => {
  const [secure, setSecure] = useState(true);
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [succModal, setSuccModal] = useState(false);
  const [errModal, setErrModal] = useState(false);
  const [resMessage, setResMessage] = useState('');
  const [formFields, setFormFields] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const dispatch = useDispatch();
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );
  const userSuccessData = useSelector(state => state.auth.userSuccessData);

  const ScreenData = [
    {
      title: HardCode.CurrentPassword,
      icon: secure ? 'eye-off' : 'eye',
      placeHolder: HardCode.EnterCurrentPasswordHere,
      secureCondition: secure ? true : false,
      onIconPressFunction: () => setSecure(!secure),
      onChangeTextFunction: text => {
        setFormFields({
          ...formFields,
          currentPass: text,
        });
      },
    },
    {
      title: HardCode.NewPassword,
      icon: secure1 ? 'eye-off' : 'eye',
      placeHolder: HardCode.EnterNewPasswordHere,
      secureCondition: secure1 ? true : false,
      onIconPressFunction: () => setSecure1(!secure1),
      onChangeTextFunction: text => {
        setFormFields({
          ...formFields,
          newPass: text,
        });
      },
    },
    {
      title: HardCode.ConfirmPassword,
      icon: secure2 ? 'eye-off' : 'eye',
      placeHolder: HardCode.EnterConfirmPasswordHere,
      secureCondition: secure2 ? true : false,
      onIconPressFunction: () => setSecure2(!secure2),
      onChangeTextFunction: text => {
        setFormFields({
          ...formFields,
          confirmPass: text,
        });
      },
    },
  ];

  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);
  const loginuser = async password => {
    const fingerprintvalue = JSON.parse(
      await AsyncStorage.getItem('fingerprint'),
    );
    await AsyncStorage.setItem(
      'fingerprint',
      JSON.stringify({
        ...fingerprintvalue,
        password: password,
      }),
    );
  };
  const changePassRequest = () => {
    Keyboard.dismiss();
    if (formFields.currentPass === '') {
      // toast.current.show('Current password cannot be empty');
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.CurrentPasswordCannotBeEmpty,
        ),
      );
      return;
    } else if (formFields.newPass === '') {
      // toast.current.show('New password cannot be empty');
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.NewPasswordCannotBeEmpty,
        ),
      );
      return;
    } else if (formFields.confirmPass === '') {
      // toast.current.show('Confirm password cannot be empty');
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.ConfirmPasswordCannotBeEmpty,
        ),
      );
      return;
    } else if (formFields.newPass !== formFields.confirmPass) {
      // toast.current.show('Password does not matched');
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.PasswordDoesNotMatch,
        ),
      );
      return;
    } else {
      setLoader(true);
      setResMessage('');
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append(
        'Authorization',
        `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
      );

      var raw = JSON.stringify({
        oldPassword: formFields.currentPass,
        newPassword: formFields.newPass,
        confirmPassword: formFields.confirmPass,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${BaseUrl}partner/Account/ChangePassword`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result.Status === 'Success') {
            setLoader(false);
            setResMessage(HardCode.PasswordHasBeenSuccessfullyUpdated);
            loginuser(formFields.newPass);
            setSuccModal(true);
          } else {
            setErrModal(true);
            setResMessage(result?.Message);
            setLoader(false);
          }
        })
        .catch(error =>{
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          console.log('error', error)});
    }
  };
  const { isPhone, gutter } = useDevice();

  return (
    <SafeAreaView style={style.mainView}>
      <FocusAwareStatusBar
        style={style.statusStrip}
        barStyle={'dark-content'}
        backgroundColor="transparent"
      />

        <BackHeader
          onPress={() => props.navigation.goBack()}
          title={HardCode.ChangePassword}
        />

      <ScrollView style={style.flex1} keyboardShouldPersistTaps="handled">
      <TouchableOpacity
        onPress={Keyboard.dismiss}
        activeOpacity={1}
        style={{
          paddingHorizontal: gutter,
          paddingVertical: isPhone ? 20 : 32,
        }}>
        <View style={[style.fields, { gap: isPhone ? 16 : 20 }]}>
            {ScreenData.map((inputData, id) => {
              return (
                <View key={id} style={style.subheadingView}>
                  <SubHeading
                    style={style.label}
                    text={inputData.title}
                  />
                  <MyFormInputTile
                    onIconPress={inputData.onIconPressFunction}
                    iconName={inputData.icon}
                    placeHolder={inputData.placeHolder}
                    secure={inputData.secureCondition}
                    onChangeText={text => {
                      inputData.onChangeTextFunction(text);
                    }}
                    // size={fontSize.twentyeight}
                  />
                </View>
              );
            })}
        </View>
      </TouchableOpacity>
      </ScrollView>
      <BottomBar>
        <AuthButton
          container={isPhone ? style.btnPhone : style.btnTablet}
          iconName="check"
          title={HardCode.SAVE}
          onPress={changePassRequest}
        />
      </BottomBar>
      <SuccessModalPopup
        visible={succModal}
        message={resMessage}
        yesPress={() => {
          setSuccModal(false);
          props.navigation.goBack();
        }}
        bnText={HardCode.OK}
      />
      <ErrorModel
        visible={errModal}
        message={resMessage}
        yesPress={() => {
          setErrModal(false);
          //props.navigation.goBack();
        }}
        // noPress={() => {
        //   setErrModal(false);
        // }}
      />
    </SafeAreaView>
  );
};
export default ChangePassword;
const style = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: C.ground,
  },
  statusStrip: { backgroundColor: C.surface },
  flex1: { flex: 1 },
  fields: { width: '100%', maxWidth: 560 },
  subheadingView: { gap: 8 },
  label: {
    fontFamily: F.bold,
    fontSize: 15,
    letterSpacing: 0,
    color: C.ink,
  },
  btnPhone: { width: '100%' },
  btnTablet: { width: 360 },
});
