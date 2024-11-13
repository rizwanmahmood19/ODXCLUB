import React from 'react';
import { Carousel, PageControl, View } from 'react-native-ui-lib';
import { useTutorialSelector } from './tutorial.selector';
import TutorialDislikePage from './tutorial-pages/tutorial.dislike.page';
import TutorialMaybePage from './tutorial-pages/tutorial.maybe.page';
import TutorialLikePage from './tutorial-pages/tutorial.like.page';
import TutorialRewindPage from './tutorial-pages/tutorial.rewind.page';
import TutorialPassionAlertPage from './tutorial-pages/tutorial.passion.alert.page';
import TutorialSecretMessagePage from './tutorial-pages/tutorial.secret.message.page';
import { StyleSheet } from 'react-native';

const Tutorial = () => {
  const { currentPage, handlePageChange, handleButtonPress, isUpdating } =
    useTutorialSelector();

  const tutorialItems = [
    <TutorialDislikePage key="tutorial-dislike-page" />,
    <TutorialLikePage key="tutorial-like-page" />,
    <TutorialMaybePage key="tutorial-maybe-page" />,
    <TutorialRewindPage key="tutorial-rewind-page" />,
    <TutorialSecretMessagePage key="tutorial-secret-message-page" />,
    <TutorialPassionAlertPage
      key="tutorial-passion-alert-page"
      handleButtonPress={handleButtonPress}
      isUpdating={isUpdating}
    />,
  ];

  return (
    <View style={styles.container}>
      <Carousel
        initialPage={currentPage}
        containerStyle={styles.carouselContainer}
        onChangePage={handlePageChange}>
        {tutorialItems}
      </Carousel>
      <View style={styles.static}>
        <PageControl
          currentPage={currentPage}
          numOfPages={tutorialItems.length}
          spacing={20}
          color="white"
          inactiveColor="rgba(255, 255, 255, 0.6)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    zIndex: 1,
  },
  container: {
    backgroundColor: '#333',
    flex: 1,
  },
  static: {
    alignItems: 'center',
    bottom: 120,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
});

export default Tutorial;
