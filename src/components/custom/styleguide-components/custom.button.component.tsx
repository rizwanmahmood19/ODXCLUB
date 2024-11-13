import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { appColors } from '../../../style/appColors';
import { appFont } from '../../../style/appFont';

export interface CustomButtonProps {
  children?: ReactNode | string;
  onPress?: (_event?: any) => void;
  disabled?: boolean;
  isLoading?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  type?: 'primary' | 'outline' | 'link';
  color?: string;
  disabledColor?: string;
}

const CustomButton = (props: CustomButtonProps) => {
  const {
    children,
    disabled,
    isLoading,
    testID,
    style,
    type,
    color,
    disabledColor,
    onPress,
  } = props;

  const selectedButtonStyle =
    type !== 'outline' && type !== 'link'
      ? primaryButtonStyles(color, disabledColor)
      : outlineButtonStyles(type, color, disabledColor);

  const buttonStyle = disabled
    ? [
        commonButtonStyles.button,
        selectedButtonStyle.button,
        selectedButtonStyle.disabled,
      ]
    : [commonButtonStyles.button, selectedButtonStyle.button];

  const buttonLabelStyle = disabled
    ? [
        commonButtonStyles.label,
        selectedButtonStyle.label,
        selectedButtonStyle.disabledLabel,
      ]
    : [commonButtonStyles.label, selectedButtonStyle.label];

  return (
    <View style={[containerStyles.container, style]}>
      <TouchableOpacity
        testID={testID}
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}>
        {isLoading ? (
          <ActivityIndicator
            style={styles.activityIndicator}
            color={color || '#fff'}
          />
        ) : typeof children === 'string' ? (
          <Text maxFontSizeMultiplier={2} style={buttonLabelStyle}>
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    </View>
  );
};

const containerStyles = StyleSheet.create({
  container: {
    width: '80%',
  },
});

const styles = StyleSheet.create({
  activityIndicator: {
    height: 12,
    marginVertical: Platform.OS === 'android' ? 4 : 0, // The activity indicator is smaller on Android
  },
});

const commonButtonStyles = StyleSheet.create({
  button: {
    borderRadius: 50,
    fontFamily: appFont.bold,
    paddingHorizontal: 8,
    paddingVertical: 10,
    textAlign: 'center',
    width: '100%',
  },
  label: {
    fontFamily: appFont.bold,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
});

const primaryButtonStyles = (
  color?: CustomButtonProps['color'],
  disabledColor?: CustomButtonProps['disabledColor'],
) => ({
  button: {
    backgroundColor: color || appColors.primary,
  },
  disabled: {
    backgroundColor: disabledColor || appColors.primaryLight,
  },
  disabledLabel: { color: 'white' },
  label: { color: 'white' },
});

const outlineButtonStyles = (
  type?: CustomButtonProps['type'],
  color?: CustomButtonProps['color'],
  disabledColor?: CustomButtonProps['disabledColor'],
) => ({
  button: {
    backgroundColor: 'transparent',
    borderColor: color || appColors.primary,
    borderWidth: type === 'link' ? 0 : 2,
  },
  disabled: {
    borderColor: disabledColor || appColors.primaryLight,
  },
  disabledLabel: {
    color: disabledColor || appColors.primaryLight,
  },
  label: {
    color: color || appColors.primary,
  },
});

export default CustomButton;
