import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

import CustomTextArea from '../custom/custom.text.area.component';
import { ReportCheckboxValues } from './report.modal.selector';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import CustomButton from '../custom/styleguide-components/custom.button.component';
import CustomCheckbox from '../custom/styleguide-components/custom.checkbox.component';

interface ReportFormProps {
  name: string;
  remarks: string;
  checkboxValues: ReportCheckboxValues;
  handleSendClick: () => void;
  handleRemarksChange: (value: string) => void;
  handleCheckboxChange: (name: keyof ReportCheckboxValues) => () => void;
}

const ReportForm = (props: ReportFormProps) => {
  const {
    name,
    remarks,
    checkboxValues,
    handleSendClick,
    handleCheckboxChange,
    handleRemarksChange,
  } = props;
  const { l10n } = useContext(LocalizationContext);

  return (
    <View>
      <Text style={styles.title}>
        {l10n.formatString(l10n.general.contextMenu.report.title, name)}
      </Text>
      <CustomCheckbox
        value={checkboxValues.isInappropriate}
        onValueChange={handleCheckboxChange('isInappropriate')}
        label={l10n.general.contextMenu.report.options.inappropriate}
      />
      <CustomCheckbox
        value={checkboxValues.isFake}
        onValueChange={handleCheckboxChange('isFake')}
        label={l10n.general.contextMenu.report.options.fake}
      />
      <CustomCheckbox
        value={checkboxValues.isOther}
        onValueChange={handleCheckboxChange('isOther')}
        label={l10n.general.contextMenu.report.options.other}
      />
      <View>
        <Text style={styles.remarks}>
          {l10n.general.contextMenu.report.remarks.title}
        </Text>
        <CustomTextArea
          value={remarks}
          placeholder={l10n.general.contextMenu.report.remarks.placeholder}
          onChangeText={handleRemarksChange}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={handleSendClick} style={styles.button}>
          {l10n.general.contextMenu.report.button}
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  remarks: {
    color: appColors.primary,
    fontFamily: appFont.semiBold,
    marginTop: 5,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  title: {
    color: appColors.primary,
    fontFamily: appFont.bold,
    fontSize: 22,
    paddingBottom: 15,
    textAlign: 'center',
  },
});

export default ReportForm;
