import React, { useContext, useEffect } from 'react';
import { View } from 'react-native-ui-lib';

import { IBlockedProfile, IPublicProfile } from '@match-app/shared';
import InfoText from '../custom/styleguide-components/info.text.component';
import Headline from '../custom/styleguide-components/headline.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import SecretMessageChannel from './secret.message.channel.component';
import { secretMessageStyles } from './secret.message.styles';
import logEvent from '../../analytics/analytics';
import {
  SecretMessageEvent,
  UserInteractionEvent,
} from '../../analytics/analytics.event';

interface ReadSecretMessageProps {
  channelId: string;
  profile: IPublicProfile | IBlockedProfile;
  handleIgnore: () => void;
}

const ReadSecretMessage = ({
  channelId,
  profile,
  handleIgnore,
}: ReadSecretMessageProps) => {
  const { l10n } = useContext(LocalizationContext);

  useEffect(() => {
    logEvent(UserInteractionEvent.click + '_' + SecretMessageEvent.open);
  }, []);

  return (
    <View useSafeArea style={secretMessageStyles.content}>
      <View style={secretMessageStyles.readSecretMessageContainer}>
        <Headline style={secretMessageStyles.headline} type="h1">
          {l10n.secretMessage.title}
        </Headline>
        <InfoText style={secretMessageStyles.infoText}>
          {l10n.secretMessage.receive.text}
        </InfoText>
        <SecretMessageChannel
          profile={profile}
          channelId={channelId}
          handleIgnore={handleIgnore}
        />
      </View>
    </View>
  );
};

export default ReadSecretMessage;
