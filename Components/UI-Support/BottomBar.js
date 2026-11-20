import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {C, B} from '../../Constants/tokens';
import {useDevice} from '../useLayout';

// White bar with a 2px ink top rule. Children sit in a row (gap 12).
// align: 'end' (default, tablets right-align fixed-width buttons) | 'stretch'
const BottomBar = ({children, style, justify = 'flex-end'}) => {
  const {isPhone, gutter} = useDevice();
  // Context read (not the hook) so it never throws outside a provider.
  const insets = useContext(SafeAreaInsetsContext);
  const bottom = insets?.bottom || 0;
  const padV = isPhone ? 12 : 16;
  return (
    <View
      style={[
        styles.bar,
        {
          paddingHorizontal: gutter,
          paddingTop: padV,
          paddingBottom: padV + bottom,
          justifyContent: justify,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: C.surface,
    borderTopWidth: B.rule,
    borderTopColor: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default BottomBar;
