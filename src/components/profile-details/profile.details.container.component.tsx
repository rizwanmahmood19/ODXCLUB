import React from 'react';
import { Modal, View } from 'react-native-ui-lib';
import {
  ContextMenuOptions,
  MatchItem,
  PublicProposal,
  SwipeDecision,
} from '@match-app/shared';
import { ActivityIndicator, StyleSheet } from 'react-native';
import GlobalNotifications from '../notifications/global.notifications';
import ProfileDetailsContainerContent from './profile.detals.container.content.component';
import { ProfileNavigation } from '../../scenes/profile/profile.component';

interface ProfileDetailsContainerProps {
  onDismiss: () => void;
  contextMenuOptions?: Array<ContextMenuOptions>;
  animationType?: 'none' | 'slide' | 'fade';
  profile?: PublicProposal['profile'];
  matchId?: MatchItem['matchId'];
  isLoading?: boolean;
  onDecision?: (decision: SwipeDecision) => void;
  returnToConversation?: () => void;
  returnToProposals?: () => void;
  isOnline?: boolean;
  isMaybe?: number;
  isOwnProfile?: boolean;
  hasReceivedSecretMessage?: boolean;
  onSecretMessageButton?: () => void;
  modal?: { isVisible: boolean };
  navigation?: ProfileNavigation;
  isMaybeButtonForceDisabled?: boolean;
}

const ProfileDetailsContainer = ({
  isOnline,
  isMaybe,
  profile,
  animationType,
  contextMenuOptions,
  matchId,
  isLoading,
  isOwnProfile,
  hasReceivedSecretMessage,
  onDismiss,
  onDecision,
  returnToConversation,
  returnToProposals,
  onSecretMessageButton,
  modal,
  navigation,
  isMaybeButtonForceDisabled,
}: ProfileDetailsContainerProps) => {
  const onActionBarDecision = (decision: SwipeDecision) => {
    onDismiss();
    if (onDecision) {
      onDecision(decision);
    }
  };

  const onSecretMessagePress = () => {
    onDismiss();
    if (onSecretMessageButton) onSecretMessageButton();
  };

  const addCornerRadiusStyleForGallery =
    modal && modal.isVisible
      ? undefined
      : {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
        };

  const Content = () => {
    return (
      <>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ProfileDetailsContainerContent
            onActionBarDecision={onActionBarDecision}
            onDismiss={onDismiss}
            onSecretMessagePress={onSecretMessagePress}
            profile={profile}
            contextMenuOptions={contextMenuOptions}
            hasReceivedSecretMessage={hasReceivedSecretMessage}
            isSMButtonDisabled={isLoading}
            isOnline={isOnline}
            isMaybe={isMaybe}
            isOwnProfile={isOwnProfile}
            isSecretMessageAvailable={!!onSecretMessageButton}
            matchId={matchId}
            onDecision={onDecision}
            isMaybeButtonForceDisabled={isMaybeButtonForceDisabled}
            returnToConversation={returnToConversation}
            returnToProposals={returnToProposals}
            galleryStyle={addCornerRadiusStyleForGallery}
            navigation={navigation}
          />
        )}
      </>
    );
  };

  if (modal) {
    return (
      <Modal
        visible={modal.isVisible}
        animationType={animationType || 'none'}
        onRequestClose={onDismiss}>
        <GlobalNotifications />
        <Content />
      </Modal>
    );
  } else {
    return (
      <View style={styles.screen}>
        <Content />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    textAlign: 'center',
  },
  screen: { flex: 1, width: '100%' },
});

export default ProfileDetailsContainer;
