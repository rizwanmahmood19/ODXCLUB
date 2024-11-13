import React from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Image, View } from 'react-native-ui-lib';

const DeckGradient = () => (
  <View style={styles.container}>
    <Image style={styles.image} source={Assets.images.deckGradient} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    width: '100%',
  },
  image: {
    height: '60%',
    resizeMode: 'stretch',
    width: '100%',
  },
});

export default DeckGradient;
