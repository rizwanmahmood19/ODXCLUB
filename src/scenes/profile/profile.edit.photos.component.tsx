import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import ProfileEditPhotos from '../../components/profile-edit/profile.edit.photos.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { ProfileContext } from '../../states/profile.state';
import { doneButtonStyles } from './done.button.style';
import { CustomHeader } from '../../components/custom/custom.header.component';
import { CustomDone } from '../../components/custom/custom.done.component';
import Headline from '../../components/custom/styleguide-components/headline.component';

interface ProfileEditPhotosScreenProps {
  navigation: {
    onPhotoSelect: (photoUrl: { base64: string; path?: string }) => void;
    goToProfileEdit: () => void;
  };
}

export const ProfileEditPhotosScreen = (
  props: ProfileEditPhotosScreenProps,
) => {
  const {
    navigation: { onPhotoSelect, goToProfileEdit },
  } = props;
  const { l10n } = useContext(LocalizationContext);
  const { state } = useContext(ProfileContext);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <CustomHeader
          right={
            <CustomDone onDone={goToProfileEdit} isLoading={state.isSaving} />
          }>
          <Headline type="h2">{l10n.profile.edit.editPhotos.title}</Headline>
        </CustomHeader>
        <View style={styles.body}>
          <ProfileEditPhotos
            onPhotoSelect={onPhotoSelect}
            goToProfileEdit={goToProfileEdit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ...doneButtonStyles,
  body: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
  },
  screen: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
});
