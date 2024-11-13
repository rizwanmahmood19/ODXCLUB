import React from 'react';
import { View } from 'react-native-ui-lib';

import PersonIcon from '../../../assets/icons/matchapp_ic_account_circle.svg';
import { StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { appStyles } from '../../style/appStyle';

const PERSON_ICON_SIZE = 70;

const MaybeEmptyCard = () => {
  return (
    <View style={styles.container}>
      <PersonIcon width={PERSON_ICON_SIZE} height={PERSON_ICON_SIZE} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: appColors.lightGrey,
    borderRadius: appStyles.borderRadius,
    flex: 1,
    height: 250,
    justifyContent: 'center',
  },
});

export default MaybeEmptyCard;
