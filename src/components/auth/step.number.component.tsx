import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';

import Label from '../custom/styleguide-components/label.component';

const DIMENSION = 30;

const StepNumber = ({
  number,
  containerStyles,
}: {
  number: string | number;
  containerStyles?: Record<string, unknown>;
}) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <Label style={styles.text}>{number.toString()}</Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.primary,
    borderRadius: 15,
    height: DIMENSION,
    width: DIMENSION,
  },
  text: {
    color: 'white',
    fontFamily: appFont.black,
    lineHeight: DIMENSION,
    textAlign: 'center',
  },
});

export default StepNumber;
