import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { PageControl, View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import Label from '../custom/styleguide-components/label.component';
import { appFont } from '../../style/appFont';
import CustomButton from '../custom/styleguide-components/custom.button.component';
import links from '../../services/links';
import { openLink } from '../../services/linking';
import { PaymentContext } from '../../payment';
import { is_iOS } from '../../util/osCheck';

interface SubscriptionStaticViewProps {
  currentPage: number;
  buttonText: string;
  galleryItems: Array<{ imageUrl: number; text: string }>;
  onStartSubscriptionPress: () => void;
  onRestorePurchasePress: () => void;
}

const SubscriptionStaticView = (props: SubscriptionStaticViewProps) => {
  const {
    currentPage,
    galleryItems,
    buttonText,
    onStartSubscriptionPress,
    onRestorePurchasePress,
  } = props;
  const { l10n } = useContext(LocalizationContext);
  const { subscriptionInfo, isLoading } = useContext(PaymentContext);

  const onTermsPress = () => openLink(links.termsURL);
  return (
    <View style={styles.container}>
      <PageControl
        currentPage={currentPage}
        numOfPages={galleryItems.length}
        spacing={20}
        color="white"
        inactiveColor="rgba(255, 255, 255, 0.6)"
      />
      <View style={styles.costContainer}>
        <Label style={styles.costText}>
          {l10n.subscription.gallery.costs.text.replace(
            '$localizedPrice$',
            subscriptionInfo?.localizedPrice,
          )}
        </Label>
        <Label style={styles.costSubtext}>
          {l10n.subscription.gallery.costs.subtext}
        </Label>
      </View>
      <CustomButton
        style={styles.startButton}
        type="outline"
        isLoading={isLoading}
        color="white"
        onPress={onStartSubscriptionPress}>
        {buttonText}
      </CustomButton>
      <CustomButton type="link" color="white" onPress={onTermsPress}>
        <Label style={styles.link}>{l10n.subscription.gallery.terms}</Label>
      </CustomButton>
      {is_iOS && (
        <CustomButton
          type="link"
          color="white"
          onPress={onRestorePurchasePress}>
          <Label style={styles.link}>
            {l10n.subscription.gallery.restorePurchase}
          </Label>
        </CustomButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  costContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  costSubtext: {
    color: 'white',
    fontFamily: appFont.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  costText: {
    color: 'white',
    fontFamily: appFont.bold,
    fontSize: 16,
    lineHeight: 20,
  },
  link: {
    color: 'white',
    textAlign: 'center',
  },
  startButton: {
    padding: 10,
  },
});

export default SubscriptionStaticView;
