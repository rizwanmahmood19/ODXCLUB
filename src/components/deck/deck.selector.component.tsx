import { RefObject, useCallback, useContext, useRef, useState } from 'react';
import {
  MAX_MAYBE,
  MAX_MAYBE_ERROR,
  PublicProposal,
  RecreatedProposal,
  SecretMessageResult,
  SwipeDecision,
} from '@match-app/shared';
import { Config, useAxios } from '../../util/useAxios';
import DeckContent from './deck.content.component';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { AppRoute } from '../../navigation/app.routes';
import { Alert, Animated } from 'react-native';
import { LocalizationContext } from '../../services/LocalizationContext';
import { ChatContext } from '../../states/chat.state';
import { MaybeListContext } from '../../states/maybeList.state';
import { MatchListContext } from '../../states/matchList.state';
import { CatchModalContext } from './catch-modal/catch.modal.context';
import { ProfileContext } from '../../states/profile.state';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import logEvent from '../../analytics/analytics';
import { MatchDecisionResultEvent } from '../../analytics/analytics.event';

type CompositeAnimation = Animated.CompositeAnimation;

export const PN_PERMISSION_AFTER_FIRST_MATCH =
  'PN_PERMISSION_AFTER_FIRST_MATCH';
export const TRUE_STRING = 'TRUE';

