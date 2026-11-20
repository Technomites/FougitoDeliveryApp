import React from 'react';
import {
  SafeAreaView,
  ImageBackground,
  Image,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Touchable,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/EvilIcons';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from '../Screens/SplashScreen';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';
import IoIcon from '../Components/Icon/IoIcon';
import MaIcon from '../Components/Icon/MaIcon';
import SubHeading from '../Components/UI-Support/SubHeading';
import Heading from '../Components/UI-Support/Heading';

import FantIcon from 'react-native-vector-icons/Fontisto';
import AntIcon from 'react-native-vector-icons/AntDesign';

//Home
import SpareHomeScreen from '../Screens/SpareParts/Home/SpareHomeScreen';
import Paragraph from '../Components/UI-Support/Paragraph';
import Color from '../Constants/Color';
import FaIcon from '../Components/Icon/FaIcon';
import MyInvoiceScreen from '../Screens/Home/MyInvoiceScreen';
import MyInvoiceDetailScreen from '../Screens/Home/MyInvoiceDetailScreen';
import CreateInvoice from '../Screens/Home/CreateInvoice';
import SpareContactUsScreen from '../Screens/SpareParts/Profile/SpareContactUsScreen';
//import SettingScreen from '../Screens/Profile/SettingScreen';
import SpareSettingScreen from '../Screens/SpareParts/Profile/SpareSettingScreen';
//import ChangePassword from '../Screens/Profile/ChangePassword';
import SpareChangePassword from '../Screens/SpareParts/Profile/SpareChangePassword';
//import Accountinfo from '../Screens/Profile/Accountinfo';
import SpareAccountinfo from '../Screens/SpareParts/Profile/SpareAccountinfo';

import SpareWalletScreen from '../Screens/SpareParts/Profile/SpareWalletScreen';
import SpareMyNotification from '../Screens/SpareParts/Home/SpareMyNotification';

//Request
import AddRequest from '../Screens/Request/AddRequest';
import MyRequestScreen from '../Screens/Request/MyRequestScreen';
import SpareViewRequest from '../Screens/SpareParts/Request/SpareViewRequest';
import SpareMyQuote from '../Screens/SpareParts/Request/SpareMyQuote';
import SpareRequestDeatils from '../Screens/SpareParts/Request/SpareRequestDeatils';
import SpareRequestDeatilsQuote from '../Screens/SpareParts/Request/SpareRequestDeatilsQuote';
import RequestDeatilsQuoteTracking from '../Screens/Request/RequestDeatilsQuoteTracking';
import RequestDeliveryMap from '../Screens/Request/RequestDeliveryMap';
import ViewQuotes from '../Screens/Request/ViewQuotes';
import RequestDeatilsQuoteReportReturnStatus from '../Screens/Request/RequestDeatilsQuoteReportReturnStatus';
import ReportSparePart from '../Screens/Request/ReportSparePart';
import RequestDeatilsQuoteReportStatus from '../Screens/Request/RequestDeatilsQuoteReportStatus';
import SpareSendAQuote from '../Screens/SpareParts/Request/SpareSendAQuote';
import SpareRequestDeliveryMap from '../Screens/SpareParts/Request/SpareRequestDeliveryMap';
import {FontFamily} from '../Constants/fonts';
import {HardCode} from '../Constants/texting';

//Setting
//import Setting from '../Screens/Profile/Settings';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Bottom = createBottomTabNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SpareHomeScreen" component={SpareHomeScreen} />
      <Stack.Screen
        name="MyInvoiceDetailScreen"
        component={MyInvoiceDetailScreen}
      />

      <Stack.Screen
        name="SpareMyNotification"
        component={SpareMyNotification}
      />
      <Stack.Screen name="SpareSettingScreen" component={SpareSettingScreen} />
      <Stack.Screen name="AddRequest" component={AddRequest} />
      <Stack.Screen name="SpareViewRequest" component={SpareViewRequest} />
      <Stack.Screen name="SpareMyQuote" component={SpareMyQuote} />
      <Stack.Screen name="MyInvoiceScreen" component={MyInvoiceScreen} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
      <Stack.Screen name="SpareWalletScreen" component={SpareWalletScreen} />
      <Stack.Screen name="SpareSendAQuote" component={SpareSendAQuote} />
    </Stack.Navigator>
  );
};

