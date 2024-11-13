import React, { useContext } from 'react';
import TutorialItem from '../tutorial.item.component';
import { LocalizationContext } from '../../../services/LocalizationContext';
import { Assets, Text } from 'react-native-ui-lib';
import InfoText from '../../custom/styleguide-components/info.text.component';
import Headline from '../../custom/styleguide-components/headline.component';
import styles from '../tutorial.style';

const TutorialRewindPage = () => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <TutorialItem
      animatedIconSource={require('../../../../assets/animations/tutorial/rewind-icon.json')}
      bottomAnimationSource={require('../../../../assets/animations/tutorial/rewind-bottom.json')}
      title={l10n.tutorial.items.rewind.title}
      backgroundImage={Assets.images.tutorialBg4}>
      <>
        <Headline type="h1" style={styles.subtitle}>
          {l10n.tutorial.items.rewind.subtitle}
        </Headline>
        <InfoText style={styles.text}>
          {l10n.formatString(
            l10n.tutorial.items.rewind.text,
            <Text style={styles.bold}>
              {l10n.tutorial.items.rewind.textBoldArguments[0]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.rewind.textBoldArguments[1]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.rewind.textBoldArguments[2]}
            </Text>,
          )}
        </InfoText>
      </>
    </TutorialItem>
  );
};

export default TutorialRewindPage;
