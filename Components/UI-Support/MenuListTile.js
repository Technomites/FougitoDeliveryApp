import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import Paragraph from './Paragraph';
import SubHeading from './SubHeading';
import FastImage from 'react-native-fast-image';
import {HardCode} from '../../Constants/texting';
import {C, F, B} from '../../Constants/tokens';
const MenuListTile = props => {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={[Styles.main, {...props.style}]}>
      <View style={Styles.imgView}>
        {/* <Image
          style={{height: 50, width: 80, resizeMode: 'contain'}}
          source={{uri: props.imageUrl}}
        /> */}
        <FastImage
          style={Styles.img}
          source={{
            uri: props.imageUrl,
            // headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={Styles.SubHeadingView}>
        <SubHeading
          numberOfLines={1}
          style={Styles.title}
          text={props.title}
        />
        <SubHeading style={Styles.price} text={props.price} />
      </View>
      {props.published ? (
        <View style={Styles.SwitchView}>
          <Paragraph
            style={Styles.para}
            text={props.publish ? HardCode.ACTIVE : HardCode.INACTIVE}
          />

          <Switch
            trackColor={{false: C.rule, true: C.accent}}
            thumbColor={C.surface}
            onChange={props.onChange}
            value={props.value}
          />
        </View>
      ) : (
        <View style={Styles.paraView}>
          <Paragraph style={Styles.para} text={props.status.toUpperCase()} />
        </View>
      )}
    </TouchableOpacity>
  );
};
export default MenuListTile;
const Styles = StyleSheet.create({
  main: {
    width: '100%',
    backgroundColor: C.surface,
    borderWidth: B.hair,
    borderColor: C.rule,
    marginVertical: 4,
    minHeight: 80,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imgView: {
    width: 64,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: C.ground,
  },
  SubHeadingView: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },
  title: {fontFamily: F.bold, fontSize: 16, color: C.ink, letterSpacing: 0},
  price: {
    fontFamily: F.black,
    fontSize: 15,
    color: C.accentDeep,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  SwitchView: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  paraView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  para: {
    fontSize: 11,
    fontFamily: F.bold,
    letterSpacing: 1.5,
    color: C.muted,
  },
  img: {height: 52, width: 64},
});
