import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import SubscriptionGallery from '../../components/subscription/subscription.gallery.component';
import logEvent from '../../analytics/analytics';
import { ScreenEvent } from '../../analytics/analytics.event';
import { useBackButton } from '../../navigation/back-button/useBackButton';
import { useNavigation } from '@react-navigation/native';
import { AppRoute } from '../../navigation/app.routes';

export const SubscriptionScreen: React.FC = () => {
  const { navigate } = useNavigation();
  useBackButton(() => {
    navigate(AppRoute.PROFILE_SETTINGS);
    return true;
  });
  useEffect(() => {
    logEvent(ScreenEvent.paywall);
  }, []);
  return (
    <View style={styles.screen}>
      <SubscriptionGallery />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
});
