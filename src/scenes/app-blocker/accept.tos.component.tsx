import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import { TermsAndPrivacyText } from '../auth/terms.privacy.text.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import { useUpdateProfile } from '../profile/profile.selector';
import { useDisableBackButton } from '../../navigation/back-button/useDisableBackButton';

export const AcceptTOSScreen = () => {
  const { l10n } = useContext(LocalizationContext);
  const { updateProfile, isUpdating } = useUpdateProfile();

  useDisableBackButton();

  const confirmTos = async () => {
    await updateProfile({
      data: { tosAcceptedAt: new Date() },
    });
  };

  return (
    <View useSafeArea={true} style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.content}>
          <LogoIcon
            width={styles.logo.width}
            height={styles.logo.height}
            style={styles.logo}
          />
          <Text style={styles.titleText}>{l10n.blocker.acceptTos.title}</Text>
          <Text style={styles.text}>
            {l10n.blocker.acceptTos.descriptionText}
          </Text>
          <TermsAndPrivacyText
            style={styles.termsAndPrivacy}
            linkText={l10n.blocker.acceptTos.hiperlinksText}
            termsString={l10n.blocker.acceptTos.termsString}
            privacyString={l10n.blocker.acceptTos.privacyString}
          />
          {isUpdating ? (
            <ActivityIndicator size={'small'} color={appColors.primary} />
          ) : (
            <CustomButton onPress={confirmTos}>
              {l10n.blocker.acceptTos.button}
            </CustomButton>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    paddingTop: 50,
  },
  logo: {
    height: 107,
    marginBottom: 47,
    width: 107,
  },
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  termsAndPrivacy: {
    marginVertical: 25,
    textAlign: 'center',
    width: '75%',
  },
  text: {
    fontFamily: appFont.regular,
    fontSize: 15,
    fontWeight: 'normal',
    marginTop: 30,
    textAlign: 'center',
    width: '75%',
  },
  titleText: {
    color: appColors.primary,
    fontFamily: appFont.bold,
    fontSize: 21,
    fontWeight: 'bold',
  },
});
