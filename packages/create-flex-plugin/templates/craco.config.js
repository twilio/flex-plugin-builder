const config = require('craco-config-flex-plugin');

module.exports = {
  ...config,
  plugins: [
    // Customize app configuration (such as webpack, devServer, linter, etc) by creating a craco plugin.
    // See https://github.com/sharegate/craco/tree/master/packages/craco#develop-a-plugin for more detail.
    //
    // Please note that craco plugins have nothing to do with flex plugins, just a naming coincidence.
    // Changes to this file are optional, you will not need to modify it for normal Flex Plugin development.
  ]
};
