import Analytics from 'appcenter-analytics';
import { ENV } from '../../env.json';

// Analytics

const isAnalyticsRequired = (): boolean => {
  return ENV === 'production'; // enable analytics only in production environment
};

const handleAnalytics = (enabled: boolean): Promise<void> => {
  return Analytics.setEnabled(enabled);
};

// Public

export const handleAppCenterInit = async () => {
  await handleAnalytics(isAnalyticsRequired());
};
