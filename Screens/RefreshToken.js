import { ActivityIndicator, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { fontSize, scalableWidth, scalableheight } from "../Components/resposnevaraiable";
import Color from "../Constants/Color";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontFamily } from "../Constants/fonts";
import { commonStylying } from "../Constants/AddWrapper";
import AuthButton from "../Components/UI-Support/AuthButton";
import { GetRefreshToken } from "../Store/Auth/AuthAction";
import { AUTHTOKENSTATEDISPATH, UserLoginActionConst } from "../Store/Auth/AuthActionConst";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from 'react-native-device-info';
import FocusAwareStatusBar from "../Components/UI-Support/customStatusBar";
import * as AuthAction from '../Store/Auth/AuthAction';
import { navigationRef } from "../Navigaor/MainNavigation";
import { DialogCard, DialogFooter, IconTile, dialogStyles } from "../Components/UI-Support/Dialog";
import { C, F } from "../Constants/tokens";
const RefreshToken = (props) => {

    const AuthTokenStateDispath = useSelector(state => state.auth.AuthTokenStateDispath);
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(false)

    const refreshing = async () => {
        try {
            setLoader(true)
            const localData = await AsyncStorage.getItem('AuthData');
            const userdata = await JSON.parse(localData);
            if (userdata !== null) {

                GetRefreshTokenhit(userdata?.Result?.AuthData?.TokenInfo);
            }
        } catch (error) {
            navigationRef?.current?.resetRoot({
                index: 0,
                routes: [
                    {
                        name: 'Auth',
                        state: {
                            routes: [{ name: 'LoginScreen' }],
                        },
                    },
                ],
            });
        }
    }
    const GetRefreshTokenhit = async tokenObj => {
        AuthAction.GetRefreshToken(tokenObj, props, async (result) => {
            if (result.Status === 'Success') {

                ValidationFunction(result.Result)
                console.log(result.Result, 'abab');
            }
            else {
                setLoader(false)

            }

        }, () => {
            setLoader(false)
            dispatch({
                type: AUTHTOKENSTATEDISPATH,
                payload: false,
            });
            navigationRef?.current?.resetRoot({
                index: 0,
                routes: [
                    {
                        name: 'Auth',
                        state: {
                            routes: [{ name: 'LoginScreen' }],
                        },
                    },
                ],
            });
        })
    }

    const saveDataIntoStorage = async AuthData => {
        await AsyncStorage.setItem('AuthData', JSON.stringify(AuthData));
    };

    const saveUserIdIntoLocal = async userId => {
        await AsyncStorage.setItem('UserId', JSON.stringify(userId));
    };

    const ValidationFunction = async (res) => {
        let refData = res;
        const localData = await AsyncStorage.getItem('AuthData');
        const userdata = await JSON.parse(localData);
        let isToUpdate = userdata;


        isToUpdate.Result.AuthData.TokenInfo = refData;

        dispatch(AuthAction.SaveUserDataIntoRedux(isToUpdate));

        saveDataIntoStorage(isToUpdate);
        saveUserIdIntoLocal(isToUpdate?.Result?.RestaurantServiceStaff?.Id);
        setLoader(false)
        dispatch({
            type: AUTHTOKENSTATEDISPATH,
            payload: false,
        });
        console.log('success');


    };
    return (
        AuthTokenStateDispath ? (
            <SafeAreaView
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: C.scrim,
                    position: 'absolute',
                    top: 0,
                    zIndex: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <FocusAwareStatusBar
                    barStyle={'light-content'}
                    backgroundColor="transparent"
                />
                <DialogCard>
                    <View style={dialogStyles.body}>
                        <IconTile
                            icon={
                                <FontAwesome
                                    name="exclamation-circle"
                                    size={28}
                                    color={C.accentDeep}
                                />
                            }
                        />
                        <Text style={styles.modalText}>
                            Your session has been expired due to inactivity
                        </Text>
                    </View>
                    <DialogFooter>
                        {loader ?
                            <View style={dialogStyles.loaderBox}>
                                <ActivityIndicator
                                    size={'large'}
                                    color={Color.btnBgColor}
                                />
                            </View> :
                            <AuthButton title={'Refresh Session'}
                                container={dialogStyles.flexBtn}
                                iconName="refresh-cw"
                                onPress={() => {
                                    refreshing()
                                }}
                            />

                        }
                    </DialogFooter>
                </DialogCard>
            </SafeAreaView>
        ) : null
    );
};

