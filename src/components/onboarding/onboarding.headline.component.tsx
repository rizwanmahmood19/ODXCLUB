import React, { useContext } from 'react';

import Headline from '../custom/styleguide-components/headline.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { StyleSheet } from 'react-native';

const OnboardingHeadline = (props: { sectionTitle?: string }) => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <Headline type="h2" style={styles.headline} isCentered>
      {props.sectionTitle ? props.sectionTitle : l10n.onboarding.generalHeader}
    </Headline>
  );
};

const styles = StyleSheet.create({
  headline: {
    margin: 20,
    paddingTop: 2,
  },
});

export default OnboardingHeadline;
