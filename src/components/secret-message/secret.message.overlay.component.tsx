import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import SecretMessageIcon from '../../../assets/icons/matchapp_ic_secret_message_profile.svg';
import { appColors } from '../../style/appColors';
import { appStyles } from '../../style/appStyle';
import Headline from '../custom/styleguide-components/headline.component';
import InfoText from '../custom/styleguide-components/info.text.component';
import { appFont } from '../../style/appFont';

interface SecretMessageOverlayProps {
  profileName: string;
}

const SecretMessageOverlay = (props: SecretMessageOverlayProps) => {
  const { profileName } = props;
  const { l10n } = useContext(LocalizationContext);

  return (
    <View style={styles.container}>
      <View style={styles.message}>
        <InfoText style={styles.overlayText}>
          {l10n.secretMessage.overlayText}
        </InfoText>
        <Headline style={styles.profileName} type="h1" numberOfLines={1}>
          {profileName}
        </Headline>
      </View>
      <SecretMessageIcon style={styles.icon} height={50} width={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.secondary,
    borderRadius: appStyles.borderRadius,
    flexDirection: 'row',
    opacity: 0.8,
    padding: 16,
  },
  icon: {
    flexBasis: 50,
    marginTop: 5,
  },
  message: {
    flex: 1,
  },
  overlayText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  profileName: {
    color: 'white',
    fontFamily: appFont.black,
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'center',
  },
});

export default SecretMessageOverlay;
