import React from 'react';
import { Assets, ScrollBar, TouchableOpacity, View } from 'react-native-ui-lib';
import { MatchListItem } from '../match-list/match.list.item.component';
import { StyleSheet } from 'react-native';
import { PassionAlertCandidate } from '@match-app/shared/src';
import { NoMatches } from '../match-list/no.matches.component';

interface PassionAlertMatchListProps {
  matches: PassionAlertCandidate[];
  handleOnPress: (item: PassionAlertCandidate) => void;
}

const PassionAlertMatchList = (props: PassionAlertMatchListProps) => {
  const { matches, handleOnPress } = props;

  const renderItem = ({ item }: { item: PassionAlertCandidate }) => {
    const itemImageSource = item.thumbnailUrl
      ? { uri: item.thumbnailUrl }
      : Assets.images.defaultProfile;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          handleOnPress(item);
        }}>
        <MatchListItem
          photo={itemImageSource}
          name={item.name}
          focused={false}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {matches && matches.length > 0 ? (
        <ScrollBar
          useList={true}
          horizontal={true}
          data={matches}
          renderItem={renderItem}
          keyExtractor={(item: PassionAlertCandidate) => item.firebaseUserId}
        />
      ) : (
        <NoMatches />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default PassionAlertMatchList;
