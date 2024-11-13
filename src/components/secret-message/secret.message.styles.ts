import { StyleSheet } from 'react-native';

import { appFont } from '../../style/appFont';

export const secretMessageStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  headline: {
    color: 'white',
    fontFamily: appFont.black,
    fontSize: 25,
    letterSpacing: -0.5,
    lineHeight: 31,
  },
  infoText: {
    color: 'white',
    fontFamily: appFont.regular,
    paddingTop: 6,
    textAlign: 'center',
  },
  readSecretMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
    width: '92%',
  },
  textContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingLeft: '10%',
    paddingRight: '10%',
    zIndex: 0,
  },
});
