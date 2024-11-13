import React from 'react';
import { View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';

interface DeckPageControlProps {
  numberOfPages: number;
  activePage: number;
  containerStyles?: Record<string, unknown>;
  activeColor?: string;
  inactiveColor?: string;
}

const DeckPageControl = (props: DeckPageControlProps) => {
  const { containerStyles, activePage, numberOfPages } = props;

  return (
    <View style={[styles.container, containerStyles]}>
      {[...Array(numberOfPages)].map((_, index) => (
        <View
          key={index}
          style={
            index === activePage
              ? styles.pageItemActive
              : styles.pageItemInactive
          }
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 12,
    position: 'absolute',
    right: 20,
    top: 5,
    zIndex: 1000,
  },
  pageItemActive: {
    backgroundColor: 'white',
    borderRadius: 50,
    flex: 1,
    height: 5,
    margin: 2,
  },
  pageItemInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 50,
    flex: 1,
    height: 5,
    margin: 2,
  },
});

export default DeckPageControl;
