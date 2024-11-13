import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Image, Text, View } from 'react-native-ui-lib';
import TrackingLockIcon from '../../../assets/icons/tracking-lock.svg';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appFont } from '../../style/appFont';
import { TrackingContext } from '../../analytics/tracking.context';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';

export const TrackingDecisionScreen = () => {
  const { l10n } = useContext(LocalizationContext);
  const { requestTracking } = useContext(TrackingContext);

  return (
    <View style={styles.wrapper}>
      <View useSafeArea={true} style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.content}>
            <TrackingLockIcon style={styles.logo} />
            <Text style={styles.title}>{l10n.trackingScreen.title}</Text>
            <Text style={styles.text}>{l10n.trackingScreen.text}</Text>
          </View>
          <View style={styles.buttonRow}>
            <CustomButton
              type="outline"
              color="white"
              style={styles.button}
              onPress={requestTracking}>
              {l10n.trackingScreen.continue}
            </CustomButton>
          </View>
        </View>
      </View>
      <Image
        source={Assets.images.allowTrackingBackground}
        style={styles.backgroundImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  button: {
    paddingHorizontal: 0,
    width: 180,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 94,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    height: 178,
  },
  screen: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 200,
  },
  text: {
    color: 'white',
    fontFamily: appFont.regular,
    fontSize: 17,
    marginTop: 60,
    maxWidth: 305,
    textAlign: 'center',
    width: '85%',
  },
  title: {
    color: 'white',
    fontFamily: appFont.bold,
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 60,
    maxWidth: 305,
    textAlign: 'center',
    width: '85%',
  },
  wrapper: {
    flex: 1,
  },
});
