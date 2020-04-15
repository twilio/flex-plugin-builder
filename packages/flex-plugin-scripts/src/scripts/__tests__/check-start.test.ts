import fs from 'fs';
import { join } from 'path';

import * as requireScripts from 'flex-dev-utils/dist/require';
import * as fsScripts from 'flex-dev-utils/dist/fs';
import * as prints from '../../prints';
import * as checkStartScript from '../check-start';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('../../prints/versionMismatch');
jest.mock('../../prints/appConfigMissing');
jest.mock('../../prints/publicDirCopyFailed');
jest.mock('../../prints/expectedDependencyNotFound');
jest.mock('../../prints/typescriptNotInstalled');

// tslint:disable-next-line
const lernaVersion = require(join(process.cwd(), 'node_modules/lerna/package.json')).version;

describe('check-start', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  describe('main', () => {
    const _checkAppConfig = jest
      .spyOn(checkStartScript, '_checkAppConfig')
      .mockReturnThis();
    const _checkPublicDirSync = jest
      .spyOn(checkStartScript, '_checkPublicDirSync')
      .mockReturnThis();
    const _checkExternalDepsVersions = jest
      .spyOn(checkStartScript, '_checkExternalDepsVersions')
      .mockReturnThis();
    const _validateTypescriptProject = jest
      .spyOn(checkStartScript, '_validateTypescriptProject')
      .mockReturnThis();

    beforeEach(() => {
      _checkAppConfig.mockReset();
      _checkPublicDirSync.mockReset();
      _checkExternalDepsVersions.mockReset();
      _validateTypescriptProject.mockReset();
    });

    afterAll(() => {
      _checkAppConfig.mockRestore();
      _checkPublicDirSync.mockRestore();
      _checkExternalDepsVersions.mockRestore();
      _validateTypescriptProject.mockRestore();
    });

    const expectCalled = (allowSkip: boolean) => {
      expect(_checkAppConfig).toHaveBeenCalledTimes(1);
      expect(_checkPublicDirSync).toHaveBeenCalledTimes(1);
      expect(_checkExternalDepsVersions).toHaveBeenCalledTimes(1);
      expect(_validateTypescriptProject).toHaveBeenCalledTimes(1);
      expect(_checkExternalDepsVersions).toHaveBeenCalledWith(allowSkip);
    };

    it('should call all methods', async () => {
      await checkStartScript.default();

      expectCalled(false);
    });

    it('should call all methods and allow skip', async () => {
      process.env.SKIP_PREFLIGHT_CHECK = 'true';
      await checkStartScript.default();

      expectCalled(true);
    });
  });

  describe('_checkAppConfig', () => {
    it('quit if no appConfig is found', () => {
      const existSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(false);

      checkStartScript._checkAppConfig();

      expect(existSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledWith(expect.stringContaining('appConfig.js'));
      expect(prints.appConfigMissing).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);

      existSync.mockRestore();
    });

    it('not quit if appConfig is found', () => {
      const existSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(true);

      checkStartScript._checkAppConfig();

      expect(existSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledWith(expect.stringContaining('appConfig.js'));
      expect(prints.appConfigMissing).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();

      existSync.mockRestore();
    });
  });

  describe('_checkPublicDirSync', () => {
    it('quit if copying file fails', () => {
      const err = new Error('asd');
      const copyFileSync = jest
        .spyOn(fs, 'copyFileSync')
        .mockImplementation(() => {
          throw err;
        });

      checkStartScript._checkPublicDirSync(true);

      expect(copyFileSync).toHaveBeenCalledTimes(1);
      expect(prints.publicDirCopyFailed).toHaveBeenCalledTimes(1);
      expect(prints.publicDirCopyFailed).toHaveBeenCalledWith(err, true);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);

      copyFileSync.mockRestore();
    });

    it('not quit if copying file pass', () => {
      const copyFileSync = jest
        .spyOn(fs, 'copyFileSync')
        .mockReturnValue(undefined);

      checkStartScript._checkPublicDirSync(true);

      expect(copyFileSync).toHaveBeenCalledTimes(1);
      expect(prints.publicDirCopyFailed).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();

      copyFileSync.mockRestore();
    });
  });

  describe('_verifyPackageVersion', () => {
    it('should quit if expected dependency is not found', () => {
      const pkg = {
        dependencies: {},
      };
      checkStartScript._verifyPackageVersion(pkg, false, 'foo');

      expect(prints.expectedDependencyNotFound).toHaveBeenCalledTimes(1);
      expect(prints.expectedDependencyNotFound).toHaveBeenCalledWith('foo');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('should warn about version mismatch and quit', () => {
      const pkg = {
        dependencies: { lerna: '10.0.0' },
      };
      checkStartScript._verifyPackageVersion(pkg, false, 'lerna');

      expect(prints.versionMismatch).toHaveBeenCalledTimes(1);
      expect(prints.versionMismatch).toHaveBeenCalledWith('lerna', lernaVersion, '10.0.0', false);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('should warn about version mismatch but not quit', () => {
      const pkg = {
        dependencies: { lerna: '10.0.0' },
      };
      checkStartScript._verifyPackageVersion(pkg, true, 'lerna');

      expect(prints.versionMismatch).toHaveBeenCalledTimes(1);
      expect(prints.versionMismatch).toHaveBeenCalledWith('lerna', lernaVersion, '10.0.0', true);
      expect(exit).not.toHaveBeenCalled();
    });

    it('should find no conflict with pinned dependency', () => {
      const pkg = {
        dependencies: { lerna: lernaVersion },
      };
      checkStartScript._verifyPackageVersion(pkg, false, 'lerna');

      expect(exit).not.toHaveBeenCalled();
    });

    it('should find no conflict with unpinned dependency', () => {
      const pkg = {
        dependencies: { lerna: `^${lernaVersion}` },
      };
      checkStartScript._verifyPackageVersion(pkg, false, 'lerna');

      expect(exit).not.toHaveBeenCalled();
    });
  });

  describe('_validateTypescriptProject', () => {
    const _hasTypescriptFiles = jest
      .spyOn(checkStartScript, '_hasTypescriptFiles')
      .mockReturnThis();
    const resolveModulePath = jest
      .spyOn(requireScripts, 'resolveModulePath')
      .mockReturnThis();
    const checkFilesExist = jest
      .spyOn(fsScripts, 'checkFilesExist')
      .mockReturnThis();
    const copyFileSync = jest
      .spyOn(fs, 'copyFileSync')
      .mockReturnValue(undefined);

    beforeEach(() => {
      _hasTypescriptFiles.mockReset();
      resolveModulePath.mockReset();
      checkFilesExist.mockReset();
      copyFileSync.mockReset();
    });

    afterAll(() => {
      _hasTypescriptFiles.mockRestore();
      resolveModulePath.mockRestore();
      checkFilesExist.mockRestore();
      copyFileSync.mockRestore();
    });

    it('should not do anything if not a typescript project', () => {
      _hasTypescriptFiles.mockReturnValue(false);

      checkStartScript._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
    });

    it('should fail if typescript project and typescript module not installed', () => {
      _hasTypescriptFiles.mockReturnValue(true);
      resolveModulePath.mockReturnValue(false);

      checkStartScript._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith('typescript');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(prints.typescriptNotInstalled).toHaveBeenCalledTimes(1);
      expect(checkFilesExist).not.toHaveBeenCalled();
    });

    it('should continue if typescript project and has tsconfig', () => {
      _hasTypescriptFiles.mockReturnValue(true);
      resolveModulePath.mockReturnValue('some-path');
      checkFilesExist.mockReturnValue(true);

      checkStartScript._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith('typescript');
      expect(checkFilesExist).toHaveBeenCalledTimes(1);

      expect(copyFileSync).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
      expect(prints.typescriptNotInstalled).not.toHaveBeenCalled();
    });

    it('should create default tsconfig.json', () => {
      _hasTypescriptFiles.mockReturnValue(true);
      resolveModulePath.mockReturnValue('some-path');
      checkFilesExist.mockReturnValue(false);
      const _copyFileSync = jest
        .spyOn(fs, 'copyFileSync')
        .mockReturnValue(undefined);

      checkStartScript._validateTypescriptProject();

      expect(_hasTypescriptFiles).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledTimes(1);
      expect(resolveModulePath).toHaveBeenCalledWith('typescript');
      expect(checkFilesExist).toHaveBeenCalledTimes(1);
      expect(_copyFileSync).toHaveBeenCalledTimes(1);

      expect(exit).not.toHaveBeenCalled();
      expect(prints.typescriptNotInstalled).not.toHaveBeenCalled();
      _copyFileSync.mockRestore();
    });
  });
});
