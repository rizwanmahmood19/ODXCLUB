import React, { useContext } from 'react';
import TutorialItem from '../tutorial.item.component';
import { LocalizationContext } from '../../../services/LocalizationContext';
import MaybeIconSmall from '../../../../assets/icons/tutorial/maybe-icon-small.svg';
import { Assets, Text } from 'react-native-ui-lib';
import Headline from '../../custom/styleguide-components/headline.component';
import InfoText from '../../custom/styleguide-components/info.text.component';
import styles from '../tutorial.style';

const ICON_SIZE = 20;

const TutorialMaybePage = () => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <TutorialItem
      animatedIconSource={require('../../../../assets/animations/tutorial/maybe-icon.json')}
      bottomAnimationSource={require('../../../../assets/animations/tutorial/maybe-bottom.json')}
      title={l10n.tutorial.items.maybe.title}
      backgroundImage={Assets.images.tutorialBg3}>
      <>
        <Headline type="h1" style={styles.subtitle}>
          {l10n.tutorial.items.maybe.subtitle}
        </Headline>
        <InfoText style={styles.text}>
          {l10n.formatString(
            l10n.tutorial.items.maybe.text,
            <MaybeIconSmall width={ICON_SIZE} height={ICON_SIZE} />,
            <Text style={styles.bold}>
              {l10n.tutorial.items.maybe.textBoldArguments[0]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.maybe.textBoldArguments[1]}
            </Text>,
          )}
        </InfoText>
      </>
    </TutorialItem>
  );
};

export default TutorialMaybePage;
