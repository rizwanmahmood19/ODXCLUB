import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
  ProfileImageCircle,
  ProfileImageCircleProps,
} from '../profile/profile.image.circle.component';

import { appFont } from '../../style/appFont';
import { appColors } from '../../style/appColors';

const DEFAULT_SIZE = 70;

interface MatchListItemProps {
  photo: ProfileImageCircleProps['photo'];
  name?: string;
  focused?: ProfileImageCircleProps['focused'];
  size?: number;
}

export const MatchListItem = (props: MatchListItemProps) => {
  const { photo, name, focused, size } = props;
  const circleSize = size || DEFAULT_SIZE;
  const textWidth = { width: circleSize };

  return (
    <View style={styles.container}>
      <ProfileImageCircle photo={photo} size={circleSize} focused={focused} />
      {name && (
        <Text
          style={[styles.name, textWidth]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {name}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 5,
  },
  name: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    fontSize: 11,
    paddingTop: 4,
    textAlign: 'center',
  },
});
