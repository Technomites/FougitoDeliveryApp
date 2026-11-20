import React, {useState} from 'react';
import {Modal, StyleSheet, View, TouchableOpacity} from 'react-native';
import AuthButton from './AuthButton';
import Paragraph from './Paragraph';
import {scalableheight} from '../resposnevaraiable';
import {
  DialogScrim,
  DialogCard,
  DialogFooter,
  IconTile,
  dialogStyles,
} from './Dialog';
const SuccessModalPopup = props => {
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
              <Paragraph style={dialogStyles.message} text={props.message} />
              <TouchableOpacity onPress={props.returnHome}></TouchableOpacity>
            </View>
            <DialogFooter>
              <AuthButton
                container={dialogStyles.flexBtn}
                iconName="check"
                title={props.bnText}
                onPress={props.yesPress}
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
});

export default SuccessModalPopup;
