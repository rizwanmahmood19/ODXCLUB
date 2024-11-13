import React, { useContext } from 'react';
import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import AuthFooter from '../../components/auth/auth.footer.component';
import styles from './style';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import EmailTextField from '../../components/custom/email.text.field.component';
import { ActivityIndicator } from 'react-native';
import { appColors } from '../../style/appColors';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface SignUpMailScreenProps {
  navigation: {
    nextButtonOnPress: () => void;
    backButtonOnPress: () => void;
  };
  selector: {
    email: string;
    onEmailChange: (changedEmail: string) => void;
    isEmailValid: boolean;
    isLoading: boolean;
  };
  wordings: {
    title: string;
    desc: string;
  };
}

export const SignUpMailEnterMailScreen = (props: SignUpMailScreenProps) => {
  const { navigation, selector, wordings } = props;

  const { l10n } = useContext(LocalizationContext);

  return (
    <View flex useSafeArea={true} style={styles.screen}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <LogoIcon
            width={styles.logo.width}
            height={styles.logo.height}
            style={styles.logo}
          />
          <Headline type="h1" style={styles.text80}>
            {wordings.title}
          </Headline>
          <View style={styles.space_s} />
          <InfoText style={styles.text80}>{wordings.desc}</InfoText>
          <View style={styles.space_l} />
          <EmailTextField
            value={selector.email}
            onChangeText={selector.onEmailChange}
            style={styles.textField}
            placeholder={l10n.screens.EMAIL_PLACEHOLDER}
            editable={true}
          />
          <View style={styles.space_l} />
          {selector.isLoading ? (
            <ActivityIndicator size={'small'} color={appColors.primary} />
          ) : (
            <CustomButton
              onPress={navigation.nextButtonOnPress}
              disabled={!selector.isEmailValid}>
              {l10n.screens.NEXT}
            </CustomButton>
          )}
        </View>
        <AuthFooter
          title={l10n.screens.BACK}
          onPress={navigation.backButtonOnPress}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
