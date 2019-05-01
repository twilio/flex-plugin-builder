const readPkg = require('read-pkg');
const path = require('path');

module.exports = {
     configure: (config, context) => {
          //do stuff with the webpack config...
          const pkg = readPkg.sync();

          // node_modules/@twilio/flex-ui/package.json
          const installedFlexUIPkg = readPkg.sync({cwd: path.join(process.cwd(), 'node_modules', '@twilio/flex-ui')});
          const TWILIO_FLEX_VERSION = installedFlexUIPkg.version;

          config.output.filename = `${pkg.name}.js`;
          config.output.chunkFilename = `[name].chunk.js`;
          config.plugins = config.plugins.filter(plugin =>
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
               'react-redux': 'ReactRedux',
          };

          config.optimization.splitChunks = false;
          config.optimization.runtimeChunk = false;

          return config;
     }
};
