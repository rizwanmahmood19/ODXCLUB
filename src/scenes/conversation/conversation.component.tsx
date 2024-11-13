import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import CustomTitle from '../../components/custom/custom.title.component';
import { MatchList } from '../../components/match-list/match.list.component';

import { MatchItem } from '@match-app/shared/dist/model/MatchItem';
import { ChatList } from '../../components/chat/chat.list.component';
import Headline from '../../components/custom/styleguide-components/headline.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';

export interface ConversationScreenProps {
  navigation: {
    openChat: (matchItem: MatchItem) => void;
    openChatForChannel: (channel: any) => void;
    openPassionAlert: () => void;
  };
}

export const ConversationScreen = (props: ConversationScreenProps) => {
  const { l10n } = useContext(LocalizationContext);
  const { navigation } = props;

  const handleOnMatchPress = (matchItem: MatchItem) => {
    navigation.openChat(matchItem);
  };

  return (
    <View useSafeArea={true} style={styles.screen}>
      <Separator />
      <Headline type="h2" isCentered style={styles.headline}>
        {l10n.conversation.title}
      </Headline>
      <View style={[styles.section, styles.sectionMatches]}>
        <CustomTitle style={styles.title} uppercase={false}>
          {l10n.conversation.sectionNewMatches}
        </CustomTitle>
        <MatchList navigation={{ onMatchPress: handleOnMatchPress }} />
      </View>
      <View style={styles.section}>
        <CustomTitle style={styles.title} uppercase={false}>
          {l10n.conversation.sectionMessages}
        </CustomTitle>
      </View>
      <ChatList
        navigation={{
          openChatForChannel: navigation.openChatForChannel,
          openPassionAlert: navigation.openPassionAlert,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headline: {
    paddingTop: 12,
  },
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  section: {
    marginBottom: 0,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  sectionMatches: {
    height: 130,
  },
  title: {
    marginBottom: 12,
    marginTop: 0,
    width: '100%',
  },
});
