import React from 'react';
import { StyleSheet } from 'react-native';
import { Switch } from 'react-native-ui-lib';
import { appColors } from '../../../style/appColors';

interface CustomSwitchProps {
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
}

export const CustomSwitch = ({
  disabled,
  onValueChange,
  value,
}: CustomSwitchProps) => {
  return (
    <Switch
      style={styles.switch}
      disabled={disabled}
      value={value}
      onColor={appColors.primary}
      offColor={appColors.darkGrey}
      disabledColor={appColors.mediumGrey}
      onValueChange={onValueChange}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    height: 24,
  },
});
