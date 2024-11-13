import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Assets, View } from 'react-native-ui-lib';
import { ProfileImageCircle } from '../profile/profile.image.circle.component';
import InfoText from '../custom/styleguide-components/info.text.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import Headline from '../custom/styleguide-components/headline.component';
import { appFont } from '../../style/appFont';
import { appColors } from '../../style/appColors';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

const IMAGE_SIZE = 180;
const BORDER_SIZE = 25;

interface ChatEmptyIndicatorProps {
  thumbnailUrl?: string;
  name?: string;
  matchId?: string;
  createdAt?: Date;
}

export const ChatEmptyIndicator: React.FC<ChatEmptyIndicatorProps> = ({
  thumbnailUrl,
  name,
  matchId,
  createdAt,
}) => {
  const { l10n } = useContext(LocalizationContext);

  const getPhotoThumbnail = () => {
    if (thumbnailUrl) return { uri: thumbnailUrl };
    return matchId ? Assets.images.defaultProfile : 'show-logo';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topSpace} />
      <View style={styles.content}>
        {name && (
          <Headline type="h3" style={styles.mainText}>
            {l10n.formatString(l10n.chat.emptyChat.mainText, name)}
          </Headline>
        )}
        <InfoText style={styles.date}>{moment(createdAt).fromNow()}</InfoText>
        <View style={styles.profileImageContainer}>
          <ProfileImageCircle
            photo={getPhotoThumbnail()}
            size={IMAGE_SIZE}
            borderSize={BORDER_SIZE}
            focused
          />
        </View>
        {name && (
          <InfoText style={styles.subtext}>
            {l10n.formatString(l10n.chat.emptyChat.subtext, name)}
          </InfoText>
        )}
      </View>
      <View style={styles.bottomSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottomSpace: { flexGrow: 1.8, minHeight: 10 },
  container: {
    alignSelf: 'center',
    flexGrow: 1,
    width: '85%',
  },
  content: {
    alignItems: 'center',
  },
  date: {
    color: appColors.darkGrey,
    fontFamily: appFont.semiBold,
    fontSize: 13,
    paddingBottom: 30,
  },
  mainText: {
    fontFamily: appFont.black,
    fontSize: 28,
    lineHeight: 38,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtext: {
    fontFamily: appFont.semiBold,
    paddingTop: 35,
    textAlign: 'center',
  },
  topSpace: { flex: 1, minHeight: 10 },
});
