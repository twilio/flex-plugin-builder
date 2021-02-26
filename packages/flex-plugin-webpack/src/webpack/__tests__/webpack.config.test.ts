import * as webpack from 'webpack';
import { Environment } from 'flex-dev-utils/dist/env';
import DotenvWebpackPlugin from 'dotenv-webpack';
import * as fs from 'flex-dev-utils/dist/fs';

import * as webpackConfig from '../webpack.config';
import { WebpackType } from '../..';

jest.mock('flex-dev-utils/dist/fs');
jest.mock('dotenv-webpack');

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

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
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
      // @ts-ignore
      jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
      jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({});
      jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const configProd = webpackConfig._getJavaScriptConfiguration({}, Environment.Production);
      const configDev = webpackConfig._getJavaScriptConfiguration({}, Environment.Development);

      expect(configProd.devtool).toEqual('hidden-source-map');
      expect(configDev.devtool).toEqual('source-map');
    });

    it('should get production config', () => {
      // @ts-ignore
      jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
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
      // @ts-ignore
      jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
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
  });

  describe('_getBasePlugins', () => {
    beforeEach(() => {
      // @ts-ignore
      DotenvWebpackPlugin.mockReset();
    });

    it('should not set DotenvWebpackPlugin if no .env file is found', () => {
      hasEnvFile.mockReturnValue(false);
      const config = webpackConfig._getBase(Environment.Development);

      const plugins = config.plugins || [];
      const plugin = plugins.find((p) => p.constructor.name === DotenvWebpackPlugin.name);

      expect(plugin).toBeUndefined();
      expect(DotenvWebpackPlugin).not.toHaveBeenCalled();
    });

    it('should set DotenvWebpackPlugin with no .example or .defaults files', () => {
      hasEnvFile.mockReturnValue(true);
      hasEnvExampleFile.mockReturnValue(false);
      hasEnvDefaultsPath.mockReturnValue(false);
      const config = webpackConfig._getBase(Environment.Development);

      const plugins = config.plugins || [];
      const plugin = plugins.find((p) => p.constructor.name === DotenvWebpackPlugin.name);

      expect(plugin).toBeDefined();
      expect(DotenvWebpackPlugin).toHaveBeenCalledTimes(1);
      expect(DotenvWebpackPlugin).toHaveBeenCalledWith({ safe: false, defaults: false });
    });

    it('should set DotenvWebpackPlugin with .example but no .defaults files', () => {
      hasEnvFile.mockReturnValue(true);
      hasEnvExampleFile.mockReturnValue(true);
      hasEnvDefaultsPath.mockReturnValue(false);
      const config = webpackConfig._getBase(Environment.Development);

      const plugins = config.plugins || [];
      const plugin = plugins.find((p) => p.constructor.name === DotenvWebpackPlugin.name);

      expect(plugin).toBeDefined();
      expect(DotenvWebpackPlugin).toHaveBeenCalledTimes(1);
      expect(DotenvWebpackPlugin).toHaveBeenCalledWith({ safe: true, defaults: false });
    });

    it('should set DotenvWebpackPlugin with .example and .defaults files', () => {
      hasEnvFile.mockReturnValue(true);
      hasEnvExampleFile.mockReturnValue(true);
      hasEnvDefaultsPath.mockReturnValue(true);
      const config = webpackConfig._getBase(Environment.Development);

      const plugins = config.plugins || [];
      const plugin = plugins.find((p) => p.constructor.name === DotenvWebpackPlugin.name);

      expect(plugin).toBeDefined();
      expect(DotenvWebpackPlugin).toHaveBeenCalledTimes(1);
      expect(DotenvWebpackPlugin).toHaveBeenCalledWith({ safe: true, defaults: true });
    });
  });
});
