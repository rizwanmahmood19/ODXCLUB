import React, { useCallback, useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Assets, ScrollBar, TouchableOpacity, View } from 'react-native-ui-lib';
import { MatchListItem } from './match.list.item.component';
import { MatchItem } from '@match-app/shared';
import { NoMatches } from './no.matches.component';
import { appColors } from '../../style/appColors';
import { MatchListContext } from '../../states/matchList.state';
import { useFocusEffect } from '@react-navigation/core';

interface MatchListProps {
  navigation: {
    onMatchPress: (matchItem: MatchItem) => void;
  };
}

export const MatchList = (props: MatchListProps) => {
  const { navigation } = props;
  const { matchList, isLoading, fetchNewMatches } =
    useContext(MatchListContext);
  const handleOnPress = (matchItem: MatchItem) => {
    navigation.onMatchPress(matchItem);
  };

  useFocusEffect(
    useCallback(() => {
      fetchNewMatches();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const renderItem = ({ item }: { item: MatchItem }) => {
    const itemImageSource = item.thumbnailUrl
      ? {
          uri: item.thumbnailUrl,
        }
      : Assets.images.defaultProfile;

    return (
      <TouchableOpacity
        onPress={() => {
          handleOnPress(item);
        }}>
        <MatchListItem
          photo={itemImageSource}
          name={item.name}
          focused={!item.isClickedOn}
        />
      </TouchableOpacity>
    );
  };
  if (isLoading && matchList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={appColors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {matchList && matchList.length > 0 ? (
        <ScrollBar
          style={styles.scrollBar}
          useList={true}
          horizontal={true}
          data={matchList}
          renderItem={renderItem}
          keyExtractor={(item: MatchItem) => item.profileId}
        />
      ) : (
        <NoMatches />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    height: 70,
    justifyContent: 'center',
    width: 50,
  },
  scrollBar: {
    height: '100%',
  },
});
