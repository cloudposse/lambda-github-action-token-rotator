const { merge } = require("webpack-merge");

module.exports = (config, _context) => {
  let newCfg = merge(config, {
    module: {
      rules: [
        // This is needed because octokit ships with a "module" (web entrypoint) defined in their package.json, which
        // does not load crypto and webpack prefers "module" over "main" if both are defined, even in node environments.
        //
        // See for more info: https://github.com/webpack/webpack/issues/5756
        {
          test: /node_modules\/@octokit?/,
          resolve: {
            mainFields: ["main"],
          },
        },
      ],
    },
    externals: {
      "aws-crt": "aws-crt",
    },
  });

  return newCfg;
};
