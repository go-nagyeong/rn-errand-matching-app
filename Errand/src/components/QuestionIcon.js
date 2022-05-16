import React from 'react'
import { Icon } from 'react-native-elements'
import Colors from '../constants/Colors'

export default Chevron = (props) => {
  const {style} = props;

  return (
    <Icon
      name="help-circle-outline"
      type="ionicon"
      color={Colors.orange}
      containerStyle={style}
    />
  )
}