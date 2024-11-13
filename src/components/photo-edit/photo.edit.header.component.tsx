import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appColors } from '../../style/appColors';
import { ICroppedImage } from './photo.edit.selector';
import { CustomHeader } from '../custom/custom.header.component';
import { CustomDone } from '../custom/custom.done.component';
import Headline from '../custom/styleguide-components/headline.component';
import InfoText from '../custom/styleguide-components/info.text.component';
import { TouchableOpacity } from 'react-native-ui-lib';
import { IProfilePicture } from '@match-app/shared';

interface PhotoEditHeaderProps {
  image: IProfilePicture | ICroppedImage | undefined;
  isLoading?: boolean;
  goBack: () => void;
  uploadPhoto: () => void;
}

const PhotoEditHeader = (props: PhotoEditHeaderProps) => {
  const { l10n } = useContext(LocalizationContext);
  const { image, isLoading, goBack, uploadPhoto } = props;

  return (
    <CustomHeader
      left={
        image !== undefined && (
          <TouchableOpacity onPress={goBack}>
            <InfoText style={styles.leftText}>{l10n.screens.CANCEL}</InfoText>
          </TouchableOpacity>
        )
      }
      right={<CustomDone isLoading={!!isLoading} onDone={uploadPhoto} />}>
      <Headline type="h2">
        {image !== undefined
          ? l10n.profile.photoCrop.title
          : l10n.profile.photoEdit.title}
      </Headline>
    </CustomHeader>
  );
};

const styles = StyleSheet.create({
  leftText: {
    color: appColors.mediumGrey,
  },
});

export default PhotoEditHeader;
