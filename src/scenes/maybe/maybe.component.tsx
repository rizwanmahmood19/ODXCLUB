import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import MaybeList from '../../components/maybe-list/maybe.list.component';
import { appFont } from '../../style/appFont';
import { MAX_MAYBE } from '@match-app/shared';
import Headline from '../../components/custom/styleguide-components/headline.component';
import InfoText from '../../components/custom/styleguide-components/info.text.component';
import { Separator } from '../../components/custom/styleguide-components/Separator';

export const MaybeScreen = () => {
  const { l10n } = useContext(LocalizationContext);

  const maxMaybeText = (
    <InfoText style={styles.descriptionBoldText}>
      {l10n.formatString(l10n.maybe.descriptionBoldText, MAX_MAYBE)}
    </InfoText>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.screen}>
        <Separator />
        <Headline type="h2" style={styles.headline}>
          {l10n.screens.MAYBE}
        </Headline>
        <View style={styles.contentContainer}>
          <InfoText style={styles.description}>
            {l10n.formatString(l10n.maybe.description, maxMaybeText)}
          </InfoText>
          <MaybeList />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    padding: 10,
    width: '100%',
  },
  description: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  descriptionBoldText: {
    fontFamily: appFont.bold,
  },
  headline: {
    paddingHorizontal: 16,
    paddingTop: 9,
    textAlign: 'center',
  },
  screen: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingBottom: 25,
    width: '100%',
  },
});
