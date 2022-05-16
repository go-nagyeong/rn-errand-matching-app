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

// FeedScreen.js에서 사용하는 화살표 아이콘 (말풍선)
export const DownSharp = (props) => {
  const {style} = props;
  return (
    <Icon
      name= {Platform.OS === 'ios' ? "ios-caret-down-sharp" : "caret-down-sharp"}
      type="ionicon"
      color={style[0]["color"]}
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