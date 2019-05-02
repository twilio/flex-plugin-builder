const path = require('path');

module.exports = (config, { env, paths, proxy, allowedHost }) => {
  config.contentBase = [
    config.contentBase,
    path.join(process.cwd(), 'node_modules', 'flex-plugin', 'dev_assets'),
  ];

  return config;
};
