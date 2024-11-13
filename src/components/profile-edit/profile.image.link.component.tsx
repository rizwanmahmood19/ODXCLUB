import React from 'react';
import { Assets, Image, TouchableOpacity } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { IProfilePicture } from '@match-app/shared';
import AddPhotoIcon from '../../../assets/icons/matchapp_ic_add_a_photo_white.svg';
import { appStyles } from '../../style/appStyle';

const ICON_SIZE = 40;

interface ProfileImageLinkProps {
  image?: IProfilePicture | null;
  handlePress: () => void;
}

const ProfileImageLink = (props: ProfileImageLinkProps) => {
  const { image, handlePress } = props;
  const imageSource = image
    ? {
        uri: image.thumbnailUrl,
      }
    : Assets.images.defaultProfile;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      activeOpacity={0.8}>
      <Image style={styles.linkImage} source={imageSource} />
      <AddPhotoIcon style={styles.icon} height={ICON_SIZE} width={ICON_SIZE} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginBottom: 12,
    position: 'relative',
  },
  icon: {
    bottom: 9,
    left: 9,
    position: 'absolute',
  },
  linkImage: {
    borderRadius: appStyles.borderRadius,
    height: 350,
    width: 'auto',
  },
});

export default ProfileImageLink;
