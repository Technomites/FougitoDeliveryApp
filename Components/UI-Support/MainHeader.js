import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { C, F, B } from '../../Constants/tokens';
import { useDevice } from '../useLayout';
import IconSquare from './IconSquare';

// Home header: ink menu square, spacer, bell square with accent count badge.
const MainHeader = props => {
  const { isPhone, gutter, homeHeader } = useDevice();

  return (
    <SafeAreaView style={Styles.safe}>
      <View
        style={[
          Styles.main,
          { height: homeHeader, paddingHorizontal: gutter },
        ]}>
        <IconSquare name="menu" variant="ink" onPress={props.onPress} />

        <View style={Styles.spacer} />

        <IconSquare
          name="bell"
          onPress={props.onNotification}
          style={Styles.bell}>
          {/* Count comes from HomeScreen; hide the badge when there is nothing new. */}
          {Number(props?.Notifation) > 0 && (
            <View style={Styles.notifationView}>
              <Text style={Styles.notifationText}>
                {Number(props.Notifation) > 99 ? '99+' : props.Notifation}
              </Text>
            </View>
          )}
        </IconSquare>
      </View>
    </SafeAreaView>
  );
};
export default MainHeader;
const Styles = StyleSheet.create({
  safe: { backgroundColor: C.surface },
  main: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface,
    borderBottomWidth: B.rule,
    borderBottomColor: C.ink,
  },
  spacer: { flex: 1 },
  bell: { overflow: 'visible' },
  notifationView: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    backgroundColor: C.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifationText: {
    fontSize: 12,
    fontFamily: F.black,
    color: C.surface,
    fontVariant: ['tabular-nums'],
  },
});
