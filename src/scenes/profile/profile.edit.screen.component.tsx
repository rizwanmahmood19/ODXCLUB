import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import ProfileEdit from '../../components/profile-edit/profile.edit.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { useKeyboardUsed } from '../../util/useKeyboardUsed';
import { ProfileContext } from '../../states/profile.state';
import ProfilePreview from '../../components/profile-preview/profile.preview.component';
import { CustomHeader } from '../../components/custom/custom.header.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import { CustomDone } from '../../components/custom/custom.done.component';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';

interface ProfileEditScreenProps {
  navigation: {
    goToEditPhotos: () => void;
    goBack: () => void;
  };
  showPreview: boolean;
}

export const ProfileEditScreen = (props: ProfileEditScreenProps) => {
  const {
    navigation: { goBack, goToEditPhotos },
    showPreview,
  } = props;
  const { l10n } = useContext(LocalizationContext);
  const { keyboardUsed } = useKeyboardUsed();
  const { state } = useContext(ProfileContext);

  return (
    <SafeAreaView style={styles.screen}>
      {state.isSaving && <DisableBackButton />}
      <View style={styles.container}>
        <CustomHeader
          right={
            <CustomDone
              isLoading={state.isSaving}
              isDisabled={keyboardUsed}
              onDone={goBack}
            />
          }>
          <Headline type="h2" isCentered>
            {showPreview
              ? l10n.profile.edit.headers.preview
              : l10n.profile.edit.headers.edit}
          </Headline>
        </CustomHeader>
        <View style={styles.body}>
          {showPreview ? (
            <ProfilePreview />
          ) : (
            <ProfileEdit goToEditPhotos={goToEditPhotos} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  screen: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
});
