import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import SubHeading from './SubHeading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {HardCode} from '../../Constants/texting';
import {C, F, B} from '../../Constants/tokens';

// Items table row. index 0 also renders the QTY | ITEM | PRICE caps header over a 2px ink rule.
// The parent supplies the white, 1px-rule table frame.
export default function OrderDeatilTile(props) {
  console.log(JSON.stringify(props.itemData?.index) + 'props');
  return (
    <View>
      {props?.index === 0 ? (
        <View style={style.headRow}>
          <SubHeading style={[style.subHeading1, style.qtyCol]} text={HardCode.QTY} />
          <SubHeading style={[style.subHeading1, style.itemCol]} text={HardCode.ITEM} />
          <SubHeading style={style.subHeading1} text={HardCode.PRICE} />
        </View>
      ) : null}
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            props.onPress && props.onPress();
            //setOrderDetailMdoalVisible(!orderDetailMdoalVisible)
          }}
          style={style.maincontainer}>
          <View style={style.qtyCol}>
            <SubHeading
              style={style.qty}
              text={`×${props?.itemData?.Quantity}`}
            />
          </View>

          <View style={[style.itemCol, style.itemRow]}>
            <View style={style.imgView}>
              <Image
                source={{uri: props?.itemData?.MenuItems?.Item?.Image}}
                style={style.image}
              />
            </View>

            <View style={style.subHeadingMainView}>
              <SubHeading
                style={style.itemname}
                text={props?.itemData?.MenuItems?.Name}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <SubHeading style={style.details} text={HardCode.ViewDetails} />
              </View>

              {/* {props?.customerNote && (
                <Icon
                  name="notes"
                  size={20}
                  color={C.accent}
                />
              )} */}
            </View>
          </View>

          <View>
            <SubHeading
              style={style.price}
              text={`${props.Currency} ` + props?.itemData?.TotalPrice.toFixed(2)}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
  },
  subHeading1: {
    fontFamily: F.bold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.muted,
  },
  qtyCol: {width: 44},
  itemCol: {flex: 1, minWidth: 0},
  maincontainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: C.surface,
    borderBottomWidth: B.hair,
    borderBottomColor: C.rule,
  },
  qty: {
    fontFamily: F.black,
    fontSize: 16,
    color: C.ink,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  itemRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12},
  imgView: {justifyContent: 'center'},
  image: {
    height: 44,
    width: 44,
    resizeMode: 'cover',
    backgroundColor: C.disabled,
  },
  subHeadingMainView: {flex: 1, minWidth: 0, gap: 2},
  itemname: {
    fontFamily: F.bold,
    fontSize: 16,
    color: C.ink,
    letterSpacing: 0,
  },
  details: {
    fontFamily: F.bold,
    fontSize: 13,
    color: C.accentDeep,
    letterSpacing: 0,
  },
  price: {
    fontFamily: F.black,
    fontSize: 16,
    color: C.ink,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
});
