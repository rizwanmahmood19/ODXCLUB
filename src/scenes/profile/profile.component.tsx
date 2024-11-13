import { noop } from '../../util/noop';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import ProfileDetailsContainer from '../../components/profile-details/profile.details.container.component';
import { useProfilePreviewSelector } from '../../components/profile-preview/profile.preview.selector';

export interface ProfileNavigation {
  onSettingsPress: () => void;
  onProfilePreviewPress: () => void;
  onProfileEditPress: () => void;
}

export interface ProfileScreenProps {
  navigation: ProfileNavigation;
}

export const ProfileScreen = (props: ProfileScreenProps) => {
  const { navigation } = props;
  const { profile } = useProfilePreviewSelector();

  return (
    <View style={styles.screen}>
      <ProfileDetailsContainer
        onDismiss={noop}
        profile={profile}
        animationType="fade"
        isOwnProfile
        isOnline
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
});