export default RefreshToken;
const styles = StyleSheet.create({
    hitSlop: {
        top: scalableheight.three,
        bottom: scalableheight.three,
        right: scalableheight.three,
        left: scalableheight.three,
    },
    tabletext: {
        fontFamily: FontFamily.Bold,
        fontSize: fontSize.twelve,
        paddingLeft: scalableheight.onepointfive,
        color: Color.black,
        alignItems: 'center',
    },
    table: {
        height: scalableheight.seven,
        width: '100%',
        flexDirection: 'row',

        backgroundColor: '#EBEBEB',
        color: '#000',
        borderRadius: 0,
        marginVertical: scalableheight.onepointfive,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    semiBoldText: {
        fontSize: fontSize.twelve,
        fontFamily: FontFamily.Bold,
        color: Color.black,
    },
    mainView: {
        // backgroundColor: Color.bgColor,
        width: '100%',
        height: '100%',

    },
    noReqContainer: {
        width: '100%',
        minHeight: scalableheight.fourtyTwo, //300
        // maxHeight: 900,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        // backgroundColor: 'red',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header1: {
        justifyContent: 'center',
    },
    logoStyles: {
        height: scalableheight.eight,
        width: scalableheight.twentyfour,
    },
    header2: {
        alignItems: 'center',

        flexDirection: 'row',
        // backgroundColor: 'red',
    },
    filterPopup: {
        // width: '10%',
        position: 'absolute',
        right: commonStylying.paddingHorizontalParent,
        bottom: scalableheight.three,
        backgroundColor: '#DBDADA',
        width: scalableheight.seventeen,
        height: scalableheight.six,
    },
    filter: {
        fontFamily: FontFamily.SemiBold,
        fontSize: scalableheight.three,
        color: Color.techBlack,
    },
    maintiletop: {
        width: '100%',
        //  flex: 1,
        backgroundColor: '#EBEBEB',
        // height: 'auto',
        // margin: scalableheight.pointfive,
        borderRadius: 0,
        marginBottom: scalableheight.four,
        marginRight: scalableheight.one,

    },
    online: {
        backgroundColor: Color.greenColor,
        width: '20%',
        borderRadius: 0,
        paddingVertical: scalableheight.pointfive,
        marginTop: scalableheight.one,
    },
    time: {
        width: '33%',
        position: 'absolute',
        right: scalableheight.two,
        zIndex: 1000,
        borderRadius: 0,
        borderBottomEndRadius: fontSize.borderradius,
        borderBottomStartRadius: fontSize.borderradius,
    },
    DeliveryTime: {
        fontFamily: FontFamily.Bold,
        fontSize: fontSize.eight,
        color: Color.white,
        marginLeft: scalableWidth.pointFive,
    },
    Name: {
        color: Color.btnBgColor,
        fontSize: fontSize.eight,
        fontFamily: FontFamily.Medium,
    },
    OrderNo: {
        color: Color.techBlack,
        fontSize: fontSize.ten,
        fontFamily: FontFamily.Bold,
        // fontWeight: '700',
        marginVertical: scalableheight.pointfive,
    },
    orderplacementtime: {
        // fontWeight: '700',
        color: Color.techGrey,
        fontSize: fontSize.four,
        fontFamily: FontFamily.Bold,
    },
    UpdatesUI: {
        color: Color.techGrey,
        fontSize: fontSize.four,
        fontFamily: FontFamily.Bold,
        textAlign: 'center',
        marginBottom: scalableheight.one,
    },
    itemName: {
        fontFamily: FontFamily.Bold,
        fontSize: fontSize.nine,
        color: Color.techBlack,
    },
    commentrow: {
        flexDirection: 'row',
        backgroundColor: '#FFF2F2',
        // marginTop: scalableheight.one,
        borderRadius: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: scalableheight.one,
        maxWidth: '85%',
    },
    quantityview: {
        // backgroundColor: '#E7E7E7',
        width: scalableheight.three,
        height: scalableheight.three,
        position: 'absolute',
        right: 0,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottompart: {
        padding: scalableheight.two,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    buttonrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    Cusinfo: {
        fontFamily: FontFamily.SemiBold,
        fontSize: fontSize.four,
        color: '#29262A',
        color: Color.btnBgColor,
    },
    refreshButton: {
        backgroundColor: '#49444a',
        height: scalableheight.seven,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '18%',
    },
    lastrow: {
        marginTop: scalableheight.two,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemHeading: {
        fontFamily: FontFamily.Medium,
        fontSize: fontSize.eight,
        color: Color.btnBgColor,
        width: '50%',
    },
    itemHeading2: {
        fontFamily: FontFamily.Medium,
        fontSize: fontSize.ten,
        color: Color.btnBgColor,
    },
    amount: {
        fontFamily: FontFamily.SemiBold,
        fontSize: fontSize.eight,
        color: Color.techBlack,
        textAlign: 'right',
        width: '50%',
        // fontWeight:'700'
    },
    popUpHeader: {
        flexDirection: 'row',
        marginTop: scalableheight.pointfive,
        borderRadius: 0,
        alignItems: 'center',
    },
    supervisorname: {
        fontFamily: FontFamily.Bold,
        fontSize: fontSize.two,
        color: '#29262A',
        color: Color.techBlack,
    },
    kitchenHeading: {
        fontFamily: FontFamily.Bold,
        fontSize: fontSize.two,
        color: Color.btnBgColor,
        textAlign: 'right',
    },
    logout: {
        fontFamily: FontFamily.SemiBold,
        fontSize: fontSize.eight,
        color: Color.white,
    },
    popUpinnerPricerow: {
        flexDirection: 'row',
        marginTop: scalableheight.one,
        borderRadius: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customer: {
        fontFamily: FontFamily.SemiBold,
        fontSize: fontSize.four,
        color: Color.techBlack,
    },
    contact: {
        fontFamily: FontFamily.SemiBold,
        fontSize: fontSize.four,
        color: Color.techGrey,
    },
    instruction: {
        color: Color.commentalret,
        paddingLeft: scalableheight.two,
        fontSize: fontSize.eight,
        fontFamily: FontFamily.Medium,
        maxWidth: '85%',
    },
    circle: {
        width: scalableheight.six,
        height: scalableheight.six,
        backgroundColor: Color.techBlack,
        borderRadius: 0,
        justifyContent: 'center',
    },
    circleanother: {
        width: scalableheight.six,
        height: scalableheight.six,
        backgroundColor: Color.techBlack,
        borderRadius: 0,
        justifyContent: 'center',
        width: scalableWidth.nine,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconView: {
        alignItems: 'center',
    },
    seprator: {
        borderBottomWidth: 1,
        marginVertical: scalableheight.two,
        width: '100%',
        borderStyle: 'solid',
        borderBottomColor: '#e8e8e8',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: '#000000d4',
    },
    cutomerView: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Color.white,
        borderRadius: 0,
        padding: scalableheight.one,
        borderWidth: 0.12,
        // borderTopColor: '#000',
    },
    profileimageview: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        width: '35%',
        height: '100%',
        // paddingVertical: '1%',

        backgroundColor: 'white',
        borderRadius: 0,
        // alignItems: 'center',
        padding: scalableWidth.onePointFive,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    text4: {
        color: Color.techBlack,
        fontSize: fontSize.eight,
        fontFamily: FontFamily.Medium,
        textAlign: 'center',
        paddingLeft: scalableheight.one,
    },
    heading: {
        fontFamily: FontFamily.SatoshiBold,
        fontSize: fontSize.sixteen,
        color: 'black',
    },
    mainviewoffers: {
        padding: scalableheight.one,
        marginRight: scalableheight.one,
        borderRadius: 0,
        justifyContent: 'center',
        marginVertical: scalableheight.one,
    },
    text: {
        fontFamily: FontFamily.Regular,
        fontSize: fontSize.seven,
        color: Color.techBlack,
        fontWeight: '600',
    },
    Touchable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: scalableheight.pointfive,
        alignItems: 'center',
        // backgroundColor:'red'
    },
    optiondescription: {
        fontFamily: FontFamily.Regular,
        fontSize: fontSize.eight,
        color: Color.techBlack,
    },
    mainHeading: {
        color: Color.techBlack,
        fontSize: fontSize.eight,
        fontFamily: FontFamily.Bold,
        fontWeight: '700',
    },
    EbillmainHeading: {
        color: Color.techBlack,
        fontSize: fontSize.eight,
        fontFamily: FontFamily.SemiBold,
    },
    centeredView1: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#000000d4',
    },
    modalView1: {
        padding: scalableheight.three,
        width: '90%',

        backgroundColor: 'white',
        borderRadius: 0,

        alignItems: 'center',
        alignSelf: "center"
    },
    button: {
        borderRadius: 0,
        padding: scalableheight.one,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: Color.btnBgColor,
        width: '8%',
        marginHorizontal: scalableheight.onepointfive,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: fontSize.ten,
    },
    modalText: {
        fontSize: 18,
        lineHeight: 25,
        fontFamily: F.bold,
        color: C.ink,
    },
    mainview2: { height: '100%', width: '100%', flexDirection: 'row' },
    touchview: { width: '65%', height: '100%' },
    searchingcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: scalableheight.three,
    },
    view: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: scalableheight.three,
    },
    txtinputview: {
        flexDirection: 'row',
        width: '50%',
        backgroundColor: '#EBEBEB',
        borderRadius: 0,
    },
    txtinput: {
        width: '92%',
        color: 'black',
        backgroundColor: Color.inputBg,
        paddingLeft: scalableheight.two,
        height: scalableheight.six,
        fontSize: fontSize.ten,
        fontFamily: FontFamily.Medium,
        borderRadius: 0,
    },
    searchicon: {
        backgroundColor: '#49444a',
        height: scalableheight.five,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '7%',
        marginLeft: -scalableheight.three,
    },
    scroll: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    activityIndicator: {
        width: '100%',
        height: scalableheight.sixty,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headview: {
        alignItems: 'center',
        width: '100%',
        marginTop: scalableheight.twentyeight,
    },
    headingstyle: {
        fontSize: fontSize.ten,
        color: Color.techGrey,
        fontFamily: FontFamily.Medium,
    },
    dineinimage: {
        height: scalableheight.three,
        width: scalableheight.three,
    },
    mapview: {
        backgroundColor: Color.white,
        padding: scalableheight.two,
        // height: 'auto',
        // maxHeight: scalableheight.twentyfour,
        // minHeight: scalableheight.twentyfour,
    },
    txtQuan: {
        textAlign: 'center',
        color: Color.techBlack,
        fontSize: fontSize.two,
        fontFamily: FontFamily.Bold,
    },
    txtQuan2: { textAlign: 'center', color: Color.techBlack },
    modaltouchview: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'absolute',
        right: 0,
    },
    touchtxt: {
        textAlign: 'right',
        fontSize: fontSize.eight,
        fontFamily: FontFamily.Medium,
        color: '#29262A90',
    },
    modalimg: {
        height: scalableheight.three,
        width: scalableheight.three,
    },
    commentrow2: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        borderRadius: 0,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        maxWidth: '100%',
    },
    instruction2: {
        fontSize: fontSize.eleven,
        maxWidth: '100%',
        padding: scalableheight.one,
        color: Color.greyText,
    },
    instruction3: {
        color: Color.techBlack,
        fontSize: fontSize.fifteen,
        width: '90%',
        textAlign: 'left',
        paddingLeft: 0,
    },

    modalsubview: {
        // height: '45%',
        // height:'auto',
        backgroundColor: 'white',
        // paddingHorizontal: '2%',
        justifyContent: 'center',
        padding: scalableheight.one,
        borderRadius: 0,
        paddingTop: scalableheight.two,
    },
    modalsubview1: {
        // position: 'absolute',
        // bottom: 0,
        // zIndex: 1,
        paddingHorizontal: '2%',
    },
    logo1: {
        width: scalableheight.tweleve,
        height: scalableheight.tweleve,
        alignSelf: 'center',
        borderRadius: 0,
    },
    iosseprator: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: scalableheight.one,
    },
    seprator2: {
        borderBottomWidth: 1,
        marginVertical: scalableheight.one,
        width: '100%',
        borderStyle: 'dashed',
        borderBottomColor: 'black',
    },
    mainHeading2: {
        color: Color.techBlack,
        fontSize: fontSize.eight,
        fontFamily: FontFamily.Regular,
    },
    prinitngRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    prinitngRow1: {
        justifyContent: 'center',
        width: '50%',
    },
    prinitngRowText: {
        color: 'black',
        fontSize: fontSize.eight,
        textAlign: 'left',
        fontFamily: FontFamily.SemiBold,
    },
    ButtonsRow: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        paddingHorizontal: commonStylying.paddingHorizontalParent,
        bottom: scalableheight.two,
    },

    ButtonView: {
        width: '48%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    powertag: {
        color: Color.techBlack,
        fontSize: fontSize.ten,
        alignSelf: 'center',
        textAlign: 'center',
    },
    logo: {
        width: '100%',
        height: scalableheight.seven,
        alignSelf: 'center',
        marginBottom: scalableheight.three,
    },
});