import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import Paragraph from '../../Components/UI-Support/Paragraph';
import Heading from '../../Components/UI-Support/Heading';
import AuthButton from '../../Components/UI-Support/AuthButton';
import IoIcon from '../../Components/Icon/IoIcon';
import BackHeader from '../../Components/UI-Support/BackHeader';
import SuccessModal from '../../Components/UI-Support/SuccessModalPopup';
// import { BaseUrl } from '../../Components/BaseUrl';
import {useSelector, useDispatch} from 'react-redux';
import {fontSize, scalableheight} from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {commonStylying} from '../../Constants/AddWrapper';
import * as DataAction from '../../Store/Data/DataAction';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';
import handleSize from 'react-native-dimension/src/utils';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import { ScrollView } from 'react-native';
import BottomBar from '../../Components/UI-Support/BottomBar';
import { useDevice } from '../../Components/useLayout';
import { C, F, B } from '../../Constants/tokens';

const ContactUsScreen = props => {
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [contactinfo, setContactInfo] = useState();
  const dispatch = useDispatch();
  const [successModal, setSuccessModal] = useState(false);

  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const ScreenData = [
    {
      icon: 'call-sharp',
      title: contactinfo
        ? `${contactinfo[0]?.Contact} , ${contactinfo[0]?.Contact2}`
        : '',
    },
    {
      icon: 'mail',
      title: contactinfo ? contactinfo[0]?.Email : '',
    },
    {
      icon: 'location',
      title: contactinfo ? contactinfo[0]?.StreetAddress : '',
    },
  ];
  useEffect(() => {
    const getContactInfo = async () => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(`${BaseUrl}BusinessSetting/Master`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.Status === 'Success') {
            setContactInfo(result?.Result);
          }
        })
        .catch(error =>{
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          console.log('error', error)});
    };
    getContactInfo();
  }, []);

  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

  const ContactUsAction = () => {
    if (message === '') {
      // toast.current.show('Message cannot be empty');
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.MessageCannotBeEmpty,
        ),
      );

      return;
    } else {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append(
        'Authorization',
        `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
      );
      setLoader(true);

      var raw = JSON.stringify({
        message: message,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${BaseUrl}ContactUs`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result) {
            setSuccessModal(true);
            setMessage('');
            setLoader(false);
          }
        })
        .catch(error => {
          setSuccessModal(false);
          setLoader(false);
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          console.log('error', error);
        });
    }
  };

  const { layout, isPhone, gutter } = useDevice();
  const landscape = layout === 'tabletLandscape';
  // Caps labels for the three API-driven rows (display only).
  const contactLabels = [HardCode.ContactNo, HardCode.Email, HardCode.Address];
  const headSize = isPhone ? 24 : 28;

  return (
    <View style={[style.mainView, props.drawerAnimationStyle]}>
      <SafeAreaView style={style.safeareaview}>
        <FocusAwareStatusBar
          style={style.statusStrip}
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />


        <BackHeader
          onPress={() => props.navigation.goBack()}
          title={HardCode.ContactUs}
        />

        <KeyboardAvoidingView
          style={style.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : ''}>
          <ScrollView style={style.flex1} keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              style={[
                style.paraView,
                landscape && style.twoCol,
                {
                  paddingHorizontal: gutter,
                  paddingVertical: isPhone ? 20 : 32,
                  gap: landscape ? 48 : 28,
                },
              ]}
              onPress={Keyboard.dismiss}
              activeOpacity={1}>
              <View style={[style.col, landscape && style.flex1]}>
                <View style={style.sectionHead}>
                  <Heading
                    style={{ ...style.heading, fontSize: headSize }}
                    text={HardCode.GetInTouchWithUs}
                  />
                </View>
                <Paragraph
                  style={style.para}
                  text={
                    HardCode.WeAreAlwaysAvailableAndHappyToChatWithYouReachOutToUs
                  }
                />
                {ScreenData.map((contactData, id) => {
                  // Values stay API-driven; a tile hides while its value is empty.
                  return !!contactData.title ? (
                    <View key={id} style={style.innercircle}>
                      <View style={style.circle}>
                        <IoIcon
                          name={contactData.icon}
                          size={20}
                          color={C.accentDeep}
                        />
                      </View>
                      <View style={style.subheadingView}>
                        <SubHeading style={style.capsLabel} text={contactLabels[id]} />
                        <SubHeading
                          numberOfLines={2}
                          style={style.subheading}
                          text={contactData.title}
                        />
                      </View>
                    </View>
                  ) : null;
                })}
              </View>

              <View style={[style.col, landscape && style.flex1]}>
                <View style={style.sectionHead}>
                  <Heading
                    style={{ ...style.heading, fontSize: headSize }}
                    text={HardCode.SendUsAMessage}
                  />
                </View>
                <Paragraph
                  style={style.para}
                  text={HardCode.WedLoveToHearFromYouGetInTouchWithUsHere}
                />

                <View style={style.textbox}>
                  <TextInput
                    multiline={true}
                    textAlignVertical="top"
                    style={style.txtinput}
                    value={message}
                    placeholderTextColor={Color.placeholderTextColor}
                    placeholder={HardCode.EnterMessageHere}
                    onChangeText={text => {
                      setMessage(text);
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        <BottomBar>
          {loader ? (
            <View style={style.loaderBox}>
              <ActivityIndicator size={'large'} color={Color.loaderColor} />
            </View>
          ) : (
            <AuthButton
              container={isPhone ? style.btnPhone : style.btnTablet}
              iconName="send"
              onPress={ContactUsAction}
              title={HardCode.SUBMIT}
            />
          )}
        </BottomBar>

        <SuccessModal
          yesPress={() => {
            setSuccessModal(false);
          }}
          bnText={HardCode.OK}
          message={HardCode.YourMessageHasBeenSentSuccessfully}
          visible={successModal}
        />
      </SafeAreaView>
    </View>
  );
};
const style = StyleSheet.create({
  flex1: { flex: 1 },
  para: {
    fontFamily: F.medium,
    fontSize: 16,
    color: C.body,
  },
  sectionHead: {
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
    paddingBottom: 8,
  },
  heading: {
    fontFamily: F.black,
    color: C.ink,
  },
  col: { gap: 16 },
  twoCol: { flexDirection: 'row', alignItems: 'flex-start' },
  circle: {
    width: 44,
    height: 44,
    backgroundColor: C.overdueBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innercircle: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  textbox: {},
  mainView: { flex: 1, overflow: 'hidden', backgroundColor: C.ground },
  safeareaview: { flex: 1, backgroundColor: C.ground },
  statusStrip: { backgroundColor: C.surface },
  paraView: {},
  capsLabel: {
    fontFamily: F.bold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.muted,
  },
  subheading: {
    color: C.ink,
    fontSize: 16,
    letterSpacing: 0,
    fontFamily: F.bold,
  },
  subheadingView: { flex: 1, minWidth: 0, gap: 2 },
  txtinput: {
    backgroundColor: C.surface,
    height: 200,
    padding: 14,
    width: '100%',
    borderWidth: B.hair,
    borderColor: C.rule,
    fontSize: 16,
    fontFamily: F.medium,
    color: C.ink,
  },
  loaderBox: { height: 56, justifyContent: 'center', alignItems: 'center' },
  btnPhone: { width: '100%' },
  btnTablet: { width: 360 },
});
export default ContactUsScreen;
