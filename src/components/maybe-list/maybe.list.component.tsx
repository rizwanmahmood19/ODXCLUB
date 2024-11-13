import React, { useContext } from 'react';
import { Toast, View } from 'react-native-ui-lib';

import { useMaybeListSelector } from './maybe.list.selector';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { LocalizationContext } from '../../services/LocalizationContext';
import ProfileDetailsContainer from '../profile-details/profile.details.container.component';
import { useNavigation } from '@react-navigation/core';
import {
  ContextMenuOptions,
  IPublicProfile,
  MAX_MAYBE,
} from '@match-app/shared';
import { AppRoute } from '../../navigation/app.routes';
import MaybeListEntry from './maybe.list.entry.component';

const MaybeList = () => {
  const {
    maybeList,
    selectedEntry,
    loading,
    decisionError,
    decisionLoading,
    onDecision,
    openModal,
    closeModal,
  } = useMaybeListSelector();
  const { l10n } = useContext(LocalizationContext);
  const navigation = useNavigation();

  const errorToast = (
    <Toast
      visible={!!decisionError}
      position="top"
      message={
        decisionError?.response?.data.message || l10n.swipeDeck.errors.swiping
      }
      backgroundColor="#f3091aff"
    />
  );

  if (loading && (!maybeList || maybeList.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={appColors.primary} />
      </View>
    );
  }

  const onSecretMessagePress = selectedEntry
    ? () => {
        navigation.navigate(AppRoute.SECRET_MESSAGE, {
          profile: selectedEntry.profile,
          channelId: selectedEntry.secretMessageChannelId,
        });
      }
    : undefined;

  return (
    <>
      <ProfileDetailsContainer
        onDismiss={closeModal}
        animationType="fade"
        profile={selectedEntry?.profile}
        isLoading={loading}
        isMaybe={1}
        contextMenuOptions={[ContextMenuOptions.REPORT]}
        onDecision={
          selectedEntry
            ? onDecision(selectedEntry?.profile as IPublicProfile)
            : undefined
        }
        isMaybeButtonForceDisabled
        onSecretMessageButton={onSecretMessagePress}
        hasReceivedSecretMessage={
          !!selectedEntry && !!selectedEntry.secretMessageChannelId
        }
        modal={{ isVisible: selectedEntry !== undefined }}
      />
      <View style={styles.container}>
        {errorToast}
        {[...Array(Math.ceil(MAX_MAYBE / 2))].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {[...Array(2)].map((__, colIndex) => {
              const currentEntry =
                (maybeList && maybeList[rowIndex * 2 + colIndex]) || undefined;

              return (
                <MaybeListEntry
                  key={
                    currentEntry
                      ? currentEntry.profile.id
                      : `${rowIndex}-${colIndex}`
                  }
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  maybeEntry={currentEntry}
                  decisionLoading={decisionLoading}
                  isLoading={loading}
                  onDecision={onDecision}
                  openModal={openModal}
                />
              );
            })}
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 100,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 0,
    padding: 0,
  },
});

export default MaybeList;
