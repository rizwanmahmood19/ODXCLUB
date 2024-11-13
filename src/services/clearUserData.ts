import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import { ASYNC_STORAGE_KEYS } from '../constants';

const deleteKeys = async () => {
  const allKeys = await AsyncStorage.getAllKeys();
  if (allKeys.length > 0) {
    await AsyncStorage.multiRemove(
      allKeys.filter(
        (x) =>
          ![
            ASYNC_STORAGE_KEYS.INITIAL_TOS_AGREE_RECORDING_ID,
            ASYNC_STORAGE_KEYS.TRACKING_ENABLED,
          ].includes(x),
      ),
    );
  }
};

const deleteGallery = async () => {
  const galleryDir =
    RNFetchBlob.fs.dirs.DocumentDir + '/matchapp/recent-pictures';

  return RNFetchBlob.fs.exists(galleryDir).then(async (exists) => {
    if (!exists) {
      return;
    }
    return RNFetchBlob.fs.ls(galleryDir).then((files: string[]) => {
      return Promise.all(
        files.map(async (filePath: string) => {
          await RNFetchBlob.fs.unlink(`${galleryDir}/${filePath}`);
        }),
      ).then((values) => values);
    });
  });
};

export const clearUserData = async () => {
  await deleteKeys();
  await deleteGallery();
};
