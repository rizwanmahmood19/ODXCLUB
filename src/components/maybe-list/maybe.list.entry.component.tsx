import React from 'react';
import MaybeCard from './maybe.card.component';
import MaybeEmptyCard from './maybe.empty.card.component';
import { View } from 'react-native-ui-lib';
import {
  IPublicProfile,
  MAX_MAYBE,
  MaybeEntry,
  SwipeDecision,
} from '@match-app/shared';
import { StyleSheet } from 'react-native';

interface MaybeListEntryProps {
  maybeEntry?: MaybeEntry;
  decisionLoading?: string;
  isLoading?: boolean;
  rowIndex: number;
  colIndex: number;
  openModal: (entry: MaybeEntry) => void;
  onDecision: (
    profile: IPublicProfile,
  ) => (decision: SwipeDecision) => Promise<void>;
}

const MaybeListEntry = (props: MaybeListEntryProps) => {
  const {
    maybeEntry,
    decisionLoading,
    isLoading,
    rowIndex,
    colIndex,
    openModal,
    onDecision,
  } = props;

  if (rowIndex * 2 + colIndex + 1 > MAX_MAYBE) return <></>;

  return (
    <View style={styles.cardContainer}>
      {maybeEntry ? (
        <MaybeCard
          maybeEntry={maybeEntry}
          isLoading={decisionLoading === maybeEntry.profile.id}
          isDisabled={isLoading}
          onDecision={onDecision(maybeEntry.profile as IPublicProfile)}
          openModal={openModal}
          secretMessageChannelId={maybeEntry.secretMessageChannelId}
        />
      ) : (
        <MaybeEmptyCard />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    flex: 1,
    margin: 7,
  },
});

export default MaybeListEntry;
