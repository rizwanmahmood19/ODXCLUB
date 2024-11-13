import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import CustomArrowButton from '../custom/custom.arrow.button.component';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import { CustomHeader } from '../custom/custom.header.component';

export interface OnboardingHeaderProps {
  back?: {
    onPress: (_event?: any) => void;
    disabled: boolean;
  };
  next?: {
    onPress: (_event?: any) => void;
    disabled: boolean;
  };
}

export const OnboardingHeader = (props: OnboardingHeaderProps) => {
  const { back, next } = props;
  return (
    <View>
      <CustomHeader
        left={
          back && (
            <CustomArrowButton
              onPress={back.onPress}
              disabled={back.disabled}
            />
          )
        }
        right={
          next && (
            <CustomArrowButton
              onPress={next.onPress}
              disabled={next.disabled}
              right
            />
          )
        }>
        <LogoIcon
          width={styles.logo.width}
          height={styles.logo.height}
          style={styles.logo}
        />
      </CustomHeader>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 32,
    marginVertical: 12,
    width: 32,
  },
});
