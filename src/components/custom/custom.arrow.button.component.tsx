import ArrowIcon from '../../../assets/icons/matchapp_back_arrow.svg';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-ui-lib';

interface CustomArrowButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  right?: boolean;
}

const CustomArrowButton = (props: CustomArrowButtonProps) => {
  const { onPress, right, disabled } = props;
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        disabled={disabled}>
        <ArrowIcon
          width={29}
          height={16}
          style={[
            disabled ? styles.disabled : styles.enabled,
            right ? styles.rightDirection : null,
          ]}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  disabled: {
    opacity: 0.5,
  },
  enabled: {
    opacity: 1.0,
  },
  rightDirection: { transform: [{ rotate: '180deg' }] },
});

export default CustomArrowButton;
