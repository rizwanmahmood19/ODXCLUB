import React, { useContext } from 'react';
import { IPublicProfile } from '@match-app/shared';
import { Text, View } from 'react-native-ui-lib';
import { Platform, StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import { LocalizationContext } from '../../services/LocalizationContext';

interface ProfileDetailsInfoProps {
  profile: IPublicProfile;
}

const ProfileDetailsInfo = (props: ProfileDetailsInfoProps) => {
  const { profile } = props;
  const { l10n } = useContext(LocalizationContext);

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.attributeName}>
          {l10n.profile.details.info.distance.toUpperCase()}
        </Text>
        <Text style={styles.attributeValue}>{profile.distance}</Text>
      </View>
      {profile.gender ? (
        <View style={styles.borderRow}>
          <Text style={styles.attributeName}>
            {l10n.profile.details.info.gender.toUpperCase()}
          </Text>
          <Text style={styles.attributeValue}>
            {l10n.profile.edit.form.gender.options[profile.gender]}
          </Text>
        </View>
      ) : null}
      {profile.relationshipStatus ? (
        <View style={styles.borderRow}>
          <Text style={styles.attributeName}>
            {l10n.profile.details.info.relationshipStatus.toUpperCase()}
          </Text>
          <Text style={styles.attributeValue}>
            {
              l10n.profile.edit.form.relationshipStatus.options[
                profile.relationshipStatus
              ]
            }
          </Text>
        </View>
      ) : null}
      {profile.height ? (
        <View style={styles.borderRow}>
          <Text style={styles.attributeName}>
            {l10n.profile.details.info.height.toUpperCase()}
          </Text>
          <Text style={styles.attributeValue}>{profile.height} cm</Text>
        </View>
      ) : null}
      {profile.place ? (
        <View style={styles.borderRow}>
          <Text style={styles.attributeName}>
            {l10n.profile.details.info.place.toUpperCase()}
          </Text>
          <Text style={styles.attributeValue}>{profile.place}</Text>
        </View>
      ) : null}
      {Array.isArray(profile.preferredPlaces) &&
      profile.preferredPlaces.length ? (
        <View style={styles.borderRow}>
          <Text style={styles.attributeName}>
            {l10n.profile.details.info.preferredPlaces.toUpperCase()}
          </Text>
          <View style={styles.multipleAttrContainer}>
            {profile.preferredPlaces.map((place) => (
              <Text key={`details-attr-${place}`} style={styles.attributeValue}>
                {l10n.profile.edit.form.preferredPlaces.options[place]}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  attributeName: {
    color: appColors.mainTextColor,
    flex: 0.7,
    fontFamily: appFont.semiBold,
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 18,
  },
  attributeValue: {
    color: appColors.mainTextColor,
    flex: 1,
    fontFamily: appFont.medium,
    fontSize: 12,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
  },
  borderRow: {
    alignItems: 'center',
    borderTopColor: appColors.mediumGrey,
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
  },
  multipleAttrContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
  },
});

export default ProfileDetailsInfo;
