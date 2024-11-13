import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

const DEFAULT_SIZE = 8;

interface NotificationBubbleProps {
  size?: number;
}

const NotificationBubble: FC<NotificationBubbleProps> = (props) => {
  const { size } = props;

  const dynamicStyles = {
    height: size || DEFAULT_SIZE,
    borderRadius: (size || DEFAULT_SIZE) / 2,
    width: size || DEFAULT_SIZE,
  };

  return <View style={StyleSheet.flatten([dynamicStyles, styles.bubble])} />;
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#E1007A',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
});

export default React.memo(NotificationBubble);
