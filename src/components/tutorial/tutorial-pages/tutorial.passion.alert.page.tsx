import React, { useContext } from 'react';
import TutorialItem from '../tutorial.item.component';
import { LocalizationContext } from '../../../services/LocalizationContext';
import { Assets, Text } from 'react-native-ui-lib';
import CustomButton from '../../custom/styleguide-components/custom.button.component';
import InfoText from '../../custom/styleguide-components/info.text.component';
import Headline from '../../custom/styleguide-components/headline.component';
import styles from '../tutorial.style';

interface TutorialPassionAlertPageProps {
  handleButtonPress: () => void;
  isUpdating?: boolean;
}

const TutorialPassionAlertPage = (props: TutorialPassionAlertPageProps) => {
  const { handleButtonPress, isUpdating } = props;
  const { l10n } = useContext(LocalizationContext);

  return (
    <TutorialItem
      animatedIconSource={require('../../../../assets/animations/tutorial/passion-alert-icon.json')}
      bottomAnimationSource={require('../../../../assets/animations/tutorial/passion-alert-bottom.json')}
      topAnimationSource={require('../../../../assets/animations/tutorial/passion-alert-top.json')}
      button={
        <CustomButton
          type="outline"
          color="white"
          style={styles.button}
          onPress={handleButtonPress}
          isLoading={isUpdating}>
          {l10n.tutorial.button}
        </CustomButton>
      }
      title={l10n.tutorial.items.passionAlert.title}
      backgroundImage={Assets.images.tutorialBg6}>
      <>
        <Headline type="h1" style={styles.subtitle}>
          {l10n.tutorial.items.passionAlert.subtitle}
        </Headline>
        <InfoText style={styles.text}>
          {l10n.formatString(
            l10n.tutorial.items.passionAlert.text,
            <Text style={styles.bold}>
              {l10n.tutorial.items.passionAlert.textBoldArguments[0]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.passionAlert.textBoldArguments[1]}
            </Text>,
            <Text style={styles.bold}>
              {l10n.tutorial.items.passionAlert.textBoldArguments[2]}
            </Text>,
          )}
        </InfoText>
      </>
    </TutorialItem>
  );
};

export default TutorialPassionAlertPage;
