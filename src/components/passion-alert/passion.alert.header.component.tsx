import React from 'react';

import PassionAlertIcon from '../../../assets/icons/matchapp_passion_alert.svg';
import { PassionAlertScreenProps } from '../../scenes/passion-alert/passion.alert.component';
import CustomArrowButton from '../custom/custom.arrow.button.component';
import { Separator } from '../custom/styleguide-components/Separator';
import { CustomHeader } from '../custom/custom.header.component';

const PASSION_ALERT_ICON_SIZE = 60;

const PassionAlertHeader = ({ navigation }: PassionAlertScreenProps) => {
  return (
    <>
      <CustomHeader
        left={
          <CustomArrowButton onPress={navigation.goBack} disabled={false} />
        }>
        <PassionAlertIcon
          width={PASSION_ALERT_ICON_SIZE}
          height={PASSION_ALERT_ICON_SIZE}
        />
      </CustomHeader>
      <Separator />
    </>
  );
};

export default PassionAlertHeader;
