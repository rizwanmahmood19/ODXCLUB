import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native-ui-lib';

import TransparentBar from '../../../assets/icons/matchapp_recom_bar_container_transparent.svg';
import OpaqueBar from '../../../assets/icons/matchapp_recom_bar_container_full.svg';
import NopeIcon from '../../../assets/icons/matchapp_recom_bar_nay_color.svg';
import MaybeIcon from '../../../assets/icons/matchapp_recom_bar_maybe_color.svg';
import YeahIcon from '../../../assets/icons/matchapp_recom_bar_yes_color.svg';
import NopeIconWhite from '../../../assets/icons/matchapp_recom_bar_nay_white.svg';
import MaybeIconWhite from '../../../assets/icons/matchapp_recom_bar_maybe_white.svg';
import YeahIconWhite from '../../../assets/icons/matchapp_recom_bar_yes_white.svg';

import { SwipeDecision } from '@match-app/shared';
import logEvent from '../../analytics/analytics';
import {
  MatchDecisionEvent,
  UserInteractionEvent,
} from '../../analytics/analytics.event';

export interface DeckActionBarProps {
  onDecision: (decision: SwipeDecision) => void;
  actionButtonsDisabled?: boolean;
  iconStyle?: Record<string, unknown>;
  iconSize?: number;
  whiteIcons?: boolean;
  isMaybeButtonForceDisabled?: boolean;
}

export const ACTION_BAR_WIDTH =
  Math.min(Dimensions.get('window').width, Dimensions.get('window').height) *
  0.61;
export const ACTION_BAR_HEIGHT = ACTION_BAR_WIDTH * 0.32;
const NOPE_ICON_WIDTH = ACTION_BAR_WIDTH * 0.12;
const NOPE_ICON_HEIGHT = ACTION_BAR_HEIGHT * 0.38;
const MAYBE_ICON_WIDTH = ACTION_BAR_WIDTH * 0.14;
const MAYBE_ICON_HEIGHT = ACTION_BAR_HEIGHT * 0.32;
const YEAH_ICON_WIDTH = ACTION_BAR_WIDTH * 0.16;
const YEAH_ICON_HEIGHT = NOPE_ICON_HEIGHT;

const DeckActionBar = (props: DeckActionBarProps) => {
  const {
    onDecision,
    whiteIcons,
    actionButtonsDisabled,
    isMaybeButtonForceDisabled,
  } = props;

  const onDislikePress = () => {
    logEvent(UserInteractionEvent.click + '_' + MatchDecisionEvent.left);
    onDecision(SwipeDecision.NO);
  };

  const onMaybePress = () => {
    logEvent(UserInteractionEvent.click + '_' + MatchDecisionEvent.maybe);
    onDecision(SwipeDecision.MAYBE);
  };

  const onLikePress = () => {
    logEvent(UserInteractionEvent.click + '_' + MatchDecisionEvent.right);
    onDecision(SwipeDecision.YES);
  };

  const maybeOpacityStyle = isMaybeButtonForceDisabled ? 0.2 : 1.0;

  return (
    <View>
      {whiteIcons ? (
        <TransparentBar width={ACTION_BAR_WIDTH} height={ACTION_BAR_HEIGHT} />
      ) : (
        <OpaqueBar
          style={styles.opaqueBar}
          width={ACTION_BAR_WIDTH}
          height={ACTION_BAR_HEIGHT}
        />
      )}
      <TouchableOpacity
        onPress={onDislikePress}
        disabled={actionButtonsDisabled}
        activeOpacity={0.5}
        style={styles.nopeButton}>
        {whiteIcons ? (
          <NopeIconWhite width={NOPE_ICON_WIDTH} height={NOPE_ICON_HEIGHT} />
        ) : (
          <NopeIcon width={NOPE_ICON_WIDTH} height={NOPE_ICON_HEIGHT} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onMaybePress}
        disabled={actionButtonsDisabled || isMaybeButtonForceDisabled}
        activeOpacity={0.5}
        style={[{ opacity: maybeOpacityStyle }, styles.maybeButton]}>
        {whiteIcons ? (
          <MaybeIconWhite width={MAYBE_ICON_WIDTH} height={MAYBE_ICON_HEIGHT} />
        ) : (
          <MaybeIcon width={MAYBE_ICON_WIDTH} height={MAYBE_ICON_HEIGHT} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLikePress}
        disabled={actionButtonsDisabled}
        activeOpacity={0.5}
        style={styles.yeahButton}>
        {whiteIcons ? (
          <YeahIconWhite width={YEAH_ICON_WIDTH} height={YEAH_ICON_HEIGHT} />
        ) : (
          <YeahIcon width={YEAH_ICON_WIDTH} height={YEAH_ICON_HEIGHT} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  maybeButton: {
    left: '43%',
    position: 'absolute',
    top: '35%',
  },
  nopeButton: {
    left: '10%',
    position: 'absolute',
    top: '32%',
  },
  opaqueBar: {
    backgroundColor: 'white',
    borderRadius: ACTION_BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  yeahButton: {
    left: '76%',
    position: 'absolute',
    top: '32%',
  },
});

export default DeckActionBar;
