import * as fsScripts from 'flex-dev-utils/dist/fs';

import * as testScripts from '../test';
import * as innerTestScript from '../test/test';
import * as prints from '../../prints';

jest.mock('flex-dev-utils/dist/logger/lib/logger');
jest.mock('flex-dev-utils/dist/env');
jest.mock('../../prints/jestNotInstalled');

describe('TestScript', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetAllMocks();
  });

  describe('default', () => {
    it('should call inner test script', async () => {
      const _validateJest = jest.spyOn(testScripts, '_validateJest').mockReturnThis();
      const _parseArgs = jest.spyOn(testScripts, '_parseArgs').mockReturnValue({
        jestEnv: 'test-env',
        cleanArgs: ['arg1', 'arg2'],
      });
      const test = jest.spyOn(innerTestScript, 'default').mockReturnThis();

      await testScripts.default('argA', 'argB');

      expect(_validateJest).toHaveBeenCalledTimes(1);
      expect(_parseArgs).toHaveBeenCalledTimes(1);
      expect(_parseArgs).toHaveBeenCalledWith('argA', 'argB');
      expect(test).toHaveBeenCalledTimes(1);
      expect(test).toHaveBeenCalledWith('test-env', 'arg1', 'arg2');

      _validateJest.mockRestore();
      _parseArgs.mockRestore();
    });
  });

  describe('_parseArgs', () => {
    it('should return default env and other args', () => {
      const { jestEnv, cleanArgs } = testScripts._parseArgs('arg1', 'arg2');

      expect(jestEnv).toEqual(testScripts.DEFAULT_JEST_ENV);
      expect(cleanArgs).toEqual(['arg1', 'arg2']);
    });

    it('should return passed env as --env foo', () => {
      const { jestEnv, cleanArgs } = testScripts._parseArgs('arg1', '--env', 'foo', 'arg2');

      expect(jestEnv).toEqual('foo');
      expect(cleanArgs).toEqual(['arg1', 'arg2']);
    });

    it('should return passed env as --env=foo', () => {
      const { jestEnv, cleanArgs } = testScripts._parseArgs('arg1', '--env=foo', 'arg2');

      expect(jestEnv).toEqual('foo');
      expect(cleanArgs).toEqual(['arg1', 'arg2']);
    });
  });

  describe('_validateJest', () => {
    const paths = {
      app: {
        jestConfigPath: 'jest/config/path',
      },
    };
    const checkFilesExist = jest.spyOn(fsScripts, 'checkFilesExist');
    const resolveModulePath = jest.spyOn(fsScripts, 'resolveModulePath');

    // @ts-ignore
    const exit = jest.spyOn(process, 'exit').mockReturnThis(() => {
      /* no-op */
    });

    beforeEach(() => {
      // @ts-ignore
      jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);
    });

    it('should not check anything if no jestConfig exists', () => {
      checkFilesExist.mockReturnValue(false);

      testScripts._validateJest();

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
    });

    it('should warn if jest is not installed', () => {
      checkFilesExist.mockReturnValue(true);
      resolveModulePath.mockReturnValue(false);

      testScripts._validateJest();

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(prints.jestNotInstalled).toHaveBeenCalledTimes(1);
    });

    it('should not warn about anything', () => {
      checkFilesExist.mockReturnValue(true);
      resolveModulePath.mockReturnValue('some-path');

      testScripts._validateJest();

      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(prints.jestNotInstalled).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
    });
  });
});
