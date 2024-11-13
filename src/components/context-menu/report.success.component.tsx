import React, { useContext } from 'react';
import { Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';

import CustomButton from '../custom/styleguide-components/custom.button.component';
import { LocalizationContext } from '../../services/LocalizationContext';

interface ReportSuccessProps {
  handleReturn: () => void;
}

const ReportSuccess = (props: ReportSuccessProps) => {
  const { handleReturn } = props;
  const { l10n } = useContext(LocalizationContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {l10n.general.contextMenu.report.success.title}
      </Text>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={handleReturn} style={styles.button}>
          {l10n.general.contextMenu.report.success.button}
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
    marginVertical: 30,
  },
  container: {
    paddingTop: '30%',
  },
  text: {
    color: appColors.primary,
    fontFamily: appFont.bold,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default ReportSuccess;
