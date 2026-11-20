import React, {useState, useRef, useEffect} from 'react';
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
  StyleSheet,
} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import NumberInput from '../../Components/UI-Support/NumberInput';
import AuthButton from '../../Components/UI-Support/AuthButton';
import Heading from '../../Components/UI-Support/Heading';
import IoIcon from '../../Components/Icon/IoIcon';
import Toast from 'react-native-toast-notifications';
// import {BaseUrl} from '../../Components/BaseUrl';
import {useSelector} from 'react-redux';
import ErrorPopUpModel from '../../Components/UI-Support/ErrorPopUpModel';
import {fontSize, scalableheight} from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {HardCode} from '../../Constants/texting';

const ForgetPasswordScreen = props => {
  //alert(userRole);
  const toast = useRef();
  const role = props.route.params.role;

  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [numberTile, setNumberTile] = useState(false);
  const [loader, setLoader] = useState(false);

  const phoneInput = useRef(null);

  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const userRole = useSelector(state => state.auth.role);
  useEffect(() => {
    const interval = setInterval(() => {
      setNumberTile(true);
    }, 1);
    return () => clearInterval(interval);
  }, []);

  const ProceedtoOtp = async () => {
    if (phoneNumber.length < 9) {
      toast.current.show(HardCode.InvalidPhoneNumber);

      return;
    } else {
      var requestOptions = {
        method: 'POST',
        redirect: 'follow',
      };

      setLoader(true);
      //alert('loader try');
      await fetch(
        `${BaseUrl}partner/account/ForgetPassword/${`971${phoneNumber}`}/RestaurantServiceStaff`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log(result);
          setLoader(false);
          if (result.Status === 'Success') {
            //  alert('true');
            props.navigation.navigate('OTPVerificationScreen', {
              role: role,
              phoneNumber: phoneNumber,
              userId: result?.Result,
            });
          } else if (result.Status === 'Error') {
            //alert('error');
            // console.log(resy);
            setErrorModal(true);
            setErrorMessage(HardCode.NumberDoesNotExists);
          }
        })
        .catch(error => {
          //alert(error);
          setLoader(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : ''}>
        <FocusAwareStatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
        <Toast textStyle={{fontSize: scalableheight.two}} ref={toast} />
        <ImageBackground
          source={require('../../assets/Images/authBgComplete.png')}
          imageStyle={styles.imagebg}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={styles.iconTouchable}>
            <IoIcon
              size={fontSize.twenty}
              color={Color.iconBlackColor}
              name="arrow-back"
            />
          </TouchableOpacity>
          <View style={styles.imageMainView}>
            <Image
              style={styles.image}
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
                <View style={styles.headingSubView}>
                  <Heading
                    style={styles.heading}
                    text={HardCode.ForgotPassword}
                  />
                  <View>
                    <SubHeading
                      style={styles.subHeading}
                      text={
                        HardCode.EnterThePhoneNumberAssociatedWithYourAccountSoWeCanSendYouAVerificationCode
                      }
                    />
                  </View>
                </View>
              </View>
              {/* PHONE NUMBER INPUT */}
              <View>
                <View style={styles.subHeadingView}>
                  <SubHeading text={HardCode.PhoneNumber} />
                </View>
                {numberTile && (
                  <NumberInput
                    ref={phoneInput}
                    value={phoneNumber}
                    onChangeText={text => {
                      setphoneNumber(text);
                    }}
                  />
                )}
              </View>

              <View style={{marginTop: scalableheight.five}}>
                {loader ? (
                  <ActivityIndicator size={'large'} color={Color.loaderColor} />
                ) : (
                  <AuthButton
                    succ={phoneNumber !== '' ? true : false}
                    onPress={
                      () => ProceedtoOtp()
                      // props.navigation.navigate('OTPVerificationScreen')
                    }
                    title={HardCode.PROCEED}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        <ErrorPopUpModel
          visible={errorModal}
          //visible={true}
          yesPress={() => {
            setErrorMessage('');
            setErrorModal(false);
          }}
          message={errorMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPasswordScreen;
const styles = StyleSheet.create({
  main: {flex: 1, bakgroundColor: Color.bgColor},
  imagebg: {
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
    //backgroundColor: 'red',
  },
  headingSubView: {
    marginVertical: scalableheight.pointsevenfive,
    //  width: '100%',
    // marginTop: scalableheight.four,
  },
  heading: {
    fontSize: fontSize.sixteen,
    color: 'black',
    marginVertical: scalableheight.pointfive,
  },
  subHeading: {fontSize: fontSize.eleven, color: Color.headingBlackColor},
  subHeadingView: {
    marginTop: scalableheight.one,
    marginBottom: scalableheight.one,
  },
});
