import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import PhotoEdit from '../../components/photo-edit/photo.edit.component';

export interface PhotoEditScreenProps {
  photoUrl: { base64: string; path?: string };
  goBack: () => void;
}

export const PhotoEditScreen = (props: PhotoEditScreenProps) => {
  const { photoUrl, goBack } = props;

  return (
    <SafeAreaView style={styles.screen}>
      <PhotoEdit photoUrl={photoUrl} goBack={goBack} />
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
