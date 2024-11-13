import React from 'react';
import { View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import InfoText from './styleguide-components/info.text.component';
import { appStyles } from '../../style/appStyle';

interface CustomErrorTextComponent {
  description: string;
  style?: Record<string, unknown>;
}

const CustomErrorText = (props: CustomErrorTextComponent) => {
  return (
    <View style={[styles.rectangle, props.style]}>
      <InfoText style={styles.text} testID={'errorText'}>
        {props.description}
      </InfoText>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangle: {
    alignItems: 'center',
    borderColor: appColors.secondary,
    borderRadius: appStyles.borderRadius,
    borderWidth: 2,
    justifyContent: 'center',
  },
  text: {
    color: appColors.secondary,
    padding: 16,
    textAlign: 'center',
  },
});

export default CustomErrorText;
