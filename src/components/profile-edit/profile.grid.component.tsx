import React, { useContext, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';
import { DraggableGrid } from 'react-native-draggable-grid';

import { IProfilePicture } from '@match-app/shared';
import ProfileGridAddImage from './profile.grid.add.image.component';
import ProfileGridDeleteImage from './profile.grid.delete.image.component';
import { useProfileGridSelector } from './profile.grid.selector';
import { LocalizationContext } from '../../services/LocalizationContext';
import CustomActionSheet from '../custom/custom.action.sheet.component';
import GalleryMenu from '../gallery-menu/gallery.menu.component';
import { InputImage } from '../photo-edit/photo.edit.selector';
import { useNavigation } from '@react-navigation/core';
import { AppRoute } from '../../navigation/app.routes';

export interface ProfileGridProps {
  images: IProfilePicture[];
  onPhotoSelect: (photo: InputImage) => void;
  onScrollEnabled: (enabled: boolean) => void;
}

export type ProfileGridItem = {
  key: string;
  image: IProfilePicture | undefined;
  disabledReSorted?: boolean;
};

const ProfileGrid = (props: ProfileGridProps) => {
  const { images, onPhotoSelect, onScrollEnabled } = props;
  const { l10n } = useContext(LocalizationContext);
  const [cellWidth, setCellWidth] = useState<number | undefined>();
  const navigation = useNavigation();

  const {
    imageToDelete,
    actionSheetOptions,
    isGalleryMenuOpen,
    openGalleryMenu,
    closeGalleryMenu,
    openDeleteDialog,
    closeDeleteDialog,
    gridData,
    onDragRelease,
  } = useProfileGridSelector(l10n, images);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width) {
      setCellWidth((width * 0.9) / 3);
    }
  };

  const renderItem = (item: ProfileGridItem) => (
    <View style={styles.item} key={item.key}>
      {item.image !== undefined ? (
        <ProfileGridDeleteImage
          openDeleteDialog={openDeleteDialog}
          image={item.image}
          width={cellWidth}
        />
      ) : (
        <ProfileGridAddImage width={cellWidth} onPress={openGalleryMenu} />
      )}
    </View>
  );

  return (
    <>
      <View style={styles.gridContainer} onLayout={handleLayout}>
        <DraggableGrid
          numColumns={3}
          renderItem={renderItem}
          data={gridData}
          itemHeight={187}
          onItemPress={({ image }) =>
            navigation.navigate(AppRoute.PHOTO_UPDATE, { image })
          }
          onDragRelease={(data) => {
            onDragRelease(data);
            onScrollEnabled(true);
          }}
          onDragStart={() => onScrollEnabled(false)}
        />
      </View>
      <CustomActionSheet
        title={l10n.profile.edit.photoDelete.title}
        visible={!!imageToDelete}
        options={actionSheetOptions}
        renderCancel={true}
        cancelLabel={l10n.profile.edit.photoDelete.cancel}
        handleMenuClose={closeDeleteDialog}
      />
      <GalleryMenu
        isOpen={isGalleryMenuOpen}
        handleMenuClose={closeGalleryMenu}
        handleImageSelect={onPhotoSelect}
      />
    </>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    height: 561,
  },
  item: {
    width: '100%',
  },
});

export default ProfileGrid;
