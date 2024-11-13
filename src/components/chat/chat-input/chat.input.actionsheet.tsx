import React, { useContext, useState } from 'react';
import CustomActionSheet from '../../custom/custom.action.sheet.component';
import { LocalizationContext } from '../../../services/LocalizationContext';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import { RecordingCamera } from './recording.camera';
import logEvent from '../../../analytics/analytics';
import {
  UserInteractionEvent,
  VideoUploadEvent,
} from '../../../analytics/analytics.event';
import {
  hasCameraPermission,
  hasGalleryPermission,
  hasVideoPermission,
} from '../../../services/permission/permission';

type ChatInputActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onImage: (filePath: string) => void;
  onVideo: (filePath: string) => void;
};

export const ChatInputActionSheet: React.FC<ChatInputActionSheetProps> = ({
  isOpen,
  onClose,
  onImage,
  onVideo,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { l10n } = useContext(LocalizationContext);
  const handleImagePickerResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel || response.error) {
      return;
    }
    const filePath = response.path || response.uri;

    if (response.type?.startsWith('image')) {
      onImage(filePath);
    } else {
      logEvent(UserInteractionEvent.click + '_' + VideoUploadEvent.select);
      onVideo(filePath);
    }
  };

  const openCamera = async (type: 'video' | 'photo') => {
    if (!(await hasCameraPermission())) {
      return;
    }

    ImagePicker.launchCamera(
      { cameraType: 'back', mediaType: type },
      handleImagePickerResponse,
    );
  };

  const openGallery = async () => {
    if (!(await hasGalleryPermission())) {
      return;
    }
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'mixed',
        noData: true,
        storageOptions: { skipBackup: true },
      },
      handleImagePickerResponse,
    );
  };

  const openVideo = async () => {
    if (!(await hasVideoPermission())) {
      return;
    }

    setIsCameraOpen(true);
  };

  const handleVideo = (filePath: string) => {
    setIsCameraOpen(false);
    onVideo(filePath);
  };

  const handleCancel = () => {
    setIsCameraOpen(false);
  };

  if (isCameraOpen) {
    return <RecordingCamera onVideo={handleVideo} onCancel={handleCancel} />;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <CustomActionSheet
        title={l10n.general.galleryMenu.title}
        visible={isOpen}
        options={[
          {
            id: 'option-camera',
            label: l10n.general.galleryMenu.options.camera,
            onPress: () => {
              onClose();
              // use a timeout (in iOS it is not possible for one modal to overlap the other)
              setTimeout(() => {
                openCamera('photo');
              }, 200);
            },
          },
          {
            id: 'option-record-video',
            label: l10n.general.galleryMenu.options.recordVideo,
            onPress: async () => {
              logEvent(
                UserInteractionEvent.click + '_' + VideoUploadEvent.record,
              );
              onClose();
              setTimeout(() => {
                openVideo();
              }, 200);
            },
          },
          {
            id: 'option-gallery',
            label: l10n.general.galleryMenu.options.gallery,
            onPress: () => {
              onClose();
              setTimeout(() => {
                openGallery();
              }, 200);
            },
          },
        ]}
        handleMenuClose={onClose}
        onModalDismissed={onClose}
        renderCancel={true}
      />
    </>
  );
};
