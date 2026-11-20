import React, { useEffect, useRef } from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Linking,
    AppState,
    Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import * as AuthAction from '../../Store/Auth/AuthAction';
import { useDispatch, useSelector } from 'react-redux';
import Color from '../../Constants/Color';
import { fontSize, scalableheight, scalableWidth } from '../../Components/resposnevaraiable';
import { FontFamily } from '../../Constants/fonts';
import SubHeading from '../../Components/UI-Support/SubHeading';
import AuthButton from '../../Components/UI-Support/AuthButton';



const LocationConnectionComponent = () => {
    const dispatch = useDispatch();
    const locationConnectionScreen = useSelector(
        state => state.auth.locationConnectionScreen
    );
    const appState = useRef(AppState.currentState);


    const openSettings = () => {
        Linking.openSettings().catch(() => {
            Alert.alert('Error', 'Unable to open settings');
        });
    };
    const checkLocationEnabled = async () => {
        const openSetting = () => {
            Linking.openSettings().catch(() => {
                Alert.alert('Error', 'Unable to open settings');
            });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');

        if (status === 'granted') {
            return true;
        }

        if (status === 'denied') {
            console.log('Error', 'Location permission denied');
        }

        if (status === 'disabled') {
            Alert.alert(
                `Turn on Location Services to allow app to determine your location.`,
                '',
                [
                    { text: 'Go to Settings', onPress: openSetting },
                    { text: "Don't Use Location", onPress: () => { } },
                ],
            );
        }
        return false;
    };
    const checkLocationAllowedAllTime = async () => {
        try {
            let hasPermission = false;

            if (Platform.OS === 'android') {
                const fgGranted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                // let bgGranted = true;

                // if (locationConnectionScreen?.msg !== 'Location Permission Denied splash') {
                //     bgGranted = await PermissionsAndroid.check(
                //         PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
                //     );
                // }

                if (fgGranted
                    // && bgGranted
                ) hasPermission = true;

            } else if (Platform.OS === 'ios') {
                const isLocationEnabled = await checkLocationEnabled();
                if (isLocationEnabled) {
                    hasPermission = true
                }
            }

            if (hasPermission) {
                dispatch(
                    AuthAction.LocationConnectionAction({
                        msg: '',
                        bol: true,
                    })
                );
            }
        } catch (err) {
            console.log('Location check error:', err);
        }
    };

    useEffect(() => {
        checkLocationAllowedAllTime();

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                checkLocationAllowedAllTime();
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, [locationConnectionScreen?.msg]);

    if (locationConnectionScreen.bol) return null;

    return (
        <SafeAreaView style={style.SafeAreaView}>
            <View style={style.View1}>
                <View style={style.View2}>
                    <MaterialIcons
                        name="location-off"
                        size={scalableheight.thirty}
                        color={Color.gray}
                    />
                </View>
            </View>

            <View style={style.oflineview}>
                <SubHeading
                    style={style.ofline}
                    text={
                        locationConnectionScreen?.msg
                            ? locationConnectionScreen?.msg?.replace('splash', '')
                            : 'Location Permission Denied'
                    }
                />

                <SubHeading
                    style={style.SubHeading1}
                    text="Please enable location services to allow all the time."
                />

                <SubHeading
                    style={style.SubHeadings}
                    text="Turn on GPS or allow location permission in settings."
                />

                <AuthButton
                    title="Open Settings"
                    onPress={openSettings}
                    container={{ width: '90%', marginTop: scalableheight.three }}
                />
            </View>
        </SafeAreaView>
    );


};

export default LocationConnectionComponent;

const style = StyleSheet.create({
    SafeAreaView: {
        height: '100%',
        width: '100%',
        backgroundColor: Color.bgColor,
        position: 'absolute',
        top: 0,
        zIndex: 100,
    },
    View1: {
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    View2: {
        justifyContent: 'center',
        alignItems: 'center',
        top: scalableWidth.three,
    },
    oflineview: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
    },
    ofline: {
        fontFamily: FontFamily.Bold,
        fontSize: fontSize.fourteen,
        color: '#29262A',
    },
    SubHeading1: {
        fontFamily: FontFamily.SemiBold,
        fontSize: fontSize.eleven,
        color: Color.gray,
    },
    SubHeadings: {
        fontFamily: FontFamily.SemiBold,
        fontSize: fontSize.eleven,
        color: Color.gray,
        textAlign: 'center',
    },
});
