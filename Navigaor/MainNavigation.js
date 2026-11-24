import React, { createRef, useEffect } from 'react';
import {
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList,
  useDrawerStatus,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import * as AuthAction from '../Store/Auth/AuthAction';
import IoIcon from '../Components/Icon/IoIcon';
import MaIcon from '../Components/Icon/MaIcon';
import Heading from '../Components/UI-Support/Heading';
import DeviceInfo from 'react-native-device-info';
import Feather from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Paragraph from '../Components/UI-Support/Paragraph';
import Color from '../Constants/Color';
import HomeScreen from '../Screens/Home/HomeScreen';
import SettingScreen from '../Screens/Profile/SettingScreen';
import ChangePassword from '../Screens/Profile/ChangePassword';
import Accountinfo from '../Screens/Profile/Accountinfo';
import MyNotification from '../Screens/Home/MyNotification';
import NewOrders from '../Screens/Orders/NewOrders';
import DeliveredOrders from '../Screens/Orders/DeliveredOrders';
import OrderDetail from '../Screens/Orders/OrderDetail';
import PastOrderDetail from '../Screens/Orders/PastOrderDetail';
import SplashScreen from '../Screens/SplashScreen';
import AutNavigator from '../Navigaor/MainNavigator';
import MenuManagement from '../Screens/MenuManagement/menuManagement';
import MenuDetail from '../Screens/MenuManagement/menuDetail';
import { useSelector, useDispatch } from 'react-redux';
import MiddleWareScreen from '../Screens/Auth/MiddleWareScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InterentConnection from '../Screens/Auth/InterentConnection';
import Location from '../Screens/Location';
import { fontSize, scalableheight } from '../Components/resposnevaraiable';
import FastImage from 'react-native-fast-image';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {
  AuthRoleActionConst,
  UserLoginActionConst,
  GetUserInformationActionConst,
  SaveLocalDataIntoReduxActionConst,
  LogoutActionConst,
  SaveServerURL,
  AUTHTOKENSTATEDISPATH,
} from '../Store/Auth/AuthActionConst';
import { useState } from 'react';
import PayToComplete from '../Screens/Orders/PayToComplete';
import { FontFamily } from '../Constants/fonts';
import { HardCode } from '../Constants/texting';
import Splash from 'react-native-splash-screen';
import { useNavigation } from '@react-navigation/native';
import RefreshToken from '../Screens/RefreshToken';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import LineArt from '../Components/UI-Support/LineArt';
import useLayout from '../Components/useLayout';
import { C, F, B } from '../Constants/tokens';
import { setNavBarTone } from '../Components/NavBarFrame';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerStyle = props => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [loader, setloader] = useState(false);
  const userInfo = useSelector(state => state.auth.userInfo);
  const token = useSelector(state => state.auth.userSuccessData);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);

  // console.log(userInfo, 'user ');
  const dispatch = useDispatch();

  useEffect(() => {
    // Ink strip + light icons while the drawer is open; white strip + dark icons otherwise.
    setNavBarTone(isDrawerOpen ? C.ink : C.surface);
    if (Platform.OS === 'android') {
      if (isDrawerOpen) {
        changeNavigationBarColor('black', false); // Change to your desired color
      } else {
        // EFF1F3
        changeNavigationBarColor('#FFFFFF', true); // Change back to the original color
      }
    }
  }, [isDrawerOpen]);

  let options = [
    {
      label: HardCode.Home,
      icon: 'home-outline',
      onPress: () => {
        props.navigation.navigate('home');
      },
      type: 1,
    },
    {
      label: HardCode.NewOrders,
      icon: 'file-text',
      onPress: () => {
        props.navigation.navigate('NewOrders');
        props.navigation.closeDrawer();
      },
      type: 2,
    },
    {
      label: HardCode.MyDeliveries,
      icon: 'clock',
      onPress: () => {
        props.navigation.navigate('DeliveredOrders');
        props.navigation.closeDrawer();
      },
      type: 2,
    },
    {
      label: HardCode.Settings,
      icon: 'settings-outline',
      onPress: () => {
        props.navigation.navigate('Setting');
        props.navigation.closeDrawer();
      },
      type: 3,
    },
  ];

  async function lougoutfunction() {
    
    // return async dispatch => {

    dispatch({
      type: LogoutActionConst.LOGOUT_ACTION,
    });
    
      const code = JSON.parse(await AsyncStorage.getItem('CountryCodeAsync'));
      const country = JSON.parse(await AsyncStorage.getItem('CountryAsync'));
      const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
      const fingerprintvalue = JSON.parse(await AsyncStorage.getItem('fingerprint'));
      await AsyncStorage.clear();
      await AsyncStorage.setItem('fingerprint', JSON.stringify(fingerprintvalue));
      await AsyncStorage.setItem('serverurl', JSON.stringify(BaseUrl));
      await AsyncStorage.setItem('CountryCodeAsync', JSON.stringify(code));
      await AsyncStorage.setItem('CountryAsync', JSON.stringify(country));    dispatch(AuthAction.resetuserurl(BaseUrl));
    

    setloader(false);
    props.navigation.replace('Auth', {
      screen: 'LoginScreen',
    });

    // };
  }

  const LogoutAction = async () => {
    const id = await DeviceInfo.getUniqueId();
    setloader(true);

    // const BaseUrl = JSON.parse(await AsyncStorage.getItem('serverurl'));
    //  const token = await AsyncStorage.getItem('AuthData',JSON.stringify(AuthData));
    console.log(BaseUrl, 'BaseUrl');
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${token?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    await fetch(
      `${BaseUrl}partner/Account/Logout?DeviceId=${id}`,
      requestOptions,
    )
      .then(response => {
        if (response.status == 200) {
          lougoutfunction()
        } else {
          console.log('hahahhah' + response.status)
          dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: true,
          });
          setloader(false);
        }
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        setloader(false);
        console.log('error', error);
      });
  };

  const layout = useLayout();
  const phone = layout === 'phone';
  const topInset = Platform.OS === 'android' ? getStatusBarHeight() : 0;

  return (
    <SafeAreaView style={styles.drawerRoot}>
      <LineArt tile={phone ? 240 : 360} opacity={0.07} />
      <View style={[styles.container, { paddingTop: topInset }]}>
        <View
          style={[
            styles.userimageview,
            phone ? styles.userPadPhone : styles.userPadTablet,
          ]}>
          <View style={styles.avatarBox}>
            {userInfo?.Result?.Logo ? (
              <FastImage
                style={{ ...styles.userimage }}
                source={{ uri: userInfo?.Result?.Logo }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <FastImage
                style={styles.userimage}
                source={require('../assets/Images/profilePlaceHolder.png')}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </View>

          <View>
            <Heading
              style={styles.userName}
              text={`${userInfo?.Result?.FirstName ? userInfo?.Result?.FirstName : ''
                } ${userInfo?.Result?.LastName ? userInfo?.Result?.LastName : ''
                }`}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              props.navigation.closeDrawer();
              // props.navigation.navigate('Accountinfo');
              props.navigation.navigate('Setting');
            }}>
            <Paragraph
              style={styles.accountLink}
              text={HardCode.AccountSettings}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollFlex} contentContainerStyle={styles.scrollContent}>
          <View style={styles.scroll}>
            {options.map((touchableData, id) => {
              // The drawer only opens over Home, so Home is the active row.
              const active = touchableData.label === HardCode.Home;
              return (
                <TouchableOpacity
                  key={id}
                  activeOpacity={1}
                  onPress={() => touchableData.onPress()}
                  style={[styles.mainrow, active && styles.mainrowActive]}>
                  <View style={[styles.iconview, active && styles.iconviewActive]}>
                    {touchableData.type == 1 ? (
                      <MaIcon
                        name={touchableData.icon}
                        size={22}
                        color={C.surface}
                      />
                    ) : touchableData.type == 2 ? (
                      <Feather
                        name={touchableData.icon}
                        size={20}
                        color={C.surface}
                      />
                    ) : touchableData.type == 3 ? (
                      <IoIcon
                        name={touchableData.icon}
                        size={21}
                        color={C.surface}
                      />
                    ) : (
                      touchableData.type == 4 && (
                        <AntIcon
                          name={touchableData.icon}
                          size={20}
                          color={C.surface}
                        />
                      )
                    )}
                  </View>

                  <View style={styles.paraview}>
                    <Paragraph style={styles.para} text={touchableData.label} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.logoutArea}>
            {loader === true ? (
              <View style={styles.logoutLoader}>
                <ActivityIndicator size={'large'} color={Color.loaderColor} />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  LogoutAction();
                }}
                style={styles.logoutBtn}>
                <View style={styles.paraview}>
                  <Paragraph style={styles.para} text={HardCode.Logout} />
                </View>
                <View>
                  <Feather name="log-out" size={20} color={C.surface} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  const layout = useLayout();
  const drawerWidth = layout === 'phone' ? 280 : 360;

  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: Color.btnBgColor,

        itemStyle: {
          borderRadius: 0,
          marginVertical: 3,
          borderBottomWidth: 0.5,
          borderBottomColor: Color.lightGray,
        },
      }}
      contentContainerStyle={styles.drawer}
      drawerType="slide"
      overlayColor="transparent"
      // initialRouteName="DrawerStack"
      drawerStyle={{
        width: '60%',
        backgroundColor: 'transparent',
      }}
      sceneContainerStyle={{
        backgroundColor: 'transparent',
      }}
      screenOptions={{
        // React Navigation 7 reads drawer options from screenOptions.
        drawerType: 'slide',
        overlayColor: C.scrim,
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: C.ink,
          borderRadius: 0,
        },
        sceneStyle: { backgroundColor: C.ground },
      }}
      drawerContent={props => {


        return <CustomDrawerStyle navigation={props.navigation} />;
      }}>
      <Drawer.Screen name="home" options={{ headerShown: false }}>
        {props => (
          <HomeScreen {...props} />
        )}
      </Drawer.Screen>
      {/* <Drawer.Screen name="NewOrders" options={{headerShown: false}}>
        {props => <NewOrders {...props} drawerAnimationStyle={animatedStyle} />}
      </Drawer.Screen>
      <Drawer.Screen name="DeliveredOrders" options={{headerShown: false}}>
        {props => (
          <DeliveredOrders {...props} drawerAnimationStyle={animatedStyle} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="MenuManagement" options={{headerShown: false}}>
        {props => (
          <MenuManagement {...props} drawerAnimationStyle={animatedStyle} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Setting" options={{headerShown: false}}>
        {props => (
          <SettingScreen {...props} drawerAnimationStyle={animatedStyle} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="contactUs" options={{headerShown: false}}>
        {props => (
          <ContactUsScreen {...props} drawerAnimationStyle={animatedStyle} />
        )}
      </Drawer.Screen> */}
    </Drawer.Navigator>
  );
};

