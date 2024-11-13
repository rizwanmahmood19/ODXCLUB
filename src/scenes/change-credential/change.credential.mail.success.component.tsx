import { KeyboardAwareScrollView, View } from 'react-native-ui-lib';
import styles from '../auth/style';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import React, { useContext } from 'react';
import { SignUpMailContext } from '../auth/signup.mail.state';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';

export interface ChangeCredentialMailSuccessScreenProps {
  onNext: () => void;
  wording: {
    title: string;
    desc: string;
    submitTitle: string;
  };
}

export const ChangeCredentialMailSuccessScreen = (
  props: ChangeCredentialMailSuccessScreenProps,
) => {
  const { onNext, wording } = props;
  const { dispatch } = useContext(SignUpMailContext);

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
            {wording.title}
          </Headline>
          <View style={styles.space_s} />
          <InfoText style={styles.text80}>{wording.desc}</InfoText>
          <View style={styles.space_l} />
          <CustomButton
            onPress={() => {
              dispatch({
                type: 'setVerificationId',
                verificationId: undefined,
              });
              onNext();
            }}>
            {wording.submitTitle}
          </CustomButton>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
