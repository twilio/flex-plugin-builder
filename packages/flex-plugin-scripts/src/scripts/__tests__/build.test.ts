import env, { Environment } from '@twilio/flex-dev-utils/dist/env';
import * as fs from '@twilio/flex-dev-utils/dist/fs';

import * as buildScript from '../build';
import * as prints from '../../prints';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('@twilio/flex-dev-utils/dist/env');
jest.mock('../../prints/buildSuccessful');
jest.mock('../../prints/buildFailure');
jest.mock('../../prints/fileTooLarge');

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
  const errorMsg = [{ message: 'some-error' }];

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
      expect(reject).toHaveBeenCalledWith([errorMsg[0].message]);
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
});