const navTheme = {
  colors: {
    background: 'transparent',
  },
};
export const navigationRef = createRef();
const MainNavigation = () => {
  const [imageshow, setImageshow] = useState(false);
  setTimeout(() => {
    setImageshow(true);
  }, 2000);
  return (
    <NavigationContainer theme={navTheme} ref={navigationRef} onReady={() => Splash.hide()}>
      {/* <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          height: Dimensions.get('window').height,
          width: '100%',
        }}></View> */}
      {imageshow ? (
        <View style={[styles.image, styles.groundFill]} />
      ) : null}
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="MiddleWareScreen" component={MiddleWareScreen} />
        <Stack.Screen name="Auth" component={AutNavigator} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NewOrders" component={NewOrders} />
        <Stack.Screen name="DeliveredOrders" component={DeliveredOrders} />
        <Stack.Screen name="MenuManagement" component={MenuManagement} />
        <Stack.Screen name="MenuDetail" component={MenuDetail} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="PastOrderDetail" component={PastOrderDetail} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="Accountinfo" component={Accountinfo} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="MyNotification" component={MyNotification} />
        <Stack.Screen name="Location" component={Location} />
        <Stack.Screen name="PayToComplete" component={PayToComplete} />

        <Stack.Screen
          name="InterentConnection"
          component={InterentConnection}
        />
      </Stack.Navigator>
      <RefreshToken
        reset={() => {
          navigationRef.current.navigate('Auth', {
            screen: 'LoginScreen',
          });
        }}
      />
    </NavigationContainer>
  );
};
const INK_ROW_BG = 'rgba(255,255,255,0.04)';
const INK_TILE_BG = 'rgba(255,255,255,0.08)';
const styles = StyleSheet.create({
  drawerRoot: { flex: 1, backgroundColor: C.ink, overflow: 'hidden' },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  userimageview: {
    width: '100%',
    gap: 12,
    borderBottomWidth: B.hair,
    borderBottomColor: C.inkRule,
  },
  userPadPhone: { paddingTop: 28, paddingHorizontal: 20, paddingBottom: 20 },
  userPadTablet: { paddingTop: 32, paddingHorizontal: 24, paddingBottom: 24 },
  avatarBox: {
    width: 72,
    height: 72,
    backgroundColor: C.surface,
    overflow: 'hidden',
  },
  userimage: {
    height: 72,
    width: 72,
  },
  userName: {
    color: C.surface,
    fontSize: 22,
    fontFamily: F.black,
  },
  accountLink: {
    fontSize: 15,
    fontFamily: F.bold,
    color: C.placeholder,
    textDecorationLine: 'underline',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  groundFill: { backgroundColor: C.ground },
  drawer: {
    flex: 1,
  },
  para: {
    fontSize: 17,
    color: C.surface,
    fontFamily: F.bold,
  },
  paraview: { flex: 1, justifyContent: 'center' },
  iconview: {
    height: 40,
    width: 40,
    backgroundColor: INK_TILE_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconviewActive: { backgroundColor: C.accent },
  mainrow: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    borderBottomWidth: B.hair,
    borderBottomColor: C.inkRule,
    borderLeftWidth: B.heavy,
    borderLeftColor: C.transparent,
  },
  mainrowActive: {
    borderLeftColor: C.accent,
    backgroundColor: INK_ROW_BG,
  },
  scrollFlex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  scroll: {},
  logoutArea: { marginTop: 'auto', padding: 16 },
  logoutLoader: { height: 56, justifyContent: 'center', alignItems: 'center' },
  logoutBtn: {
    height: 56,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderWidth: B.rule,
    borderColor: C.surface,
  },
});

export default MainNavigation;
