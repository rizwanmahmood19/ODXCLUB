import React from 'react';
import { Assets } from 'react-native-ui-lib';
import {
  Image,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { appColors } from '../../style/appColors';
import { textInputStyles } from '../../style/appStyle';

export type EmailTextFieldProps = TextInputProps;

const IMAGE_WIDTH = 10;
const IMAGE_HEIGHT = 17;

const PhoneNumberTextField = (props: EmailTextFieldProps) => {
  return (
    <View style={[props.style, styles.container]}>
      <TextInput
        {...props}
        autoCorrect={false}
        keyboardType="phone-pad"
        style={styles.textField}
        maxFontSizeMultiplier={2}
      />
      <Image
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        style={styles.image}
        resizeMode={'contain'}
        source={Assets.icons.smartphone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: appColors.primary,
    borderRadius: 50,
    borderWidth: 2,
    flexDirection: 'row',
    height: 38,
    paddingLeft: 8,
    width: '80%',
  },
  image: {
    height: IMAGE_HEIGHT,
    marginHorizontal: 12,
    width: IMAGE_WIDTH,
  },
  textField: {
    backgroundColor: 'white',
    borderWidth: 0,
    color: appColors.mainTextColor,
    flex: 1,
    margin: 0,
    padding: 0,
    paddingHorizontal: 10,
    ...textInputStyles,
  },
});

export default PhoneNumberTextField;
