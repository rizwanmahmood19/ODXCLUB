import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/app.component';
import './src/style/appStyle';
import * as Sentry from '@sentry/react-native';
import env from './env.json';

if (env && env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
  });
}

AppRegistry.registerComponent(appName, () => App);

export default App;
