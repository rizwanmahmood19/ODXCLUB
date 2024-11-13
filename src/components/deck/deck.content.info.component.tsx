/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, View } from 'react-native-ui-lib'; // FIXME: MATCH-229 https://github.com/react-native-community/react-native-svg not showing drop shadows
// maybe we can use png instead of svg
import PlaceIcon from '../../../assets/icons/matchapp_ic_place.svg';
import StarBadge from '../../../assets/images/reviewIcons/StarBadge.svg';
import MaybeBadge from '../../../assets/icons/MaybeBadge.svg';
import { appFont } from '../../style/appFont';
import { IBlockedProfile, IPublicProfile } from '@match-app/shared';
import { appColors } from '../../style/appColors';
import { useAxios } from '../../util/useAxios';
import { is_android, is_iOS } from '../../util/osCheck';

interface DeckContentInfoProps {
  profile: IPublicProfile | IBlockedProfile;
  showOnlineStatus: boolean;
  isOwnProfile?: boolean;
  isMaybe?: boolean;
}

const DeckContentInfo = (props: DeckContentInfoProps) => {
  const { showOnlineStatus, profile, isOwnProfile, isMaybe } = props;

  const [{ data }] = useAxios({
    url: `is-online/status/${profile.id}`,
    method: 'GET',
    initial: showOnlineStatus && !isOwnProfile,
  });

  const isOnlineStyle = {
    backgroundColor:
      data === undefined && !isOwnProfile
        ? 'transparent'
        : isOwnProfile || data.isOnline
        ? appColors.green
        : appColors.red,
  };

  return (
    <View style={styles.container}>
      {(profile as IPublicProfile).distance && (
        <View style={styles.distanceContainer}>
          <PlaceIcon style={styles.placeIcon} width={40} height={40} />
          <Text style={styles.distanceText}>
            {(profile as IPublicProfile).distance}
          </Text>
        </View>
      )}
      <View style={styles.nameContainer}>
        {profile.isReviewed && (
          <TouchableOpacity style={styles.Review}>
            <StarBadge width={28} height={28} />
          </TouchableOpacity>
        )}
        {isMaybe && (
          <TouchableOpacity style={styles.Review}>
            <MaybeBadge width={28} height={28} />
          </TouchableOpacity>
        )}
        <Text numberOfLines={2} style={styles.nameText}>
          {profile.name}
        </Text>
        {(profile as IPublicProfile).age && (
          <View style={styles.detailsContainer}>
            <Text style={styles.ageText}>
              {(profile as IPublicProfile).age}
            </Text>
            <View style={[styles.online, isOnlineStyle]} />
          </View>
        )}
      </View>
      <View style={styles.descriptionContainer}>
        <Text
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={styles.descriptionText}>
          {profile.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Review: {
    borderRadius: 15,
    height: 30,
    marginRight: 5,
    right: 10,
    top: Platform.OS === 'android' ? 1 : -1,
    width: 30,
  },
  ageText: {
    alignSelf: 'flex-end',
    color: 'white',
    fontFamily: is_android ? appFont.light : appFont.regular,
    fontSize: 32,
    lineHeight: is_iOS ? 60 : undefined,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  descriptionContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  descriptionText: {
    color: 'white',
    fontFamily: appFont.medium,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 10,
    paddingTop: 5,
    textAlign: 'center',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  distanceContainer: {
    alignItems: 'center',
    flex: 1,
  },
  distanceText: {
    color: 'white',
    fontFamily: appFont.medium,
    fontSize: 14,
    paddingTop: 5,
    textAlign: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 6,
  },
  nameText: {
    alignSelf: 'flex-end',
    color: 'white',
    flexShrink: 1,
    fontFamily: appFont.black,
    fontSize: 32,
    letterSpacing: -0.5,
    lineHeight: is_iOS ? 60 : undefined,
    paddingRight: 9,
    textAlign: 'center',
  },
  online: {
    borderRadius: 8 / 2,
    height: 9,
    marginTop: 3,
    width: 9,
  },
  placeIcon: {
    opacity: 0.5,
  },
});

export default DeckContentInfo;
