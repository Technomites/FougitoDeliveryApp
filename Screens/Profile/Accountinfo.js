import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';

import AuthButton from '../../Components/UI-Support/AuthButton';
import MyFormInputTile from '../../Components/UI-Support/MyFormInputTile';
import IoIcon from '../../Components/Icon/IoIcon';
import BackHeader from '../../Components/UI-Support/BackHeader';
import NumberInput from '../../Components/UI-Support/NumberInput';
import { useSelector, useDispatch } from 'react-redux';
// import { BaseUrl } from '../../Components/BaseUrl';
import * as ProfileAction from '../../Store/Auth/AuthAction';
import {
  AUTHTOKENSTATEDISPATH,
  GetUserInformationActionConst,
} from '../../Store/Auth/AuthActionConst';
import SuccessModalPopup from '../../Components/UI-Support/SuccessModalPopup';
import ImagePicker from 'react-native-image-crop-picker';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import { totalSize } from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import { commonStylying } from '../../Constants/AddWrapper';
import * as DataAction from '../../Store/Data/DataAction';
import { FontFamily } from '../../Constants/fonts';
import { HardCode } from '../../Constants/texting';
import { getAllCountries } from 'react-native-country-picker-modal';
import BottomBar from '../../Components/UI-Support/BottomBar';
import { useDevice } from '../../Components/useLayout';
import { C, F, B } from '../../Constants/tokens';

