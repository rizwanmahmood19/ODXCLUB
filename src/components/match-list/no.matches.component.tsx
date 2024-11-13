import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native-ui-lib';
import { appFont } from '../../style/appFont';
import { appColors } from '../../style/appColors';
import ProfileCircleDefault from '../custom/profile.circle.default.component';
import { LocalizationContext } from '../../services/LocalizationContext';

export const NoMatches = () => {
  const { l10n } = useContext(LocalizationContext);
  return (
    <View style={styles.container}>
      <ProfileCircleDefault />
      <Text style={styles.name} ellipsizeMode="tail">
        {l10n.general.noFits}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 70,
  },
  name: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    fontSize: 11,
    paddingTop: 5,
    textAlign: 'center',
  },
});
