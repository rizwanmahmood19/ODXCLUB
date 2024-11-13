import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderHandlers,
  StyleSheet,
} from 'react-native';
import { TouchableOpacity, View } from 'react-native-ui-lib';

import { IBlockedProfile, IPublicProfile } from '@match-app/shared';
import { MaybeStamp, NopeStamp, YeahStamp } from './deck.stamps.component';
import DeckGallery from './deck.gallery';
import {
  ScreenEvent,
  UserInteractionEvent,
} from '../../analytics/analytics.event';
import logEvent from '../../analytics/analytics';

import { appStyles } from '../../style/appStyle';
import DeckContentInfo from './deck.content.info.component';
import SecretMessageOverlay from '../secret-message/secret.message.overlay.component';

interface DeckCardProps {
  profile: IPublicProfile | IBlockedProfile;
  isTopCard: boolean;
  likeOpacity?: Animated.AnimatedInterpolation;
  dislikeOpacity?: Animated.AnimatedInterpolation;
  maybeOpacity?: Animated.Value;
  panHandlers?: GestureResponderHandlers;
  secretMessageChannelId?: string;
  isMaybe?: number;
  style?: Record<string, unknown> | Record<string, unknown>[];
  fetchSecretMessage?: (config?: Record<string, unknown>) => void;
  fetchIsMaybe?: (config?: Record<string, unknown>) => void;
  handleFirstImageLoad?: () => void;
  handleSecretMessageClick?: () => void;
  openDetails?: () => void;
}

export const MAYBE_STAMP_CENTER = (Dimensions.get('window').width - 235) / 2;

const Stamps = (props: DeckCardProps) => {
  const { likeOpacity, dislikeOpacity, maybeOpacity } = props;

  return (
    <>
      <YeahStamp
        style={[
          { opacity: likeOpacity },
          styles.likeStyle,
          styles.decisionOpacity,
        ]}
      />
      <NopeStamp
        style={[
          { opacity: dislikeOpacity },
          styles.dislikeStyle,
          styles.decisionOpacity,
        ]}
      />
      <MaybeStamp
        style={[
          { opacity: maybeOpacity },
          styles.decisionOpacity,
          styles.maybeStyle,
        ]}
      />
    </>
  );
};

const DeckCard = (props: DeckCardProps) => {
  const {
    isTopCard,
    panHandlers,
    profile,
    style,
    secretMessageChannelId,
    fetchSecretMessage,
    fetchIsMaybe,
    handleFirstImageLoad,
    handleSecretMessageClick,
    openDetails,
    isMaybe,
  } = props;

  const pictures = Array.isArray(profile.pictures) ? profile.pictures : [];

  useEffect(() => {
    if (isTopCard && fetchSecretMessage) {
      fetchSecretMessage({
        url: `/matching/secret-message/${profile.id}`,
      });
    }

    if (fetchIsMaybe) {
      fetchIsMaybe({
        url: `/matching/counter_result/${profile.id}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTopCard]);

  return (
    <Animated.View style={style} {...panHandlers}>
      {isTopCard && <Stamps {...props} />}
      {isTopCard && !!secretMessageChannelId && (
        <TouchableOpacity
          onPress={handleSecretMessageClick}
          activeOpacity={0.8}
          style={styles.secretMessageOverlayContainer}>
          <SecretMessageOverlay profileName={profile.name} />
        </TouchableOpacity>
      )}
      <DeckGallery
        showGradient
        hasSecretMessage={!!secretMessageChannelId}
        images={pictures}
        onFirstImageLoad={handleFirstImageLoad}
      />
      <View style={styles.deckContentInfoContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            logEvent(
              UserInteractionEvent.click +
                '_' +
                ScreenEvent.recommendationDetail,
            );
            openDetails && openDetails();
          }}>
          <DeckContentInfo
            profile={profile}
            showOnlineStatus={isTopCard}
            isMaybe={isMaybe === 1}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  decisionOpacity: {
    position: 'absolute',
    top: 50,
    zIndex: 1000,
  },
  deckContentInfoContainer: {
    bottom: appStyles.bottomMargin + 150,
    paddingHorizontal: 5,
    position: 'absolute',
    width: '100%',
  },
  dislikeStyle: {
    right: 40,
    transform: [{ rotate: '20deg' }],
  },
  likeStyle: {
    left: 40,
    transform: [{ rotate: '-20deg' }],
  },
  maybeStyle: {
    left: MAYBE_STAMP_CENTER,
    position: 'absolute',
  },
  secretMessageOverlayContainer: {
    marginHorizontal: '3%',
    position: 'absolute',
    top: 30,
    width: '94%',
    zIndex: 1000,
  },
});

export default DeckCard;
