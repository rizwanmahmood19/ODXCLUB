import { StyleSheet } from 'react-native';
import { appFont } from '../../style/appFont';
import { appColors } from '../../style/appColors';

const styles = StyleSheet.create({
  boldFont: {
    fontFamily: appFont.bold,
    fontWeight: 'bold',
  },
  centeredText: {
    textAlign: 'center',
  },
  container: {
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    paddingBottom: 21,
    paddingTop: 50,
  },
  errorContainer: { marginBottom: 8, width: '80%' },
  errorSignIn: { marginBottom: 12, marginTop: 25, width: '80%' },
  errorSignUp: { marginBottom: 12, marginTop: 12, width: '80%' },
  link: {
    backgroundColor: 'white',
    fontFamily: appFont.medium,
    fontSize: 15,
    textAlign: 'center',
  },
  logo: {
    height: 107,
    marginBottom: 47,
    width: 107,
  },
  primaryColor: {
    color: appColors.primary,
  },
  screen: {
    backgroundColor: 'white',
  },
  signUpLink: {
    textAlign: 'center',
  },
  space_l: {
    marginBottom: 24,
  },
  space_m: {
    marginBottom: 12,
  },
  space_s: {
    marginBottom: 8,
  },
  text80: {
    textAlign: 'center',
    width: '80%',
  },
  text80left: {
    textAlign: 'left',
    width: '80%',
  },
  textField: {
    alignItems: 'center',
    fontSize: 16,
    width: '80%',
  },
});

export default styles;
