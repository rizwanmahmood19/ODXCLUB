import { IProfilePicture } from '@match-app/shared';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import PhotoUpdate from '../../components/photo-edit/photo.update.component';

type PhotoUpdateScreenProps = StackScreenProps<
  {
    parameters: { image: IProfilePicture };
  },
  'parameters'
>;

export const PhotoUpdateScreen: React.FC<PhotoUpdateScreenProps> = (props) => {
  const {
    route: {
      params: { image },
    },
  } = props;

  return (
    <SafeAreaView style={styles.screen}>
      <PhotoUpdate image={image} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
});
