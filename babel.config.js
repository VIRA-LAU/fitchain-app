module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["./src"],
          alias: {
            src: "./src",
            utils: "./src/utils",
            screens: "./src/screens",
            components: "./src/components",
            assets: "./src/assets",
            navigation: "./src/navigation",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@dotenv",
          path: ".env.local",
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
