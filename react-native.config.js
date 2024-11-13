const path = require('path');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: path.join(
            __dirname,
            'node_modules//react-native-video/android-exoplayer',
          ),
        },
      },
    },
  },
  assets: ['./assets/fonts/'],
};
