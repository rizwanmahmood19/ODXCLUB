import React, { useContext } from 'react';
import { View } from 'react-native-ui-lib';
import { ActivityIndicator, StyleSheet } from 'react-native';

import CustomTitle from '../custom/custom.title.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import PassionAlertMatchList from './passion.alert.match.list.component';
import {
  IPassionAlertSelectorParams,
  usePassionAlertSelector,
} from './passion.alert.selector';
import PassionAlertSelectedMatches from './passion.alert.selected.matches.component';
import { appColors } from '../../style/appColors';
import ChatInput from '../chat/chat-input/chat.input.component';
import { ScrollView } from 'react-native-gesture-handler';
import SendIcon from '../../../assets/icons/matchapp_send_secondary.svg';
import AttachmentIcon from '../../../assets/icons/matchapp_attachment_secondary.svg';
import { ChatContext } from '../../states/chat.state';
import { AppRoute } from '../../navigation/app.routes';
import { useNavigation } from '@react-navigation/core';
import Headline from '../custom/styleguide-components/headline.component';
import InfoText from '../custom/styleguide-components/info.text.component';
import { appFont } from '../../style/appFont';

const PassionAlert = () => {
  const { client, refreshChatList } = useContext(ChatContext);
  const { l10n } = useContext(LocalizationContext);
  const selectorParams: IPassionAlertSelectorParams = {
    l10n,
    client,
  };

  const navigation = useNavigation();

  const {
    unselectedMatches,
    selectedMatches,
    channels,
    selectedMatchIds,
    loading,
    addMatch,
    removeMatch,
  } = usePassionAlertSelector(selectorParams);

  const handleMessageSent = () => {
    refreshChatList();
    navigation.navigate(AppRoute.CONVERSATION);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Headline type="h2" isCentered style={styles.headline}>
          {l10n.passionAlert.title.header}
        </Headline>
        <InfoText style={styles.info}>
          {l10n.formatString(
            l10n.passionAlert.title.info,
            <InfoText style={styles.centeredBold}>
              {l10n.passionAlert.title.infoBold1}
            </InfoText>,
            <InfoText style={styles.centeredBold}>
              {l10n.passionAlert.title.infoBold2}
            </InfoText>,
          )}
        </InfoText>
        <View style={[styles.section, styles.sectionNewMatches]}>
          <CustomTitle style={styles.title} uppercase={false}>
            {l10n.passionAlert.title.newMatches}
          </CustomTitle>
          <PassionAlertMatchList
            matches={unselectedMatches}
            handleOnPress={addMatch}
          />
        </View>
        <View style={styles.section}>
          <CustomTitle style={styles.title} uppercase={false}>
            {l10n.passionAlert.title.selectedMatches}
          </CustomTitle>
          <PassionAlertSelectedMatches
            matches={selectedMatches}
            removeMatch={removeMatch}
          />
        </View>
      </ScrollView>
      <View>
        <ChatInput
          placeholder={l10n.chat.chatInput.placeholder}
          smallPlaceholder={l10n.passionAlert.chat.smallPlaceholder}
          matchIds={selectedMatchIds}
          channels={channels}
          AttachmentIcon={AttachmentIcon}
          SendIcon={SendIcon}
          color={appColors.secondary}
          handleMessageSent={handleMessageSent}
          scrollEnabled={true}
          isPassionAlert={true}
          disabled={selectedMatches.length === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredBold: {
    fontFamily: appFont.bold,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headline: {
    paddingVertical: 10,
  },
  info: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionNewMatches: {
    height: 130,
  },
  title: {
    marginBottom: 12,
    marginTop: 0,
    width: '100%',
  },
});

export default PassionAlert;
