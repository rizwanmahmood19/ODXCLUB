import React, { useContext } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Image, View, Modal } from 'react-native-ui-lib';
import CustomButton from '../../custom/styleguide-components/custom.button.component';
import LottieView from 'lottie-react-native';
import { LocalizationContext } from '../../../services/LocalizationContext';
import Headline from '../../custom/styleguide-components/headline.component';
import { appFont } from '../../../style/appFont';
import InfoText from '../../custom/styleguide-components/info.text.component';
import { ProfileContext } from '../../../states/profile.state';
import { useNavigation } from '@react-navigation/core';
import { AppRoute } from '../../../navigation/app.routes';
import { MatchItemOptionalFBID } from './catch.modal.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.3;
const CARD_WIDTH = CARD_HEIGHT * 0.7;

interface CatchModalProps {
  visible: boolean;
  matchItem?: MatchItemOptionalFBID;
  closeModal: () => void;
}

const CatchModal: React.FC<CatchModalProps> = (props) => {
  const { l10n } = useContext(LocalizationContext);
  const {
    state: { profile },
  } = useContext(ProfileContext);
  const navigation = useNavigation();
  const { visible, matchItem, closeModal } = props;

  const navigateToChat = () => {
    closeModal();
    navigation.navigate(AppRoute.CHAT, { matchItem });
  };

  return (
    <Modal
      style={styles.modal}
      visible={visible}
      animationType="fade"
      overlayBackgroundColor="rgba(0, 0, 0, 0.8)"
      transparent>
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../../../assets/animations/catch_preblurred.json')}
          style={styles.backgroundAnimation}
          autoPlay
          loop
        />
      </View>
      <View style={styles.content}>
        <Headline type="h1" style={styles.title}>
          {l10n.swipeDeck.catchModal.title}
        </Headline>
        <View style={styles.pictures}>
          <View style={[styles.imageWithShadow, styles.imageFirst]}>
            <Image
              style={styles.image}
              source={{ uri: profile?.pictures[0]?.thumbnailUrl }}
            />
          </View>
          <View style={[styles.imageWithShadow, styles.imageSecond]}>
            <Image
              style={styles.image}
              source={{ uri: matchItem?.thumbnailUrl }}
            />
          </View>
        </View>
        <View style={styles.innerContent}>
          <InfoText style={styles.description}>
            {l10n.formatString(
              l10n.swipeDeck.catchModal.description,
              matchItem?.name || 'User',
            )}
          </InfoText>
          <View style={styles.buttonsContainer}>
            <CustomButton
              type="outline"
              color="white"
              style={styles.button}
              onPress={navigateToChat}>
              {l10n.swipeDeck.catchModal.buttons.sendMessage}
            </CustomButton>
            <CustomButton
              type="outline"
              color="white"
              style={styles.button}
              onPress={closeModal}>
              {l10n.swipeDeck.catchModal.buttons.keepSwiping}
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    height: '100%',
    position: 'absolute',
    transform: [{ scale: 1.5 }],
    width: '100%',
    zIndex: 1,
  },
  backgroundAnimation: {
    flex: 1,
  },
  button: {
    padding: 8,
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    zIndex: 3,
  },
  description: {
    color: 'white',
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
  },
  image: {
    borderRadius: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
  },
  imageFirst: {
    transform: [{ rotate: '-8.4deg' }],
  },
  imageSecond: {
    transform: [{ rotate: '15deg' }],
  },
  imageWithShadow: {
    borderRadius: 10,
    elevation: 5,
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    width: CARD_WIDTH,
  },
  innerContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
    width: '70%',
  },
  modal: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_HEIGHT,
  },
  pictures: {
    flexDirection: 'row',
    height: CARD_HEIGHT,
    justifyContent: 'center',
    top: -20,
    width: CARD_WIDTH * 2,
    zIndex: 1,
  },
  title: {
    color: 'white',
    fontFamily: appFont.black,
    fontSize: 48,
    lineHeight: 54,
    paddingTop: SCREEN_HEIGHT >= 667 ? '20%' : '12%',
    textAlign: 'center',
    zIndex: 2,
  },
});

export default CatchModal;