const useDeckSelector = (deckRef: RefObject<DeckContent>) => {
  const listTimestamp = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorToast, setErrorToast] = useState<string>();
  const [secretMessage, setSecretMessage] = useState<SecretMessageResult>();
  const [isMaybe, setIsMaybe] = useState<SecretMessageResult>();
  const [publicProposals, setPublicProposals] = useState<
    Array<PublicProposal | null>
  >([]);
  const { setCanUndo } = useContext(ProfileContext);
  const navigation = useNavigation();
  const { l10n } = useContext(LocalizationContext);
  const { refreshChatList, queryAndSetUnreadChannels } =
    useContext(ChatContext);
  const { fetchMaybeList } = useContext(MaybeListContext);
  const { fetchNewMatches } = useContext(MatchListContext);
  const { openCatchModal } = useContext(CatchModalContext);

  const [{ error: loadingError, loading: fetchLoading }, fetchProposals] =
    useAxios({
      url: 'matching/proposals',
      method: 'GET',
      initial: false,
    });

  const [{ loading: loadingSecretMessage }, getSecretMessage] = useAxios({
    method: 'GET',
    initial: false,
    onSuccess: ({ data }) => setSecretMessage(data),
  });

  const [{ loading: loadingIsMaybe }, getIsMaybe] = useAxios({
    method: 'GET',
    initial: false,
    onSuccess: ({ data }) =>
      setIsMaybe(data.decision === undefined ? 2 : data.decision),
  });

  const fetchSecretMessage = (
    configOverride?: Partial<Config<any>> | undefined,
  ) => {
    setSecretMessage(undefined);
    getSecretMessage(configOverride);
  };

  const fetchIsMaybe = (configOverride?: Partial<Config<any>> | undefined) => {
    setIsMaybe(undefined);
    getIsMaybe(configOverride);
  };

  const [{ loading: loadingDecision }, postDecision] = useAxios({
    method: 'POST',
    initial: false,
  });

  const insertProposal = (
    proposals: (PublicProposal | null)[],
    index: number,
    proposal: PublicProposal,
  ) => {
    setPublicProposals([
      ...proposals.slice(0, index),
      proposal,
      ...proposals.slice(index),
    ]);
  };

  const [{ loading: loadingUndoDecision }, undoDecision] =
    useAxios<RecreatedProposal>({
      url: 'matching/undo',
      method: 'POST',
      onSuccess: ({ data }) => {
        if (data?.proposal) {
          setCanUndo(false);
          // insert new proposal into proposal array at the current index position
          insertProposal(publicProposals, currentIndex, data.proposal);
        }
      },
      onError: (error) => {
        console.error(error.response?.data);
        setCanUndo(false);
      },
    });
  const [detailsVisible, setDetailsVisible] = useState(false);

  const closeDetailsModal = () => setDetailsVisible(false);
  const openDetailsModal = () => setDetailsVisible(true);
  const returnToProposals = () => {
    navigation.navigate(AppRoute.DISCOVER);
    closeDetailsModal();
    getNextProposals();
  };

  const getNextProposals = async (skip?: number, retry = false) => {
    const { error, response } = await fetchProposals({
      params: {
        skip,
        retry: retry ? 'true' : undefined,
      },
    });
    if (error) {
      console.error(JSON.stringify(error.response));
      setIsLoading(false);
      return;
    }
    const { data } = response;
    // 1. check if backend decided to generate a new list => retry in 2 seconds
    if (data.isLoading) {
      setTimeout(() => getNextProposals(), 2000);
      setIsLoading(true);
      setCurrentIndex(0);
      listTimestamp.current = 0;
      return;
    }

    // 2. check if we are working on the current list => if not, reset index to current list
    if (listTimestamp.current && data.listTimestamp !== listTimestamp.current) {
      setIsLoading(true);
      setPublicProposals([]);
      listTimestamp.current = data.listTimestamp;
      setCurrentIndex(0);
      await getNextProposals();
      return;
    }

    const loadedProposals =
      Array.isArray(data.proposals) && data.proposals.length
        ? data.proposals
        : [];

    // TODO: Remove skipping and test if it works, since the code below already handles duplicated entries
    if (skip) {
      // Compare new proposals with last 10 loaded proposals to ensure that none is repeated
      const lastTenProposalIDs = publicProposals
        .slice(
          publicProposals.length - 11 > 0 ? publicProposals.length - 11 : 0,
        )
        .map((proposal) => proposal?.id);
      const filteredLoadedProposals = loadedProposals.filter(
        (proposal: PublicProposal) => !lastTenProposalIDs.includes(proposal.id),
      );
      setPublicProposals([...publicProposals, ...filteredLoadedProposals]);
    } else {
      setPublicProposals(loadedProposals);
      setCurrentIndex(0);
    }

    listTimestamp.current = data.listTimestamp;
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getNextProposals();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  async function onRetry() {
    await getNextProposals(0, true);
  }

  const increment = async () => {
    const newIndex = currentIndex + 1;
    setSecretMessage(undefined);
    if (newIndex > publicProposals.length - 3 && !fetchLoading) {
      // fetch upcoming proposals
      await getNextProposals(2);
    }
    setCurrentIndex(newIndex);
  };

  const onActionBarDecision = async (decision: SwipeDecision) => {
    if (publicProposals[currentIndex]) {
      if (deckRef?.current) {
        deckRef.current.onActionBarDecision(decision);
      } else {
        await increment();
      }
    }
  };

  const onDeckDecision = async (
    decision: SwipeDecision,
    publicProposal: PublicProposal,
    animation?: CompositeAnimation,
  ): Promise<void> => {
    const [{ response }] = await Promise.all([
      postDecision({
        url: `matching/proposals/${publicProposal.id}`,
        data: {
          decision,
        },
        onError: (error) => {
          // in case of an error, stop the animation
          if (animation) {
            animation.stop();
          }
          if (error.response?.data.message === MAX_MAYBE_ERROR) {
            Alert.alert(
              l10n.maybe.maxMaybeModal.title,
              l10n.formatString(
                l10n.maybe.maxMaybeModal.description,
                MAX_MAYBE,
              ),
              [
                {
                  text: l10n.buttons.cancel,
                  style: 'cancel',
                },
                {
                  text: l10n.maybe.maxMaybeModal.ok,
                  onPress: () => navigation.navigate(AppRoute.MAYBE),
                },
              ],
              { cancelable: false },
            );
          } else {
            setErrorToast(
              error.response?.data.message || l10n.swipeDeck.errors.swiping,
            );
          }
        },
      }),
      new Promise((resolve) => {
        if (animation) {
          animation.start(() => resolve(undefined));
        } else {
          resolve(undefined);
        }
      }),
    ]);

    if (response?.data) {
      if (response.data.matchId) {
        const targetProfile = publicProposals[currentIndex]?.profile;
        if (targetProfile) {
          openCatchModal({
            name: targetProfile.name,
            isClickedOn: true,
            matchId: response.data.matchId,
            profileId: targetProfile.id,
            thumbnailUrl: targetProfile.pictures[0].thumbnailUrl,
          });
        }
        queryAndSetUnreadChannels();
        const hasPNPermissionAppearedAfterMatch = await AsyncStorage.getItem(
          PN_PERMISSION_AFTER_FIRST_MATCH,
        );
        if (hasPNPermissionAppearedAfterMatch !== TRUE_STRING) {
          AsyncStorage.setItem(PN_PERMISSION_AFTER_FIRST_MATCH, TRUE_STRING);
          messaging().requestPermission();
        }
        fetchNewMatches();
        fetchMaybeList();
        logEvent(MatchDecisionResultEvent.newMatch);
        refreshChatList();
        setCanUndo(false);
      } else if (decision === SwipeDecision.MAYBE) {
        setCanUndo(false);
        fetchMaybeList();
      } else {
        setCanUndo(true);
      }
      await increment();
    }
  };

  const onDismissErrorToast = () => setErrorToast(undefined);

  return {
    loading: isLoading,
    loadingError,
    errorToastMessage: errorToast,
    onRetry,
    currentIndex,
    publicProposals,
    detailsVisible,
    actionButtonsDisabled: loadingDecision,
    openDetailsModal,
    closeDetailsModal,
    onDismissErrorToast,
    onDeckDecision,
    onActionBarDecision,
    increment,
    returnToProposals,
    undoDecision,
    loadingUndoDecision,
    secretMessage,
    loadingSecretMessage,
    fetchSecretMessage,
    fetchIsMaybe,
    isMaybe,
  };
};

export default useDeckSelector;
