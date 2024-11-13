import React, { ReactNode, useContext } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Picker, Text, Typography, View } from 'react-native-ui-lib';
import {
  PickerItemLabeledValue,
  PickerProps,
} from 'react-native-ui-lib/typings';

import { appColors } from '../../../style/appColors';
import ArrowIconPrimary from '../../../../assets/icons/matchapp-arrow-right.svg';
import ArrowIconSecondary from '../../../../assets/icons/matchapp-arrow-right-pink.svg';
import { appFont } from '../../../style/appFont';
import Label from './label.component';
import { PreferredPlaces } from '@match-app/shared';
import { LocalizationContext } from '../../../services/LocalizationContext';
import { is_android } from '../../../util/osCheck';

interface CustomPickerProps extends Omit<PickerProps, 'onChange'> {
  children: ReactNode;
  label?: string;
  pickerLabel?: string;
  labelStyle?: StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
  onChange: (value: PickerItemLabeledValue) => void;
  isValid?: boolean;
}

const ARROW_ICON_SIZE = 15;

const CustomPicker = (props: CustomPickerProps) => {
  const { children, label, labelStyle, isValid, pickerLabel, ...otherProps } =
    props;
  const { l10n } = useContext(LocalizationContext);
  const topBarProps = {
    doneButtonProps: {
      labelStyle: {
        color: appColors.primary,
      },
    },
    doneLabel: l10n.screens.DONE,
  };

  return (
    <View style={styles.container}>
      <Picker
        semibold
        multiline={true}
        enableErrors={false}
        topBarProps={topBarProps}
        renderPicker={(
          pickerProps: { value: string; label: string } | string[],
        ) => {
          const combinedLabel = Array.isArray(pickerProps)
            ? pickerProps
                .map((item) => {
                  if (
                    label === l10n.profile.settings.form.preferredGender.title
                  ) {
                    return l10n.profile.settings.form.preferredGender.options[
                      item
                    ];
                  } else {
                    return l10n.profile.edit.form.preferredPlaces.options[
                      PreferredPlaces[item as keyof typeof PreferredPlaces]
                    ];
                  }
                })
                .join(', ')
            : pickerProps.label;

          return (
            <View style={styles.pickerContainer}>
              {label && (
                <Label style={[styles.label, labelStyle]}>{label}</Label>
              )}
              <View
                style={[
                  styles.picker,
                  isValid === false ? styles.invalid : styles.valid,
                ]}>
                <Text style={styles.pickerValue} maxFontSizeMultiplier={2}>
                  {combinedLabel}
                </Text>
                {isValid === false ? (
                  <ArrowIconSecondary
                    style={styles.arrowRightIcon}
                    height={ARROW_ICON_SIZE}
                    width={ARROW_ICON_SIZE}
                  />
                ) : (
                  <ArrowIconPrimary
                    style={styles.arrowRightIcon}
                    height={ARROW_ICON_SIZE}
                    width={ARROW_ICON_SIZE}
                  />
                )}
              </View>
            </View>
          );
        }}
        label={pickerLabel}
        {...otherProps}>
        {children}
      </Picker>
    </View>
  );
};

Typography.loadTypographies({
  semibold: {
    fontFamily: appFont.semiBold,
  },
});

const styles = StyleSheet.create({
  arrowRightIcon: {
    position: 'absolute',
    right: 9,
    top: 10,
  },
  container: {
    zIndex: 2,
  },
  invalid: {
    borderColor: appColors.secondary,
  },
  label: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    paddingBottom: 9,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 38,
    borderWidth: 2,
    color: appColors.mainTextColor,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 21,
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
  },
  pickerValue: {
    bottom: is_android ? 1 : 0,
    color: appColors.mainTextColor,
    fontFamily: appFont.medium,
    fontSize: 14,
    lineHeight: is_android ? 32 : 38,
    width: '100%',
  },
  valid: {
    borderColor: appColors.primary,
  },
});

export default CustomPicker;
