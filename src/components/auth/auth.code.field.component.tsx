import React, { useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';

const CELL_COUNT = 6;

export interface AuthCodeFieldProps {
  onChange: (code: string, complete: boolean) => void;
  cellTextStyle: Record<string, unknown>;
  cellRootStyle?: Record<string, unknown>;
}

export const AuthCodeField = (props: AuthCodeFieldProps) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [moreProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View style={styles.root}>
      <CodeField
        ref={ref}
        {...moreProps}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          props.onChange(text, text.length === CELL_COUNT);
        }}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[
              styles.cellRoot,
              props.cellRootStyle,
              isFocused && styles.focusCell,
            ]}>
            <Text
              style={[styles.cellText, props.cellTextStyle]}
              maxFontSizeMultiplier={1.2}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cellRoot: {
    alignItems: 'center',
    borderBottomColor: appColors.primary,
    borderBottomWidth: 2,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 5,
    width: 35,
  },
  cellText: {
    fontFamily: appFont.regular,
    fontSize: 38,
    lineHeight: 45,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: appColors.primaryLight,
    borderBottomWidth: 2,
  },
  root: { alignItems: 'center', flex: 1, margin: 8 },
});
