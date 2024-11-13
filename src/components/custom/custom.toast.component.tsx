import React from 'react';
import { TouchableOpacity } from 'react-native-ui-lib';

type CustomToastProps = {
  backgroundColor: string;
  onPress?: () => void;
};
export const CustomToast: React.FC<CustomToastProps> = ({
  backgroundColor,
  onPress,
  children,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles(backgroundColor).hintWrapper}>
      {children}
    </TouchableOpacity>
  );
};
const styles = (backgroundColor: string) => ({
  hintWrapper: {
    backgroundColor: backgroundColor,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
});
