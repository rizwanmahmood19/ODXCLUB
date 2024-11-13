import React from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { Assets, Image } from 'react-native-ui-lib';

interface StampProps {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}

export const YeahStamp = (props: StampProps) => {
  const { style } = props;
  return (
    <Animated.View style={style} pointerEvents="none">
      <Image width={167} height={71} source={Assets.icons.yeahStamp} />
    </Animated.View>
  );
};

export const NopeStamp = (props: StampProps) => {
  const { style } = props;
  return (
    <Animated.View style={style} pointerEvents="none">
      <Image width={162} height={71} source={Assets.icons.nopeStamp} />
    </Animated.View>
  );
};

export const MaybeStamp = (props: StampProps) => {
  const { style } = props;
  return (
    <Animated.View style={style} pointerEvents="none">
      <Image width={234} height={71} source={Assets.icons.maybeStamp} />
    </Animated.View>
  );
};
