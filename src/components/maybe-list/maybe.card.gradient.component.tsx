import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import { appStyles } from '../../style/appStyle';

interface MaybeCardGradientProps {
  isSecretMessage?: boolean;
}

const MaybeCardGradient = ({ isSecretMessage }: MaybeCardGradientProps) => (
  <LinearGradient
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    locations={[0, 0.2, 0.7, 1]}
    colors={[
      '#000000AA',
      '#00000000',
      isSecretMessage ? '#E1007A00' : '#002D9100',
      isSecretMessage ? '#E1007AAA' : '#002D91AA',
    ]}
    style={styles.gradient}
  />
);

const styles = StyleSheet.create({
  gradient: {
    borderRadius: appStyles.borderRadius,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
});

export default MaybeCardGradient;
