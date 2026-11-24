import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import Heading from '../../Components/UI-Support/Heading';
import IconBg from '../../Components/UI-Support/IconBg';
import IoIcon from '../../Components/Icon/IoIcon';
import BackHeader from '../../Components/UI-Support/BackHeader';
import {scalableheight, fontSize} from '../../Components/resposnevaraiable';
import {useSelector, useDispatch} from 'react-redux';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import FastImage from 'react-native-fast-image';
import {HardCode} from '../../Constants/texting';
import {FontFamily} from '../../Constants/fonts';
import {ScrollView} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useGrid, useBottomInset} from '../../Components/useLayout';
import {C, F, B} from '../../Constants/tokens';

const SettingScreen = props => {
  const ScreenData = [
    {
      navigation: 'Accountinfo',
      icon: 'person-outline',
      title: HardCode.AccountInfo,
    },
    {
      navigation: 'ChangePassword',
      icon: 'lock-closed-outline',
      title: HardCode.ChangePassword,
    },
  ];
  const userInfo = useSelector(state => state.auth.userInfo);
  // const internetConnectionStatus = useSelector(
  //   state => state.data.internetConnectionStatus,
  // );
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (internetConnectionStatus === false) {
  //     props.navigation.replace('InterentConnection');
  //   }
  // }, [internetConnectionStatus]);
  const grid = useGrid();
  const bottomInset = useBottomInset();

  return (
    <View style={[style.animatedView, props.drawerAnimationStyle]}>
      <SafeAreaView style={style.mainView}>

        <FocusAwareStatusBar
          style={style.statusStrip}
          barStyle={'dark-content'}
          backgroundColor="transparent"
        />
        <BackHeader
          title={HardCode.Settings}
          onPress={() => props.navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: grid.gutter,
            paddingTop: grid.isPhone ? 20 : 28,
            paddingBottom: (grid.isPhone ? 20 : 28) + bottomInset,
            gap: 20,
          }}>
          <View style={style.maincontainer}>
            <View style={style.imgMainView}>
              <View style={style.avatar}>
                <View style={style.avatarLayer}>
                  <FastImage
                    style={style.image}
                    resizeMode={FastImage.resizeMode.cover}
                    source={require('../../assets/Images/profilePlaceHolder.png')}
                  />
                </View>
                <View style={[style.avatarLayer, {zIndex: 1}]}>
                  <FastImage
                    style={{...style.image}}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri:
                        userInfo?.Result?.Logo === null ||
                        userInfo?.Result?.Logo === ''
                          ? 'https://img.freepik.com/free-vector/automotive-auto-repair-logo_160069-1.jpg'
                          : userInfo?.Result?.Logo,
                    }}
                  />
                </View>
              </View>
              <View style={style.subHeadingView}>
                <SubHeading
                  style={style.welcome}
                  text={HardCode.WelcomeWithoutComa + ','}
                />
                <SubHeading
                  style={[style.text, {fontSize: grid.isPhone ? 28 : 36}]}
                  text={[userInfo?.Result?.FirstName, userInfo?.Result?.LastName]
                    .filter(Boolean)
                    .join(' ')}
                />
              </View>
            </View>
          </View>
          <View style={style.innerview}>
            {ScreenData.map((touchableData, id) => {
              return (
                <View key={id} style={{width: grid.tileW}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      props.navigation.navigate(touchableData.navigation)
                    }>
                    <View style={style.touchablelowerView}>
                      <View style={style.view4}>
                        <IoIcon
                          name={touchableData.icon}
                          size={22}
                          color={C.ink}
                        />
                      </View>
                      <View style={style.flexMin}>
                        <SubHeading
                          style={style.text2}
                          text={touchableData.title}
                        />
                      </View>
                      <Feather name="chevron-right" size={22} color={C.ink} />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
const style = StyleSheet.create({
  maincontainer: {
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
    paddingBottom: 16,
  },
  image: {
    height: 72,
    width: 72,
    resizeMode: 'contain',
  },
  avatar: {width: 72, height: 72, backgroundColor: C.surface},
  avatarLayer: {position: 'absolute', top: 0, left: 0},
  welcome: {
    color: C.muted,
    fontSize: 18,
    letterSpacing: 0,
    fontFamily: F.medium,
  },
  text: {
    color: C.ink,
    letterSpacing: -0.5,
    fontFamily: F.black,
  },
  innerview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  text2: {
    color: C.ink,
    fontSize: 17,
    letterSpacing: 0,
    fontFamily: F.bold,
  },
  animatedView: {flex: 1, overflow: 'hidden', backgroundColor: C.ground},
  mainView: {flex: 1, backgroundColor: C.ground},
  statusStrip: {backgroundColor: C.surface},
  imgMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  subHeadingView: {flex: 1, minWidth: 0, gap: 4},
  flexMin: {flex: 1, minWidth: 0},
  touchablelowerView: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  view4: {
    width: 44,
    height: 44,
    backgroundColor: C.disabled,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SettingScreen;
