import React, { useRef, useState } from 'react';
import { Assets, Carousel, TouchableOpacity, View } from 'react-native-ui-lib';
import {
  Dimensions,
  GestureResponderEvent,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import DeckGradient from './deck.gradient.component';
import DeckPageControl from './deck.page.control.component';
import { IPublicProfilePicture } from '@match-app/shared';
import SecretMessageGradient from '../secret-message/secret.message.gradient.component';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface DeckGalleryProps {
  images: IPublicProfilePicture[];
  style?: Record<string, unknown>;
  showGradient?: boolean;
  allowScroll?: boolean;
  hasSecretMessage?: boolean;
  onFirstImageLoad?: () => void;
}

const DeckGallery = (props: DeckGalleryProps) => {
  const {
    images,
    style,
    showGradient,
    hasSecretMessage,
    onFirstImageLoad,
    allowScroll,
  } = props;
  const carouselRef = useRef<typeof Carousel>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [startTouchXPosition, setStartTouchXPosition] = useState(0);
  const pointerEvents = allowScroll ? 'auto' : 'none';

  const increaseIndex = () => {
    if (currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1);
      carouselRef.current?.goToPage(currentPage + 1);
    }
  };
  const decreaseIndex = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      carouselRef.current?.goToPage(currentPage - 1);
    }
  };

  const handleTouchStart = (event: GestureResponderEvent) => {
    if (allowScroll) {
      setStartTouchXPosition(event.nativeEvent.locationX);
    }
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (allowScroll) {
      if (Math.abs(startTouchXPosition - event.nativeEvent.locationX) < 10) {
        if (event.nativeEvent.locationX > SCREEN_WIDTH * 0.5) {
          increaseIndex();
        } else {
          decreaseIndex();
        }
      }
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex !== currentPage) setCurrentPage(newPageIndex);
  };

  return (
    <View style={[styles.container, style]}>
      {images.length > 1 ? (
        <>
          <DeckPageControl
            activePage={currentPage}
            numberOfPages={images.length}
          />
          {!allowScroll && (
            <>
              <TouchableOpacity
                style={styles.rightButton}
                onPress={increaseIndex}
              />
              <TouchableOpacity
                style={styles.leftButton}
                onPress={decreaseIndex}
              />
            </>
          )}
          <Carousel
            pointerEvents={pointerEvents}
            ref={carouselRef}
            initialPage={currentPage}
            onTouchEnd={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onChangePage={handlePageChange}
            containerStyle={styles.container}>
            {images.map((image, index) => (
              <View style={styles.container} key={index}>
                <ImageBackground
                  onLoadEnd={index === 0 ? onFirstImageLoad : undefined}
                  style={styles.image}
                  source={{
                    uri: image.url,
                  }}>
                  {showGradient && <DeckGradient />}
                </ImageBackground>
              </View>
            ))}
          </Carousel>
        </>
      ) : (
        <ImageBackground
          style={styles.image}
          source={
            images.length > 0
              ? {
                  uri: images[0].url,
                }
              : Assets.images.defaultProfile
          }
          onError={onFirstImageLoad}
          onLoadEnd={onFirstImageLoad}>
          {showGradient &&
            (hasSecretMessage ? <SecretMessageGradient /> : <DeckGradient />)}
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    position: 'relative',
  },
  image: {
    backgroundColor: '#aaaaaa',
    borderRadius: 2,
    flex: 1,
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  leftButton: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '50%',
    zIndex: 100,
  },
  rightButton: {
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    zIndex: 100,
  },
});

export default DeckGallery;
