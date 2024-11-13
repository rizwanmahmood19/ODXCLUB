import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-ui-lib';

import ProfileGrid from './profile.grid.component';
import useProfileChangeSelector from '../../scenes/profile/profile.change.selector';
import { LocalizationContext } from '../../services/LocalizationContext';
import CustomButton from '../custom/styleguide-components/custom.button.component';

interface ProfileEditPhotosProps {
  onPhotoSelect: (photoUrl: { base64: string; path?: string }) => void;
  goToProfileEdit: () => void;
}

const ProfileEditPhotos = (props: ProfileEditPhotosProps) => {
  const { onPhotoSelect, goToProfileEdit } = props;
  const { l10n } = useContext(LocalizationContext);
  const { initialValues, scrollEnabled, handleScrollEnabled } =
    useProfileChangeSelector();

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      scrollEnabled={scrollEnabled}>
      <ProfileGrid
        onPhotoSelect={onPhotoSelect}
        images={initialValues.pictures}
        onScrollEnabled={handleScrollEnabled}
      />
      <CustomButton
        type="outline"
        onPress={goToProfileEdit}
        style={styles.button}>
        {l10n.profile.edit.editPhotos.goToEdit}
      </CustomButton>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 6,
    paddingTop: 15,
    width: '100%',
  },
  container: {
    flex: 1,
    marginTop: -12, // the grid has an internal padding, that we need to reset here
    paddingHorizontal: 5,
  },
});

export default ProfileEditPhotos;
