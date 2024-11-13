import React, { useContext } from 'react';
import TutorialItem from '../tutorial.item.component';
import { LocalizationContext } from '../../../services/LocalizationContext';
import { Text, Assets } from 'react-native-ui-lib';
import YeahIconSmall from '../../../../assets/icons/tutorial/yeah-icon-small.svg';
import Headline from '../../custom/styleguide-components/headline.component';
import InfoText from '../../custom/styleguide-components/info.text.component';
import styles from '../tutorial.style';

const ICON_SIZE = 20;

const TutorialSecretMessagePage = () => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <TutorialItem
      animatedIconSource={require('../../../../assets/animations/tutorial/secret-message-icon.json')}
      bottomAnimationSource={require('../../../../assets/animations/tutorial/secret-message-bottom.json')}
      title={l10n.tutorial.items.secretMessage.title}
      backgroundImage={Assets.images.tutorialBg5}>
      <>
        <Headline type="h1" style={styles.subtitle}>
          {l10n.tutorial.items.secretMessage.subtitle}
        </Headline>
        <InfoText style={styles.text}>
          {l10n.formatString(
            l10n.tutorial.items.secretMessage.text,
            <YeahIconSmall width={ICON_SIZE} height={ICON_SIZE} />,
            <Text style={styles.bold}>
              {l10n.tutorial.items.secretMessage.textBoldArguments[0]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.secretMessage.textBoldArguments[1]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.secretMessage.textBoldArguments[2]}
            </Text>,
          )}
        </InfoText>
      </>
    </TutorialItem>
  );
};

export default TutorialSecretMessagePage;
