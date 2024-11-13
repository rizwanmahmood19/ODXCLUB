console.log('jest config loaded');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  preset: 'react-native',
  modulePathIgnorePatterns: ['<rootDir>/__tests__/scenes/profile/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    // '@stream-io/styled-components':
    //   '<rootDir>/node_modules/@stream-io/styled-components/native/dist/styled-components.native.cjs.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|react-navigation|react-native-push-notification/component|react-native-push-notification|react-native-animatable|react-native-localization|stream-chat-react-native|stream-chat-react-native-core|react-native-localize|lodash-es|@react-native-community/datetimepicker)',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jestSetupFile.js',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
