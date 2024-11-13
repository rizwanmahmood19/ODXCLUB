import { is_iOS } from '../../util/osCheck';
import React from 'react';
import { useDisableBackButton } from './useDisableBackButton';

const InnerComponent: React.FC = () => {
  useDisableBackButton();
  return null;
};

export const DisableBackButton: React.FC = () => {
  if (is_iOS) {
    return null;
  }
  return <InnerComponent />;
};
