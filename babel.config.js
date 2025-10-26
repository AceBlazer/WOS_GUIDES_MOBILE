module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        blacklist: null,
        whitelist: null,
        blocklist: null,
        allowlist: null,
      },
    ],
  ],
};
