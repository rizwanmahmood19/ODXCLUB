import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import NopeIcon from '../../../assets/icons/matchapp_recom_bar_nay_color.svg';
import YeahIcon from '../../../assets/icons/matchapp_recom_bar_yes_color.svg';
import { SwipeDecision } from '@match-app/shared';
import logEvent from '../../analytics/analytics';
import {
  MatchDecisionEvent,
  UserInteractionEvent,
} from '../../analytics/analytics.event';
import { useDebouncedEffect } from '../../util/useDebouncedEffect';

export interface DeckActionBarProps {
  onDecision: (decision: SwipeDecision) => void;
}

const MaybeCardActionBar = (props: DeckActionBarProps) => {
  const { onDecision } = props;

  const [disabled, setDisabled] = useState(false);

  useDebouncedEffect(
    () => {
      setDisabled(false);
    },
    1000,
    [disabled],
  );

  const onDislikePress = () => {
    setDisabled(true);
    logEvent(UserInteractionEvent.click + '_' + MatchDecisionEvent.left);
    onDecision(SwipeDecision.NO);
  };

  const onLikePress = () => {
    setDisabled(true);
    logEvent(UserInteractionEvent.click + '_' + MatchDecisionEvent.right);
    onDecision(SwipeDecision.YES);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDislikePress}
        disabled={disabled}
        activeOpacity={0.5}
        style={styles.button}>
        <NopeIcon width={18} height={18} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLikePress}
        disabled={disabled}
        activeOpacity={0.5}
        style={styles.button}>
        <YeahIcon width={22} height={22} />
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 10,
    width: 'auto',
    zIndex: 5,
  },
});

export default MaybeCardActionBar;
