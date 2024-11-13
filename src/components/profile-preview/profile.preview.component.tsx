import React from 'react';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import DeckContentInfo from '../deck/deck.content.info.component';
import DeckGallery from '../deck/deck.gallery';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ContextMenuOptions } from '@match-app/shared';
import ProfileDetailsContainer from '../profile-details/profile.details.container.component';
import { useProfilePreviewSelector } from './profile.preview.selector';
import { appStyles } from '../../style/appStyle';
import { noop } from '../../util/noop';

const ProfilePreview = () => {
  const { profile } = useProfilePreviewSelector();

  return (
    <View style={styles.container}>
      <View style={styles.deckContent}>
        <ProfileDetailsContainer
          onDismiss={noop}
          profile={profile}
          contextMenuOptions={[ContextMenuOptions.REPORT]}
          isOnline
          isOwnProfile
          // TODO Add react-native-modal to have slide animation only on show
          animationType="fade"
          modal={{ isVisible: false }}
        />
        {profile ? (
          <>
            <DeckGallery showGradient images={profile.pictures} />
            {profile.pictures.length !== 0 && (
              <View style={styles.deckContentInfoContainer}>
                <TouchableOpacity activeOpacity={0.8} disabled={true}>
                  <DeckContentInfo
                    profile={profile}
                    showOnlineStatus={true}
                    isOwnProfile
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deckContent: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: appStyles.borderRadius,
    borderTopRightRadius: appStyles.borderRadius,
    flex: 1,
    marginTop: 12,
    overflow: 'hidden',
    padding: 0,
  },
  deckContentInfoContainer: {
    bottom: appStyles.bottomMargin,
    paddingHorizontal: 5,
    position: 'absolute',
    width: '100%',
  },
});

export default ProfilePreview;
