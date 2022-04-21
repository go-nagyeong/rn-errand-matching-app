import React from 'react'
import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors'

export const Downward = (props) => {
  const {style} = props;
  return (
    <Icon
      name="chevron-down-outline"
      type="ionicon"
      color={Colors.lightGray2}
      containerStyle={style}
    />
  )
}

export const Upward = (props) => {
  const {style} = props;
  return (
    <Icon
      name="chevron-up-outline"
      type="ionicon"
      color={Colors.lightGray2}
      containerStyle={style}
    />
  )
}

export default Chevron = (props) => {
  const {style} = props;

  return (
    <Icon
      name="chevron-forward"
      type="ionicon"
      color={Colors.lightGray2}
      containerStyle={style}
    />
  )
}