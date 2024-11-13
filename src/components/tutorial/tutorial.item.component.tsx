import React from 'react';
import { View } from 'react-native-ui-lib';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Headline from '../custom/styleguide-components/headline.component';
import { appFont } from '../../style/appFont';
import LottieView from 'lottie-react-native';
import { appStyles } from '../../style/appStyle';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const isHeightSmall = SCREEN_HEIGHT < 667;
const BOTTOM_ANIMATION_HEIGHT = 60;
const TOP_ANIMATION_HEIGHT = 60;

interface TutorialItemProps {
  animatedIconSource: string;
  bottomAnimationSource: string;
  topAnimationSource?: string;
  title: string;
  backgroundImage: number;
  children: React.ReactNode;
  button?: React.ReactNode;
}

const TutorialItem = (props: TutorialItemProps) => {
  const {
    title,
    backgroundImage,
    animatedIconSource,
    bottomAnimationSource,
    topAnimationSource,
    children,
    button,
  } = props;

  const containerStyles = {
    marginTop: !topAnimationSource ? TOP_ANIMATION_HEIGHT / 2 : 0,
  };

  return (
    <ImageBackground style={styles.image} source={backgroundImage}>
      <View style={styles.safeAreaView}>
        {topAnimationSource && (
          <View style={styles.topAnimationContainer}>
            <LottieView
              source={topAnimationSource}
              style={styles.topAnimation}
              autoPlay
              loop
            />
          </View>
        )}
        <View style={[styles.container, containerStyles]}>
          <Headline type="h1" style={styles.title}>
            {title}
          </Headline>
          <View style={styles.iconAnimationContainer}>
            <LottieView
              source={animatedIconSource}
              style={styles.iconAnimation}
              autoPlay
              loop
            />
          </View>
          <ScrollView contentContainerStyle={styles.alignCenter}>
            {children}
          </ScrollView>
          {button && <View style={styles.buttonContainer}>{button}</View>}
        </View>
        <View style={styles.bottomAnimationContainer}>
          <LottieView
            source={bottomAnimationSource}
            style={styles.bottomAnimation}
            autoPlay
            loop
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  alignCenter: {
    alignItems: 'center',
  },
  bottomAnimation: {
    flex: 1,
  },
  bottomAnimationContainer: {
    bottom: 0,
    flexDirection: 'row',
    height: BOTTOM_ANIMATION_HEIGHT,
    marginBottom: appStyles.bottomMargin,
    width: '80%',
  },
  buttonContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 55,
    overflow: 'hidden',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  iconAnimation: {
    height: isHeightSmall ? 45 : 50,
    width: isHeightSmall ? 45 : 50,
  },
  iconAnimationContainer: {
    padding: isHeightSmall ? 15 : 25,
  },
  image: {
    backgroundColor: '#000',
    flex: 1,
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
  safeAreaView: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
  },
  title: {
    color: 'white',
    fontFamily: appFont.black,
    fontSize: 30,
    lineHeight: 40,
    textAlign: 'center',
  },
  topAnimation: {
    flex: 1,
  },
  topAnimationContainer: {
    flexDirection: 'row',
    height: TOP_ANIMATION_HEIGHT,
    marginTop: appStyles.topMargin,
    width: '80%',
  },
});

export default TutorialItem;
