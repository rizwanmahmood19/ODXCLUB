import React, { useContext } from 'react';
import TutorialItem from '../tutorial.item.component';
import { LocalizationContext } from '../../../services/LocalizationContext';
import YeahIconSmall from '../../../../assets/icons/tutorial/yeah-icon-small.svg';
import { Assets, Text } from 'react-native-ui-lib';
import Headline from '../../custom/styleguide-components/headline.component';
import InfoText from '../../custom/styleguide-components/info.text.component';
import styles from '../tutorial.style';

const ICON_SIZE = 20;

const TutorialLikePage = () => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <TutorialItem
      animatedIconSource={require('../../../../assets/animations/tutorial/yeah-icon.json')}
      bottomAnimationSource={require('../../../../assets/animations/tutorial/yeah-bottom.json')}
      title={l10n.tutorial.items.like.title}
      backgroundImage={Assets.images.tutorialBg2}>
      <>
        <Headline type="h1" style={styles.subtitle}>
          {l10n.tutorial.items.like.subtitle}
        </Headline>
        <InfoText style={styles.text}>
          {l10n.formatString(
            l10n.tutorial.items.like.text,
            <YeahIconSmall width={ICON_SIZE} height={ICON_SIZE} />,
            <Text style={styles.bold}>
              {l10n.tutorial.items.like.textBoldArguments[0]}
            </Text>,
          )}
        </InfoText>
      </>
    </TutorialItem>
  );
};

export default TutorialLikePage;
