import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Image, Text, View } from 'react-native-ui-lib';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appFont } from '../../style/appFont';
import CustomButton from '../../components/custom/styleguide-components/custom.button.component';
import TextWithLinks from '../../components/custom/styleguide-components/text.with.links.component';
import links from '../../services/links';
import { TrackingContext } from '../../analytics/tracking.context';
import { appStyles } from '../../style/appStyle';

export const InitialTOSScreen = () => {
  const { l10n } = useContext(LocalizationContext);
  const { acceptInitialTOS, isLoadingAcceptInitialTOS } =
    useContext(TrackingContext);
  return (
    <View style={styles.wrapper}>
      <View useSafeArea={true} style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View>
              <Image
                style={styles.logo}
                source={Assets.images.extendedLogo}
                resizeMode="contain"
              />
              <Text style={styles.text}>{l10n.welcomeScreen.title}</Text>
            </View>
            <CustomButton
              style={styles.button}
              type="outline"
              color="white"
              isLoading={isLoadingAcceptInitialTOS}
              onPress={acceptInitialTOS}>
              {l10n.welcomeScreen.button}
            </CustomButton>
          </View>
          <View style={styles.bottom}>
            <TextWithLinks
              style={styles.linkTextContainer}
              textStyle={styles.linkText}
              descriptionText={l10n.welcomeScreen.linkText}
              links={[
                {
                  url: links.termsURL,
                  text: l10n.welcomeScreen.termsString,
                },
                {
                  url: links.privacyURL,
                  text: l10n.welcomeScreen.privacyString,
                },
              ]}
            />
          </View>
        </View>
      </View>
      <Image
        source={Assets.images.welcomeBackground}
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
  bottom: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: appStyles.bottomMargin,
  },
  button: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 200,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: '7.5%',
    width: '100%',
  },
  linkText: {
    color: 'white',
    fontFamily: appFont.light,
    paddingHorizontal: '3%',
    textAlign: 'center',
  },
  linkTextContainer: {
    paddingHorizontal: 9,
  },
  logo: {
    maxHeight: 170,
    maxWidth: '100%',
  },
  screen: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 200,
  },
  text: {
    color: 'white',
    fontFamily: appFont.bold,
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 60,
    maxWidth: '100%',
    textAlign: 'center',
  },
  wrapper: {
    flex: 1,
  },
});
