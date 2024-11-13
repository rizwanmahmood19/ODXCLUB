import { useContext, useEffect, useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';

import { useAxios } from '../../util/useAxios';
import { Alert } from 'react-native';
import { base64ToUri } from '../../services/imagePicker';
import { appColors } from '../../style/appColors';
import RNFetchBlob from 'rn-fetch-blob';
import { getByteSizeBase64 } from '../../util/getByteSizeBase64';
import { LocalizationContext } from '../../services/LocalizationContext';
import { ChatContext } from '../../states/chat.state';
import { is_android, is_iOS } from '../../util/osCheck';
import { IProfilePicture } from '@match-app/shared';
import { ProfileContext } from '../../states/profile.state';
import { ImageCheckContext } from '../../states/imageCheck.state';

export interface ICroppedImage {
  path: string;
  size?: number;
}

export type InputImage = {
  base64: string;
  path?: string;
};

export const usePhotoEditSelector = (
  photo: { base64: string; path?: string },
  goBack: () => void,
) => {
  const { l10n } = useContext(LocalizationContext);
  const { addPicture } = useContext(ProfileContext);
  const [isBlurred, setIsBlurred] = useState(false);
  const [croppedImage, setCroppedImage] = useState<ICroppedImage>();
  const { refreshChatList } = useContext(ChatContext);
  const { dispatch } = useContext(ImageCheckContext);

  const handleSwitchChange = (value: boolean) => setIsBlurred(value);
  const [{ error, loading }, uploadPicture] = useAxios<IProfilePicture>({
    method: 'POST',
    url: 'profile-picture',
    onError: (e) => {
      console.error(e);
      Alert.alert(
        l10n.profile.photoEdit.uploadError.title,
        l10n.profile.photoEdit.uploadError.description,
        [
          {
            text: l10n.profile.photoEdit.uploadError.okay,
            onPress: () => goBack(),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {
            goBack();
          },
        },
      );
    },
    onSuccess: (response) => {
      if (typeof response.data === 'object') {
        if (!response.data.ready) {
          dispatch({ type: 'addImage', imageId: response.data.id });
        }
        addPicture(response.data);
        if (response.data.index === 0) {
          refreshChatList();
        }
      }
    },
  });

  const uploadPhoto = async () => {
    if (!croppedImage) {
      return;
    }
    const imagePath =
      croppedImage.path.indexOf('file:///') === 0 || is_iOS
        ? croppedImage.path
        : 'file:///' + croppedImage.path;
    const formData = new FormData();
    formData.append('file', {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    formData.append('isBlurred', `${isBlurred}`);
    await uploadPicture({
      headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Length': croppedImage.size,
      },
      data: formData,
    });
    goBack();
  };

  const processUncroppedImage = async (image: InputImage) => {
    let size;
    let path = base64ToUri(image.base64);
    if (image.path) {
      path = image.path;
      try {
        const stats = await RNFetchBlob.fs.stat(image.path);
        size = stats.size;
        path = is_android ? 'file:///' + stats.path : stats.path;
      } catch (statError) {
        console.error(statError);
      }
    } else {
      size = getByteSizeBase64(image.base64);
    }

    return { path, size };
  };

  const processImage = async (image: InputImage) => {
    try {
      const cropResult = await ImagePicker.openCropper({
        path: is_android ? 'file:///' + image.path : base64ToUri(image.base64),
        cropperToolbarTitle: l10n.profile.photoEdit.title,
        cropperActiveWidgetColor: appColors.primary,
        cropperStatusBarColor: '#ffffff',
        cropperToolbarColor: '#ffffff',
        mediaType: 'photo',
        width: 300,
        height: 400,
      });
      setCroppedImage(cropResult);
    } catch (croppingError) {
      // cropper throws error on cancellation and can only be identified by message "User cancelled image selection"
      if (croppingError.message?.toLowerCase().indexOf('cancelled') > -1) {
        goBack();
        return;
      }
      // in case we encountered a real error, we offer to upload the image as is
      Alert.alert(
        l10n.profile.photoEdit.croppingError.title,
        l10n.profile.photoEdit.croppingError.description,
        [
          {
            text: l10n.profile.photoEdit.croppingError.submit,
            onPress: async () => {
              const uncroppedImage = await processUncroppedImage(image);
              setCroppedImage(uncroppedImage);
            },
          },
          {
            text: l10n.profile.photoEdit.croppingError.cancel,
            onPress: () => goBack(),
          },
        ],
        { onDismiss: () => goBack(), cancelable: true },
      );
    }
  };

  useEffect(() => {
    processImage(photo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.path, photo.base64]);

  return {
    croppedImage,
    isBlurred,
    isLoading: loading || error,
    uploadPhoto,
    handleSwitchChange,
  };
};
