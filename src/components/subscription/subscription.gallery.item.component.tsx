import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import LogoIcon from '../../../assets/icons/matchapp_ic_logo.svg';
import Headline from '../custom/styleguide-components/headline.component';

interface SubscriptionGalleryItemProps {
  imageUrl: number;
  text: string;
  staticHeight?: number;
}

const SubscriptionGalleryItem = (props: SubscriptionGalleryItemProps) => {
  const { imageUrl, text, staticHeight } = props;

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={imageUrl}>
        <View style={[styles.content, { bottom: staticHeight }]}>
          <LogoIcon
            style={styles.logo}
            width={styles.logo.width}
            height={styles.logo.height}
          />
          <Headline type="h1" style={styles.text}>
            {text}
          </Headline>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    marginBottom: 20,
    position: 'absolute',
    width: '85%',
    zIndex: 50,
  },
  image: {
    alignItems: 'center',
    backgroundColor: '#aaaaaa',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    resizeMode: 'cover',
    width: '100%',
  },
  logo: {
    height: 80,
    marginBottom: 30,
    width: 80,
  },
  text: {
    color: 'white',
    fontSize: 30,
    lineHeight: 40,
    textAlign: 'center',
  },
});

export default SubscriptionGalleryItem;
