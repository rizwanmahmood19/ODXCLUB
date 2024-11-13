import React, { useContext } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Carousel, TouchableOpacity, View } from 'react-native-ui-lib';
import BackArrow from '../../../assets/icons/matchapp_back_arrow_white.svg';
import SubscriptionGalleryItem from './subscription.gallery.item.component';
import { useSubscriptionGallerySelector } from './subscription.gallery.selector';
import SubscriptionStaticView from './subscription.static.view.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { SubscriptionState } from '../../payment/PaymentContextProd';
import { PaymentContext } from '../../payment';
import { useNavigation } from '@react-navigation/native';
import { AppRoute } from '../../navigation/app.routes';
import { is_iOS } from '../../util/osCheck';
import { DisableBackButton } from '../../navigation/back-button/DisableBackButton';
import Headline from '../custom/styleguide-components/headline.component';
import InfoText from '../custom/styleguide-components/info.text.component';
import { appStyles } from '../../style/appStyle';

const HEIGHT_40_PERCENT = Dimensions.get('window').height * 0.4;
const STATIC_HEIGHT = HEIGHT_40_PERCENT > 250 ? HEIGHT_40_PERCENT : 250;

const SubscriptionGallery = () => {
  const {
    subscriptionState,
    restorePurchase,
    requestSubscription,
    isLoading,
    isWaitingModalVisible,
  } = useContext(PaymentContext);
  const {
    currentPage,
    carouselRef,
    galleryItems,
    increaseIndex,
    decreaseIndex,
  } = useSubscriptionGallerySelector();
  const { l10n } = useContext(LocalizationContext);
  const { navigate } = useNavigation();
  const handleBackPress = () => {
    if (isLoading) {
      return;
    }
    navigate(AppRoute.PROFILE_SETTINGS);
  };
  return (
    <>
      <View style={styles.container}>
        {isLoading && <DisableBackButton />}
        <TouchableOpacity style={styles.backArrow} onPress={handleBackPress}>
          <BackArrow height={20} width={40} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightButton} onPress={increaseIndex} />
        <TouchableOpacity style={styles.leftButton} onPress={decreaseIndex} />
        <Carousel
          pointerEvents="none"
          ref={carouselRef}
          initialPage={currentPage}
          containerStyle={styles.carouselContainer}>
          {galleryItems.map((item, index) => (
            <SubscriptionGalleryItem
              key={`subscription-gallery-item-${index}`}
              staticHeight={STATIC_HEIGHT}
              {...item}
            />
          ))}
        </Carousel>
        <View style={styles.staticContainer}>
          <SubscriptionStaticView
            currentPage={currentPage}
            galleryItems={galleryItems}
            // Android doesn't inform if a subscription was cancelled, so we always set the "startNow" label
            buttonText={
              subscriptionState === SubscriptionState.CANCELED && is_iOS
                ? l10n.subscription.gallery.button.startNow
                : l10n.subscription.gallery.button.startTrial
            }
            onStartSubscriptionPress={requestSubscription}
            onRestorePurchasePress={restorePurchase}
          />
        </View>
      </View>
      {isWaitingModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Headline type="h3">
              {l10n.subscription.waitingModal.title}
            </Headline>
            <InfoText style={styles.modalInfo}>
              {l10n.subscription.waitingModal.description}
            </InfoText>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backArrow: {
    left: 20,
    position: 'absolute',
    top: 60,
    zIndex: 101,
  },
  carouselContainer: {
    flex: 1,
    zIndex: 1,
  },
  container: {
    flex: 1,
  },
  leftButton: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '50%',
    zIndex: 100,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: appStyles.borderRadius,
    margin: 24,
    padding: 24,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.7)',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 2000,
  },
  modalInfo: {
    paddingTop: 9,
  },
  rightButton: {
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    zIndex: 100,
  },
  staticContainer: {
    bottom: 0,
    height: STATIC_HEIGHT,
    position: 'absolute',
    width: '100%',
    zIndex: 100,
  },
});

export default SubscriptionGallery;
