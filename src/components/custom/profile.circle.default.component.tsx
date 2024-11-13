import React from 'react';
import { View } from 'react-native-ui-lib';

import PersonIcon from '../../../assets/icons/matchapp_ic_account_circle.svg';
import { appColors } from '../../style/appColors';
import { StyleProp, ViewStyle } from 'react-native';

const DEFAULT_ICON_SIZE = 40;
const DEFAULT_SIZE = 70;

interface ProfileCircleProps {
  size?: number;
  iconSize?: number;
  color?: string;
  borderColor?: string;
}

const ProfileCircleDefault = (props: ProfileCircleProps) => {
  const iconSize = props.iconSize || DEFAULT_ICON_SIZE;
  const size = props.size || DEFAULT_SIZE;

  return (
    <View style={containerStyles(props, iconSize, size)}>
      <PersonIcon width={iconSize} height={iconSize} />
    </View>
  );
};

const containerStyles = (
  props: ProfileCircleProps,
  iconSize: number,
  size: number,
): StyleProp<ViewStyle> => ({
  alignItems: 'center',
  backgroundColor: props.color || appColors.lightGrey,
  borderColor: props.borderColor || '#FFF',
  borderRadius: iconSize,
  borderStyle: 'solid',
  borderWidth: 2,
  height: size,
  justifyContent: 'center',
  width: size,
});

export default ProfileCircleDefault;
