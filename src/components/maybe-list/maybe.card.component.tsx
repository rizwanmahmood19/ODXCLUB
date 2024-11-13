import React from 'react';
import { Assets, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { SwipeDecision, MaybeEntry } from '@match-app/shared';
import { appFont } from '../../style/appFont';
import MaybeCardGradient from './maybe.card.gradient.component';
import { appColors } from '../../style/appColors';
import { appStyles } from '../../style/appStyle';
import MaybeCardActionBar from './maybe.card.action.bar.component';
import SecretMessageIcon from '../../../assets/icons/matchapp_ic_sm_white_bg.svg';

interface MaybeCardProps {
  maybeEntry: MaybeEntry;
  onDecision: (decision: SwipeDecision) => Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
  secretMessageChannelId?: string;
  openModal: (entry: MaybeEntry) => void;
}

const MaybeCard = (props: MaybeCardProps) => {
  const {
    maybeEntry,
    onDecision,
    isDisabled,
    isLoading,
    openModal,
    secretMessageChannelId,
  } = props;
  const openDetailsModal = () => openModal(maybeEntry);
  const { profile } = maybeEntry;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={isLoading || isDisabled ? undefined : openDetailsModal}>
      <ImageBackground
        borderRadius={appStyles.borderRadius}
        style={styles.image}
        source={
          profile.pictures.length > 0
            ? {
                uri: profile.pictures[0].thumbnailUrl,
              }
            : Assets.images.defaultProfile
        }>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={appColors.primary} />
          </View>
        )}
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.name}>
            {profile.name}
          </Text>
          <Text style={styles.age}>{profile.age}</Text>
        </View>
        <MaybeCardActionBar onDecision={onDecision} />
        <MaybeCardGradient isSecretMessage={!!secretMessageChannelId} />
      </ImageBackground>
      {!!secretMessageChannelId && (
        <View style={styles.secretMessageIcon}>
          <SecretMessageIcon width={20} height={20} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  age: {
    alignItems: 'center',
    color: 'white',
    flexBasis: 'auto',
    fontFamily: appFont.semiBold,
    fontSize: 14,
    paddingLeft: 5,
  },
  container: {
    flex: 1,
    height: 250,
  },
  image: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    resizeMode: 'cover',
    width: '100%',
  },
  infoContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  loadingContainer: {
    position: 'absolute',
    top: '42%',
    width: '100%',
  },
  name: {
    alignItems: 'center',
    color: 'white',
    flexShrink: 1,
    fontFamily: appFont.black,
    fontSize: 14,
    paddingTop: 10,
  },
  secretMessageIcon: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 40,
  },
});

export default MaybeCard;
