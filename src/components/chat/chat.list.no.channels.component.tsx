import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

import { LocalizationContext } from '../../services/LocalizationContext';
import ProfileCircleDefault from '../custom/profile.circle.default.component';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';

const NO_FITS_ICON_SIZE = 30;
const NO_FITS_SIZE = 60;

const ChatListNoChannels = () => {
  const { l10n } = useContext(LocalizationContext);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <ProfileCircleDefault
          size={NO_FITS_SIZE}
          iconSize={NO_FITS_ICON_SIZE}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{l10n.chat.emptyList.title}</Text>
        <Text style={styles.text}>{l10n.chat.emptyList.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    width: NO_FITS_SIZE,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 27,
    textAlign: 'center',
  },
  text: {
    color: appColors.darkGrey,
    fontFamily: appFont.regular,
    fontSize: 13,
    paddingTop: 4,
  },
  title: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    fontSize: 15,
  },
});

export default ChatListNoChannels;
