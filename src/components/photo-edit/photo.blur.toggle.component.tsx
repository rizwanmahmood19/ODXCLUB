import React, { useContext } from 'react';
import Label from '../custom/styleguide-components/label.component';
import { CustomSwitch } from '../custom/styleguide-components/custom.switch.component';
import BlurredIconCircled from '../../../assets/icons/blurred-eye-circled.svg';
import { BlurView } from '@react-native-community/blur';
import { Assets, Image, Text, View } from 'react-native-ui-lib';
import InfoText from '../custom/styleguide-components/info.text.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import { StyleSheet } from 'react-native';
import { appStyles } from '../../style/appStyle';

interface PhotoBlurToggleProps {
  isBlurred: boolean;
  imagePath: string;
  handleSwitchChange: (value: boolean) => void;
}

const PhotoBlurToggle: React.FC<PhotoBlurToggleProps> = (props) => {
  const { imagePath, isBlurred, handleSwitchChange } = props;
  const { l10n } = useContext(LocalizationContext);

  return (
    <>
      <View style={styles.centeringContainer}>
        <View style={styles.imageContainer}>
          <Image
            width={250}
            height={350}
            style={styles.image}
            source={{ uri: imagePath }}
          />
          {isBlurred && (
            <>
              <BlurView
                style={styles.blurView}
                blurAmount={9}
                blurType="light"
              />
              <BlurredIconCircled
                style={styles.eyeIcon}
                width={40}
                height={40}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.toggleContainer}>
        <Label>{l10n.profile.photoCrop.subtitle}</Label>
        <CustomSwitch value={isBlurred} onValueChange={handleSwitchChange} />
      </View>
      <InfoText style={styles.text}>{l10n.profile.photoCrop.text}</InfoText>
      <View style={styles.blurInfoContainer}>
        <Text style={styles.blurInfoOuterText}>
          <InfoText style={styles.blurInfoText}>
            {l10n.profile.photoCrop.blurInformationBeforeIcon}
          </InfoText>
          <Image
            source={Assets.icons.blurredEye}
            height={20}
            width={20}
            style={styles.blurInfoIcon}
          />
          <InfoText style={styles.blurInfoText}>
            {l10n.profile.photoCrop.blurInformationAfterIcon}
          </InfoText>
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  blurInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurInfoIcon: {},
  blurInfoOuterText: {
    maxWidth: 250,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '100%',
  },
  blurInfoText: {
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  blurView: {
    height: 350,
    position: 'absolute',
    width: 250,
  },
  centeringContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 18,
    paddingTop: 3,
    width: '100%',
  },
  eyeIcon: {
    alignSelf: 'flex-end',
    marginRight: 12,
    marginTop: 12,
  },
  image: {
    borderRadius: appStyles.borderRadius,
    position: 'absolute',
  },
  imageContainer: {
    alignItems: 'center',
    borderRadius: appStyles.borderRadius,
    height: 350,
    overflow: 'hidden',
    position: 'relative',
    width: 250,
  },
  text: {
    fontSize: 13,
    padding: 16,
    textAlign: 'center',
  },
  toggleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
});

export default PhotoBlurToggle;
