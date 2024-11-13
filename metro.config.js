/**
 * Metro Bundler configuration
 * https://facebook.github.io/metro/docs/en/configuration
 *
 */

const { getDefaultConfig } = require('metro-config');

const blacklist = require('metro-config/src/defaults/exclusionList');
const path = require('path');

async function getConfig(appDir, options = {}) {
  const watchFolders = [
    path.resolve(appDir),
    path.resolve(appDir, '../../', 'node_modules'),
    path.resolve(appDir, '../../', 'packages', 'shared'),
  ];
  console.log('watchFolders:', watchFolders);

  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    projectRoot: path.resolve(__dirname, '.'),
    watchFolders,
    resolver: {
      blacklistRE: blacklist([
        /node_modules\/.*\/node_modules\/react-native\/.*/,
      ]),
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => {
            return path.join(__dirname, `node_modules/${name}`);
          },
        },
      ),
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resetCache: true,
  };
}

module.exports = getConfig(__dirname);
