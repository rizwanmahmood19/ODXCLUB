import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { Platform } from 'react-native';
import {
  ContextMenuOptions,
  MatchItem,
  PublicProposal,
} from '@match-app/shared';

import DeckGallery from '../deck/deck.gallery';
import ReturnIcon from '../../../assets/icons/matchapp_profile_back.svg';

import PreviewIcon from '../../../assets/icons/matchapp_profile_preview.svg';
import SettingsIcon from '../../../assets/icons/matchapp_profile_settings.svg';
import EditIcon from '../../../assets/icons/matchapp_profile_edit.svg';
import StarSVG from '../../../assets/images/reviewIcons/StarSVG.svg';
import MaybeBadge from '../../../assets/icons/tutorial/maybe-icon-small.svg';
import { Dimensions, StyleSheet } from 'react-native';
import ProfileDetailsInfo from './profile.details.info.component';
import { appFont } from '../../style/appFont';
import ContextMenu from '../context-menu/context.menu.component';
import ContextIcon from '../../../assets/icons/matchapp_ic_more_horiz.svg';
import { useAxios } from '../../util/useAxios';
import { appColors } from '../../style/appColors';
import { is_iOS } from '../../util/osCheck';
import SecretMessageOverlay from '../secret-message/secret.message.overlay.component';
import { ProfileNavigation } from '../../scenes/profile/profile.component';

interface ProfileDetailsProps {
  profile: PublicProposal['profile'];
  contextMenuOptions?: Array<ContextMenuOptions>;
  matchId?: MatchItem['matchId'];
  onReturnClick: () => void;
  returnToConversation?: () => void;
  returnToProposals?: () => void;
  onDismiss?: () => void;
  isOnline?: boolean;
  isMaybe?: number;
  isOwnProfile?: boolean;
  onSecretMessagePress?: () => void;
  hasReceivedSecretMessage?: boolean;
  galleryStyle?: Record<string, unknown>;
  navigation?: ProfileNavigation;
}

const RETURN_ICON_SIZE = 36;
const ACTION_ICON_SIZE = 49;
const GALLERY_HEIGHT = Dimensions.get('window').height * 0.5;

const ProfileDetails = (props: ProfileDetailsProps) => {
  const {
    onReturnClick,
    profile,
    contextMenuOptions,
    matchId,
    returnToConversation,
    returnToProposals,
    isOnline,
    isMaybe,
    isOwnProfile,
    onSecretMessagePress,
    hasReceivedSecretMessage,
    galleryStyle,
    navigation,
  } = props;
  const [{ data }] = useAxios({
    url: `is-online/status/${profile.id}`,
    method: 'GET',
    initial: isOnline === undefined, // we only fetch online status if parent component did not already fetch it
  });

  const isOnlineStyle = {
    backgroundColor:
      isOnline === undefined && data === undefined
        ? 'transparent'
        : isOnline || data.isOnline
        ? appColors.primary
        : appColors.secondary,
  };

  return (
    <View>
      {!isOwnProfile && (
        <View style={styles.topRightIcon}>
          <ContextMenu
            options={contextMenuOptions}
            buttonStyle={styles.contextButton}
            matchId={matchId}
            profile={profile}
            username={profile.name}
            returnToConversation={returnToConversation}
            returnToProposals={returnToProposals}>
            <ContextIcon width={30} height={30} />
          </ContextMenu>
        </View>
      )}
      <View style={styles.galleryContainer}>
        <DeckGallery
          allowScroll
          style={galleryStyle}
          images={profile.pictures}
        />
        {hasReceivedSecretMessage && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSecretMessagePress}
            style={styles.secretMessageOverlay}>
            <SecretMessageOverlay profileName={profile.name} />
          </TouchableOpacity>
        )}
      </View>
      {isOwnProfile ? (
        <View style={styles.actionBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionBarButton}
            onPress={navigation?.onProfilePreviewPress}>
            <PreviewIcon width={ACTION_ICON_SIZE} height={ACTION_ICON_SIZE} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionBarButton}
            onPress={() => navigation?.onProfileEditPress()}>
            <EditIcon width={ACTION_ICON_SIZE} height={ACTION_ICON_SIZE} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionBarButton}
            onPress={navigation?.onSettingsPress}>
            <SettingsIcon width={ACTION_ICON_SIZE} height={ACTION_ICON_SIZE} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.returnButton}
          onPress={onReturnClick}>
          <ReturnIcon width={RETURN_ICON_SIZE} height={RETURN_ICON_SIZE} />
        </TouchableOpacity>
      )}

      <View style={styles.dataContainer}>
        <View style={styles.nameContainer}>
          {profile.isReviewed && (
            <TouchableOpacity style={styles.Review}>
              <StarSVG width={28} height={28} />
            </TouchableOpacity>
          )}
          {isMaybe === 1 && (
            <TouchableOpacity style={styles.Review}>
              <MaybeBadge width={28} height={28} />
            </TouchableOpacity>
          )}
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.age}>{profile.age || ''}</Text>
          <View style={[styles.onlineStatus, isOnlineStyle]} />
        </View>
        <Text style={styles.description}>{profile.description}</Text>
        <ProfileDetailsInfo profile={profile} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Review: {
    alignSelf: 'center',
    borderRadius: 15,
    height: 30,
    marginRight: 5,
    width: 30,
  },
  actionBar: {
    flexDirection: 'row',
    height: ACTION_ICON_SIZE,
    justifyContent: 'space-evenly',
    position: 'absolute',
    right: 0,
    top: GALLERY_HEIGHT - ACTION_ICON_SIZE / 2,
    width: (ACTION_ICON_SIZE + 12) * 3,
    zIndex: 10,
  },
  actionBarButton: {
    height: ACTION_ICON_SIZE,
    width: ACTION_ICON_SIZE,
  },
  age: {
    color: appColors.mainTextColor,
    flexBasis: 'auto',
    fontFamily: appFont.medium,
    fontSize: 28,
    lineHeight: is_iOS ? 50 : undefined,
    paddingLeft: 10,
  },
  contextButton: {
    paddingBottom: 20,
    paddingLeft: 20,
  },
  dataContainer: {
    paddingBottom: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    zIndex: 1,
  },
  description: {
    color: appColors.mainTextColor,
    fontFamily: appFont.regular,
    fontSize: 14,
    paddingVertical: 15,
  },
  galleryContainer: {
    height: GALLERY_HEIGHT,
    top: 0,
  },
  name: {
    color: appColors.mainTextColor,
    flexShrink: 1,
    fontFamily: appFont.black,
    fontSize: 28,
    lineHeight: is_iOS ? 50 : undefined,
    marginLeft: 5,
  },
  nameContainer: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    paddingTop: 16,
  },
  onlineStatus: {
    backgroundColor: '#ABCF86',
    borderRadius: 8 / 2,
    height: 8,
    marginLeft: 8,
    width: 8,
  },
  returnButton: {
    borderColor: '#ffffff',
    borderRadius: 100,
    borderWidth: 2,
    height: RETURN_ICON_SIZE + 4,
    position: 'absolute',
    right: 18,
    top: GALLERY_HEIGHT - (RETURN_ICON_SIZE + 4) / 2,
    width: RETURN_ICON_SIZE + 4,
    zIndex: 10,
  },
  secretMessageOverlay: {
    bottom: 30,
    paddingHorizontal: 10,
    position: 'absolute',
    width: '100%',
    zIndex: 4,
  },
  topRightIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 5,
  },
});

export default ProfileDetails;
