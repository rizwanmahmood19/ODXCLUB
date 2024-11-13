import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { View } from 'react-native-ui-lib';
import { RetryImage } from '../custom/custom.retry-image.component';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import { appColors } from '../../style/appColors';
import LottieView from 'lottie-react-native';

const DEFAULT_BORDER_SIZE = 10;

export interface ProfileImageCircleProps {
  photo: ImageSourcePropType | 'show-logo';
  size: number;
  borderSize?: number;
  focused?: boolean;
  imageStyle?: Record<string, unknown>;
}

export const ProfileImageCircle: React.FC<ProfileImageCircleProps> = ({
  photo,
  size,
  borderSize,
  focused,
  imageStyle,
}) => {
  if (photo === 'show-logo') {
    return (
      <LogoIcon style={[styles(size, borderSize).logoImage, imageStyle]} />
    );
  }
  return (
    <View style={styles(size, borderSize).profileContainer}>
      <RetryImage
        style={[styles(size, borderSize).image, imageStyle]}
        source={photo}
      />
      {focused && (
        <LottieView
          source={require('../../../assets/animations/gradient-new-chat.json')}
          style={styles(size, borderSize).animatedBorder}
          autoPlay
          loop
        />
      )}
    </View>
  );
};

const styles = (size: number, borderSize?: number) => ({
  animatedBorder: {
    height: size + (borderSize || DEFAULT_BORDER_SIZE),
    position: 'absolute',
    width: size + (borderSize || DEFAULT_BORDER_SIZE),
    zIndex: 1,
  },
  image: {
    borderColor: appColors.secondary,
    borderRadius: size / 2,
    height: size,
    width: size,
    zIndex: 2,
  },
  logoImage: {
    borderColor: appColors.secondary,
    borderRadius: size / 2,
    height: 24,
    width: 24,
  },
  profileContainer: {
    borderRadius: size / 2,
    height: size + (borderSize || DEFAULT_BORDER_SIZE),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});
