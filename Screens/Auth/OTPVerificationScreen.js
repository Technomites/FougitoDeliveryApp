import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Image,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Color from '../../Constants/Color';
import Heading from '../../Components/UI-Support/Heading';
import Paragraph from '../../Components/UI-Support/Paragraph';
import IoIcon from '../../Components/Icon/IoIcon';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Toast from 'react-native-toast-notifications';
import AuthButton from '../../Components/UI-Support/AuthButton';
import {useSelector, useDispatch} from 'react-redux';
import {scalableheight, fontSize} from '../../Components/resposnevaraiable';
import SubHeading from '../../Components/UI-Support/SubHeading';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {FontFamily} from '../../Constants/fonts';

// import {BaseUrl} from '../../Components/BaseUrl';

const OTPVerificationScreen = props => {
  const role = props.route.params.role;
  const phoneNumber = props.route.params.phoneNumber;
  const userId = props.route.params.userId;
  const Android = Platform.OS === 'android';
  const [code, setCode] = useState('');
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(60);
  const inputEl = useRef(null);
  const toast = useRef();
  const BaseUrl = useSelector(state => state.auth.BaseUrl);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          toast.current.show('Time Up Resend Otp');
        } else {
          setMinutes(minutes - 1);
          setSeconds(60);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const VerifyOtpCodeRequest = code => {
    var raw = '';

    var requestOptions = {
      method: 'POST',
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}partner/account/VerifyOTP/${code}/${userId}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result, 'AYAYAYAYYAYAY');
        if (result?.Status === 'Success') {
          //alert('success');
          props.navigation.navigate('NewPasswordScreen', {
            userId: userId,
          });
        } else if (result?.Status === 'Error') {
          toast.current.show('Invalid Otp. Please try again');
        }
      })
      .catch(error => console.log('error', error));
  };

  const ResendOtpCode = code => {
    var requestOptions = {
      method: 'POST',
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}partner/Account/ResendOTP/971${phoneNumber}/RestaurantServiceStaff`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setMinutes(1);
        setSeconds(60);
        console.log(result);
      })

      .catch(error => console.log('error', error));
  };

  return (
    <SafeAreaView style={Styles.mainView}>
      <Toast textStyle={{fontSize: fontSize.twelve}} ref={toast} />

      <ImageBackground
        source={require('../../assets/Images/authBgComplete.png')}
        imageStyle={Styles.imageBg}>
        <FocusAwareStatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={Styles.iconTouchable}>
          <IoIcon
            size={fontSize.twenty}
            color={Color.iconBlackColor}
            name="arrow-back"
          />
        </TouchableOpacity>
        <View style={Styles.imageMainView}>
          <Image
            style={Styles.image}
            source={require('../../assets/Images/logo.png')}
          />
        </View>
        <View style={{height: '45%'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginHorizontal: scalableheight.two}}>
            <View
              style={{
                marginTop: scalableheight.ten - scalableheight.pointfive,
              }}>
              <View style={Styles.headingSubView}>
                <Heading style={Styles.heading} text="Verification" />

                <SubHeading
                  style={Styles.subHeading}
                  text={`A verifiation code was sent to your number`}
                />
                <SubHeading
                  style={[
                    Styles.subHeading,
                    {color: Color.headingColor, fontFamily: FontFamily.Bold},
                  ]}
                  text={`+971${phoneNumber}`}
                />
              </View>

              <View style={Styles.OTPView}>
                <OTPInputView
                  selectionColor={Color.btnBgColorOtherPlace}
                  autoFocusOnLoad={Android ? false : false}
                  ref={inputEl}
                  style={Styles.otp}
                  pinCount={4}
                  code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                  onCodeChanged={code => {
                    setCode(code);
                  }}
                  codeInputFieldStyle={Styles.underlineStyleBase}
                  codeInputHighlightStyle={Styles.underlineStyleHighLighted}
                  onCodeFilled={VerifyOtpCodeRequest}
                />
              </View>

              <View style={{marginTop: scalableheight.three}}>
                <AuthButton
                  title="VERIFY"
                  onPress={() => props.navigation.navigate('NewPasswordScreen')}
                />
              </View>
              <View style={Styles.resendMainView}>
                <View style={Styles.resendSubView}>
                  <TouchableOpacity onPress={() => ResendOtpCode()}>
                    <Text style={Styles.resendText}>RESEND CODE</Text>
                  </TouchableOpacity>
                  <Text style={Styles.text}>
                    {minutes === 0 && seconds === 0 ? (
                      <Text> 0 : 0</Text>
                    ) : (
                      <Text>
                        {' '}
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Color.inputBg,
  },

  borderStyleHighLighted: {
    borderColor: 'red',
  },

  underlineStyleBase: {
    width: scalableheight.seven,
    height: scalableheight.seven,
    borderWidth: scalableheight.borderTopWidthtoggle,
    backgroundColor: Color.inputBg,
    borderColor: Color.lightGray,
    borderRadius: 0,
    color: 'black',
    fontSize: fontSize.fifteen,
    fontWeight: 'bold',
  },

  underlineStyleHighLighted: {
    borderColor: Color.btnBgColorOtherPlace,
  },
  mainView: {flex: 1, bakgroundColor: Color.bgColor},
  imageBg: {
    height: scalableheight.eighty + scalableheight.two,
    width: '100%',
    resizeMode: 'cover',
  },
  iconTouchable: {
    height: scalableheight.five,
    width: scalableheight.five,
    backgroundColor: Color.white,
    borderRadius: 0,
    top: scalableheight.five,
    left: scalableheight.two,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  imageMainView: {
    height: '40%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: scalableheight.thirteen,
  },
  imageSubView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //backgroundColor: 'red',
  },
  image: {
    height: scalableheight.thirteen,
    width: scalableheight.twenty,
    resizeMode: 'contain',
  },
  headingMainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingSubView: {
    marginVertical: scalableheight.pointsevenfive,
  },
  heading: {
    fontSize: fontSize.sixteen,
    color: 'black',
    marginVertical: scalableheight.pointfive,
  },
  subHeading: {fontSize: fontSize.eleven, color: Color.headingBlackColor},
  paragraph: {fontSize: fontSize.twelve, color: 'black'},
  OTPView: {
    marginTop: scalableheight.pointsevenfive,
    justifyContent: 'center',
    alignItems: 'center',

    //   backgroundColor: 'red',
  },
  otp: {width: '70%', height: scalableheight.ten},
  authBtnView: {width: '90%', marginVertical: '4%'},
  resendMainView: {width: '100%', height: scalableheight.five},
  resendSubView: {
    //  backgroundColor: 'red',
    width: '100%',
    height: scalableheight.nine,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: Color.btnBgColorOtherPlace,
    fontFamily: FontFamily.Medium,
    fontSize: fontSize.twelve,
  },
  text: {
    fontFamily: FontFamily.Medium,
    fontSize: fontSize.twelve,
    color: Color.otptextColor,
  },
});
export default OTPVerificationScreen;
