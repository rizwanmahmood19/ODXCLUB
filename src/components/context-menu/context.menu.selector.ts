import { useContext, useState } from 'react';

import { LocalizationContext } from '../../services/LocalizationContext';
import { ContextMenuProps } from './context.menu.component';
import { ContextMenuOptions } from '@match-app/shared';
import { useAxios } from '../../util/useAxios';
import { useNavigation } from '@react-navigation/core';

export const useContextMenuSelector = (props: ContextMenuProps) => {
  const {
    matchId,
    username,
    options: optionsToShow,
    returnToConversation,
    returnToProposals,
    profile,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [confirmedOption, setConfirmedOption] = useState('');
  const [reportVisible, setReportVisible] = useState(false);
  const { l10n } = useContext(LocalizationContext);
  const navigation = useNavigation();

  const [{ loading: unMatchLoading }, unMatch] = useAxios({
    method: 'DELETE',
    initial: false,
  });

  const [{ loading: ignoreLoading }, ignore] = useAxios({
    method: 'POST',
    params: {
      matchId: matchId,
    },
    initial: false,
  });

  const closeMenu = () => {
    setIsOpen(false);
    closeConfirmation();
  };
  const openMenu = () => setIsOpen(true);
  const closeConfirmation = () => setConfirmedOption('');

  const handleUnMatch = () => {
    setConfirmedOption(ContextMenuOptions.UNMATCH);
  };

  const handleIgnore = () => {
    setConfirmedOption(ContextMenuOptions.IGNORE);
  };

  const confirmUnMatch = () => {
    const config = { url: `matching/matches/${matchId}` };
    unMatch(config).then(() => {
      if (returnToConversation) {
        returnToConversation();
      } else {
        navigation.goBack();
      }
    });
  };

  const confirmIgnore = () => {
    if (profile) {
      const config = { url: `profile/ignore/${profile.id}` };
      ignore(config).then(() => {
        if (returnToProposals) {
          returnToProposals();
        } else if (returnToConversation) {
          returnToConversation();
        } else {
          navigation.goBack();
        }
      });
    }
  };

  const handleReportClick = () => {
    closeMenu();
    // setTimeout is a hack to make the modal work with the ActionSheet
    setTimeout(() => {
      setReportVisible(true);
    }, 400);
  };

  const closeReportModal = () => setReportVisible(false);

  const checkTitle = () => {
    if (confirmedOption) {
      if (confirmedOption === ContextMenuOptions.UNMATCH) {
        return l10n.formatString(
          l10n.general.contextMenu.confirmation.unmatch.title,
          username,
        );
      }
      if (confirmedOption === ContextMenuOptions.IGNORE) {
        return l10n.formatString(
          l10n.general.contextMenu.confirmation.ignore.title,
          username,
        );
      }
    }
    return l10n.general.contextMenu.title;
  };

  const title = checkTitle();

  const checkOptions = () => {
    const optionsArray = [];
    if (confirmedOption) {
      if (confirmedOption === ContextMenuOptions.UNMATCH) {
        return [
          {
            id: ContextMenuOptions.UNMATCH,
            label: l10n.formatString(
              l10n.general.contextMenu.confirmation.unmatch.confirm,
              username,
            ),
            onPress: confirmUnMatch,
          },
        ];
      }
      if (confirmedOption === ContextMenuOptions.IGNORE) {
        return [
          {
            id: ContextMenuOptions.IGNORE,
            label: l10n.formatString(
              l10n.general.contextMenu.confirmation.ignore.confirm,
              username,
            ),
            onPress: confirmIgnore,
          },
        ];
      }
    }

    if (
      !optionsToShow ||
      optionsToShow.indexOf(ContextMenuOptions.UNMATCH) !== -1
    ) {
      optionsArray.push({
        id: 'option-unmatch',
        label: l10n.formatString(
          l10n.general.contextMenu.options.unMatch,
          username,
        ),
        loading: unMatchLoading,
        onPress: handleUnMatch,
      });
    }

    if (
      !optionsToShow ||
      optionsToShow.indexOf(ContextMenuOptions.IGNORE) !== -1
    ) {
      optionsArray.push({
        id: 'option-ignore',
        label: l10n.formatString(
          l10n.general.contextMenu.options.block,
          username,
        ),
        loading: ignoreLoading,
        onPress: handleIgnore,
      });
    }

    if (
      !optionsToShow ||
      optionsToShow.indexOf(ContextMenuOptions.REPORT) !== -1
    ) {
      optionsArray.push({
        id: 'option-report',
        label: l10n.formatString(
          l10n.general.contextMenu.options.report,
          username,
        ),
        onPress: handleReportClick,
      });
    }

    return optionsArray;
  };

  const options = checkOptions();

  return {
    loading: {
      unMatch: unMatchLoading,
    },
    options,
    title,
    isOpen,
    reportVisible,
    confirmedOption,
    closeReportModal,
    closeMenu,
    openMenu,
    closeConfirmation,
  };
};
