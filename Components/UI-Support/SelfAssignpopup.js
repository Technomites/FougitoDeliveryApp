import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Color from '../../Constants/Color';
import AuthButton from './AuthButton';
import Paragraph from './Paragraph';
import SubHeading from './SubHeading';
import MyFormInputTile from './MyFormInputTile';
import {HardCode} from '../../Constants/texting';
import {C, F} from '../../Constants/tokens';
import {
  DialogScrim,
  DialogCard,
  DialogFooter,
  IconTile,
  dialogStyles,
} from './Dialog';
const SelfAssignpopup = props => {
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
              <IconTile
                icon={
                  <MaterialIcons
                    name="delivery-dining"
                    color={C.accentDeep}
                    size={30}
                  />
                }
              />
              <Paragraph style={styles.title} text={HardCode.AssignOrder} />
              <View style={styles.field}>
                <SubHeading style={styles.reason} text={HardCode.OrderNo} />
                <MyFormInputTile
                  //   onIconPress={() => setSecure2(!secure2)}
                  //   iconName={!secure2 ? 'eye' : 'eye-off'}
                  value={props.value}
                  placeHolder={HardCode.EnterOrderNo}
                  onChangeText={props.onChangeText}
                />
              </View>
            </View>
            <DialogFooter>
              <TouchableOpacity
                onPress={props.onNoPress}
                style={dialogStyles.outlineBtn}>
                <SubHeading style={dialogStyles.outlineText} text={HardCode.CANCEL} />
                <Feather name="x" size={20} color={C.ink} />
              </TouchableOpacity>
              {props.loader ? (
                <View style={dialogStyles.loaderBox}>
                  <ActivityIndicator size={'large'} color={Color.loaderColor} />
                </View>
              ) : (
                <AuthButton
                  container={dialogStyles.flexBtn}
                  iconName="send"
                  title={HardCode.SUBMIT}
                  onPress={props.onSubmit}
                />
              )}
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
  title: {
    fontFamily: F.black,
    fontSize: 24,
    color: C.ink,
  },
  field: {gap: 8},
  reason: {
    fontFamily: F.bold,
    fontSize: 15,
    color: C.ink,
    letterSpacing: 0,
  },
});

export default SelfAssignpopup;
