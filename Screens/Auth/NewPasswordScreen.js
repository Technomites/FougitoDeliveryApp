import React, {useState, useRef} from 'react';
import {
  View,
  Image,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import MyFormInputTile from '../../Components/UI-Support/MyFormInputTile';
import AuthButton from '../../Components/UI-Support/AuthButton';
import Heading from '../../Components/UI-Support/Heading';
import IoIcon from '../../Components/Icon/IoIcon';
import Toast from 'react-native-toast-notifications';
import SuccessModalPopup from '../../Components/UI-Support/SuccessModalPopup';
import {useSelector, useDispatch} from 'react-redux';
import {scalableheight, fontSize} from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {HardCode} from '../../Constants/texting';
// import {BaseUrl} from '../../Components/BaseUrl';

const NewPasswordScreen = props => {
  const toast = useRef();
  const userId = props?.route?.params?.userId;
  const [secure, setSecure] = useState(false);
  const [password, setPassword] = useState('');
  const [secure2, setSecure2] = useState(false);
  const [confirmpassword, setconfirmpassword] = useState('');
  const [loader, setLoader] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [phoneNumber, setphoneNumber] = useState('');
  const [numberTile, setNumberTile] = useState(false);
  const phoneInput = useRef(null);

  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const ScreenData = [
    {
      title: HardCode.Password,
      icon: !secure ? 'eye' : 'eye-off',
      placeHolder: HardCode.EnterNewPasswordHere,
      secureCondition: !secure ? true : false,
      onIconPressFunction: () => setSecure(!secure),
      onChangeTextFunction: text => {
        setPassword(text);
      },
    },
    {
      title: HardCode.ConfirmPassword,
      icon: !secure2 ? 'eye' : 'eye-off',
      placeHolder: HardCode.EnterConfirmPasswordHere,
      secureCondition: !secure2 ? true : false,
      onIconPressFunction: () => setSecure2(!secure2),
      onChangeTextFunction: text => {
        setconfirmpassword(text);
      },
    },
  ];

  const ProceedtoOtp = () => {
    toast.current.hideAll();
    if (password.length <= 0) {
      toast.current.show('Please enter your password');

      return;
    }
    if (confirmpassword.length <= 0) {
      toast.current.show('Please enter your confirm password');

      return;
    }
    props.navigation.navigate('Auth', {
      screen: 'LoginScreen',
    });
  };

  const SetNewPasswordResuwst = () => {
    toast.current.hideAll();
    if (password.length <= 0) {
      toast.current.show(HardCode.PleaseEnterYourPassword);

      return;
    } else if (confirmpassword.length <= 0) {
      toast.current.show(HardCode.PleaseEnterYourConfirmPassword);

      return;
    } else if (password !== confirmpassword) {
      toast.current.show(HardCode.PasswordDoesNotMathced);

      return;
    } else {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        userId: userId,
        newPassword: password,
        confirmPassword: confirmpassword,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      setLoader(true);
      fetch(`${BaseUrl}partner/Account/ResetPassword`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if (result?.errors) {
            setLoader(false);
            toast.current.show(HardCode.PasswordDoesNotMathced);
            return;
          }
          setLoader(false);
          setSuccessModal(true);
        })
        .catch(error => setLoader(false));
    }
  };

  return (
    <SafeAreaView style={style.main}>
      <Toast textStyle={{fontSize: fontSize.twelve}} ref={toast} />
      <ImageBackground
        source={
          // role === 'Gar'
          //   ? require('../../assets/Images/authBgComplete.png')
          //   : require('../../assets/Images/authBgCompleteSpa.png')
          require('../../assets/Images/authBgComplete.png')
        }
        imageStyle={style.imageBg}>
        <FocusAwareStatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={style.touchable}>
          <IoIcon
            size={fontSize.twenty}
            color={Color.iconBlackColor}
            name="arrow-back"
          />
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: scalableheight.two}}>
          <View style={{height: scalableheight.twentysix, width: '100%'}}>
            <View style={style.imgView}>
              <View>
                <Image
                  style={style.img}
                  source={require('../../assets/Images/logo.png')}
                />
              </View>
            </View>
          </View>

          <View style={style.headingMainView}>
            <View style={headingSubView}>
              <Heading style={style.heading} text={HardCode.SetANewPassword} />
              <View></View>
            </View>
          </View>

          <View>
            {ScreenData.map((inputData, id) => {
              return (
                <View key={id}>
                  <View style={style.subHeadingView}>
                    <SubHeading text={inputData.title} />
                  </View>
                  <MyFormInputTile
                    onIconPress={inputData.onIconPressFunction}
                    iconName={inputData.icon}
                    placeHolder={inputData.placeHolder}
                    secure={inputData.secureCondition}
                    onChangeText={text => {
                      inputData.onChangeTextFunction(text);
                    }}
                  />
                </View>
              );
            })}
          </View>

          <View style={style.loaderView}>
            {loader ? (
              <ActivityIndicator size={'large'} color={Color.loaderColor} />
            ) : (
              <AuthButton
                onPress={SetNewPasswordResuwst}
                title={HardCode.SAVECHANGES}
              />
            )}
          </View>
        </ScrollView>
        <SuccessModalPopup
          message={HardCode.PasswordHasBeenSuccessfullyChanged}
          yesPress={() => {
            setSuccessModal(false);
            props.navigation.navigate('Auth', {
              screen: 'LoginScreen',
            });
          }}
          bnText={HardCode.OK}
          visible={successModal}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NewPasswordScreen;
const style = StyleSheet.create({
  main: {flex: 1, bakgroundColor: Color.bgColor},
  imageBg: {
    height: '62%',
    width: '100%',

    resizeMode: 'cover',
  },
  subHeadingView: {marginVertical: 5},
  touchable: {
    height: scalableheight.five,
    width: scalableheight.five,
    backgroundColor: Color.white,
    borderRadius: 0,
    marginTop: scalableheight.four,
    marginLeft: scalableheight.onepointfive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loaderView: {marginTop: 12},
  img: {
    height: scalableheight.fifteen,
    width: scalableheight.fifteen,
    resizeMode: 'contain',
  },
  headingMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    //paddingBottom: 4,
    // backgroundColor: 'red',
  },
  headingSubView: {
    width: '100%',
    marginTop: scalableheight.fifteen,
  },
  heading: {fontSize: fontSize.seventeen, color: 'black'},
});
