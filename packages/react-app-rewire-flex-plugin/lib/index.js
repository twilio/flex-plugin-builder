/* config-overrides.js */
const removeWebpackPlugins = require('react-app-rewire-unplug');
const readPkg = require('read-pkg');
const rewireUglifyjs = require('react-app-rewire-uglifyjs');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

process.env.PORT = process.env.PORT || 8080;

function overrideWebpack(config, env) {
  //do stuff with the webpack config...
  const pkg = readPkg.sync();
  const TWILIO_FLEX_VERSION = pkg.devDependencies['@twilio/flex-ui'].replace(
    '^',
    ''
  );

  config = rewireUglifyjs(config);

  config.output.filename = `${pkg.name}.js`;
  config.output.chunkFilename = '[name].chunk.js';
  config.plugins = config.plugins.filter(
    plugin =>
      !['SWPrecacheWebpackPlugin', 'ManifestPlugin'].includes(
        plugin.constructor.name
      )
  );
  config.plugins.forEach(plugin => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.inject = false;
      plugin.options.hash = false;
      return;
    }

    if (plugin.constructor.name === 'InterpolateHtmlPlugin') {
      plugin.replacements = {
        ...plugin.replacements,
        TWILIO_FLEX_VERSION,
      };
    }
  });


  config.resolve.alias = {
    ...config.resolve.alias,
    '@twilio/flex-ui': 'flex-plugin/dev_assets/flex-shim.js',
  };

  config.externals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'redux': 'Redux',
    'react-redux': 'ReactRedux'
  };

  return config;
}

function overrideDevServer(configFunction) {
  // Return the replacement function for create-react-app to use to generate the Webpack
  // Development Server config. "configFunction" is the function that would normally have
  // been used to generate the Webpack Development server config - you can use it to create
  // a starting configuration to then modify instead of having to create a config from scratch.
  return function (proxy, allowedHost) {
    // Create the default config by calling configFunction with the proxy/allowedHost parameters
    const config = configFunction(proxy, allowedHost);

    config.contentBase = [
      config.contentBase,
      path.join(process.cwd(), 'node_modules', 'flex-plugin', 'dev_assets'),
    ];
    // Return your customised Webpack Development Server config.
    return config;
  };
}

module.exports = {
  webpack: overrideWebpack,
  devServer: overrideDevServer,
};
