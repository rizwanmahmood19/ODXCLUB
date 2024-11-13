import { useContext, useState } from 'react';

import { ReportModalProps } from './report.modal.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { useAxios } from '../../util/useAxios';
import { useNavigation } from '@react-navigation/core';

export interface ReportCheckboxValues {
  isInappropriate: boolean;
  isFake: boolean;
  isOther: boolean;
}

const initialCheckboxValues: ReportCheckboxValues = {
  isInappropriate: false,
  isFake: false,
  isOther: false,
};

export const useReportModalSelector = (props: ReportModalProps) => {
  const { profile, closeModal, matchId, returnToProposals } = props;
  const { l10n } = useContext(LocalizationContext);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [checkboxValues, setCheckboxValues] = useState<ReportCheckboxValues>(
    initialCheckboxValues,
  );
  const navigation = useNavigation();

  const [{ loading: reportLoading }, report] = useAxios({
    method: 'POST',
    params: {
      matchId: matchId,
    },
    initial: false,
  });

  const handleCheckboxChange = (name: keyof ReportCheckboxValues) => () => {
    setCheckboxValues((previousValues) => ({
      ...previousValues,
      [name]: !previousValues[name],
    }));
  };
  const handleRemarksChange = (value: string) => setRemarks(value);
  const returnToPrevious = () => {
    if (returnToProposals) {
      returnToProposals();
    } else {
      navigation.goBack();
    }
    setIsSuccess(false);
    closeModal();
  };

  const closeConfirmation = () => setConfirmationOpen(false);
  const openConfirmation = () => setConfirmationOpen(true);

  // should also block user
  const handleSend = async () => {
    const { isInappropriate, isFake, isOther } = checkboxValues;
    report({
      url: `/profile/report/${profile!.id}`,
      data: {
        isInappropriate,
        isFake,
        isOther,
        customText: remarks,
      },
    }).then(() => {
      setIsSuccess(true);
      setConfirmationOpen(false);
      setCheckboxValues(initialCheckboxValues);
      setRemarks('');
    });
  };

  const confirmationOptions = [
    {
      id: 'option-confirm',
      label: l10n.general.contextMenu.report.confirmation.option,
      loading: reportLoading,
      onPress: handleSend,
    },
  ];

  return {
    checkboxValues,
    remarks,
    isSuccess,
    confirmationOpen,
    confirmationOptions,
    closeConfirmation,
    returnToPrevious,
    openConfirmation,
    handleCheckboxChange,
    handleRemarksChange,
  };
};
