import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AuthButton from './AuthButton';
import Paragraph from './Paragraph';
import SubHeading from './SubHeading';
import TransparentHeader from './TransparentHeader';
import {
  Camera,
  getCameraDevice,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera';
import { HardCode } from '../../Constants/texting';
import { C, F } from '../../Constants/tokens';
import useLayout from '../useLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DialogCard, DialogFooter, IconTile, dialogStyles } from './Dialog';
const Qrpopup = props => {
  const [qrvalue, setQrvalue] = useState('');
  const [areyousurevisible, setareyousurevisible] = useState(false);
  const [camscanner, setCamScanner] = useState(false);
  const [scanpermission, setScanPermission] = useState(true);
  const layout = useLayout();
  const insets = useSafeAreaInsets();
  // const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  const devices = useCameraDevices();
  const device = getCameraDevice(devices, "back");
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      // A code entering the frame half-visible/blurred is reported with no
      // decoded value; only accept a real string (this caused "invalid QR" on
      // the first scan).
      const hit = codes.find(
        c => typeof c?.value === 'string' && c.value.trim() !== '',
      );
      if (hit) {
        setQrvalue(hit.value.trim());
      }
    },
  });
  useEffect(() => {
    setCamScanner(false);
    requestCameraPermission();
  }, [props.state]);
  useEffect(() => {
    if (qrvalue != '') {
      props.codescanned(qrvalue, 'Hellow');
      setTimeout(() => {
        setQrvalue('');
      }, 2000);
    }
  }, [qrvalue]);
  // useEffect(() => {
  //   if (barcodes.length > 0) {
  //     setQrvalue(barcodes[0]?.rawValue);
  //     console.log(barcodes[0]?.rawValue, 'kkkk');


  //     // // setTimeout(() => {
  //     // setQrvalue('');
  //     // // }, 2000);
  //   }
  // }, [barcodes]);
  const requestCameraPermission = async () => {
    if (Platform.OS != 'ios') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: HardCode.FougitoFoodAppCameraPermission,
            message: HardCode.FougitoFoodAppNeedsAccessToYourCameraToScanQRCode,
            buttonNeutral: HardCode.AskMeLater,
            buttonNegative: HardCode.Cancel,
            buttonPositive: HardCode.OK,
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setCamScanner(true);
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    if (Platform.OS == 'ios') {
      setCamScanner(true);
    }
  };
  const frameSize =
    layout === 'tabletLandscape' ? 360 : layout === 'tabletPortrait' ? 440 : 240;
  return (
    // Full-screen layer (Modal) so the camera covers the whole display no matter
    // which screen opens it (Order Detail sits inside a SafeAreaView).
    <Modal
      visible={props.state == true}
      animationType="fade"
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={props.pressback}>
      <View style={{ ...styles.centeredView, zIndex: 10 }}>
        {camscanner && device != null && (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={scanpermission}
            codeScanner={codeScanner}
          />
        )}
        {/* 55% ink scrim + scan frame (6px accent corners, accent scan line) */}
        <View pointerEvents="none" style={styles.scrim} />
        <View pointerEvents="none" style={styles.frameWrap}>
          <View style={[styles.frame, { width: frameSize, height: frameSize }]}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <View style={styles.scanLine} />
          </View>
          <Text style={styles.hint}>{HardCode.ScanHint}</Text>
        </View>

        <TransparentHeader
          title={HardCode.ScanQRCode}
          refresh={qrvalue}
          onpressback={props.pressback}
          top={insets.top}
        // onpress={() => {
        // //   setvisible(false);
        // //   setScanPermission(true);
        // //   setQrvalue('');
        // }}
        />

        {camscanner && (
          <>
            {/* <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={scanpermission}
              frameProcessor={frameProcessor}
              frameProcessorFps={1}
            /> */}

            {areyousurevisible && (
              <View style={styles.mainView}>
                <DialogCard>
                  <View style={dialogStyles.body}>
                    <IconTile name="help-circle" />
                    {/* <Heading style={{color: 'black', fontSize: 20}} text="Oops" /> */}

                    <Paragraph
                      style={dialogStyles.message}
                      text={`${HardCode.AreYouSureYouWantToAssign} ${qrvalue} ${HardCode.toYourself}`}
                    />
                  </View>
                  <DialogFooter>
                    <TouchableOpacity
                      onPress={() => {
                        setareyousurevisible(false);
                      }}
                      style={dialogStyles.outlineBtn}>
                      <SubHeading style={dialogStyles.outlineText} text={HardCode.No} />
                      <Feather name="x" size={20} color={C.ink} />
                    </TouchableOpacity>
                    <AuthButton
                      container={dialogStyles.flexBtn}
                      iconName="check"
                      title={HardCode.YES}
                      onPress={() => {
                        setareyousurevisible(false);
                        props.codescanned(qrvalue);
                      }}
                    />
                  </DialogFooter>
                </DialogCard>
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: C.ink,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.scrim,
  },
  frameWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: { position: 'relative' },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: C.accent,
  },
  tl: { left: 0, top: 0, borderLeftWidth: 6, borderTopWidth: 6 },
  tr: { right: 0, top: 0, borderRightWidth: 6, borderTopWidth: 6 },
  bl: { left: 0, bottom: 0, borderLeftWidth: 6, borderBottomWidth: 6 },
  br: { right: 0, bottom: 0, borderRightWidth: 6, borderBottomWidth: 6 },
  hint: {
    marginTop: 24,
    paddingHorizontal: 24,
    textAlign: 'center',
    color: C.surface,
    fontFamily: F.bold,
    fontSize: 16,
  },
  scanLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: '50%',
    height: 2,
    backgroundColor: C.accent,
  },
  mainView: {
    height: '100%',
    width: '100%',
    backgroundColor: C.scrim,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 20,
  },
});

export default Qrpopup;