// const CustomDrawerStyle = props => {
//   return (
//     <View>
//       <ImageBackground
//         style={{height: 250, width: '100%'}}
//         source={require('../assets/Images/GrodrawerBg.png')}>
//         <View
//           style={{
//             height: 50,
//             width: '100%',

//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexDirection: 'row',
//           }}>
//           <TouchableOpacity
//             onPress={() => props.navigation.closeDrawer()}
//             style={{
//               height: 50,
//               width: '15%',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <IoIcon name="arrow-back" size={25} color="black" />
//           </TouchableOpacity>
//           <View
//             style={{
//               height: 50,
//               width: '40%',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <Image
//               style={{height: 40, width: 130, resizeMode: 'contain'}}
//               source={require('../assets/Images/logo.png')}
//             />
//           </View>
//         </View>

//         <View
//           style={{
//             width: '100%',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: 200,
//           }}>
//           <View>
//             <Image
//               style={{
//                 height: 100,
//                 width: 100,
//                 resizeMode: 'contain',
//                 marginBottom: 5,
//               }}
//               source={{
//                 uri: 'https://img.freepik.com/free-vector/automotive-auto-repair-logo_160069-1.jpg',
//               }}
//             />
//           </View>
//           <View>
//             <Heading style={{color: 'black'}} text="Jimmy's Garage" />
//           </View>

//           <TouchableOpacity>
//             <Paragraph text="Account Settings" />
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>
//       <ScrollView>
//         <DrawerItemList {...props} />
//         <View
//           style={{
//             marginLeft: 20,
//             marginTop: 20,
//             justifyContent: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => props.navigation.closeDrawer()}
//             style={{flexDirection: 'row'}}>
//             <View
//               style={{
//                 height: 30,
//                 width: 30,
//                 backgroundColor: '#f2f4f5',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <MaIcon name="logout" size={22} color={Color.btnBgColor} />
//             </View>

//             <View style={{marginLeft: 30}}>
//               <Paragraph
//                 style={{fontSize: 12, color: 'black', marginTop: 5}}
//                 text="Log out"
//               />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

