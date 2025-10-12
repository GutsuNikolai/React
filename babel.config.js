// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          // ВАЖНО: корень — только src, а не "."
          root: ["./src"],
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
      // если используешь reanimated, добавь его последним:
      // "react-native-reanimated/plugin",
    ],
  };
};
