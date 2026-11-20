import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Paragraph from './Paragraph';
import SubHeading from './SubHeading';
import { HardCode } from '../../Constants/texting';
import { C, F, B } from '../../Constants/tokens';

// Top-docked alert card: white, 2px ink border, order no in accentDeep,
// message, accent OK button (label left, icon right), illustration right.
const NotificationAlert = props => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(640, width - 32);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        navigationBarTranslucent>
        <View style={styles.mainView}>
          <View style={[styles.paraMainView, { width: cardWidth }]}>
            <View style={styles.paraSubView}>
              <Paragraph style={{ color: C.ink }} />
              <View>
                <SubHeading style={styles.orderNo} text={props.orderNo} />
              </View>
              {props?.details?.HotelName &&
              <SubHeading
                style={styles.hotel}
                text={props?.details?.HotelName + ' - ' + props?.details?.RoomName}
              />}
              <Paragraph
                style={styles.message}
                text={
                  props?.details?.Description === 'Order canceled' || props?.details?.Description === 'Order Cancelled'
                    ? HardCode.OrderCancel
                    : props?.details?.Description?.includes('status updated')
                      ? HardCode.OrderStatusUpdated
                      : props?.details?.Description?.includes('order has been reassigned')
                        ? props?.details?.Description
                        : props?.details?.Description?.includes('ready for pickup')
                          ? props?.details?.Description
                          : HardCode.HeyNewOrderReceived
                }
              />
              <TouchableOpacity
                onPress={props.onPress}
                style={styles.touchable}>
                <Paragraph style={styles.okText} text={HardCode.OK} />
                <Feather name="check" size={18} color={C.surface} />
              </TouchableOpacity>
            </View>
            <View style={styles.imgView}>
              <Image
                style={styles.img}
                source={require('../../assets/Images/alertNoti.png')}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Out of layout flow: the Modal renders in its own window, so this host
  // must not take flex space from the screen it sits in.
  centeredView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
  mainView: {
    flex: 1,
    backgroundColor: C.scrim,
    alignItems: 'center',
  },
  paraMainView: {
    backgroundColor: C.surface,
    borderWidth: B.rule,
    borderColor: C.ink,
    borderLeftWidth: 6,
    borderLeftColor: C.accent,
    alignItems: 'center',
    marginTop: getStatusBarHeight() + 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  paraSubView: {
    flex: 1,
    gap: 6,
  },
  orderNo: {
    fontFamily: F.black,
    fontSize: 20,
    color: C.accentDeep,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  hotel: {
    fontFamily: F.bold,
    fontSize: 14,
    color: C.ink,
    letterSpacing: 0,
  },
  message: {
    fontFamily: F.medium,
    fontSize: 15,
    color: C.body,
  },
  touchable: {
    marginTop: 8,
    height: 48,
    alignSelf: 'stretch',
    backgroundColor: C.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  okText: {
    fontFamily: F.bold,
    fontSize: 16,
    color: C.surface,
  },
  img: {
    height: 96,
    width: 96,
    resizeMode: 'contain',
  },
  imgView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationAlert;
