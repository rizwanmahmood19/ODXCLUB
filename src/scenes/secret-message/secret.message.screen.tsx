import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import BackArrowIcon from '../../../assets/icons/matchapp_back_arrow_white.svg';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import SendSecretMessage from '../../components/secret-message/send-secret-message';
import SecretMessageGradient from '../../components/secret-message/secret.message.gradient.component';
import ReadSecretMessage from '../../components/secret-message/read.secret.message.component';
import { useNavigation } from '@react-navigation/core';
import { StackScreenProps } from '@react-navigation/stack';
import { IBlockedProfile, IPublicProfile } from '@match-app/shared';

const SecretMessageScreen: React.FC<
  StackScreenProps<
    {
      parameters: {
        profile: IPublicProfile | IBlockedProfile;
        channelId: string;
      };
    },
    'parameters'
  >
> = ({
  route: {
    params: { profile, channelId },
  },
}) => {
  const { goBack } = useNavigation();

  useEffect(() => {
    if (!profile) {
      goBack();
    }
  }, [goBack, profile]);
  const picture = Array.isArray(profile?.pictures) && profile.pictures[0];

  return (
    <View flex style={styles.screen}>
      {profile && (
        <View style={styles.container}>
          {picture && (
            <Image
              style={styles.backgroundImage}
              source={{ uri: picture.url }}
            />
          )}
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={goBack}>
            <BackArrowIcon height={20} width={40} />
          </TouchableOpacity>
          {channelId ? (
            <ReadSecretMessage
              profile={profile}
              channelId={channelId}
              handleIgnore={goBack}
            />
          ) : (
            <SendSecretMessage profile={profile} />
          )}
          <SecretMessageGradient styles={styles.gradientOverlay} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    height: 30,
    left: 15,
    position: 'absolute',
    top: 60,
    width: 40,
    zIndex: 5,
  },
  backgroundImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 0,
  },
  container: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 0,
  },
  screen: {
    backgroundColor: 'white',
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
});

export default SecretMessageScreen;
