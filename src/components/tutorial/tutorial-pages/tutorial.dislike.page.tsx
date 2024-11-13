import React, { useContext } from 'react';
import TutorialItem from '../tutorial.item.component';
import { LocalizationContext } from '../../../services/LocalizationContext';
import NopeIconSmall from '../../../../assets/icons/tutorial/nope-icon-small.svg';
import { Assets, Text } from 'react-native-ui-lib';
import InfoText from '../../custom/styleguide-components/info.text.component';
import Headline from '../../custom/styleguide-components/headline.component';
import styles from '../tutorial.style';

const ICON_SIZE = 18;

const TutorialDislikePage = () => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <TutorialItem
      animatedIconSource={require('../../../../assets/animations/tutorial/nope-icon.json')}
      bottomAnimationSource={require('../../../../assets/animations/tutorial/nope-bottom.json')}
      title={l10n.tutorial.items.dislike.title}
      backgroundImage={Assets.images.tutorialBg1}>
      <>
        <Headline type="h1" style={styles.subtitle}>
          {l10n.tutorial.items.dislike.subtitle}
        </Headline>
        <InfoText style={styles.text}>
          {l10n.formatString(
            l10n.tutorial.items.dislike.text,
            <NopeIconSmall width={ICON_SIZE} height={ICON_SIZE} />,
            <Text style={styles.bold}>
              {l10n.tutorial.items.dislike.textBoldArguments[0]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.dislike.textBoldArguments[1]}
            </Text>,
          )}
        </InfoText>
      </>
    </TutorialItem>
  );
};

export default TutorialDislikePage;