const CustomDrawerStyle = props => {
  return (
    <View>
      <ImageBackground
        style={{height: 250, width: '100%'}}
        source={require('../assets/Images/GrodrawerBg.png')}>
        <View
          style={{
            height: 50,
            width: '100%',

            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => props.navigation.closeDrawer()}
            style={{
              height: 50,
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <IoIcon name="arrow-back" size={25} color={Color.iconBlackColor} />
          </TouchableOpacity>
          <View
            style={{
              height: 50,
              width: '40%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{height: 40, width: 120, resizeMode: 'contain'}}
              source={require('../assets/Images/logo.png')}
            />
          </View>
        </View>

        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            borderRadius: 0,
          }}>
          <View>
            <Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 0,
                resizeMode: 'contain',
                marginBottom: 5,
              }}
              source={{
                uri: 'https://img.freepik.com/free-vector/automotive-auto-repair-logo_160069-1.jpg',
              }}
            />
          </View>
          <View>
            <Heading style={{color: 'black'}} text={HardCode.JimmysGarage} />
          </View>

          <TouchableOpacity>
            <Paragraph text={HardCode.AccountSettings} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <ScrollView>
        <View
          style={{
            marginLeft: 20,
            marginTop: 12,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => props.navigation.navigate('home')}
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              borderBottomColor: Color.lightGray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
              width: '95%',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#ebebeb',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                bottom: 5,
              }}>
              <MaIcon name="home-outline" size={23} color={Color.iconColor} />
            </View>

            <View style={{marginLeft: 30}}>
              <Paragraph
                style={{
                  fontSize: 12,
                  color: Color.paranormaltextColor,
                  fontFamily: FontFamily.Bold,

                  marginTop: 5,
                  right: 10,
                  bottom: 5,
                }}
                text={HardCode.Home}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => props.navigation.navigate('MyRequest')}
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              borderBottomColor: Color.lightGray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
              width: '95%',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#ebebeb',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                bottom: 5,
              }}>
              <FantIcon name="file-2" size={17} color={Color.iconColor} />
            </View>

            <View style={{marginLeft: 30}}>
              <Paragraph
                style={{
                  fontSize: 12,
                  color: Color.paranormaltextColor,
                  fontFamily: FontFamily.Bold,

                  marginTop: 5,
                  right: 10,
                  bottom: 5,
                }}
                text={HardCode.MyQuotes}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => props.navigation.navigate('SpareMyWallet')}
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              borderBottomColor: Color.lightGray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
              width: '95%',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#ebebeb',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                bottom: 5,
              }}>
              <IoIcon name="wallet-outline" size={18} color={Color.iconColor} />
            </View>

            <View style={{marginLeft: 30}}>
              <Paragraph
                style={{
                  fontSize: 12,
                  color: Color.paranormaltextColor,
                  fontFamily: FontFamily.Bold,

                  marginTop: 5,
                  right: 10,
                  bottom: 5,
                }}
                text={HardCode.MyWallet}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => props.navigation.navigate('SpareSettingScreen')}
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              borderBottomColor: Color.lightGray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
              width: '95%',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#ebebeb',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                bottom: 5,
              }}>
              <IoIcon
                name="settings-outline"
                size={22}
                color={Color.iconColor}
              />
            </View>

            <View style={{marginLeft: 30}}>
              <Paragraph
                style={{
                  fontSize: 12,
                  color: Color.paranormaltextColor,
                  fontFamily: FontFamily.Bold,

                  marginTop: 5,
                  right: 10,
                  bottom: 5,
                }}
                text={HardCode.Settings}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => props.navigation.navigate('ContactUsScreen')}
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              borderBottomColor: Color.lightGray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
              width: '95%',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#ebebeb',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                bottom: 5,
              }}>
              <AntIcon name="phone" size={20} color={Color.iconColor} />
            </View>

            <View style={{marginLeft: 30}}>
              <Paragraph
                style={{
                  fontSize: 12,
                  color: Color.paranormaltextColor,
                  fontFamily: FontFamily.Bold,

                  marginTop: 5,
                  right: 10,
                  bottom: 5,
                }}
                text={HardCode.ContactUs}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => props.navigation.replace('Auth')}
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              borderBottomColor: Color.lightGray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
              width: '95%',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#ebebeb',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
                bottom: 5,
              }}>
              <MaIcon name="logout" size={22} color={Color.iconColor} />
            </View>

            <View style={{marginLeft: 30}}>
              <Paragraph
                style={{
                  fontSize: 12,
                  color: Color.paranormaltextColor,
                  fontFamily: FontFamily.Bold,

                  marginTop: 5,
                  right: 10,
                  bottom: 5,
                }}
                text={HardCode.Logout}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{activeTintColor: Color.btnBgColor}}
      drawerContent={CustomDrawerStyle}>
      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#f2f4f5',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
              }}>
              <IoIcon name="home-outline" size={22} color={Color.iconColor} />
            </View>
          ),
          drawerLabel: () => (
            <Paragraph
              style={{fontSize: 12, color: Color.paraBlackColor}}
              text={HardCode.Home}
            />
          ),
        }}
        name="home"
        component={HomeNavigator}
      />

      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#f2f4f5',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
              }}>
              <FaIcon name="file-o" size={22} color={Color.iconColor} />
            </View>
          ),
          drawerLabel: () => (
            <Paragraph
              style={{fontSize: 12, color: Color.paraBlackColor}}
              text={HardCode.MyQuotes}
            />
          ),
        }}
        name="MyRequest"
        component={SpareMyQuote}
      />

      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#f2f4f5',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
              }}>
              <IoIcon name="wallet-outline" size={22} color={Color.iconColor} />
            </View>
          ),
          drawerLabel: () => (
            <Paragraph
              style={{fontSize: 12, color: Color.paraBlackColor}}
              text={HardCode.MyWallet}
            />
          ),
        }}
        name="SpareMyWallet"
        component={SpareWalletScreen}
      />

      {/* <Drawer.Screen
        options={{
          drawerIcon: () => (
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#f2f4f5',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
              }}>
              <IoIcon
                name="newspaper-outline"
                size={22}
                color={Color.btnBgColor}
              />
            </View>
          ),
          drawerLabel: () => (
            <Paragraph
              style={{fontSize: 12, color: 'black'}}
              text="Raised Invoice"
            />
          ),
        }}
        name="RaisedInvoice"
        component={MyInvoiceScreen}
      /> */}

      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#f2f4f5',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
              }}>
              <IoIcon
                name="settings-outline"
                size={22}
                color={Color.iconColor}
              />
            </View>
          ),
          drawerLabel: () => (
            <Paragraph
              style={{fontSize: 12, color: Color.paraBlackColor}}
              text={HardCode.Setting}
            />
          ),
        }}
        name="Setting"
        component={SpareSettingScreen}
      />

      <Drawer.Screen
        options={{
          drawerIcon: () => (
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: '#f2f4f5',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 0,
              }}>
              <FaIcon name="podcast" size={22} color={Color.iconColor} />
            </View>
          ),
          drawerLabel: () => (
            <Paragraph
              style={{fontSize: 12, color: Color.paraBlackColor}}
              text={HardCode.ContactUs}
            />
          ),
        }}
        name="contactUs"
        component={SpareContactUsScreen}
      />
    </Drawer.Navigator>
  );
};

