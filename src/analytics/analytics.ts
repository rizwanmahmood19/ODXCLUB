import analytics from '@react-native-firebase/analytics';

const logEvent = (
  name: string,
  params?: undefined | { [key: string]: any },
): Promise<void> => {
  return analytics().logEvent(name, params);
};

export default logEvent;
