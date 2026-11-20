import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SubHeading from './SubHeading';
import { HardCode } from '../../Constants/texting';
import { C, F, B } from '../../Constants/tokens';
import useLayout from '../useLayout';

// Order tile: white, 1px rule. 48 pink bag tile; OrderNo / CustomerName / date;
// amount top-right on landscape, own line on portrait + phone; optional room row;
// bottom strip "ORDER STATUS" + coloured status | 56 arrow cell.
// Props kept: deatils, Currency, onPress, container, status. Optional: style (grid cell).
export default function ActiveRequestTile(props) {
  const layout = useLayout();
  const amountRight = layout === 'tabletLandscape';
  const amountText = `${props.Currency} ${props.deatils?.TotalAmount.toFixed(2)}`;
  return (
    <View style={[style.cell, props.style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        // onPress={props.onModelPopUp}
        onPress={props.onPress}
        style={{
          ...style.MainContainer,
          ...props.container,
        }}>
        <View style={style.topViewContainer}>
          <View style={style.bagTile}>
            <Feather name="shopping-bag" size={22} color={C.accentDeep} />
          </View>

          <View style={style.info}>
            <SubHeading
              numberOfLines={1}
              style={style.subheading}
              text={props.deatils?.OrderNo}
            />
            <SubHeading
              numberOfLines={1}
              style={style.subheading2}
              text={props.deatils?.CustomerName}
            />
            <SubHeading style={style.date} text={props.deatils?.FormattedDate} />
            {!amountRight && (
              <SubHeading style={style.priceBelow} text={amountText} />
            )}
          </View>

          {amountRight && (
            <SubHeading style={style.price} text={amountText} />
          )}
        </View>

        {(props.deatils?.HotelRoomId || props.deatils?.HotelsAndMallsRoomId) && (
          <View style={style.roomRow}>
            <MaterialCommunityIcons
              name={'room-service'}
              size={20}
              color={C.accentDeep}
            />
            <SubHeading
              numberOfLines={1}
              style={style.room}
              text={`${props.deatils?.HotelRoomId ? props.deatils?.HotelRoomName : props.deatils?.HotelsAndMallsRoomName
                }`}
            />
          </View>
        )}

        <View style={style.statusView}>
          <View style={style.statusSubView}>
            <SubHeading style={style.statusLabel} text={HardCode.OrderStatus} />
            {props.status ? (
              <SubHeading
                style={[
                  style.statusText,
                  {
                    color:
                      props.status === HardCode.NotDelivered
                        ? C.accentDeep
                        : C.green,
                  },
                ]}
                text={
                  props.status === HardCode.NotDelivered
                    ? HardCode.Canceled
                    : props.status
                }
              />
            ) : (
              <SubHeading
                style={{
                  ...style.statusText,
                  color: props.deatils?.Status === 'Pending' ||
                    props.deatils?.Status === 'Preparing' ||
                    props.deatils?.Status === 'Confirmed' ?
                    C.amberDeep :
                    props.deatils?.Status === 'FoodReady'
                      ? C.green
                      : C.accentDeep,
                }}
                text={
                  props.deatils?.Status === 'Pending' ||
                    props.deatils?.Status === 'Preparing' ||
                    props.deatils?.Status === 'Confirmed' ?
                    HardCode.OrderIsPreparing :
                    props.deatils?.Status === 'FoodReady'
                      ? HardCode.ReadyForPickup :
                      HardCode.PickedUp
                }
              />
            )}
          </View>
          {/* {alert(props.deatils?.Status)} */}
          <TouchableOpacity onPress={props.onPress} style={style.icon}>
            <Feather name="arrow-right" size={22} color={C.accent} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  cell: {},
  MainContainer: {
    width: '100%',
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
  },
  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
  },
  bagTile: {
    width: 48,
    height: 48,
    backgroundColor: C.overdueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, minWidth: 0, gap: 3 },
  subheading: {
    fontFamily: F.black,
    fontSize: 18,
    color: C.accentDeep,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  subheading2: {
    fontFamily: F.medium,
    fontSize: 16,
    color: C.ink,
    letterSpacing: 0,
  },
  date: {
    fontFamily: F.medium,
    fontSize: 14,
    color: C.muted,
    letterSpacing: 0,
  },
  price: {
    fontFamily: F.black,
    fontSize: 18,
    color: C.ink,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  priceBelow: {
    marginTop: 4,
    fontFamily: F.black,
    fontSize: 17,
    color: C.ink,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: B.hair,
    borderTopColor: C.rule,
  },
  room: {
    flex: 1,
    fontFamily: F.bold,
    fontSize: 15,
    color: C.ink,
    letterSpacing: 0,
  },
  statusView: {
    flexDirection: 'row',
    height: 56,
    borderTopWidth: B.hair,
    borderTopColor: C.rule,
  },
  statusSubView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 2,
  },
  statusLabel: {
    fontFamily: F.bold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.muted,
  },
  statusText: {
    fontFamily: F.bold,
    fontSize: 15,
    letterSpacing: 0,
  },
  icon: {
    width: 56,
    borderLeftWidth: B.hair,
    borderLeftColor: C.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
