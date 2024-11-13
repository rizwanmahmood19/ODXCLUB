import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Linking, StyleSheet } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import links from '../../services/links';
import { useSignOut } from '../auth/useSignOut';
import { currentUser } from '../../services/authentication';
import { BlockedUserContext } from '../../states/blocked.user.state';

export const BlockedUserScreen = () => {
  const { l10n } = useContext(LocalizationContext);
  const { dispatch } = useContext(BlockedUserContext);
  const { signOut, isSigningOut } = useSignOut();

  const handleButtonClick = () =>
    dispatch({ type: 'setBlockedUser', isUserBlocked: false });

  useEffect(() => {
    if (currentUser()) {
      signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View useSafeArea={true} style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.content}>
          <LogoIcon
            width={styles.logo.width}
            height={styles.logo.height}
            style={styles.logo}
          />
          <Text style={styles.titleText}>{l10n.blockedUser.title}</Text>
          <Text style={styles.text}>{l10n.blockedUser.text}</Text>
          <Button
            onPress={() => Linking.openURL(`mailto:${links.supportMail}`)}
            style={styles.support}
            link
            linkColor={appColors.primary}
            label={links.supportMail}
          />
        </View>
        <View>
          {isSigningOut ? (
            <ActivityIndicator color={appColors.primary} size="small" />
          ) : (
            <Button
              link
              linkColor={appColors.primary}
              labelStyle={styles.buttonLabel}
              label={l10n.blockedUser.leaveButton}
              onPress={handleButtonClick}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonLabel: {
    fontFamily: appFont.bold,
  },
  container: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 50,
  },
  logo: {
    height: 107,
    marginBottom: 47,
    width: 107,
  },
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  support: {
    marginBottom: 70,
    marginTop: 30,
  },
  text: {
    fontFamily: appFont.regular,
    fontSize: 15,
    fontWeight: 'normal',
    marginTop: 30,
    textAlign: 'center',
    width: '75%',
  },
  titleText: {
    color: appColors.primary,
    fontFamily: appFont.bold,
    fontSize: 21,
    fontWeight: 'bold',
  },
});
