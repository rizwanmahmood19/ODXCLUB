import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native-ui-lib';
import DeleteIcon from '../../../assets/icons/matchapp_remove_picture.svg';
import BlurredIcon from '../../../assets/icons/blurred-eye-circled.svg';
import { IProfilePicture } from '@match-app/shared/src';
import { appColors } from '../../style/appColors';
import { appStyles } from '../../style/appStyle';

interface ProfileGridDeleteImageProps {
  image: IProfilePicture;
  openDeleteDialog: (id: string) => void;
  width?: number;
}

const ProfileGridDeleteImage = ({
  image,
  openDeleteDialog,
  width,
}: ProfileGridDeleteImageProps) => {
  const handlePress = () => {
    openDeleteDialog(image.id);
  };

  return (
    <View style={{ ...styles.container, width }}>
      {image.ready ? (
        <>
          <Image
            style={styles.image}
            source={{
              uri: image.thumbnailUrl,
            }}
          />
          {image.isBlurred && (
            <BlurredIcon style={styles.eyeIcon} width={22} height={22} />
          )}
        </>
      ) : (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size={'small'} color={appColors.primary} />
        </View>
      )}
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <DeleteIcon style={styles.deleteIcon} width={30} height={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 175,
    justifyContent: 'flex-end',
    maxWidth: 115,
    position: 'relative',
  },
  deleteIcon: { marginBottom: 8 },
  eyeIcon: { position: 'absolute', right: 6, top: 6 },
  image: {
    borderRadius: appStyles.borderRadius,
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
    width: '100%',
  },
  indicatorContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default ProfileGridDeleteImage;
