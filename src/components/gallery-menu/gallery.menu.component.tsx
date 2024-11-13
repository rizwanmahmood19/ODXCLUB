import React, { useContext } from 'react';
import { LocalizationContext } from '../../services/LocalizationContext';
import { useGalleryMenuSelector } from './gallery.menu.selector';
import CustomActionSheet from '../custom/custom.action.sheet.component';

export interface GalleryMenuProps {
  isOpen: boolean;
  handleMenuClose: () => void;
  handleImageSelect: (response: { base64: string; path?: string }) => void;
}

const GalleryMenu = (props: GalleryMenuProps) => {
  const { isOpen, handleMenuClose } = props;
  const { l10n } = useContext(LocalizationContext);

  const { options } = useGalleryMenuSelector(props);

  // MATCH-628: force modal dismiss (otherwise the photo picker / camera disappears immediately on iOS)
  if (!isOpen) {
    return <></>;
  }

  return (
    <CustomActionSheet
      title={l10n.general.galleryMenu.title}
      visible={isOpen}
      options={options}
      handleMenuClose={handleMenuClose}
      onModalDismissed={handleMenuClose}
      renderCancel={true}
    />
  );
};

export default GalleryMenu;