const BottomNavigator = () => {
  return (
    <Bottom.Navigator>
      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <MaIcon
              name="home-outline"
              size={23}
              color={focused ? Color.iconColor : '#29262A'}
            />
          ),
          tabBarLabel: ({focused}) => (
            <SubHeading
              text={HardCode.Home}
              style={{
                fontSize: 10,
                color: focused
                  ? Color.headingColor
                  : Color.headingnormaltextColor,
                bottom: 5,
              }}
            />
          ),
        }}
        name="BottomTab"
        component={DrawerNavigator}
        listeners={({navigation}) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            navigation.navigate('SpareHomeScreen'); // Here!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          },
        })}
      />

      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <FaIcon
              name="file-o"
              size={17}
              color={focused ? Color.iconColor : '#29262A'}
            />
          ),
          tabBarLabel: ({focused}) => (
            <SubHeading
              text={HardCode.MyQuotes}
              style={{
                fontSize: 10,
                color: focused
                  ? Color.headingColor
                  : Color.headingnormaltextColor,
                bottom: 5,
              }}
            />
          ),
        }}
        name="My Quotes"
        component={SpareMyQuote}
      />

      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="bell"
              size={30}
              color={focused ? Color.iconColor : '#29262A'}
            />
          ),
          tabBarLabel: ({focused}) => (
            <SubHeading
              text="Alerts"
              style={{
                fontSize: 10,
                color: focused
                  ? Color.headingColor
                  : Color.headingnormaltextColor,
                bottom: 5,
              }}
            />
          ),
        }}
        name={HardCode.Alerts}
        component={SpareMyNotification}
      />

      <Bottom.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <IoIcon
              name="person-outline"
              size={20}
              color={focused ? Color.iconColor : '#29262A'}
            />
          ),
          tabBarLabel: ({focused}) => (
            <SubHeading
              text={HardCode.Profile}
              style={{
                fontSize: 10,
                color: focused
                  ? Color.headingColor
                  : Color.headingnormaltextColor,
                bottom: 5,
              }}
            />
          ),
        }}
        name="Profile"
        component={SpareSettingScreen}
      />
    </Bottom.Navigator>
  );
};
const GarageNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="bottom"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="bottom" component={BottomNavigator} />
      <Stack.Screen name="drawer" component={DrawerNavigator} />
      <Stack.Screen name="AddRequest" component={AddRequest} />
      <Stack.Screen name="SpareViewRequest" component={SpareViewRequest} />
      <Stack.Screen name="SpareMyQuote" component={SpareMyQuote} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
      <Stack.Screen
        name="SpareRequestDeatils"
        component={SpareRequestDeatils}
      />
      <Stack.Screen name="ViewQuotes" component={ViewQuotes} />
      <Stack.Screen
        name="SpareRequestDeatilsQuote"
        component={SpareRequestDeatilsQuote}
      />
      <Stack.Screen
        name="RequestDeatilsQuoteTracking"
        component={RequestDeatilsQuoteTracking}
      />
      <Stack.Screen name="RequestDeliveryMap" component={RequestDeliveryMap} />
      <Stack.Screen
        name="RequestDeatilsQuoteReportReturnStatus"
        component={RequestDeatilsQuoteReportReturnStatus}
      />
      <Stack.Screen name="MyRequestScreen" component={MyRequestScreen} />
      <Stack.Screen name="ReportSparePart" component={ReportSparePart} />
      <Stack.Screen
        name="RequestDeatilsQuoteReportStatus"
        component={RequestDeatilsQuoteReportStatus}
      />
      <Stack.Screen
        name="SpareRequestDeliveryMap"
        component={SpareRequestDeliveryMap}
      />
      <Stack.Screen
        name="SpareChangePassword"
        component={SpareChangePassword}
      />
      <Stack.Screen name="SpareAccountinfo" component={SpareAccountinfo} />
    </Stack.Navigator>
  );
};

export default GarageNavigator;
