import React, { ChangeEvent } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import DateTimePicker from '../react-native-ui-lib-overrides/dateTimePicker';

import { appColors } from '../../style/appColors';
import TodayIcon from '../../../assets/icons/matchapp_ic_today.svg';
import { appFont } from '../../style/appFont';
import moment from 'moment';
import Label from './styleguide-components/label.component';

interface CustomAgePickerProps {
  value?: Date | null;
  placeholder?: Date;
  dateFormat: string;
  onChange: (e: string | ChangeEvent<any>) => void;
  style?: Record<string, unknown>;
  label?: string;
  labelStyle?: Record<string, unknown>;
}

const CustomAgePicker = (props: CustomAgePickerProps) => {
  const { style, value, placeholder, label, labelStyle, ...otherProps } = props;
  const ageFromDate = (date: Date) => moment().diff(moment(date), 'years');

  const textFontColor = {
    color: !value ? appColors.darkGrey : appColors.mainTextColor,
  };

  const placeholderText = placeholder !== null ? placeholder : '';

  return (
    <View>
      {label && <Label style={[styles.label, labelStyle]}>{label}</Label>}
      <View style={styles.container}>
        <View>
          <DateTimePicker
            // use workaround for jittery picker https://github.com/wix/react-native-ui-lib/issues/870
            dialogProps={{
              useSafeArea: true,
            }}
            {...otherProps}
            value={value !== null ? value : new Date()}
            enableErrors={false}
            hideUnderline
            maximumDate={new Date()}
            style={[styles.picker, style]}
          />
        </View>
        <View pointerEvents="none" style={styles.age}>
          <Text
            style={[styles.ageText, textFontColor]}
            maxFontSizeMultiplier={2}>
            {value === null || value === undefined
              ? placeholderText
              : ageFromDate(value)}
          </Text>
        </View>
        <TodayIcon style={styles.todayIcon} height={20} width={20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  age: {
    alignItems: 'center',
    display: 'flex',
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
  },
  ageText: {
    color: appColors.mainTextColor,
    fontFamily: appFont.medium,
    marginHorizontal: 21,
  },
  container: {
    position: 'relative',
    zIndex: 0,
  },
  label: {
    color: appColors.mainTextColor,
    fontFamily: appFont.semiBold,
    paddingBottom: 9,
  },
  picker: {
    borderColor: appColors.primary,
    borderRadius: 50,
    borderWidth: 2,
    color: 'transparent',
    minHeight: 38,
    top: 0,
    width: '100%',
  },
  todayIcon: {
    marginVertical: 6,
    position: 'absolute',
    right: 15,
    top: 3,
  },
});

export default CustomAgePicker;
