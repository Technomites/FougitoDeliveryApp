import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../../Constants/Color';
import AuthButton from './AuthButton';
import Paragraph from './Paragraph';
import SubHeading from './SubHeading';
import MyFormInputTile from '../../Components/UI-Support/MyFormInputTile';
import {scalableheight} from '../resposnevaraiable';
import {HardCode} from '../../Constants/texting';
import {C} from '../../Constants/tokens';
import {
  DialogScrim,
  DialogCard,
  DialogFooter,
  IconTile,
  dialogStyles,
} from './Dialog';
const Reasonpopup = props => {
  const [reason, setreason] = useState('');
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
              <IconTile name="help-circle" />
              <Paragraph
                style={dialogStyles.message}
                text={HardCode.AreYouSureYouWantToCancelThisOrder}
              />
              <MyFormInputTile
                placeHolder={HardCode.EnterReasonHere}
                onChangeText={props.onChangeText}
              />
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
});

export default Reasonpopup;
