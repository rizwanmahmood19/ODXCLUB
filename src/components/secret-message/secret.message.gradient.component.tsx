import React from 'react';
import { StyleSheet } from 'react-native';
import { Assets, Image, View } from 'react-native-ui-lib';

const SecretMessageGradient = ({
  styles: propStyles,
}: {
  styles?: Record<string, unknown>;
}) => (
  <View style={[styles.container, propStyles]}>
    <Image style={styles.image} source={Assets.images.smGradient} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    width: '100%',
  },
  image: {
    height: '100%',
    resizeMode: 'stretch',
    width: '100%',
  },
});

export default SecretMessageGradient;
