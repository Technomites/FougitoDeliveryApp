import React from 'react';
import {Modal, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {HardCode} from '../../Constants/texting';
import {C, F, B} from '../../Constants/tokens';
import useLayout from '../useLayout';
import {BrandField, WhiteLogo} from './AuthBrandPane';
import FocusAwareStatusBar from './customStatusBar';
import AuthButton from './AuthButton';
import {useRootInsets} from '../NavBarFrame';

// "Delivered" success: full accent field with line-art, white check square,
// headline (HardCode.YourOrderHasBeen + HardCode.DeliveredSuccessfully), 2px white rule,
// order line, white 72dp "Return to home screen" (L: 400 wide on the right, bottom-aligned).
const DeliveredSuccess = ({visible, loader, onReturn, line}) => {
  const layout = useLayout();
  const phone = layout === 'phone';
  const landscape = layout === 'tabletLandscape';
  const head = landscape ? 88 : phone ? 44 : 80;
  const insets = useRootInsets();

  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
        navigationBarTranslucent
      transparent={true}
      supportedOrientations={['portrait', 'landscape']}
      visible={visible}>
      <BrandField tile={phone ? 240 : 360} style={styles.fill}>
        <FocusAwareStatusBar barStyle="light-content" backgroundColor="transparent" />
        <View
          style={[
            styles.content,
            {
              marginBottom: insets.bottom,
              marginLeft: insets.left,
              marginRight: insets.right,
            },
            landscape
              ? {paddingVertical: 48, paddingHorizontal: 56}
              : phone
              ? {paddingVertical: 28, paddingHorizontal: 20}
              : {paddingVertical: 56, paddingHorizontal: 48},
          ]}>
          <View style={styles.topRow}>
            <WhiteLogo height={landscape ? 36 : phone ? 28 : 36} />
            <Text style={styles.caps}>{HardCode.Deliver}</Text>
          </View>

          <View style={landscape ? styles.bottomRow : styles.bottomCol}>
            <View style={[styles.copy, landscape && styles.copyLandscape]}>
              <View
                style={[
                  styles.check,
                  {width: phone ? 56 : 72, height: phone ? 56 : 72},
                ]}>
                <Feather name="check" size={phone ? 28 : 36} color={C.accent} />
              </View>
              <Text
                style={[
                  styles.headline,
                  {
                    fontSize: head,
                    lineHeight: Math.round(head * 1.0),
                    letterSpacing: -0.03 * head,
                    maxWidth: phone ? 320 : 720,
                  },
                ]}>
                {`${HardCode.YourOrderHasBeen} ${HardCode.DeliveredSuccessfully}`}
              </Text>
              <View style={styles.rule} />
              {!!line && (
                <Text style={[styles.line, {fontSize: phone ? 17 : 22}]}>{line}</Text>
              )}
            </View>

            <View style={landscape ? styles.btnBoxLandscape : styles.btnBox}>
              {loader ? (
                <View style={styles.loaderBox}>
                  <ActivityIndicator size={'large'} color={C.surface} />
                </View>
              ) : (
                <AuthButton
                  variant="white"
                  iconName="home"
                  container={styles.returnBtn}
                  textStyle={styles.returnText}
                  onPress={onReturn}
                  title={HardCode.RETURNTOHOMESCREEN}
                />
              )}
            </View>
          </View>
        </View>
      </BrandField>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fill: {flex: 1},
  content: {flex: 1, justifyContent: 'space-between'},
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caps: {
    fontFamily: F.bold,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.surface,
  },
  bottomRow: {flexDirection: 'row', alignItems: 'flex-end', gap: 48},
  bottomCol: {gap: 28},
  copy: {gap: 24},
  copyLandscape: {flex: 1},
  check: {
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {fontFamily: F.black, color: C.surface},
  rule: {height: B.rule, backgroundColor: C.surface, alignSelf: 'stretch'},
  line: {fontFamily: F.medium, color: C.surface},
  btnBox: {alignSelf: 'stretch'},
  btnBoxLandscape: {width: 400},
  loaderBox: {height: 72, justifyContent: 'center', alignItems: 'center'},
  returnBtn: {height: 72, alignSelf: 'stretch', width: '100%'},
  returnText: {fontSize: 18},
});

export default DeliveredSuccess;
