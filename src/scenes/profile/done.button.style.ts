import { StyleSheet } from 'react-native';

import { appFont } from '../../style/appFont';
import { appColors } from '../../style/appColors';

export const doneButtonStyles = StyleSheet.create({
  doneButton: {
    height: 44,
    paddingLeft: 10,
    paddingTop: 10,
    position: 'absolute',
    right: 16,
    top: 10,
    width: 64,
    zIndex: 3,
  },
  doneButtonActive: {
    color: appColors.primary,
  },
  doneButtonInActive: {
    color: appColors.mediumGrey,
  },
  leftButtonText: {
    fontFamily: appFont.regular,
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  text: {
    fontFamily: appFont.regular,
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'right',
  },
});
