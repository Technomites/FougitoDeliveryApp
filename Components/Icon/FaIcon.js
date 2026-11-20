import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FaIcon = props => {
  return (
    <View>
      <Icon
        name={props.name}
        size={props.size ? props.size : 25}
        color={props.color ? props.color : '#19191933'}
      />
    </View>
  );
};
export default FaIcon;
