import React, { useContext } from 'react';
import {
  KeyboardAwareScrollView,
  Modal,
  Text,
  View,
} from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';

import { IPublicProfile, MatchItem } from '@match-app/shared';
import { LocalizationContext } from '../../services/LocalizationContext';
import { useReportModalSelector } from './report.modal.selector';
import ReportForm from './report.form.component';
import ReportSuccess from './report.success.component';
import CustomActionSheet from '../custom/custom.action.sheet.component';
import { Separator } from '../custom/styleguide-components/Separator';
import { CustomHeader } from '../custom/custom.header.component';
import CustomArrowButton from '../custom/custom.arrow.button.component';
import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import GlobalNotifications from '../notifications/global.notifications';

export interface ReportModalProps {
  profile?: IPublicProfile;
  visible: boolean;
  closeModal: () => void;
  matchId?: MatchItem['matchId'];
  returnToProposals?: () => void;
}

const ReportModal = (props: ReportModalProps) => {
  const { visible, profile, closeModal } = props;
  const { l10n } = useContext(LocalizationContext);
  const {
    remarks,
    checkboxValues,
    isSuccess,
    confirmationOpen,
    confirmationOptions,
    returnToPrevious,
    closeConfirmation,
    openConfirmation,
    handleCheckboxChange,
    handleRemarksChange,
  } = useReportModalSelector(props);

  return (
    <Modal visible={visible} animationType={'fade'} onRequestClose={closeModal}>
      <GlobalNotifications />
      <KeyboardAwareScrollView>
        <View useSafeArea={true}>
          <CustomHeader left={<CustomArrowButton onPress={closeModal} />}>
            <LogoIcon
              width={styles.logo.width}
              height={styles.logo.height}
              style={styles.logo}
            />
          </CustomHeader>
          <Separator />
          {profile ? (
            <View style={styles.container}>
              {isSuccess ? (
                <ReportSuccess handleReturn={returnToPrevious} />
              ) : (
                <ReportForm
                  name={profile.name}
                  remarks={remarks}
                  checkboxValues={checkboxValues}
                  handleSendClick={openConfirmation}
                  handleCheckboxChange={handleCheckboxChange}
                  handleRemarksChange={handleRemarksChange}
                />
              )}
            </View>
          ) : (
            <View style={styles.container}>
              <Text>Profile not found</Text>
            </View>
          )}
        </View>
        <CustomActionSheet
          visible={confirmationOpen}
          options={confirmationOptions}
          handleMenuClose={closeConfirmation}
          title={l10n.general.contextMenu.report.confirmation.title}
          renderCancel
        />
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  logo: {
    height: 32,
    marginVertical: 12,
    width: 32,
  },
});

export default ReportModal;
