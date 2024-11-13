import React from 'react';
import { StyleSheet } from 'react-native';
import { Slider, View } from 'react-native-ui-lib';
import { appColors } from '../../../style/appColors';
import { SliderProps } from 'react-native-ui-lib/typings';

interface AudioTrackProps extends SliderProps {
  color?: string;
}

const AudioTrack = (props: AudioTrackProps) => {
  const { color, ...otherProps } = props;
  const generalColor = color || appColors.primary;
  const specificStyles = {
    activeThumb: {
      backgroundColor: generalColor,
    },
    border: {
      borderColor: generalColor,
    },
  };
  return (
    <View style={styles.container}>
      <Slider
        {...otherProps}
        trackStyle={[styles.track, specificStyles.border]}
        thumbStyle={[styles.thumb, specificStyles.border]}
        activeThumbStyle={[styles.activeThumb, specificStyles.activeThumb]}
        minimumTrackTintColor={generalColor}
        maximumTrackTintColor={generalColor}
        thumbTintColor={generalColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activeThumb: {
    borderWidth: 3,
    height: 15,
    width: 15,
  },
  container: {
    marginHorizontal: 3, // Margin to compensate activeThumb width difference
  },
  thumb: {
    elevation: 0,
    height: 12,
    shadowOpacity: 0,
    width: 12,
  },
  track: {
    backgroundColor: appColors.primary,
    height: 2,
  },
});

export default AudioTrack;
