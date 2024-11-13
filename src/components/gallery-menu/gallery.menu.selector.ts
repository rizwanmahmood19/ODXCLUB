import { GalleryMenuProps } from './gallery.menu.component';
import { useContext, useEffect, useState } from 'react';
import { LocalizationContext } from '../../services/LocalizationContext';
import { imageFromCamera, imageFromGallery } from '../../services/imagePicker';
import {
  hasGalleryPermission,
  hasCameraPermission,
} from '../../services/permission/permission';

export const useGalleryMenuSelector = (props: GalleryMenuProps) => {
  const { handleImageSelect, handleMenuClose } = props;
  const [selectedOption, setSelectedOption] = useState<number | undefined>();

  useEffect(() => {
    if (selectedOption !== undefined) {
      handleSelectedOption();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  const handleSelectedOption = () => {
    switch (selectedOption) {
      case 0:
        openCamera();
        break;
      case 1:
        openGallery();
        break;
      default:
        break;
    }
    setSelectedOption(undefined);
  };

  const { l10n } = useContext(LocalizationContext);
  const openGallery = async () => {
    if (!(await hasGalleryPermission())) {
      return;
    }

    imageFromGallery(l10n.profile.photoEdit.pictureOption).then(
      (res) => handleImageSelect(res),
      // TODO MATCH-265: Handle error
      (reject) => console.error(reject),
    );
  };
  const openCamera = async () => {
    if (!(await hasCameraPermission())) {
      return;
    }

    imageFromCamera(l10n.profile.photoEdit.pictureOption).then(
      (res) => handleImageSelect(res),
      // TODO MATCH-265: Handle error
      (reject) => console.error(reject),
    );
  };

  const options = [
    {
      id: 'option-camera',
      label: l10n.general.galleryMenu.options.camera,
      onPress: () => {
        handleMenuClose();
        setSelectedOption(0);
      },
    },
    {
      id: 'option-gallery',
      label: l10n.general.galleryMenu.options.gallery,
      onPress: () => {
        handleMenuClose();
        setSelectedOption(1);
      },
    },
  ];

  return {
    options,
  };
};
