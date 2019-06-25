import { logger } from 'flex-dev-utils';
import * as releaseScript from '../release';

jest.mock('../../clients/assets');
jest.mock('../../clients/services');
jest.mock('../../clients/environments');
jest.mock('../../clients/builds');
jest.mock('../../clients/deployments');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('../../utils/runtime');
jest.mock('../../utils/paths', () => ({
  version: '1.0.0',
  assetBaseUrlTemplate: 'template',
}));

// tslint:disable
const Runtime = require('../../utils/runtime').default;
const AssetClient = require('../../clients/assets').default;
const BuildClient = require('../../clients/builds').default;
const DeploymentClient = require('../../clients/deployments').default;
const fs = require('flex-dev-utils/dist/fs');
// tslint:enable

describe('release', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  (logger.colors as any).blue = jest.fn();

  const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockImplementation(() => ({
    version: '1.0.0',
    name: 'plugin-test',
  }));
  const doRelease = jest.spyOn(releaseScript, '_doRelease');
  process.env.TWILIO_API_KEY = 'SK00000000000000000000000000000000';
  process.env.TWILIO_API_SECRET = 'abc123';

  const upload =
    jest.fn().mockImplementation((_: any, path: string) => {
      if (path.indexOf('map') === -1) {
        return Promise.resolve({sid: 'ZVxxx'});
      } else {
        return Promise.resolve({sid: 'ZVyyy'});
      }
    });
  const existingBuild = {sid: 'ZBxxx', asset_versions: [], function_versions: []};
  const createBuild =
    jest.fn().mockImplementation(() => Promise.resolve({sid: 'ZByyy'}));
  const createDeployment =
    jest.fn().mockImplementation(() => Promise.resolve({sid: 'ZDxxx'}));
  Runtime.mockImplementation(() => ({
    service: {sid: 'ZSxxx'},
    environment: {sid: 'ZExxx', build_sid: 'ZBxxx', domain_name: 'test.twil.io'},
    build: existingBuild,
  }));

  beforeEach(() => {
    jest.clearAllMocks();

    AssetClient.mockImplementation(() => ({
      upload,
    }));
    BuildClient.mockImplementation(() => ({
      create: createBuild,
    }));
    DeploymentClient.mockImplementation(() => ({
      create: createDeployment,
    }));
  });

  it('should exit if no command is provided', async () => {
    await releaseScript.default();

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('can only be'), expect.anything());
    expect(doRelease).not.toHaveBeenCalled();
  });

  it('should exit if incorrect command is provided', async () => {
    await releaseScript.default('foo');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('can only be'), expect.anything());
    expect(doRelease).not.toHaveBeenCalled();
  });

  it('should exit if custom is called without an argument', async () => {
    await releaseScript.default('custom');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Custom version bump'));
    expect(doRelease).not.toHaveBeenCalled();
  });

  it('should bump major', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await releaseScript.default('major');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('2.0.0', {isPublic: false, overwrite: false});

    checkFilesExist.mockRestore();
  });

  it('should bump minor', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await releaseScript.default('minor');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('1.1.0', {isPublic: false, overwrite: false});

    checkFilesExist.mockRestore();
  });

  it('should bump patch', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await releaseScript.default('patch');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('1.0.1', {isPublic: false, overwrite: false});

    checkFilesExist.mockRestore();
  });

  it('should bump custom', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await releaseScript.default('custom', 'custom-version');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('custom-version', {isPublic: false, overwrite: false});

    checkFilesExist.mockRestore();
  });

  it('should bump overwrite', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await releaseScript.default('overwrite');

    expect(readPackageJson).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('1.0.0', {isPublic: false, overwrite: true});

    checkFilesExist.mockRestore();
  });

  it('should run as public', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await releaseScript.default('major', '--public');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('2.0.0', {isPublic: true, overwrite: false});

    checkFilesExist.mockRestore();
  });

  it('should quit if duplicate route is found', async (done) => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => true);
    const verifyPath = jest.spyOn(releaseScript, '_verifyPath').mockImplementation(() => false);

    try {
      await releaseScript.default('major');
    } catch (e) {
      done();
    }

    checkFilesExist.mockRestore();
    verifyPath.mockRestore();
  });

  it('should not quit duplicate route is found but is overwrite', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => true);
    const verifyPath = jest.spyOn(releaseScript, '_verifyPath').mockImplementation(() => false);

    await releaseScript.default('overwrite');

    checkFilesExist.mockRestore();
    verifyPath.mockRestore();
  });

  describe('_verifyPath', () => {
    it('should return be false if asset bundle path exists', () => {
      const build = {
        asset_versions: [{path: '/baseUrl/bundle.js'}],
        function_versions: [],
      };

      expect(releaseScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be false if asset bundle sourcemap path exists', () => {
      const build = {
        asset_versions: [{path: '/baseUrl/bundle.js.map'}],
        function_versions: [],
      };

      expect(releaseScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be false if function bundle sourcemap path exists', () => {
      const build = {
        asset_versions: [],
        function_versions: [{path: '/baseUrl/bundle.js'}],
      };

      expect(releaseScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be true', () => {
      const build = {
        asset_versions: [{path: '/baseUrl/anotherBundle.js'}],
        function_versions: [{path: '/baseUrl/yetAnotherBundle.js'}],
      };

      expect(releaseScript._verifyPath('/baseUrl', build as any)).toBeTruthy();
    });
  });
});
