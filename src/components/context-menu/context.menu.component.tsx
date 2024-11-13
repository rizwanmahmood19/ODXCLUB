import React, { ReactNode, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';

import ContextIcon from '../../../assets/icons/matchapp_context_green.svg';
import { appColors } from '../../style/appColors';
import { LocalizationContext } from '../../services/LocalizationContext';
import { useContextMenuSelector } from './context.menu.selector';
import {
  ContextMenuOptions,
  IPublicProfile,
  MatchItem,
} from '@match-app/shared';
import CustomActionSheet from '../custom/custom.action.sheet.component';
import ReportModal from './report.modal.component';

export interface ContextMenuProps {
  username: string;
  profile?: IPublicProfile;
  matchId?: MatchItem['matchId'];
  style?: Record<string, unknown>;
  buttonStyle?: Record<string, unknown>;
  options?: Array<ContextMenuOptions>;
  children?: ReactNode;
  returnToConversation?: () => void;
  returnToProposals?: () => void;
}

const ContextMenu = (props: ContextMenuProps) => {
  const { style, children, buttonStyle, profile, matchId, returnToProposals } =
    props;
  const { l10n } = useContext(LocalizationContext);
  const {
    isOpen,
    confirmedOption,
    options,
    title,
    reportVisible,
    closeReportModal,
    openMenu,
    closeMenu,
  } = useContextMenuSelector(props);

  return (
    <View style={style}>
      <ReportModal
        profile={profile}
        visible={reportVisible}
        closeModal={closeReportModal}
        matchId={matchId}
        returnToProposals={returnToProposals}
      />
      <TouchableOpacity
        style={[styles.iconButton, buttonStyle]}
        onPress={openMenu}>
        {children || (
          <ContextIcon fill={appColors.primary} width={30} height={10} />
        )}
      </TouchableOpacity>
      <CustomActionSheet
        title={title}
        visible={isOpen}
        options={options}
        renderCancel={true}
        cancelLabel={
          confirmedOption
            ? l10n.general.contextMenu.confirmation.return
            : undefined
        }
        handleMenuClose={closeMenu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    paddingVertical: 10,
  },
});

export default ContextMenu;
