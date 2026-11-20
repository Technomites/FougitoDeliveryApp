import React, {Component} from 'react';
// import {render} from 'react-dom';
// import Switch from 'react-toggle-switch';
import {
  View,
  Dimensions,
  Modal,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import Color from '../../Constants/Color';

// import Toggleswitch from '../components';

const Popuprequest = props => {
  return (
    <View style={Styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={props.showModel} statusBarTranslucent>
        <View
          style={Styles.mainImgView}>
          <View
            style={Styles.subImgView}>
            <Image
              resizeMode="contain"
              style={Styles.image}
              source={require('../../assets/Images/spareparts.png')}
            />
          </View>

          <View
            style={Styles.touchableMainView}>
            <TouchableOpacity onPress={props.onClose}>
              <View
                style={touchableSubView}>
                <Text style={Styles.touchableText}>
                  <Entypo name="cross" size={24} color={Color.iconWhiteColor}/>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Styles = StyleSheet.create({
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  mainImgView:{
    backgroundColor: 'rgba(71,71,71,0.9)',
    position: 'absolute',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    padding: 20,
    flex: 1,
  },
  subImgView:{
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  image:{
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableMainView:{
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
  },
  touchableSubView:{
    backgroundColor: Color.btnBgColor,
    width: 50,
    height: 50,
    borderRadius: 0,
    // position: 'relative',
    // bottom: '80%',
  },
  touchableText:{textAlign: 'center', marginVertical: 13}
});

export default Popuprequest;
