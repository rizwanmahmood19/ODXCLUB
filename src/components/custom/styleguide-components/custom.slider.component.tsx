import React from 'react';
import { StyleSheet } from 'react-native';
import { Slider } from 'react-native-ui-lib';
import { appColors } from '../../../style/appColors';
import { SliderProps } from 'react-native-ui-lib/typings';

const CustomSlider = (props: SliderProps) => {
  const { ...otherProps } = props;
  return (
    <Slider
      {...otherProps}
      trackStyle={styles.track}
      thumbStyle={styles.thumb}
      activeThumbStyle={styles.activeThumb}
      minimumTrackTintColor={appColors.primary}
      maximumTrackTintColor={appColors.primaryLight}
      thumbTintColor="#fff"
    />
  );
};

const styles = StyleSheet.create({
  activeThumb: {
    borderWidth: 1.5,
    height: 19,
    shadowOpacity: 0,
    width: 19,
  },
  thumb: {
    borderColor: appColors.primary,
    borderWidth: 2,
    height: 16,
    shadowOpacity: 0,
    width: 16,
  },
  track: {
    backgroundColor: appColors.primary,
    borderColor: 'white',
    height: 2,
    width: '100%',
  },
});

export default CustomSlider;
