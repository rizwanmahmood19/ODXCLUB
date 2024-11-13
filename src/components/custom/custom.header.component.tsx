import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

export interface CustomHeaderProps {
  children?: ReactNode | string;
  left?: ReactNode;
  right?: ReactNode;
}

export const CustomHeader = ({ children, left, right }: CustomHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>{left}</View>
      <View style={styles.content}>
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    flexBasis: 70,
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    width: '100%',
  },
  left: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
});
