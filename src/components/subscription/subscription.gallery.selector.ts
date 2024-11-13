import { useContext, useEffect, useRef, useState } from 'react';
import { LocalizationContext } from '../../services/LocalizationContext';
import { Assets, Carousel } from 'react-native-ui-lib';

export const useSubscriptionGallerySelector = () => {
  const { l10n } = useContext(LocalizationContext);

  const intervalRef = useRef<number>();
  const getGalleryItem = (index: number) => ({
    imageUrl: Assets.images[`subscriptionBackground${index}`],
    text: l10n.subscription.gallery.texts[index],
  });

  const galleryItems = [
    getGalleryItem(0),
    getGalleryItem(1),
    getGalleryItem(2),
    getGalleryItem(3),
    getGalleryItem(4),
  ];

  const carouselRef = useRef<typeof Carousel>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const increaseIndex = () => {
    setCurrentPage((current) => (current + 1) % galleryItems.length);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  const decreaseIndex = () => {
    setCurrentPage(
      (current) => (current - 1 + galleryItems.length) % galleryItems.length,
    );
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentPage((current) => (current + 1) % galleryItems.length);
    }, 3000) as any;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goToPage(currentPage);
    }
  }, [currentPage]);

  return {
    carouselRef,
    galleryItems,
    currentPage,
    increaseIndex,
    decreaseIndex,
  };
};
