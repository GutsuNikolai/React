// babel.config.js (корень проекта)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // нужен expo-router
      "expo-router/babel",
      // алиасы под src/*
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src",
            "@shared": "./src/shared",
            "@widgets": "./src/widgets",
            "@entities": "./src/entities",
            "@features": "./src/features"
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
        }
      ]
    ]
  };
};