const Accountinfo = props => {
  const userInfo = useSelector(state => state.auth.userInfo);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const [loader, setLoader] = useState(false);
  const [succModal, setSuccModal] = useState(false);
  const [pickImage, setPickImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [imageLoader, setImageLoader] = useState(false);
  const [countryCode, setCountryCode] = useState('971');
  const [country, setCountry] = useState('AE');
  const region = useSelector(state => state.auth.region);

  console.log(userInfo?.Result?.Logo);

  const [formFields, setFOrmFields] = useState({
    firstName: userInfo?.Result?.FirstName ? userInfo?.Result?.FirstName : '',
    lastName: userInfo?.Result?.LastName ? userInfo?.Result?.LastName : '',
    email: userInfo?.Result?.Email ? userInfo?.Result?.Email : '',
    phoneNumber: userInfo?.Result?.PhoneNumber
      ? userInfo?.Result?.PhoneNumber.slice(3, 15)
      : '',
    pickImage:
      userInfo?.Result?.Logo === '' || userInfo?.Result?.Logo === null
        ? ''
        : userInfo?.Result?.Logo,
  });
  console.log('====================================');
  console.log(userInfo);
  console.log('====================================');

  // alert(JSON.stringify(userInfo?.Result?.Id));
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );

  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const dispatch = useDispatch();

  const ScreenData = [
    {
      title: HardCode.FirstName,

      placeHolder: HardCode.EnterFirstNameHere,
      value: formFields.firstName,
      onChangeTextFunction: text => {
        setFOrmFields({
          ...formFields,
          firstName: text,
        });
      },
    },
    {
      title: HardCode.LastName,

      placeHolder: HardCode.EnterLastNameHere,
      value: formFields.lastName,

      onChangeTextFunction: text => {
        setFOrmFields({
          ...formFields,
          lastName: text,
        });
      },
    },
    {
      title: HardCode.EmailOptional,

      placeHolder: HardCode.EnterEmailHere,
      value: formFields.email,

      onChangeTextFunction: text => {
        setFOrmFields({
          ...formFields,
          email: text,
        });
      },
    },
  ];
  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);

  // useEffect(() => {
  //   handleCountries();
  // }, [userInfo]);
  useEffect(() => {
    setCountry(region?.country)
    setCountryCode(region?.countryCode)

  }, []);
  // const handleCountries = async () => {
  //   const allCountries = await getAllCountries();
  //   const findCountry = allCountries.find(
  //     x => x.callingCode[0] === userInfo?.Result?.CountryCode,
  //   );
  //   if (findCountry) {
  //     setCountry(findCountry.cca2);
  //     setCountryCode(findCountry.callingCode[0]);
  //   }
  // };

  const getUserInformation = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}Partner/DeliveryStaff/ByUser`, requestOptions)
      .then(response => response.json())
      .then(result => {
        dispatch(ProfileAction.UserInformationAction(result));
        setLoader(false);
        setSuccModal(true);
      })
      .catch(error => {
        setLoader(false);
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log(error);
      });
  };

  const upadteUserInformation = () => {
    //alert(userSuccessData?.Result?.AuthData?.TokenInfo?.Token);
    if (formFields.firstName === '') {
      // toast.current.show('First name cannot be empty');
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.FirstNameCannotBeEmpty,
        ),
      );

      return;
    } else if (formFields.lastName === '') {
      // toast.current.show('Last name cannot be empty');
      dispatch(
        DataAction.ToastMessageSenderScreenAction(
          HardCode.LastNameCannotBeEmpty,
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
        id: userSuccessData?.Result?.RestaurantDeliveryStaff?.Id,
        firstname: formFields.firstName,
        lastname: formFields.lastName,
        email: formFields.email,
        restaurantbranchID:
          userSuccessData?.Result?.RestaurantDeliveryStaff?.RestaurantBranchId,
        restaurantID:
          userSuccessData?.Result?.RestaurantDeliveryStaff?.RestaurantId,
        Logo: imageUrl,
      });

      console.log(raw, 'YAHHAHAHAAHAH');

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${BaseUrl}Partner/DeliveryStaff`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          setTimeout(() => {
            getUserInformation();
          }, 100);
        })
        .catch(error => {
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          console.log('error', error);
        });
    }
  };

  const getImageUrlLink = async path => {
    setImageLoader(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'multipart/form-data');
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var photo = {
      uri: path,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };

    var formdata = new FormData();
    formdata.append('file', photo);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    await fetch(`${BaseUrl}File/Mobile`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.Status === 'Success') {
          console.log(result.Result, 'YAHAHHAHAHAHAHAHHAHAH');
          setFOrmFields({
            ...formFields,
            pickImage: result.Result,
          });
          setImageUrl(result.Result);
          setImageLoader(false);
          // imagesUrl.push(result);
          //setImagesUrl(oldState => [...oldState, result.Result]);
          //alert('image success');
        }
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error);
      });
  };

  const PickImage = () => {
    ImagePicker.openPicker({
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      compressImageQuality: 0.8,
      maxFiles: 10,
      mediaType: 'photo',
      includeBase64: true,
    })
      .then(response => {
        console.log(response.path);
        setPickImage(response.path);
        getImageUrlLink(response.path);
      })
      .catch(e => console.log(e, 'Error'));
  };

  const { layout, isPhone, gutter } = useDevice();
  const landscape = layout === 'tabletLandscape';
  const photo = landscape ? 200 : isPhone ? 96 : 128;

  return (
    <SafeAreaView style={style.mainView}>
      <FocusAwareStatusBar
        style={style.statusStrip}
        barStyle={'dark-content'}
        backgroundColor="transparent"
      />
      <BackHeader
        title={HardCode.AccountInfo}
        onPress={() => props.navigation.goBack()}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={style.flex1}
        contentContainerStyle={[
          style.ScrollViewLowerView,
          landscape ? style.rowLayout : null,
          {
            paddingHorizontal: gutter,
            paddingVertical: isPhone ? 20 : 32,
            gap: landscape ? 48 : 24,
          },
        ]}>
        <View style={landscape ? style.photoCol : null}>
          <TouchableOpacity
            onPress={Keyboard.dismiss}
            activeOpacity={1}
            style={[style.imageview, { width: photo, height: photo }]}>
            <FastImage
              style={[style.image, style.imageLayer, { width: photo, height: photo }]}
              source={require('../../assets/Images/profilePlaceHolder.png')}
              resizeMode={FastImage.resizeMode.cover}
            />
            <FastImage
              style={[style.image, style.imageLayer, { width: photo, height: photo, zIndex: 1 }]}
              source={{
                uri: formFields.pickImage,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            {
              <TouchableOpacity
                onPress={() => PickImage()}
                style={style.Touchable}>
                {imageLoader === true ? (
                  <ActivityIndicator size={'small'} color={C.surface} />
                ) : (
                  <IoIcon
                    name="camera-outline"
                    size={22}
                    color={C.surface}
                  />
                )}
              </TouchableOpacity>
            }
          </TouchableOpacity>
        </View>
        <View style={[style.fields, { gap: isPhone ? 16 : 20 }]}>
          <KeyboardAvoidingView
            style={{ gap: isPhone ? 16 : 20 }}
            // style={{width: '100%', height: '100%'}}
            behavior={Platform.OS === 'ios' ? 'padding' : ''}>
            {ScreenData.map((inputData, id) => {
              return (
                <View key={id} style={style.maininner}>
                  <SubHeading style={style.text} text={inputData.title} />
                  <MyFormInputTile
                    onChangeText={text => {
                      inputData.onChangeTextFunction(text);
                    }}
                    value={inputData.value}
                    placeHolder={inputData.placeHolder}
                    keyboardType="default"
                  />
                </View>
              );
            })}
          </KeyboardAvoidingView>
          <View>
            {/* PHONE NUMBER INPUT */}
            <View style={style.maininner}>
              <SubHeading style={style.text} text={HardCode.PhoneNumber} />
              <NumberInput
                editable={false}
                countryCode={countryCode}
                countryFlag={country}
                value={formFields.phoneNumber}
                onChangeText={text => { }}
                fontStyle={{ color: C.ink }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomBar>
        {loader ? (
          <View style={style.loaderBox}>
            <ActivityIndicator size={'large'} color={Color.loaderColor} />
          </View>
        ) : (
          <AuthButton
            container={isPhone ? style.btnPhone : style.btnTablet}
            iconName="check"
            onPress={upadteUserInformation}
            title={HardCode.SAVE}
          />
        )}
      </BottomBar>
      <SuccessModalPopup
        visible={succModal}
        message={HardCode.ProfileHasBeenSuccessfullyUpdated}
        yesPress={() => {
          setSuccModal(false);
          // props.navigation.goBack();
        }}
        bnText={HardCode.OK}
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  text: {
    fontFamily: F.bold,
    fontSize: 15,
    letterSpacing: 0,
    color: C.ink,
  },
  imageview: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  image: {
    resizeMode: 'contain',
  },
  imageLayer: { position: 'absolute', top: -1, left: -1 },
  maininner: { gap: 8 },
  mainView: { flex: 1, backgroundColor: C.ground },
  statusStrip: { backgroundColor: C.surface },
  flex1: { flex: 1 },
  ScrollViewLowerView: {},
  rowLayout: { flexDirection: 'row', alignItems: 'flex-start' },
  photoCol: { width: 280 },
  fields: { width: '100%', maxWidth: 560, flexShrink: 1 },
  Touchable: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 44,
    height: 44,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  loaderBox: { height: 56, justifyContent: 'center', alignItems: 'center' },
  btnPhone: { width: '100%' },
  btnTablet: { width: 360 },
});
export default Accountinfo;
