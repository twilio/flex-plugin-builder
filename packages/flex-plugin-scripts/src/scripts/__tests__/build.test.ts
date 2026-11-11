import env, { Environment } from '@twilio/flex-dev-utils/dist/env';
import * as fs from '@twilio/flex-dev-utils/dist/fs';
import { webpack } from '@twilio/flex-plugin-webpack';
import { webpack5 } from '@twilio/flex-plugin-webpack5';

import * as buildScript from '../build';
import * as configScripts from '../../config';
import * as prints from '../../prints';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('@twilio/flex-dev-utils/dist/env');
jest.mock('../../prints/buildSuccessful');
jest.mock('../../prints/buildFailure');
jest.mock('../../prints/fileTooLarge');
jest.mock('@twilio/flex-plugin-webpack', () => ({
  ...jest.requireActual('@twilio/flex-plugin-webpack'),
  webpack: jest.fn(),
}));
jest.mock('@twilio/flex-plugin-webpack5', () => ({
  ...jest.requireActual('@twilio/flex-plugin-webpack5'),
  webpack5: jest.fn(),
}));

describe('BuildScript', () => {
  const paths = {
    app: {
      bundlePath: '/bundle/path/file.js',
      sourceMapPath: '/source/map/path/file.js',
    },
  };

  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockReturnThis(() => {
    /* no-op */
  });
  const bundle: buildScript.Bundle = {
    name: 'test-bundle',
    size: 12345,
  };
  const errorMsg = 'some-error';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetAllMocks();

    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
  });

  describe('default', () => {
    it('should build successfully', async () => {
      const getFileSizeInMB = jest.spyOn(fs, 'getFileSizeInMB').mockReturnValue(1);
      const updateAppVersion = jest.spyOn(fs, 'updateAppVersion').mockReturnThis();
      const _getBundle = jest.spyOn(buildScript, '_runWebpack').mockResolvedValue({ warnings: [], bundles: [bundle] });

      await buildScript.default();

      expect(env.setBabelEnv).toHaveBeenCalledTimes(1);
      expect(env.setBabelEnv).toHaveBeenCalledWith(Environment.Production);
      expect(env.setNodeEnv).toHaveBeenCalledTimes(1);
      expect(env.setNodeEnv).toHaveBeenCalledWith(Environment.Production);

      expect(getFileSizeInMB).toHaveBeenCalledTimes(2);
      expect(getFileSizeInMB).toHaveBeenCalledWith(paths.app.bundlePath);
      expect(getFileSizeInMB).toHaveBeenCalledWith(paths.app.sourceMapPath);
      expect(updateAppVersion).not.toHaveBeenCalled();
      expect(_getBundle).toHaveBeenCalledTimes(1);
      expect(prints.buildSuccessful).toHaveBeenCalledTimes(1);
      expect(prints.buildFailure).not.toHaveBeenCalled();
      expect(prints.fileTooLarge).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();

      _getBundle.mockRestore();
    });

    it('should exit if bundle size is too large', async () => {
      const getFileSizeInMB = jest.spyOn(fs, 'getFileSizeInMB').mockReturnValueOnce(100).mockReturnValue(5);
      const _getBundle = jest.spyOn(buildScript, '_runWebpack').mockResolvedValue({ warnings: [], bundles: [bundle] });

      await buildScript.default();

      expect(getFileSizeInMB).toHaveBeenCalledTimes(2);
      expect(getFileSizeInMB).toHaveBeenCalledWith(paths.app.bundlePath);
      expect(getFileSizeInMB).toHaveBeenCalledWith(paths.app.sourceMapPath);
      expect(prints.buildSuccessful).not.toHaveBeenCalledTimes(1);
      expect(prints.buildFailure).not.toHaveBeenCalled();
      expect(prints.fileTooLarge).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalled();

      _getBundle.mockRestore();
    });

    it('should exit if source map size is too large', async () => {
      const getFileSizeInMB = jest.spyOn(fs, 'getFileSizeInMB').mockReturnValueOnce(5).mockReturnValue(100);
      const _getBundle = jest.spyOn(buildScript, '_runWebpack').mockResolvedValue({ warnings: [], bundles: [bundle] });

      await buildScript.default();

      expect(getFileSizeInMB).toHaveBeenCalledTimes(2);
      expect(getFileSizeInMB).toHaveBeenCalledWith(paths.app.bundlePath);
      expect(getFileSizeInMB).toHaveBeenCalledWith(paths.app.sourceMapPath);
      expect(prints.buildSuccessful).not.toHaveBeenCalledTimes(1);
      expect(prints.buildFailure).not.toHaveBeenCalled();
      expect(prints.fileTooLarge).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalled();

      _getBundle.mockRestore();
    });

    it('should update appVersion if provided', async () => {
      const updateAppVersion = jest.spyOn(fs, 'updateAppVersion').mockReturnThis();
      const _getBundle = jest.spyOn(buildScript, '_runWebpack').mockResolvedValue({ warnings: [], bundles: [bundle] });

      await buildScript.default('--version', '1.2.3');

      expect(updateAppVersion).toHaveBeenCalledTimes(1);
      expect(updateAppVersion).toHaveBeenCalledWith('1.2.3');

      _getBundle.mockRestore();
    });

    it('should build with webpack 5 when --wp5 is passed', async () => {
      jest.spyOn(fs, 'getFileSizeInMB').mockReturnValue(1);
      const _runWebpack = jest.spyOn(buildScript, '_runWebpack');
      const _runWebpack5 = jest
        .spyOn(buildScript, '_runWebpack5')
        .mockResolvedValue({ warnings: [], bundles: [bundle] });

      await buildScript.default('--wp5');

      expect(_runWebpack5).toHaveBeenCalledTimes(1);
      expect(_runWebpack).not.toHaveBeenCalled();
      expect(prints.buildSuccessful).toHaveBeenCalledTimes(1);
      expect(prints.buildSuccessful).toHaveBeenCalledWith([bundle], []);
      expect(exit).not.toHaveBeenCalled();

      _runWebpack.mockRestore();
      _runWebpack5.mockRestore();
    });

    it('should fail to build', async () => {
      const _getBundle = jest.spyOn(buildScript, '_runWebpack').mockRejectedValue(errorMsg);

      await buildScript.default();
      expect(_getBundle).toHaveBeenCalledTimes(1);
      expect(prints.buildSuccessful).not.toHaveBeenCalled();
      expect(prints.buildFailure).toHaveBeenCalledTimes(1);
      expect(prints.buildFailure).toHaveBeenCalledWith(errorMsg);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);

      _getBundle.mockRestore();
    });
  });

  describe('_handler', () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    it('should reject on webpack error', async () => {
      const err = new Error('foo');
      // @ts-ignore
      await buildScript._handler(resolve, reject)(err, null);

      expect(reject).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledWith(err);
      expect(resolve).not.toHaveBeenCalled();
    });

    it('should reject on compile error', async () => {
      const toJson = jest.fn().mockReturnValue({ errors: errorMsg });
      const stats = {
        toJson,
        hasErrors: () => true,
      };

      // @ts-ignore
      await buildScript._handler(resolve, reject)(null, stats);

      expect(toJson).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledWith(errorMsg);
      expect(resolve).not.toHaveBeenCalled();
    });

    it('should compile successfully', async () => {
      const toJson = jest.fn().mockReturnValue({
        assets: [bundle],
        warnings: [],
      });
      const stats = {
        toJson,
        hasErrors: () => false,
      };

      // @ts-ignore
      await buildScript._handler(resolve, reject)(null, stats);

      expect(toJson).toHaveBeenCalledTimes(2);
      expect(reject).not.toHaveBeenCalled();
      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({
        bundles: [bundle],
        warnings: [],
      });
    });
  });
  describe('_flattenAssetsWp5', () => {
    it('should return assets unchanged when there are no related assets', () => {
      const assets = [bundle, { name: 'other', size: 1 }];

      expect(buildScript._flattenAssetsWp5(assets)).toEqual(assets);
    });

    it('should hoist related assets after their parent', () => {
      const sourceMap = { name: 'test-bundle.js.map', size: 1 };
      const other = { name: 'other', size: 2 };
      const assets = [{ ...bundle, related: [sourceMap] }, other];

      expect(buildScript._flattenAssetsWp5(assets)).toEqual([assets[0], sourceMap, other]);
    });
  });

  describe('_handlerWp5', () => {
    const resolve = jest.fn();
    const reject = jest.fn();

    it('should reject on webpack error', async () => {
      const err = new Error('foo');
      await buildScript._handlerWp5(resolve, reject)(err, null);

      expect(reject).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledWith(err);
      expect(resolve).not.toHaveBeenCalled();
    });

    it('should reject with the error messages on compile error', async () => {
      const toJson = jest.fn().mockReturnValue({ errors: [{ message: errorMsg }] });
      const stats = {
        toJson,
        hasErrors: () => true,
      };

      await buildScript._handlerWp5(resolve, reject)(null, stats);

      expect(toJson).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledTimes(1);
      expect(reject).toHaveBeenCalledWith([errorMsg]);
      expect(resolve).not.toHaveBeenCalled();
    });

    it('should compile successfully and flatten related assets', async () => {
      const sourceMap = { name: 'test-bundle.js.map', size: 1 };
      const asset = { ...bundle, related: [sourceMap] };
      const toJson = jest.fn().mockReturnValue({
        assets: [asset],
        warnings: [{ message: 'a-warning' }],
      });
      const stats = {
        toJson,
        hasErrors: () => false,
      };

      await buildScript._handlerWp5(resolve, reject)(null, stats);

      expect(toJson).toHaveBeenCalledTimes(2);
      expect(reject).not.toHaveBeenCalled();
      expect(resolve).toHaveBeenCalledTimes(1);
      expect(resolve).toHaveBeenCalledWith({
        bundles: [asset, sourceMap],
        warnings: ['a-warning'],
      });
    });
  });

  describe('_runWebpack', () => {
    // Built per test: the top-level beforeEach resets every mock, including toJson
    const getStats = () => ({
      toJson: jest.fn().mockReturnValue({ assets: [bundle], warnings: [] }),
      hasErrors: () => false,
    });

    it('should run webpack with the production configuration', async () => {
      const config = {};
      const getConfiguration = jest.spyOn(configScripts, 'default').mockResolvedValue(config);
      const stats = getStats();
      const run = jest.fn((cb) => cb(null, stats));
      (webpack as unknown as jest.Mock).mockReturnValue({ run });

      const result = await buildScript._runWebpack();

      expect(getConfiguration).toHaveBeenCalledWith(
        configScripts.ConfigurationType.Webpack,
        Environment.Production,
        false,
      );
      expect(webpack).toHaveBeenCalledWith(config);
      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ bundles: [bundle], warnings: [] });

      getConfiguration.mockRestore();
    });

    it('should run webpack 5 with the production configuration', async () => {
      const config = {};
      const getConfigurationForWp5 = jest.spyOn(configScripts, 'getConfigurationForWp5').mockResolvedValue(config);
      const stats = getStats();
      const run = jest.fn((cb) => cb(null, stats));
      (webpack5 as unknown as jest.Mock).mockReturnValue({ run });

      const result = await buildScript._runWebpack5();

      expect(getConfigurationForWp5).toHaveBeenCalledWith(
        configScripts.ConfigurationType.Webpack,
        Environment.Production,
        false,
      );
      expect(webpack5).toHaveBeenCalledWith(config);
      expect(run).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ bundles: [bundle], warnings: [] });

      getConfigurationForWp5.mockRestore();
    });
  });
});
