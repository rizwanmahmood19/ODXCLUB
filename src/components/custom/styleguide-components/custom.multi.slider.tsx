import React, { useState } from 'react';
import MultiSlider, {
  MultiSliderProps,
} from '@ptomasroos/react-native-multi-slider';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { appColors } from '../../../style/appColors';
import { View } from 'react-native-ui-lib';

const CustomMultiSlider = (props: MultiSliderProps) => {
  // workaround until fixed: https://github.com/ptomasroos/react-native-multi-slider/issues/88
  const [viewWidth, setViewWidth] = useState(0);
  const onLayout = (event: LayoutChangeEvent) => {
    setViewWidth(event.nativeEvent.layout.width);
  };

  return (
    <View onLayout={onLayout} style={styles.container}>
      <MultiSlider
        {...props}
        selectedStyle={styles.selectedStyle}
        trackStyle={styles.trackStyle}
        markerStyle={styles.markerStyle}
        sliderLength={viewWidth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -12,
    width: '100%',
  },
  markerStyle: {
    backgroundColor: '#ffffff',
    borderColor: appColors.primary,
    borderWidth: 2,
    height: 16,
    shadowOpacity: 0,
    width: 16,
  },
  selectedStyle: {
    backgroundColor: appColors.primary,
  },
  trackStyle: {
    backgroundColor: appColors.primaryLight,
    height: 2,
  },
});

export default CustomMultiSlider;
