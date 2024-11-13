import { Dimensions, StyleSheet } from 'react-native';
import { appFont } from '../../style/appFont';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  bold: {
    fontFamily: appFont.black,
  },
  button: {
    marginVertical: '5%',
    width: 250,
  },
  subtitle: {
    color: 'white',
    fontFamily: appFont.black,
    lineHeight: 32,
    paddingBottom: 5,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: SCREEN_HEIGHT < 670 ? 14 : 16,
    lineHeight: SCREEN_HEIGHT < 670 ? 21 : 24,
    textAlign: 'center',
  },
});

export default styles;
