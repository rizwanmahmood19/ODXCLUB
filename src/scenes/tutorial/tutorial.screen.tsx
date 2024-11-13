import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import Tutorial from '../../components/tutorial/tutorial.component';

const TutorialScreen = () => {
  return (
    <View style={styles.screen}>
      <Tutorial />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default TutorialScreen;
