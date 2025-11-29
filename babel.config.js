// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],         // <- обязательно
          alias: {
            "@": "./src",
            "@shared": "./src/shared",
            "@widgets": "./src/widgets",
            "@entities": "./src/entities",
            "@features": "./src/features",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx"]
        }
      ],
      // если используешь react-native-reanimated — раскомментируй ниже и помести ПОСЛЕДНИМ
      // "react-native-reanimated/plugin",
    ],
  };
};
