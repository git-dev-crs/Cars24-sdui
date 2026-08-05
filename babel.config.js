module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@components': './src/components',
          '@renderer': './src/renderer',
          '@registry': './src/registry',
          '@screens': './src/screens',
          '@types': './src/types',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@json': './src/json'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
