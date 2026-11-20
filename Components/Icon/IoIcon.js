import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const IoIcon = props => {
  return (
    <View style={props.style}>
      <Icon
        name={props.name}
        size={props.size ? props.size : 25}
        color={props.color ? props.color : '#19191933'}
      />
    </View>
  );
};
export default IoIcon;
