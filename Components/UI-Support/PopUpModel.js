import React, {useState} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AuthButton from './AuthButton';
import Paragraph from './Paragraph';
import SubHeading from './SubHeading';
import {HardCode} from '../../Constants/texting';
import {C} from '../../Constants/tokens';
import {
  DialogScrim,
  DialogCard,
  DialogFooter,
  IconTile,
  dialogStyles,
} from './Dialog';
const PopUpModel = props => {
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
              <IconTile name="check" />
              <Paragraph style={dialogStyles.message} text={props.message} />
            </View>
            <DialogFooter>
              {!props.noShow ? (
                <TouchableOpacity
                  onPress={props.noPress}
                  style={dialogStyles.outlineBtn}>
                  <SubHeading style={dialogStyles.outlineText} text={HardCode.No} />
                  <Feather name="x" size={20} color={C.ink} />
                </TouchableOpacity>
              ) : null}
              <AuthButton
                container={dialogStyles.flexBtn}
                iconName="check"
                title={props.title ? props.title : HardCode.YES}
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

export default PopUpModel;
