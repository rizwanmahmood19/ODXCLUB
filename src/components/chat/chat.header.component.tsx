import React from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { ProfileImageCircle } from '../profile/profile.image.circle.component';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import ContextMenu from '../context-menu/context.menu.component';
import ProfileDetailsContainer from '../profile-details/profile.details.container.component';
import { useChatHeaderSelector } from './chat.header.selector';
import ArrowBackIcon from '../../../assets/icons/matchapp_back_arrow.svg';
import { CustomHeader } from '../custom/custom.header.component';
import { Separator } from '../custom/styleguide-components/Separator';
import VideoIcon from '../../../assets/icons/matchapp_ic_video-chat-pink.svg';

export interface ChatHeaderProps {
  matchId?: string;
  otherMemberFirebaseId?: string;
  thumbnailUrl?: string;
  name?: string;
  onCloseChat: () => void;
  openVideoModal?: () => void;
}

export const ChatHeader = (props: ChatHeaderProps) => {
  const {
    openVideoModal,
    name,
    matchId,
    otherMemberFirebaseId,
    thumbnailUrl,
    onCloseChat,
  } = props;
  const {
    loading,
    profile,
    detailsVisible,
    openDetailsModal,
    closeDetailsModal,
    returnToConversation,
  } = useChatHeaderSelector(matchId, otherMemberFirebaseId);

  return (
    <>
      {matchId && (
        <ProfileDetailsContainer
          onDismiss={closeDetailsModal}
          animationType="fade"
          matchId={matchId}
          profile={profile}
          isLoading={loading}
          returnToConversation={returnToConversation}
          modal={{ isVisible: detailsVisible }}
        />
      )}
      <CustomHeader
        left={
          <TouchableOpacity onPress={onCloseChat}>
            <ArrowBackIcon width={36} height={16} />
          </TouchableOpacity>
        }
        right={
          matchId &&
          otherMemberFirebaseId &&
          name && (
            <View style={styles.rightContainer}>
              <TouchableOpacity
                onPress={openVideoModal}
                style={styles.videoCallButton}>
                <VideoIcon />
              </TouchableOpacity>
              <ContextMenu
                matchId={matchId}
                profile={profile}
                username={name}
              />
            </View>
          )
        }>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={openDetailsModal}>
          <ProfileImageCircle
            photo={
              thumbnailUrl
                ? {
                    uri: thumbnailUrl,
                  }
                : matchId
                ? Assets.images.defaultProfile
                : 'show-logo'
            }
            size={38}
            borderSize={1}
          />
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
        </TouchableOpacity>
      </CustomHeader>
      <Separator />
    </>
  );
};

const styles = StyleSheet.create({
  name: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    fontSize: 12,
    lineHeight: 12,
    paddingBottom: 2,
    paddingTop: 6,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    paddingBottom: 6,
    paddingTop: 12,
  },
  rightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  videoCallButton: {
    paddingRight: 13,
  },
});
