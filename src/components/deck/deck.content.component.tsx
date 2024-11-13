import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
} from 'react-native';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import { PublicProposal, SwipeDecision } from '@match-app/shared';
import DeckCard from './deck.card.component';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { AxiosResult } from '../../util/useAxios';
import DeckActionBar from './deck.action.bar.component';
import logEvent from '../../analytics/analytics';
import {
  MatchDecisionEvent,
  UserInteractionEvent,
} from '../../analytics/analytics.event';
import { appStyles } from '../../style/appStyle';
import UndoIcon from '../../../assets/icons/matchapp_ic_undo.svg';
import UndoInactiveIcon from '../../../assets/icons/matchapp_ic_undo_inactive.svg';
import SecretMessageButton from '../secret-message/secret.message.button.component';
import { navigate } from '../../services/navigate';
import { AppRoute } from '../../navigation/app.routes';

type CompositeAnimation = Animated.CompositeAnimation;

const SCREEN_WIDTH = Dimensions.get('window').width + 8;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SIDE_BUTTON_SIZE =
  Math.min(Dimensions.get('window').width, Dimensions.get('window').height) *
  0.15;

interface DeckContentProps {
  currentIndex: number;
  publicProposals: Array<PublicProposal | null>;
  openDetails: () => void;
  onActionBarDecision: (decision: SwipeDecision) => void;
  undoDecision: () => Promise<AxiosResult>;
  canUndo: boolean;
  loadingUndoDecision: boolean;
  secretMessageChannelId?: string;
  isMaybe?: string;
  loadingSecretMessage: boolean;
  fetchSecretMessage: (config?: Record<string, unknown>) => void;
  fetchIsMaybe: (config?: Record<string, unknown>) => void;

  onDecision(
    decision: SwipeDecision,
    publicProposal: PublicProposal,
    animation?: CompositeAnimation,
  ): Promise<AxiosResult>;
}

interface DeckContentState {
  isFirstImageLoaded: boolean;
  isProcessingAction: boolean;
}

class DeckContent extends Component<DeckContentProps, DeckContentState> {
  private position: Animated.AnimatedValueXY;
  private readonly rotate: Animated.AnimatedInterpolation;
  private rotateAndTranslate: {
    transform: (
      | { rotate: Animated.AnimatedInterpolation }
      | { [p: string]: Animated.AnimatedValue }
    )[];
  };
  private likeOpacity: Animated.AnimatedInterpolation;
  private dislikeOpacity: Animated.AnimatedInterpolation;
  private maybeOpacity: Animated.Value;

  private PanResponder: PanResponderInstance | undefined;

