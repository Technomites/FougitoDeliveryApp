import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BackHeader from '../../Components/UI-Support/BackHeader';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import { fontSize, scalableheight } from '../../Components/resposnevaraiable';
import Color from '../../Constants/Color';
import SubHeading from '../../Components/UI-Support/SubHeading';
import { commonStylying } from '../../Constants/AddWrapper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Heading from '../../Components/UI-Support/Heading';
import AuthButton from '../../Components/UI-Support/AuthButton';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Fontisto';
import Paragraph from '../../Components/UI-Support/Paragraph';
import { getQRcode, shortPulling } from '../../Store/Auth/AuthAction';
import { FontFamily } from '../../Constants/fonts';
import { HardCode } from '../../Constants/texting';
import { width } from 'react-native-dimension';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
import DeliveredSuccess from '../../Components/UI-Support/DeliveredSuccess';
import { dialogStyles, useDialogMetrics } from '../../Components/UI-Support/Dialog';
import { useDevice, useBottomInset } from '../../Components/useLayout';
import { useRootInsets } from '../../Components/NavBarFrame';
import { C, F, B } from '../../Constants/tokens';
const PayToComplete = props => {
  const userInfo = useSelector(state => state.auth.userInfo);
  const dispatch = useDispatch();
  let deatilsresult = props.route.params.deatilsresult;
  let orderId = props.route.params.orderId;
  const [loading, setLoading] = useState(true);
  const [MdoalVisible, setMdoalVisible] = useState(false);
  const [cardPay, setcardPay] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderroom, setLoaderroom] = useState(false);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const QRcoding = useSelector(state => state.auth.qrcode);

  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  useEffect(() => {
    dispatch(
      getQRcode(orderId, userSuccessData?.Result?.AuthData?.TokenInfo.Token),
    );
  }, []);
  const checkset = () => {
    setLoading(false);
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  };
  useEffect(() => {
    dispatch(
      shortPulling(
        orderId,
        userSuccessData?.Result?.AuthData?.TokenInfo.Token,
        checkset,
      ),
    );
    setTimeout(() => {
      setCount(count + 1);
    }, 5000);
  }, [count]);
  const ChangeStatusAPi = () => {
    setLoader(true);

    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}partner/orders/${orderId}/Status/5?${deatilsresult?.PaymentMethod == 'RoomPayment' ? 'PaymentMethod=RoomPayment&IsPaymentMethodCash=true' : 'IsPaymentMethodCash=true'}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result, 'cash payment');
        if (result?.Result) {
          setLoader(false);
          setMdoalVisible(false);
          setVisible(true);
        } else {
          setLoader(false);
        }
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });
  };
  const CardPayment = () => {
    setLoader(true);

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

    fetch(`${BaseUrl}partner/orders/${orderId}/PaidByCard`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result, 'change status card');
        if (result?.Result) {
          setLoader(false);
          setMdoalVisible(false);
          setVisible(true);
        } else {
          setLoader(false);
        }
      })
      .catch(error => {
        setLoader(false);
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
      });
  };
  const ChangeStatusAPiroom = () => {
    setLoaderroom(true);

    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${userSuccessData?.Result?.AuthData?.TokenInfo?.Token}`,
    );

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}partner/orders/${orderId}/Status/5?PaymentMethod=RoomPayment`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result, 'change status 222222222');
        if (result?.Result) {
          setLoaderroom(false);
          setMdoalVisible(false);
          setVisible(true);
        } else {
          setLoaderroom(false);
        }
      })
      .catch(error => {
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)
        setLoaderroom(false)
      });
  };
  // console.log(
  //   deatilsresult?.PaymentMethod,
  //   'deatilsresult?.Restaurant?.OrderPaymentType',
  // );
  // ---- Fougito layout (visual only) ----
  const { layout, isPhone, gutter } = useDevice();
  const landscape = layout === 'tabletLandscape';
  const tabletPortrait = layout === 'tabletPortrait';
  const dialog = useDialogMetrics();
  const bottomInset = useBottomInset();
  const rootInsets = useRootInsets();
  const modalPad = {
    paddingBottom: rootInsets.bottom,
    paddingLeft: rootInsets.left,
    paddingRight: rootInsets.right,
  };
  const qrSize = isPhone ? 240 : 260;

  const billRow = (label, value) => (
    <View style={styles.subHeadingMainView}>
      <SubHeading style={styles.para} text={label} />
      <SubHeading style={[styles.para, styles.num]} text={value} />
    </View>
  );

  const totalHero = (size) => (
    <View style={styles.hero}>
      <SubHeading style={styles.caps13} text={HardCode.TOTAL} />
      <SubHeading
        style={[styles.heroAmount, { fontSize: size, lineHeight: size }]}
        text={
          `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TotalAmount.toFixed(2)
        }
      />
    </View>
  );

  const qrBlock = (
    <View style={styles.imgView}>
      {deatilsresult?.Restaurant?.OrderPaymentType === 'COD' ? (
        <>
          <View style={styles.codOverlay}>
            <MaterialCommunityIcons
              name="cancel"
              size={qrSize * 0.55}
              color={C.accent}
            />
          </View>
          <Image
            resizeMode="stretch"
            style={[
              styles.img,
              { width: qrSize, height: qrSize, opacity: 0.5 },
            ]}
            source={require('../../assets/Images/qr-code.png')}
          />
        </>
      ) : QRcoding ? (
        <Image
          resizeMode="stretch"
          source={{ uri: `data:image/png;base64, ${QRcoding}` }}
          style={[styles.img, { width: qrSize, height: qrSize }]}
        />
      ) : (
        <View
          style={{
            height: qrSize,
            width: qrSize,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} color={Color.loaderColor} />
        </View>
      )}
    </View>
  );

  const billBlock = (
    <View style={landscape ? styles.billFlat : styles.billCard}>
      {billRow(HardCode.SubTotal, `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.Amount.toFixed(2))}
      {billRow(
        HardCode.DeliveryCharges,
        `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.DeliveryCharges.toFixed(2),
      )}
      {billRow(
        `${HardCode.VATAmount} (${deatilsresult?.TaxPercent})%`,
        `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TaxAmount.toFixed(2),
      )}
      {billRow(
        `${HardCode.CouponDiscount} (${deatilsresult?.DiscountPercent})%`,
        `- ${userInfo?.Result?.RestaurantBranch?.Currency} ` +
        deatilsresult?.CouponDiscount.toFixed(2),
      )}
      <View style={styles.totalRow}>
        <SubHeading style={styles.para2} text={HardCode.Total + ' Amount'} />
        <SubHeading
          style={[styles.para2, styles.num]}
          text={
            `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TotalAmount.toFixed(2)
          }
        />
      </View>
    </View>
  );

  const paymentBlock = (
    <>
      <View style={styles.waiting}>
        <View style={styles.waitingicon}>
          {deatilsresult?.Restaurant?.OrderPaymentType === 'COD' ? (
            <MaterialCommunityIcons
              name="cancel"
              size={28}
              color={C.muted}
            />
          ) : loading ? (
            <ActivityIndicator size={'small'} color={Color.loaderColor} />
          ) : (
            <Feather
              name="check-circle"
              size={28}
              color={C.green}
            />
          )}
        </View>

        <View style={styles.waitingsub}>
          {deatilsresult?.Restaurant?.OrderPaymentType === 'COD' ? (
            <SubHeading
              style={styles.waitingTitle}
              text={HardCode.NoServiceAvailable}
            />
          ) : loading ? (
            <>
              <SubHeading
                style={styles.waitingTitle}
                text={HardCode.WaitingForPayment}
              />
              <Text style={styles.para3}>
                <SubHeading
                  style={styles.para3}
                  text={HardCode.AfterPaymentWillMarkYour}
                />
                <SubHeading
                  style={styles.para3}
                  text={HardCode.orderAsDelivered}
                />
              </Text>
            </>
          ) : (
            <SubHeading
              style={[styles.waitingTitle, { color: C.green }]}
              text={HardCode.PaymentComplete}
            />
          )}
        </View>
      </View>
      <View style={styles.abstxtView}>
        <View style={styles.emptyView}></View>
        <Text style={styles.abstxt}>{HardCode.OR}</Text>
        <View style={styles.emptyView}></View>
      </View>
      {loaderroom ?
        (<ActivityIndicator style={{ marginVertical: 16 }} size={'large'} color={Color.loaderColor} />)

        : (
          <>
            <TouchableOpacity
              onPress={() => {
                setcardPay(false)
                setMdoalVisible(true);
              }}
              style={styles.optionTile}>
              <View style={styles.optionIcon}>
                <FontAwesome5
                  name="money-bill-wave"
                  size={20}
                  color={C.accentDeep}
                />
              </View>

              <View style={styles.flexMin}>
                <SubHeading
                  style={styles.optionTitle}
                  text={HardCode.SwitchToCashPayment}
                />
                <SubHeading
                  style={[styles.para3]}
                  text={HardCode.ReceivePaymentInCash}
                />
              </View>
              <Feather name="chevron-right" size={22} color={C.ink} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setcardPay(true)
                setMdoalVisible(true);
              }}
              style={styles.optionTile}>
              <View style={styles.optionIcon}>
                <FontAwesome5
                  name="credit-card"
                  size={20}
                  color={C.accentDeep}
                />
              </View>

              <View style={styles.flexMin}>
                <SubHeading
                  style={styles.optionTitle}
                  text={HardCode.SwitchToCardPayment}
                />
                <SubHeading
                  style={[styles.para3]}
                  text={HardCode.ReceivePaymentByCard}
                />
              </View>
              <Feather name="chevron-right" size={22} color={C.ink} />
            </TouchableOpacity>
            {deatilsresult?.PaymentMethod == 'RoomPayment' &&

              <AuthButton
                onPress={() => {
                  ChangeStatusAPiroom()
                }}
                iconName="key"
                container={styles.stackBtn}
                title={'Room Payment'}
              />
            }
          </>)
      }
    </>
  );

  return (
    <SafeAreaView style={styles.safeareaView}>
      <FocusAwareStatusBar
        style={styles.statusStrip}
        barStyle={'dark-content'}
        backgroundColor="transparent"
      />
      <BackHeader
        onPress={() => props.navigation.goBack()}
        title={HardCode.PaymentScreen}
        subtitle={deatilsresult?.OrderNo}
        filter={false}
      />
      {landscape ? (
        <View style={styles.landscapeRow}>
          <ScrollView
            style={styles.leftPanel}
            contentContainerStyle={[styles.leftPanelContent, { paddingBottom: 32 + bottomInset }]}>
            {totalHero(72)}
            {qrBlock}
            {billBlock}
          </ScrollView>
          <ScrollView
            style={styles.flex1}
            contentContainerStyle={[styles.rightContent, { paddingBottom: 32 + bottomInset }]}>
            {paymentBlock}
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          style={styles.mainView}
          contentContainerStyle={{
            paddingHorizontal: gutter,
            paddingTop: isPhone ? 16 : 28,
            paddingBottom: (isPhone ? 16 : 28) + bottomInset,
            gap: isPhone ? 12 : 16,
          }}>
          {tabletPortrait && totalHero(64)}
          {qrBlock}
          {billBlock}
          {paymentBlock}
        </ScrollView>
      )}
      {/* Receive Amount: dialog pattern */}
      <Modal
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
        visible={MdoalVisible}>
        <View style={[styles.centeredView, modalPad]}>
          <View style={[styles.modalView, { width: dialog.width }]}>
            <View style={styles.modalBody}>
              <View style={styles.amountBox}>
                <SubHeading style={styles.caps13} text={HardCode.Amount} />
                <SubHeading
                  style={styles.amountBig}
                  text={
                    `${userInfo?.Result?.RestaurantBranch?.Currency} ` + deatilsresult?.TotalAmount.toFixed(2)
                  }
                />
              </View>
              <Text style={styles.modalCopy}>
                <SubHeading
                  style={styles.modalCopy}
                  text={HardCode.ReceivingPaymentWillMark}
                />
                {' '}
                <SubHeading
                  style={styles.modalCopy}
                  text={HardCode.YourOrderAsDelivered}
                />
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setMdoalVisible(!MdoalVisible)}
                style={dialogStyles.outlineBtn}>
                <Heading style={dialogStyles.outlineText} text={HardCode.CLOSE} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
              {loader ? (
                <View style={styles.loaderBox}>
                  <ActivityIndicator size={'large'} color={Color.loaderColor} />
                </View>
              ) : (
                <AuthButton
                  container={styles.flexBtn}
                  compact={dialog.phone}
                  onPress={() => {
                    if (cardPay == true) {
                      CardPayment()
                    }
                    else {
                      ChangeStatusAPi()
                    }
                  }}
                  title={HardCode.RECEIVEPAYMENT}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
      {/* Delivered: full accent field (README 10) */}
      <DeliveredSuccess
        visible={visible}
        loader={loader}
        line={`${deatilsresult?.OrderNo} · ${deatilsresult?.CustomerName} · ${userInfo?.Result?.RestaurantBranch?.Currency} ${deatilsresult?.TotalAmount?.toFixed?.(2)}`}
        onReturn={() => {
          setVisible(false);
          props.navigation.navigate('Drawer');
        }}
      />
    </SafeAreaView>
  );
};

export default PayToComplete;

const styles = StyleSheet.create({
  safeareaView: {
    flex: 1,
    backgroundColor: C.ground,
  },
  statusStrip: { backgroundColor: C.surface },
  flex1: { flex: 1 },
  flexMin: { flex: 1, minWidth: 0 },
  num: { fontVariant: ['tabular-nums'] },
  landscapeRow: { flex: 1, flexDirection: 'row' },
  leftPanel: {
    width: 480,
    flexGrow: 0,
    backgroundColor: C.surface,
    borderRightWidth: B.rule,
    borderRightColor: C.ink,
  },
  leftPanelContent: {
    padding: 32,
    gap: 24,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  rightContent: {
    padding: 32,
    gap: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  hero: { gap: 4 },
  caps13: {
    fontFamily: F.bold,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.muted,
  },
  heroAmount: {
    fontFamily: F.black,
    letterSpacing: -1,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  img: {
    backgroundColor: C.surface,
  },
  imgView: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  codOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  billCard: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  billFlat: {},
  subHeadingMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
  },
  para: {
    fontFamily: F.medium,
    fontSize: 15,
    letterSpacing: 0,
    color: C.body,
    flexShrink: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: B.rule,
    borderTopColor: C.ink,
    marginTop: 8,
    paddingTop: 12,
  },
  para2: {
    fontFamily: F.black,
    fontSize: 20,
    letterSpacing: 0,
    color: C.ink,
  },
  para3: {
    fontFamily: F.medium,
    fontSize: 14,
    letterSpacing: 0,
    color: C.muted,
  },
  waiting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  waitingicon: {
    width: 56,
    height: 56,
    borderWidth: B.rule,
    borderColor: C.ink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingsub: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },
  waitingTitle: {
    fontFamily: F.black,
    fontSize: 20,
    letterSpacing: 0,
    color: C.ink,
  },
  abstxtView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emptyView: {
    flex: 1,
    height: B.hair,
    backgroundColor: C.rule,
  },
  abstxt: {
    fontFamily: F.bold,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.muted,
  },
  optionTile: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  optionIcon: {
    width: 52,
    height: 52,
    backgroundColor: C.overdueBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontFamily: F.bold,
    fontSize: 17,
    letterSpacing: 0,
    color: C.ink,
  },
  stackBtn: { height: 56, alignSelf: 'stretch', width: '100%' },
  mainView: { flex: 1 },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.scrim,
  },
  modalView: {
    backgroundColor: C.ground,
    borderWidth: B.rule,
    borderColor: C.ink,
    overflow: 'hidden',
  },
  modalBody: { padding: 20, gap: 14 },
  amountBox: {
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 6,
  },
  amountBig: {
    fontFamily: F.black,
    fontSize: 40,
    letterSpacing: 0,
    color: C.ink,
    fontVariant: ['tabular-nums'],
  },
  modalCopy: {
    fontFamily: F.medium,
    fontSize: 16,
    letterSpacing: 0,
    color: C.body,
  },
  modalFooter: {
    backgroundColor: C.surface,
    borderTopWidth: B.rule,
    borderTopColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  flexBtn: { flex: 1, width: undefined },
  loaderBox: { flex: 1, height: 56, justifyContent: 'center', alignItems: 'center' },
});
