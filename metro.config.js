const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    blockList: [
      /.*\/android\/\.gradle\/.*/,
      /.*\/node_modules\/.*\.gradle\/.*/,
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
