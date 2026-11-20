import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import AuthButton from './AuthButton';
import {HardCode} from '../../Constants/texting';
import {C, F} from '../../Constants/tokens';
import {
  DialogScrim,
  DialogCard,
  DialogFooter,
  IconTile,
  dialogStyles,
} from './Dialog';

// Not imported by any screen (kept for parity); restyled to the dialog kit.
const SuccessModal = props => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.visible}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
        navigationBarTranslucent>
        <DialogScrim>
          <DialogCard>
            <View style={dialogStyles.body}>
              <IconTile name="check" tone="accent" />
              <Text style={styles.iconText}>{HardCode.Done}</Text>
              <Text style={styles.text}>
                {props.msg ? props.msg : HardCode.YourAdWillBeLivesSoon}
              </Text>
            </View>
            <DialogFooter>
              <AuthButton
                container={dialogStyles.flexBtn}
                iconName="home"
                onPress={props.modelOff}
                title={props.title ? props.title : HardCode.RETURNHOME}
              />
            </DialogFooter>
          </DialogCard>
        </DialogScrim>
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
  iconText: {fontFamily: F.black, fontSize: 24, color: C.ink},
  text: {fontFamily: F.medium, fontSize: 16, color: C.muted},
});

export default SuccessModal;
