import React, { useContext } from 'react';
import {
  ContextMenuOptions,
  MatchItem,
  PublicProposal,
  SwipeDecision,
} from '@match-app/shared';
import { LocalizationContext } from '../../services/LocalizationContext';
import { Button, Text, View } from 'react-native-ui-lib';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ProfileDetails from './profile.details.component';
import DeckActionBar, {
  ACTION_BAR_HEIGHT,
} from '../deck/deck.action.bar.component';
import SecretMessageButton from '../secret-message/secret.message.button.component';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import { ProfileNavigation } from '../../scenes/profile/profile.component';
import { appStyles } from '../../style/appStyle';

interface ProfileDetailsContainerContentProps {
  profile?: PublicProposal['profile'];
  onDismiss: () => void;
  contextMenuOptions?: Array<ContextMenuOptions>;
  matchId?: MatchItem['matchId'];
  onDecision?: (decision: SwipeDecision) => void;
  returnToConversation?: () => void;
  returnToProposals?: () => void;
  isOnline?: boolean;
  isMaybe?: number;
  isOwnProfile?: boolean;
  hasReceivedSecretMessage?: boolean;
  isSMButtonDisabled?: boolean;
  onSecretMessagePress: () => void;
  isSecretMessageAvailable?: boolean;
  onActionBarDecision: (decision: SwipeDecision) => void;
  galleryStyle?: Record<string, unknown>;
  navigation?: ProfileNavigation;
  isMaybeButtonForceDisabled?: boolean;
}

const ProfileDetailsModalContent = (
  props: ProfileDetailsContainerContentProps,
) => {
  const {
    profile,
    onDismiss,
    contextMenuOptions,
    matchId,
    isSMButtonDisabled,
    onDecision,
    returnToConversation,
    returnToProposals,
    isOwnProfile,
    onSecretMessagePress,
    isOnline,
    isMaybe,
    hasReceivedSecretMessage,
    onActionBarDecision,
    isSecretMessageAvailable,
    galleryStyle,
    navigation,
    isMaybeButtonForceDisabled,
  } = props;
  const { l10n } = useContext(LocalizationContext);

  return !profile ? (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{l10n.chat.profile.error.title}</Text>
      <Button
        style={styles.errorButton}
        labelStyle={styles.errorButtonLabel}
        label={l10n.chat.profile.error.cancel}
        onPress={() => onDismiss()}
      />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ProfileDetails
          onReturnClick={onDismiss}
          profile={profile}
          isOnline={isOnline}
          isMaybe={isMaybe}
          contextMenuOptions={contextMenuOptions}
          matchId={matchId}
          returnToConversation={returnToConversation}
          returnToProposals={returnToProposals}
          isOwnProfile={isOwnProfile}
          onSecretMessagePress={onSecretMessagePress}
          hasReceivedSecretMessage={hasReceivedSecretMessage}
          galleryStyle={galleryStyle}
          navigation={navigation}
        />
        <View style={styles.actionBarSpace} />
      </ScrollView>
      {onDecision && (
        <View style={styles.actionBarContainer}>
          <View style={styles.sideButton} />
          <DeckActionBar
            onDecision={onActionBarDecision}
            whiteIcons={false}
            isMaybeButtonForceDisabled={isMaybeButtonForceDisabled}
          />
          <View style={styles.sideButton}>
            {isSecretMessageAvailable && (
              <View style={styles.buttonBackdrop}>
                <SecretMessageButton
                  onPress={onSecretMessagePress}
                  colorful
                  size={50}
                  isDisabled={isSMButtonDisabled}
                  isMessageReceived={hasReceivedSecretMessage}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionBarContainer: {
    bottom: appStyles.bottomMargin,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  actionBarSpace: {
    height: ACTION_BAR_HEIGHT + 10,
    width: '100%',
  },
  buttonBackdrop: {
    backgroundColor: '#ccc',
    borderRadius: 24,
  },
  container: {
    flex: 1,
  },
  errorButton: {
    backgroundColor: appColors.primary,
    borderRadius: 4,
  },
  errorButtonLabel: {
    fontFamily: appFont.regular,
    fontSize: 19,
    fontWeight: 'normal',
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    width: '70%',
  },
  sideButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default ProfileDetailsModalContent;
