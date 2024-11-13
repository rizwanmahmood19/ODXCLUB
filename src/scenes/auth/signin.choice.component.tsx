import React, { useContext } from 'react';
import { View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';

import AuthFooter from '../../components/auth/auth.footer.component';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import styles from './style';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';

export interface SignInChoiceScreenProps {
  navigation: {
    emailSignInOnPress: () => void;
    phoneSignInOnPress: () => void;
    backButtonOnPress: () => void;
  };
}

export const SignInChoiceScreen = (props: SignInChoiceScreenProps) => {
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
            {l10n.screens.SIGN_IN_TITLE}
          </Headline>
          <View style={styles.space_s} />
          <InfoText style={styles.text80}>
            {l10n.screens.SIGN_IN_CHOICE_DESCRIPTION}
          </InfoText>
          <View style={styles.space_l} />
          <CustomButton onPress={props.navigation.phoneSignInOnPress}>
            {l10n.screens.SIGN_IN_PHONE}
          </CustomButton>
          <View style={styles.space_l} />
          <CustomButton onPress={props.navigation.emailSignInOnPress}>
            {l10n.screens.SIGN_IN_EMAIL}
          </CustomButton>
        </View>
      </View>
      <AuthFooter
        title={l10n.screens.BACK}
        onPress={props.navigation.backButtonOnPress}
      />
    </View>
  );
};
