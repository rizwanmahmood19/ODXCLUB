import React from 'react';
import { StyleSheet } from 'react-native';
import ArrowIconPrimary from '../../../../assets/icons/matchapp-arrow-right.svg';
import ArrowIconSecondary from '../../../../assets/icons/matchapp-arrow-right-pink.svg';
import { appColors } from '../../../style/appColors';
import { appFont } from '../../../style/appFont';
import InfoText from './info.text.component';
import { TouchableOpacity } from 'react-native-ui-lib';

interface CustomTextFieldStageComponentProps {
  value: string | null | undefined;
  placeholder: string;
  onPress: () => void;
  isVerified?: boolean;
}

const ARROW_ICON_SIZE = 14;

export const CustomTextFieldStageComponent = (
  props: CustomTextFieldStageComponentProps,
) => {
  const { value, placeholder, onPress, isVerified } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isVerified === false ? styles.invalid : styles.valid,
      ]}
      onPress={onPress}>
      <InfoText style={value ? styles.text : styles.textPlaceholder}>
        {value ? value : placeholder}
      </InfoText>
      {isVerified === false ? (
        <ArrowIconSecondary height={ARROW_ICON_SIZE} width={ARROW_ICON_SIZE} />
      ) : (
        <ArrowIconPrimary height={ARROW_ICON_SIZE} width={ARROW_ICON_SIZE} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    flexDirection: 'row',
    height: 38,
    justifyContent: 'flex-start',
    marginBottom: 6,
    paddingLeft: 21,
    paddingRight: 12,
  },
  invalid: {
    borderColor: appColors.secondary,
  },
  text: {
    color: appColors.mainTextColor,
    flex: 1,
    fontFamily: appFont.medium,
    fontSize: 14,
  },
  textPlaceholder: {
    color: appColors.mediumGrey,
    flex: 1,
    fontFamily: appFont.medium,
    fontSize: 14,
  },
  valid: {
    borderColor: appColors.primary,
  },
});
