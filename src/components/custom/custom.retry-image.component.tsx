import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import { Image } from 'react-native-ui-lib';

type RetryImageProps = {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  maxRetries?: number;
};

/**
 * This component automatically tries to refetch the source when it fails to load it.
 * The refetch timeout to refetch increases by x seconds each time (all tries accumulated with Little Gauss in seconds)
 */
export const RetryImage = ({
  maxRetries = 10,
  source,
  style,
}: RetryImageProps) => {
  const [retries, setRetries] = useState(0);
  useEffect(() => {
    setRetries(0);
  }, [source]);

  return (
    <Image
      key={retries}
      style={style}
      source={source}
      onError={() => {
        if (retries < maxRetries) {
          setTimeout(() => {
            setRetries(retries + 1);
          }, 1000 * (retries + 1));
        }
      }}
    />
  );
};
