import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import { LocalizationContext } from '../../services/LocalizationContext';
import ProfileSettingsForm from '../../components/profile-settings/profile.settings.form.component';
import { ProfileContext } from '../../states/profile.state';
import Headline from '../../components/custom/styleguide-components/headline.component';
import { CustomHeader } from '../../components/custom/custom.header.component';
import { CustomDone } from '../../components/custom/custom.done.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';

interface ProfileSettingsScreenProps {
  navigation: {
    onDonePress: () => void;
    onChangeCredential: (email: boolean) => void;
  };
}

export const ProfileSettingsScreen = (props: ProfileSettingsScreenProps) => {
  const { l10n } = useContext(LocalizationContext);
  const { navigation } = props;
  const { state } = useContext(ProfileContext);

  return (
    <SafeAreaView style={styles.screen}>
      {state.isSaving && <DisableBackButton />}
      <View style={styles.container}>
        <CustomHeader
          right={
            <CustomDone
              isLoading={state.isSaving}
              onDone={navigation.onDonePress}
              isDisabled={!state.isValid}
            />
          }>
          <Headline type="h2">{l10n.profile.settings.title}</Headline>
        </CustomHeader>
        <Separator />
        <View style={styles.body}>
          <ProfileSettingsForm
            onChangeCredential={navigation.onChangeCredential}
          />
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
    width: '100%',
  },
  screen: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
});