  constructor(props: DeckContentProps) {
    super(props);
    this.position = new Animated.ValueXY();
    this.state = {
      isFirstImageLoaded: false,
      isProcessingAction: false,
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    this.rotateAndTranslate = {
      transform: [
        { rotate: this.rotate },
        ...this.position.getTranslateTransform(),
      ],
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    this.maybeOpacity = new Animated.Value(0);
  }

  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return (
          !this.state.isProcessingAction &&
          (Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1)
        );
      },
      onStartShouldSetPanResponder: (_evt, _gestureState) => true,
      onPanResponderMove: (_evt, gestureState) => {
        this.position.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > 120 && !this.state.isProcessingAction) {
          logEvent(UserInteractionEvent.swipe + '_' + MatchDecisionEvent.right);
          this.handleLikeAnimation(gestureState.dy, false);
        } else if (gestureState.dx < -120 && !this.state.isProcessingAction) {
          logEvent(UserInteractionEvent.swipe + '_' + MatchDecisionEvent.left);
          this.handleDislikeAnimation(gestureState.dy, false);
        } else {
          Animated.spring(this.position, {
            useNativeDriver: true,
            toValue: { x: 0, y: 0 },
            friction: 4,
          }).start();
        }
      },
    });
  }

  public async onActionBarDecision(decision: SwipeDecision) {
    if (this.state.isProcessingAction) {
      return;
    }
    switch (decision) {
      case SwipeDecision.YES:
        await this.handleLikeAnimation(75, true);
        break;
      case SwipeDecision.NO:
        await this.handleDislikeAnimation(75, true);
        break;
      case SwipeDecision.MAYBE:
        await this.handleMaybeAnimation();
        break;
    }
  }

  handleMaybeAnimation = async () => {
    const shared = {
      useNativeDriver: true,
      easing: Easing.linear,
    };
    const animatedTimingPosition = (x: number, y: number, duration: number) =>
      Animated.timing(this.position, {
        toValue: { x, y },
        duration,
        ...shared,
      });

    const animation = Animated.sequence([
      animatedTimingPosition(-SCREEN_WIDTH / 3, 0, 200),
      animatedTimingPosition(2 * (SCREEN_WIDTH / 3), 0, 400),
      animatedTimingPosition(0, 0, 400),
      Animated.parallel(
        [
          Animated.timing(this.position, {
            toValue: { x: 0, y: SCREEN_HEIGHT },
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(this.maybeOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ],
        { stopTogether: false },
      ),
    ]);
    await this.runAnimationAndRequest(animation, SwipeDecision.MAYBE);
  };

  runAnimationAndRequest = async (
    animation: CompositeAnimation,
    decision: SwipeDecision,
  ) => {
    const currentProposal = this.props.publicProposals[this.props.currentIndex];
    if (currentProposal !== null) {
      this.setState({ isProcessingAction: true });
      await this.props.onDecision(decision, currentProposal, animation);
      // reset after animation
      this.maybeOpacity.setValue(0);
      this.position.setValue({ x: 0, y: 0 });
      this.setState({ isProcessingAction: false });
    }
  };

  handleLikeAnimation = async (yValue: number, viaActionBar: boolean) => {
    const shared = {
      useNativeDriver: true,
      toValue: { x: SCREEN_WIDTH + 100, y: yValue },
    };
    const animation = viaActionBar
      ? Animated.timing(this.position, {
          ...shared,
          duration: 500,
          easing: Easing.linear,
        })
      : Animated.spring(this.position, {
          ...shared,
        });
    await this.runAnimationAndRequest(animation, SwipeDecision.YES);
  };

  handleDislikeAnimation = async (yValue: number, viaActionBar: boolean) => {
    const shared = {
      useNativeDriver: true,
      toValue: { x: -SCREEN_WIDTH - 100, y: yValue },
    };
    const animation = viaActionBar
      ? Animated.timing(this.position, {
          ...shared,
          duration: 500,
          easing: Easing.linear,
        })
      : Animated.spring(this.position, {
          ...shared,
        });
    await this.runAnimationAndRequest(animation, SwipeDecision.NO);
  };

  handleFirstImageLoad = () => {
    this.setState({ isFirstImageLoaded: true });
  };

  handleUndoPress = (): Promise<AxiosResult> => {
    return this.props.undoDecision();
    // MATCH-960
    // TODO: Animate undo action
  };

  onSecretMessageButton = () => {
    const proposal = this.props.publicProposals[this.props.currentIndex];
    if (proposal) {
      navigate(AppRoute.SECRET_MESSAGE, {
        profile: proposal.profile,
        channelId: this.props.secretMessageChannelId,
      });
    }
  };

  renderUsers = () => {
    if (
      this.props.currentIndex > this.props.publicProposals.length ||
      !this.props.publicProposals[this.props.currentIndex]
    ) {
      return null;
    }
    return this.props.publicProposals
      .map((item, i) => {
        if (
          !item ||
          i < this.props.currentIndex ||
          i > this.props.currentIndex + 2
        ) {
          return null;
        } else if (i === this.props.currentIndex) {
          return (
            <DeckCard
              key={item.id}
              isTopCard
              panHandlers={this.PanResponder?.panHandlers || {}}
              style={[this.rotateAndTranslate as any, styles.deckContent]}
              profile={item.profile}
              likeOpacity={this.likeOpacity}
              dislikeOpacity={this.dislikeOpacity}
              maybeOpacity={this.maybeOpacity}
              handleFirstImageLoad={this.handleFirstImageLoad}
              openDetails={this.props.openDetails}
              fetchSecretMessage={this.props.fetchSecretMessage}
              fetchIsMaybe={this.props.fetchIsMaybe}
              isMaybe={this.props.isMaybe}
              handleSecretMessageClick={this.onSecretMessageButton}
              secretMessageChannelId={this.props.secretMessageChannelId}
            />
          );
        } else {
          return (
            this.state.isFirstImageLoaded && (
              <DeckCard
                key={item.id}
                isTopCard={false}
                profile={item.profile}
                handleFirstImageLoad={this.handleFirstImageLoad}
                style={styles.deckContent}
              />
            )
          );
        }
      })
      .reverse();
  };

  render() {
    return (
      <>
        <View style={styles.deckContentWrapper}>{this.renderUsers()}</View>
        <View style={styles.buttonsContainer}>
          <View style={styles.sideButtonContainer}>
            {!this.props.canUndo ||
            this.props.loadingUndoDecision ||
            this.state.isProcessingAction ? (
              <UndoInactiveIcon
                width={SIDE_BUTTON_SIZE}
                height={SIDE_BUTTON_SIZE}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.handleUndoPress}>
                <UndoIcon width={SIDE_BUTTON_SIZE} height={SIDE_BUTTON_SIZE} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.actionBarContainer}>
            <DeckActionBar
              onDecision={this.props.onActionBarDecision}
              actionButtonsDisabled={this.state.isProcessingAction}
              whiteIcons={true}
            />
          </View>
          <View style={styles.sideButtonContainer}>
            <SecretMessageButton
              onPress={this.onSecretMessageButton}
              colorful={false}
              size={SIDE_BUTTON_SIZE}
              isDisabled={
                this.state.isProcessingAction || this.props.loadingSecretMessage
              }
              isMessageReceived={!!this.props.secretMessageChannelId}
            />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  actionBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    bottom: appStyles.bottomMargin,
    display: 'flex',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  deckContent: {
    backgroundColor: 'transparent',
    height: '100%',
    padding: 0,
    position: 'absolute',
    width: '100%',
  },
  deckContentWrapper: {
    height: '100%',
    paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop - 60,
    width: '100%',
  },
  sideButtonContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default DeckContent;
