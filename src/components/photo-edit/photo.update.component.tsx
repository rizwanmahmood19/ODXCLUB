import React from 'react';
import { View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import PhotoEditHeader from './photo.edit.header.component';
import PhotoBlurToggle from './photo.blur.toggle.component';
import { usePhotoUpdateSelector } from './photo.update.selector';
import { useNavigation } from '@react-navigation/core';
import { IProfilePicture } from '@match-app/shared';

interface PhotoUpdateProps {
  image: IProfilePicture;
}

const PhotoUpdate: React.FC<PhotoUpdateProps> = ({ image }) => {
  const navigation = useNavigation();
  const { isBlurred, isLoading, updatePhoto, handleSwitchChange } =
    usePhotoUpdateSelector(image, navigation.goBack);

  return (
    <View style={styles.body}>
      <PhotoEditHeader
        uploadPhoto={updatePhoto}
        goBack={navigation.goBack}
        isLoading={isLoading}
        image={image}
      />
      <View style={styles.container}>
        <PhotoBlurToggle
          imagePath={image.pictureUrl}
          isBlurred={isBlurred}
          handleSwitchChange={handleSwitchChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    textAlign: 'center',
    width: '100%',
  },
});

export default PhotoUpdate;
