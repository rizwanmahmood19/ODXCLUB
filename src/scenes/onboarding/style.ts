import { StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  content: { alignItems: 'center', flex: 1, zIndex: 1 },
  continueButton: {
    width: '100%',
  },
  continueContainer: {
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    width: '100%',
  },
  continueHintText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    borderColor: appColors.secondary,
  },
  errorContainer: {
    width: '100%',
  },
  errorFinish: {
    marginHorizontal: 16,
  },
  errorTextContainer: {
    marginBottom: 8,
  },
  errorTitle: {
    color: appColors.secondary,
  },
  flexOne: {
    flex: 1,
  },
  fullWidht: {
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
  },
  keyboardAware: {
    width: '100%',
  },
  logo: {
    height: 113,
    marginBottom: 36,
    marginTop: 24,
    width: 113,
  },
  paddingTopZero: {
    paddingTop: 0,
  },
  screen: {
    backgroundColor: 'white',
    flex: 1,
  },
  section: {
    marginBottom: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  sectionPictures: {
    marginBottom: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  sectionSearchSettings: {
    height: 50,
    marginBottom: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  splitTitle: {
    flexDirection: 'row',
  },
  title: {
    marginBottom: 5,
    marginTop: 0,
    width: '100%',
  },
  titleA: {
    flex: 0.8,
    fontFamily: appFont.semiBold,
    fontSize: 13,
  },
  titleRight: {
    flex: 0.2,
    fontFamily: appFont.semiBold,
    fontSize: 14,
    textAlign: 'right',
  },
});

export default styles;
