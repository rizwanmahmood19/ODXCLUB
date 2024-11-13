import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';

const commonOptions = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.9,
};

const resolvePromise = (
  response: ImagePickerResponse,
  resolve: (value: { base64: string; path?: string }) => void,
  reject: (error: string) => void,
) => {
  if (response.didCancel) {
    reject('User cancelled photo picker');
  } else if (response.error) {
    reject(`ImagePicker Error: ${response.error}`);
  } else if (response.customButton) {
    reject('User tapped custom button: @{response.customButton}');
  } else {
    resolve({
      base64: response.data,
      path: response.path,
    });
  }
};

const imageFromPicker = (
  title: string,
): Promise<{ base64: string; path?: string }> => {
  return new Promise<{ base64: string; path?: string }>((resolve, reject) => {
    const options = {
      title: title,
      ...commonOptions,
    };

    ImagePicker.showImagePicker(options, (response) =>
      resolvePromise(response, resolve, reject),
    );
  });
};

export const imageFromGallery = (
  title: string,
): Promise<{ base64: string; path?: string }> => {
  return new Promise<{ base64: string; path?: string }>((resolve, reject) => {
    const options = {
      title: title,
      ...commonOptions,
    };
    ImagePicker.launchImageLibrary(options, (response) =>
      resolvePromise(response, resolve, reject),
    );
  });
};

export const imageFromCamera = (
  title: string,
): Promise<{ base64: string; path?: string }> => {
  return new Promise<{ base64: string; path?: string }>((resolve, reject) => {
    const options = {
      title: title,
      ...commonOptions,
    };

    ImagePicker.launchCamera(options, (response) =>
      resolvePromise(response, resolve, reject),
    );
  });
};

export const base64ToUri = (base64: string) =>
  `data:image/jpeg;base64,${base64}`;

export default imageFromPicker;
