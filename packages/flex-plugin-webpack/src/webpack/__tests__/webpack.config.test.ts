import * as webpack from 'webpack';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import * as fs from '@twilio/flex-dev-utils/dist/fs';

import * as webpackConfig from '../webpack.config';
import * as clientVariables from '../clientVariables';
import { WebpackType } from '../..';

jest.mock('@twilio/flex-dev-utils/dist/fs');
jest.mock('webpack/lib/DefinePlugin');

describe('WebpackConfiguration', () => {
  const isTSProject = jest.fn();
  const hasEnvFile = jest.fn();
  const hasEnvExampleFile = jest.fn();
  const hasEnvDefaultsPath = jest.fn();
  const paths = {
    webpack: {
      nodeModulesDir: 'webpack/node_modules',
    },
    app: {
      name: 'test',
      version: '1.2.3',
      buildDir: 'the/build/dir',
      publicDir: 'the/public/dir',
      isTSProject,
      hasEnvFile,
      hasEnvExampleFile,
      hasEnvDefaultsPath,
    },
    extensions: [],
    scripts: {
      nodeModulesDir: 'the/scripts/node_modules',
    },
    cli: {
      nodeModulesDir: 'cli/node_modules',
    },
  };
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };

    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
  });

  describe('default', () => {
    it('should get static config', () => {
      const _getBase = jest.spyOn(webpackConfig, '_getBase').mockReturnThis();
      const _getStaticConfiguration = jest.spyOn(webpackConfig, '_getStaticConfiguration').mockReturnThis();
      const _getJavaScriptConfiguration = jest.spyOn(webpackConfig, '_getJavaScriptConfiguration').mockReturnThis();

      webpackConfig.default(Environment.Development, WebpackType.Static);

      expect(_getBase).toHaveBeenCalledTimes(1);
      expect(_getStaticConfiguration).toHaveBeenCalledTimes(1);
      expect(_getJavaScriptConfiguration).not.toHaveBeenCalled();
    });

    it('should get js config', () => {
      const _getBase = jest.spyOn(webpackConfig, '_getBase').mockReturnThis();
      const _getStaticConfiguration = jest.spyOn(webpackConfig, '_getStaticConfiguration').mockReturnThis();
      const _getJavaScriptConfiguration = jest.spyOn(webpackConfig, '_getJavaScriptConfiguration').mockReturnThis();

      webpackConfig.default(Environment.Development, WebpackType.JavaScript);

      expect(_getBase).toHaveBeenCalledTimes(1);
      expect(_getStaticConfiguration).not.toHaveBeenCalled();
      expect(_getJavaScriptConfiguration).toHaveBeenCalledTimes(1);
    });

    it('should get all config', () => {
      const _getBase = jest.spyOn(webpackConfig, '_getBase').mockReturnThis();
      const _getStaticConfiguration = jest.spyOn(webpackConfig, '_getStaticConfiguration').mockReturnThis();
      const _getJavaScriptConfiguration = jest.spyOn(webpackConfig, '_getJavaScriptConfiguration').mockReturnThis();

      webpackConfig.default(Environment.Development, WebpackType.Complete);

      expect(_getBase).toHaveBeenCalledTimes(1);
      expect(_getStaticConfiguration).toHaveBeenCalledTimes(1);
      expect(_getJavaScriptConfiguration).toHaveBeenCalledTimes(1);
    });
  });

  describe('_getJavaScriptConfiguration', () => {
    it('should test devtool field', () => {
      jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({});
      jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const configProd = webpackConfig._getJavaScriptConfiguration({}, Environment.Production);
      const configDev = webpackConfig._getJavaScriptConfiguration({}, Environment.Development);

      expect(configProd.devtool).toEqual('hidden-source-map');
      expect(configDev.devtool).toEqual('source-map');
    });

    it('should get production config', () => {
      const _getJavaScriptEntries = jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      const _getOptimization = jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({});
      const _getJSPlugins = jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const config = webpackConfig._getJavaScriptConfiguration({}, Environment.Production);
      const output = config.output as webpack.Output;

      expect(output.path).toEqual(paths.app.buildDir);
      expect(output.filename).toEqual(`${paths.app.name}.js`);
      expect(output.publicPath).toEqual(paths.app.publicDir);
      expect(output.pathinfo).toEqual(false);
      expect(config.bail).toEqual(true);

      expect(_getJavaScriptEntries).toHaveBeenCalledTimes(1);
      expect(_getOptimization).toHaveBeenCalledTimes(1);
      expect(_getJSPlugins).toHaveBeenCalledTimes(1);
    });

    it('should get development config', () => {
      const _getJavaScriptEntries = jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      const _getOptimization = jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({});
      const _getJSPlugins = jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const config = webpackConfig._getJavaScriptConfiguration({}, Environment.Development);
      const output = config.output as webpack.Output;

      expect(output.path).toEqual(paths.app.buildDir);
      expect(output.filename).toEqual(`plugins/${paths.app.name}.js`);
      expect(output.publicPath).toEqual(paths.app.publicDir);
      expect(output.pathinfo).toEqual(true);
      expect(config.bail).toEqual(false);

      expect(_getJavaScriptEntries).toHaveBeenCalledTimes(1);
      expect(_getOptimization).toHaveBeenCalledTimes(1);
      expect(_getJSPlugins).toHaveBeenCalledTimes(1);
    });
  });

  describe('_getJSScripts', () => {
    it('should return flex-ui only', () => {
      const scripts = webpackConfig._getJSScripts('1.18.0', '', '');

      expect(scripts).toHaveLength(1);
      expect(scripts[0]).toContain('flex-ui');
      expect(scripts[0]).toContain('1.18.0');
      expect(scripts[0]).toContain('twilio-flex.min.js');
    });

    it('should return flex-ui and react/dom', () => {
      const scripts = webpackConfig._getJSScripts('1.19.0', '16.13.1', '16.12.1');

      expect(scripts).toHaveLength(3);
      expect(scripts[0]).toContain('umd/react.development');
      expect(scripts[0]).toContain('16.13.1');
      expect(scripts[1]).toContain('umd/react-dom.development');
      expect(scripts[1]).toContain('16.12.1');
      expect(scripts[2]).toContain('flex-ui');
      expect(scripts[2]).toContain('1.19.0');
      expect(scripts[2]).toContain('twilio-flex.unbundled-react.min.js');
    });

    it('should overwrite flex-ui if --flex-ui-source is provided', () => {
      process.env.FLEX_UI_SRC = 'http://localhost:8080/twilio-flex-ui.dev.browser.js';
      const scripts = webpackConfig._getJSScripts('1.19.0', '16.13.1', '16.12.1');

      expect(scripts).toHaveLength(3);
      expect(scripts[0]).toContain('umd/react.development');
      expect(scripts[0]).toContain('16.13.1');
      expect(scripts[1]).toContain('umd/react-dom.development');
      expect(scripts[1]).toContain('16.12.1');
      expect(scripts[2]).toContain('localhost:8080');
    });

    it('should overwrite flex-ui even if flex-ui is < 1.19.0', () => {
      process.env.FLEX_UI_SRC = 'http://localhost:8080/twilio-flex-ui.dev.browser.js';
      const scripts = webpackConfig._getJSScripts('1.18.0', '', '');

      expect(scripts).toHaveLength(1);
      expect(scripts[0]).toContain('localhost:8080');
    });
  });

  describe('_getBasePlugins', () => {
    const depVersions = {
      '@twilio/flex-plugin-scripts': '1.0.0',
      '@twilio/flex-plugin': '1.1.0',
      '@twilio/flex-ui': '1.2.0',
      react: '1.3.0',
      'react-dom': '1.4.0',
    };

    const mockGetDependencyVersion = () => {
      jest.spyOn(fs, 'getDependencyVersion').mockImplementation((name) => depVersions[name]);
    };
    const verifyInternalDefinition = () => {
      expect(webpack.DefinePlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          __FPB_PLUGIN_UNIQUE_NAME: `'${paths.app.name}'`,
          __FPB_PLUGIN_VERSION: `'${paths.app.version}'`,
          __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: `'${depVersions['@twilio/flex-plugin-scripts']}'`,
          __FPB_FLEX_PLUGIN_VERSION: `'${depVersions['@twilio/flex-plugin']}'`,
          __FPB_FLEX_UI_VERSION: `'${depVersions['@twilio/flex-ui']}'`,
          __FPB_REACT_VERSION: `'${depVersions.react}'`,
          __FPB_REACT_DOM_VERSION: `'${depVersions['react-dom']}'`,
          __FPB_CRACO_CONFIG_FLEX_PLUGIN_VERSION: `'N/A'`,
        }),
      );
    };

    beforeEach(() => {
      // @ts-ignore
      webpack.DefinePlugin.mockReset();
    });

    it('should call DefinePlugin for internal definitions', () => {
      mockGetDependencyVersion();
      const plugins = webpackConfig._getBasePlugins(Environment.Development);

      expect(webpack.DefinePlugin).toHaveBeenCalledTimes(1);
      verifyInternalDefinition();

      const plugin = plugins.find((p) => p.constructor.name === webpack.DefinePlugin.name);
      expect(plugin).toBeDefined();
    });

    it('should add client variables', () => {
      const variables = {
        sample: 'variable',
        test: 'name',
      };
      mockGetDependencyVersion();
      jest.spyOn(clientVariables, 'getSanitizedProcessEnv').mockReturnValue({ 'process.env': variables });

      const plugins = webpackConfig._getBasePlugins(Environment.Development);

      expect(webpack.DefinePlugin).toHaveBeenCalledTimes(1);
      expect(webpack.DefinePlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          'process.env': variables,
        }),
      );
      verifyInternalDefinition();

      const plugin = plugins.find((p) => p.constructor.name === webpack.DefinePlugin.name);
      expect(plugin).toBeDefined();
    });
  });

  describe('_getStaticConfiguration', () => {
    it('should add static plugins', () => {
      jest.spyOn(webpackConfig, '_getStaticPlugins').mockReturnValue([]);
      webpackConfig._getStaticConfiguration({}, Environment.Development);

      expect(webpackConfig._getStaticPlugins).toHaveBeenCalledTimes(1);
      expect(webpackConfig._getStaticPlugins).toHaveBeenCalledWith(Environment.Development);
    });
  });
});
