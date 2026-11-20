import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {C, F, B} from '../../Constants/tokens';
import useLayout from '../useLayout';
import LineArt from './LineArt';

const LOGO_WHITE = require('../../assets/Images/fougito_logo_white.png');
// fougito_logo_*.png keep the SVG's 150 x 70 frame
const LOGO_RATIO = 150 / 70;

// Red Fougito field with white line-art at 16%. Splash uses it directly.
export const BrandField = ({tile = 360, style, children}) => (
  <View style={[styles.field, style]}>
    <LineArt tile={tile} opacity={0.16} />
    {children}
  </View>
);

export const WhiteLogo = ({height = 40, style}) => (
  <Image
    source={LOGO_WHITE}
    fadeDuration={0}
    resizeMode="contain"
    style={[{height, width: height * LOGO_RATIO}, style]}
  />
);

// Auth brand pane: red field + line-art + white logo + 56x4 white bar + "Deliver".
// L: 538 wide column with a 2px ink right rule. P: 360 band. M: 152 band.
// topInset pads for a translucent status bar when the pane sits at the top.
const AuthBrandPane = ({title = 'Deliver', topInset = 0, style}) => {
  const layout = useLayout();
  const landscape = layout === 'tabletLandscape';
  const phone = layout === 'phone';

  const frame = landscape
    ? {
        width: 538,
        alignSelf: 'stretch',
        padding: 40,
        paddingTop: 40 + topInset,
        borderRightWidth: B.rule,
      }
    : phone
    ? {
        height: 152 + topInset,
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 20 + topInset,
        borderBottomWidth: B.rule,
      }
    : {
        height: 360 + topInset,
        paddingHorizontal: 40,
        paddingBottom: 40,
        paddingTop: 40 + topInset,
        borderBottomWidth: B.rule,
      };
  const wordSize = phone ? 44 : 112;

  return (
    <BrandField tile={phone ? 240 : 360} style={[styles.pane, frame, style]}>
      <WhiteLogo height={phone ? 28 : 44} />
      <View style={{gap: phone ? 10 : 20}}>
        <View style={styles.bar} />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.word,
            {
              fontSize: wordSize,
              lineHeight: Math.round(wordSize * 1.02),
              letterSpacing: -0.04 * wordSize,
            },
          ]}>
          {title}
        </Text>
      </View>
    </BrandField>
  );
};

const styles = StyleSheet.create({
  field: {backgroundColor: C.accent, overflow: 'hidden'},
  pane: {justifyContent: 'space-between', borderColor: C.ink},
  bar: {width: 56, height: 4, backgroundColor: C.surface},
  word: {fontFamily: F.black, color: C.surface, includeFontPadding: false},
});

export default AuthBrandPane;
