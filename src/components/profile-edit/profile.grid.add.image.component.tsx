import React from 'react';
import { StyleSheet } from 'react-native';
import AddIcon from '../../../assets/icons/matchapp_add_picture.svg';
import PersonIcon from '../../../assets/icons/matchapp_ic_account_circle.svg';
import { appStyles } from '../../style/appStyle';
import { TouchableOpacity } from 'react-native-ui-lib';

const ADD_ICON_SIZE = 30;
const PERSON_ICON_SIZE = 50;

interface ProfileGridAddImageProps {
  onPress?: () => void;
  width?: number;
}

const ProfileGridAddImage = ({ onPress, width }: ProfileGridAddImageProps) => {
  return (
    <TouchableOpacity style={{ ...styles.container, width }} onPress={onPress}>
      <PersonIcon width={PERSON_ICON_SIZE} height={PERSON_ICON_SIZE} />
      <AddIcon
        style={styles.addIcon}
        width={ADD_ICON_SIZE}
        height={ADD_ICON_SIZE}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addIcon: {
    bottom: 8,
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: appStyles.borderRadius,
    height: 175,
    justifyContent: 'center',
    maxWidth: 115,
  },
});

export default ProfileGridAddImage;
