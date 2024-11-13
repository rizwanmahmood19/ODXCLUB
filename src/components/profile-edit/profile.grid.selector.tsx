import { useContext, useEffect, useState } from 'react';
import { ProfileGridItem } from './profile.grid.component';
import { useAxios } from '../../util/useAxios';
import { useFetchProfile } from '../../scenes/profile/profile.selector';
import { IProfilePicture } from '@match-app/shared/src';
import { compact } from 'lodash';
import { ProfileContext } from '../../states/profile.state';
import { ChatContext } from '../../states/chat.state';
import { Alert } from 'react-native';
import { ImageCheckContext } from '../../states/imageCheck.state';

const getPreparedGridData = (images: IProfilePicture[]) =>
  [...Array(9)].map((_, index) => ({
    key: images[index]?.id ? images[index].id : `${index}`,
    image: images[index],
    disabledReSorted: images[index] === undefined,
  }));

export const useProfileGridSelector = (
  l10n: any,
  images: IProfilePicture[],
) => {
  const { refreshChatList } = useContext(ChatContext);
  const { dispatch } = useContext(ProfileContext);
  const [imageToDelete, setImageToDelete] = useState<string>();
  const [isGalleryMenuOpen, setIsGalleryMenuOpen] = useState(false);
  const { fetchProfile } = useFetchProfile();
  const [{ loading: loadingDelete }, deletePicture] = useAxios({
    method: 'DELETE',
  });
  const [, orderPictures] = useAxios({
    method: 'PUT',
  });
  const { dispatch: imageCheckDispatch } = useContext(ImageCheckContext);

  const [gridData, setGridData] = useState<ProfileGridItem[]>(
    getPreparedGridData(images !== undefined ? images : []),
  );

  useEffect(() => {
    if (images === undefined) {
      return;
    }
    // grid image was added or deleted
    setGridData(getPreparedGridData(images));

    let timeout: number;
    if (!images.every((p) => p.ready)) {
      timeout = setTimeout(() => {
        fetchProfile();
      }, 1000) as unknown as number;
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const openDeleteDialog = (id: string) => {
    if (images && images.length === 1) {
      Alert.alert(
        l10n.profile.edit.editPhotos.minOnePicAlert.title,
        l10n.profile.edit.editPhotos.minOnePicAlert.text,
      );
    } else {
      setImageToDelete(id);
    }
  };
  const closeDeleteDialog = () => setImageToDelete(undefined);
  const openGalleryMenu = () => setIsGalleryMenuOpen(true);
  const closeGalleryMenu = () => setIsGalleryMenuOpen(false);

  const deleteImage = (id: string) => {
    const config = { url: `profile-picture/${id}` };
    const mainPictureChanged =
      Array.isArray(images) && images.length && images[0].id === id;

    deletePicture(config).then(() => {
      fetchProfile();
      imageCheckDispatch({ type: 'removeImage', imageId: id });
      closeDeleteDialog();
      if (mainPictureChanged) {
        refreshChatList();
      }
    });
  };

  const onDragRelease = async (data: ProfileGridItem[]) => {
    const mainPictureChanged =
      Array.isArray(images) && images.length && images[0].id !== data[0].key;

    setGridData(data);
    const orderIds = compact(
      data.map((item) => {
        return item.image?.id;
      }),
    );
    dispatch({ type: 'setIsSaving', isSaving: true });
    await updateOrderedPictures(orderIds);
    dispatch({ type: 'setIsSaving', isSaving: false });
    if (mainPictureChanged) {
      refreshChatList();
    }
  };

  const updateOrderedPictures = async (orderedIds: string[]) => {
    const config = {
      url: 'profile-picture/order',
      data: { orderedIds: orderedIds },
    };
    await orderPictures(config);
    await fetchProfile();
  };

  const actionSheetOptions = [
    {
      id: 'option-delete',
      label: l10n.profile.edit.photoDelete.confirm,
      loading: loadingDelete,
      onPress: () => deleteImage(imageToDelete!),
    },
  ];

  return {
    imageToDelete,
    actionSheetOptions,
    isGalleryMenuOpen,
    openGalleryMenu,
    closeGalleryMenu,
    openDeleteDialog,
    closeDeleteDialog,
    deleteImage,
    updateOrderedPictures,
    gridData,
    onDragRelease,
  };
};
