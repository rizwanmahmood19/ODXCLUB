import React, { useContext } from 'react';
import { View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';

import AuthFooter from '../../components/auth/auth.footer.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import { TermsAndPrivacyText } from './terms.privacy.text.component';
import styles from './style';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface SignUpChoiceScreenProps {
  navigation: {
    registerEmailButtonOnPress: () => void;
    registerPhoneButtonOnPress: () => void;
    alreadySignedUpButtonOnPress: () => void;
  };
}

export const SignUpChoiceScreen = (props: SignUpChoiceScreenProps) => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <View flex useSafeArea={true} style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.content}>
          <LogoIcon
            width={styles.logo.width}
            height={styles.logo.height}
            style={styles.logo}
          />
          <Headline type="h1" style={styles.text80}>
            {l10n.screens.SIGN_UP_CHOICE_TITLE}
          </Headline>
          <View style={styles.space_l} />
          <InfoText style={styles.text80}>
            {l10n.screens.SIGN_UP_CHOICE_DESCRIPTION}
          </InfoText>
          <View style={styles.space_l} />
          <TermsAndPrivacyText
            style={styles.text80}
            textStyle={styles.centeredText}
          />
          <View style={styles.space_l} />
          <CustomButton onPress={props.navigation.registerPhoneButtonOnPress}>
            {l10n.screens.SIGN_UP_PHONE}
          </CustomButton>
          <View style={styles.space_l} />
          <CustomButton onPress={props.navigation.registerEmailButtonOnPress}>
            {l10n.screens.SIGN_UP_EMAIL}
          </CustomButton>
        </View>
      </View>
      <AuthFooter
        title={l10n.screens.SIGNED_IN_ALREADY}
        onPress={props.navigation.alreadySignedUpButtonOnPress}
      />
    </View>
  );
};
