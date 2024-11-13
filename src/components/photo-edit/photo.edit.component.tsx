import React, { useContext } from 'react';
import { View } from 'react-native-ui-lib';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { usePhotoEditSelector } from './photo.edit.selector';
import { appColors } from '../../style/appColors';
import { LocalizationContext } from '../../services/LocalizationContext';
import { PhotoEditScreenProps } from '../../scenes/profile/photo.edit.component';
import PhotoEditHeader from './photo.edit.header.component';
import InfoText from '../custom/styleguide-components/info.text.component';
import PhotoBlurToggle from './photo.blur.toggle.component';

const PhotoEdit: React.FC<PhotoEditScreenProps> = (props) => {
  const { photoUrl, goBack } = props;
  const { l10n } = useContext(LocalizationContext);
  const {
    isBlurred,
    croppedImage,
    isLoading,
    uploadPhoto,
    handleSwitchChange,
  } = usePhotoEditSelector(photoUrl, goBack);

  return (
    <View style={styles.body}>
      <PhotoEditHeader
        uploadPhoto={uploadPhoto}
        goBack={goBack}
        isLoading={isLoading}
        image={croppedImage}
      />
      <View style={styles.container}>
        {croppedImage ? (
          <PhotoBlurToggle
            imagePath={croppedImage.path}
            isBlurred={isBlurred}
            handleSwitchChange={handleSwitchChange}
          />
        ) : (
          <>
            <InfoText style={styles.loadingText}>
              {l10n.profile.photoEdit.loadingText}
            </InfoText>
            <ActivityIndicator
              size={'large'}
              style={styles.activityIndicator}
              color={appColors.primary}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    textAlign: 'center',
    width: '100%',
  },
  loadingText: {
    alignSelf: 'center',
  },
});

export default PhotoEdit;
