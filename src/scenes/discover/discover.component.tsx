import React, { useContext } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Toast, View } from 'react-native-ui-lib';
import Deck from './../../components/deck/deck.component';
import { useTrackLocation } from '../../services/location-tracking/useTrackLocation';
import { appColors } from '../../style/appColors';
import NoGps from '../../components/deck/noGps.component';
import { useBackButton } from '../../navigation/back-button/useBackButton';
import { ChatContext } from '../../states/chat.state';
import { CatchModalContext } from '../../components/deck/catch-modal/catch.modal.context';
import CatchModal from '../../components/deck/catch-modal/catch.modal.component';

export const DiscoverScreen = () => {
  const {
    error,
    toastError,
    closeErrorToast,
    position,
    permissionState,
    isReady,
    isLoadingPosition,
    onRetry,
  } = useTrackLocation();
  const { client } = useContext(ChatContext);
  const { isCatchModalOpen, matchItem, closeCatchModal } =
    useContext(CatchModalContext);

  useBackButton(() => {
    // ensuring the app is closed and no previous screens (onboarding, authentication screens, etc.) can be reached from here
    client.disconnectUser();
    BackHandler.exitApp();
    return true;
  });

  if (permissionState === undefined || !isReady) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <>
        <Toast
          visible={!!toastError}
          position="top"
          showDismiss
          onDismiss={closeErrorToast}
          message={toastError?.message}
          backgroundColor="#f3091aff"
        />
        {position && !error ? (
          <>
            <CatchModal
              matchItem={matchItem}
              visible={isCatchModalOpen}
              closeModal={closeCatchModal}
            />
            <Deck />
          </>
        ) : (
          <NoGps isLoadingPosition={isLoadingPosition} onRetry={onRetry} />
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
    maxWidth: Math.min(
      Dimensions.get('screen').height,
      Dimensions.get('screen').width,
    ),
  },
});
