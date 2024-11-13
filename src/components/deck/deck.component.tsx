import React, { useContext, useRef } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Toast, View } from 'react-native-ui-lib';
import DeckContent from './deck.content.component';

import useDeckSelector from './deck.selector.component';
import { appColors } from '../../style/appColors';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appFont } from '../../style/appFont';
import ProfileDetailsContainer from '../profile-details/profile.details.container.component';
import { ContextMenuOptions } from '@match-app/shared';
import { navigate } from '../../services/navigate';
import { AppRoute } from '../../navigation/app.routes';
import UndoIconColored from '../../../assets/icons/matchapp_ic_undo_colored.svg';
import UndoIconInactive from '../../../assets/icons/matchapp_ic_undo.svg';
import { ProfileContext } from '../../states/profile.state';
import CustomButton from '../custom/styleguide-components/custom.button.component';

const Deck = () => {
  const deckRef = useRef<DeckContent | null>(null);
  const { l10n } = useContext(LocalizationContext);
  const { profile } = useContext(ProfileContext);

  const {
    loadingError,
    loading,
    onRetry,
    currentIndex,
    errorToastMessage,
    onDismissErrorToast,
    publicProposals,
    detailsVisible,
    closeDetailsModal,
    openDetailsModal,
    onActionBarDecision,
    onDeckDecision,
    returnToProposals,
    undoDecision,
    loadingUndoDecision,
    fetchSecretMessage,
    fetchIsMaybe,
    loadingSecretMessage,
    secretMessage,
    isMaybe,
  } = useDeckSelector(deckRef);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }
  if (loadingError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {loadingError.response?.status === 400
            ? l10n.swipeDeck.errors.generation
            : l10n.swipeDeck.errors.loading}
        </Text>
        <CustomButton onPress={onRetry} style={styles.errorButton}>
          {l10n.swipeDeck.retry}
        </CustomButton>
      </View>
    );
  }

  const errorToast = (
    <Toast
      visible={!!errorToastMessage}
      position="top"
      showDismiss
      onDismiss={onDismissErrorToast}
      message={errorToastMessage || l10n.swipeDeck.errors.swiping}
      backgroundColor="#f3091aff"
    />
  );

  if (currentIndex >= publicProposals.length) {
    return (
      <>
        {errorToast}
        <View style={styles.endView}>
          <View style={styles.emptyViewPlaceholder} />
          <View>
            <Text style={styles.noProposalsTitle} center>
              {l10n.swipeDeck.empty.title}
            </Text>
            <Text style={styles.noProposalsDescription} center>
              {l10n.swipeDeck.empty.description}
            </Text>
          </View>
          {profile?.canUndoLastSwipeDecision ? (
            loadingUndoDecision ? (
              <UndoIconInactive
                height={50}
                width={50}
                style={styles.undoIcon}
              />
            ) : (
              <TouchableOpacity onPress={() => undoDecision()}>
                <UndoIconColored
                  height={50}
                  width={50}
                  style={styles.undoIcon}
                />
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.emptyViewPlaceholder} />
          )}
        </View>
      </>
    );
  }

  const currentProposal = publicProposals[currentIndex];
  const onSecretMessageButton =
    currentProposal && !loadingSecretMessage
      ? () => {
          navigate(AppRoute.SECRET_MESSAGE, {
            profile: currentProposal.profile,
            channelId: secretMessage?.secretMessageChannelId,
          });
        }
      : undefined;

  return (
    <>
      {errorToast}
      <ProfileDetailsContainer
        onDismiss={closeDetailsModal}
        onDecision={onActionBarDecision}
        contextMenuOptions={[
          ContextMenuOptions.REPORT,
          ContextMenuOptions.IGNORE,
        ]}
        profile={currentProposal?.profile}
        returnToProposals={returnToProposals}
        // TODO Add react-native-modal to have slide animation only on show
        animationType="fade"
        onSecretMessageButton={onSecretMessageButton}
        hasReceivedSecretMessage={!!secretMessage?.secretMessageChannelId}
        modal={{ isVisible: detailsVisible }}
        isMaybe={isMaybe}
      />
      <DeckContent
        ref={deckRef}
        onDecision={onDeckDecision}
        currentIndex={currentIndex}
        publicProposals={publicProposals}
        onActionBarDecision={onActionBarDecision}
        openDetails={openDetailsModal}
        undoDecision={undoDecision}
        canUndo={!!profile?.canUndoLastSwipeDecision}
        loadingUndoDecision={loadingUndoDecision}
        secretMessageChannelId={secretMessage?.secretMessageChannelId}
        loadingSecretMessage={loadingSecretMessage}
        fetchSecretMessage={fetchSecretMessage}
        fetchIsMaybe={fetchIsMaybe}
        isMaybe={isMaybe}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyViewPlaceholder: {
    height: 100,
  },
  endView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  errorButton: {
    backgroundColor: appColors.primary,
    borderRadius: 4,
    width: '100%',
  },
  errorContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: '8%',
    paddingBottom: 220,
  },
  errorText: {
    fontSize: 20,
    marginBottom: 36,
    textAlign: 'center',
  },
  noProposalsDescription: {
    color: appColors.secondary,
    fontFamily: appFont.regular,
    fontSize: 18,
  },
  noProposalsTitle: {
    color: appColors.secondary,
    fontFamily: appFont.bold,
    fontSize: 24,
    paddingBottom: 8,
  },
  undoIcon: {
    alignSelf: 'center',
    height: 40,
    marginBottom: 60,
    width: 40,
  },
});

export default Deck;
