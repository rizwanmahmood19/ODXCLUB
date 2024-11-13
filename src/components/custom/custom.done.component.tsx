import { ActivityIndicator, StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import InfoText from './styleguide-components/info.text.component';
import React, { useContext } from 'react';
import { LocalizationContext } from '../../services/LocalizationContext';
import { TouchableOpacity } from 'react-native-ui-lib';

type CustomDoneComponentProps = {
  isDisabled?: boolean;
  isLoading: boolean;
  onDone: () => void;
};
export const CustomDone: React.FC<CustomDoneComponentProps> = ({
  isDisabled,
  isLoading,
  onDone,
}) => {
  const { l10n } = useContext(LocalizationContext);
  return (
    <>
      {isLoading ? (
        <ActivityIndicator color={appColors.secondary} />
      ) : (
        <TouchableOpacity onPress={onDone} disabled={isDisabled}>
          <InfoText style={isDisabled ? styles.disabled : styles.text}>
            {l10n.screens.DONE}
          </InfoText>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  disabled: {
    color: appColors.mediumGrey,
  },
  text: {
    color: appColors.primary,
  },
});
