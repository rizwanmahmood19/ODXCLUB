import { useState } from 'react';
import { useUpdateProfile } from '../../scenes/profile/profile.selector';
import logEvent from '../../analytics/analytics';
import { FunnelEvents } from '../../analytics/analytics.event';

export const useTutorialSelector = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { updateProfile, isUpdating } = useUpdateProfile();

  const handlePageChange = (newPageIndex: number) => {
    setCurrentPage(newPageIndex);
  };

  const handleButtonPress = async () => {
    logEvent(FunnelEvents.letsDoThisButton);
    await updateProfile({ data: { hasCompletedTutorial: true } });
  };

  return {
    currentPage,
    isUpdating,
    updateProfile,
    handlePageChange,
    handleButtonPress,
  };
};
