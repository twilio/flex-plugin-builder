import * as releaseScript from '../release';

jest.mock('../../clients/assets');
jest.mock('../../clients/services');
jest.mock('../../clients/environments');
jest.mock('../../clients/builds');
jest.mock('../../clients/deployments');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('../../utils/paths', () => ({
  version: '1.0.0',
  assetBaseUrlTemplate: 'template',
}));

// tslint:disable
const AssetClient = require('../../clients/assets').default;
const ServiceClient = require('../../clients/services').default;
const EnvironmentClient = require('../../clients/environments').default;
const BuildClient = require('../../clients/builds').default;
const DeploymentClient = require('../../clients/deployments').default;
const logger = require('flex-dev-utils').logger;
const fs = require('flex-dev-utils/dist/fs');
// tslint:enable

describe('release', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  const error = jest.spyOn(logger, 'error').mockImplementation(() => { /* no-op */ });
  jest.spyOn(logger, 'warning').mockImplementation(() => { /* no-op */ });
  jest.spyOn(logger, 'info').mockImplementation(() => { /* no-op */ });
  jest.spyOn(logger, 'success').mockImplementation(() => { /* no-op */ });
  jest.spyOn(logger, 'newline').mockImplementation(() => { /* no-op */ });

  const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockImplementation(() => ({
    version: '1.0.0',
    name: 'plugin-test',
  }));
  const doRelease = jest.spyOn(releaseScript, '_doRelease');
  process.env.ACCOUNT_SID = 'ACxxx';
  process.env.AUTH_TOKEN = 'abc';

  const getDefaultService =
    jest.fn().mockImplementation(() => Promise.resolve({sid: 'ZSxxx'}));
  const getDefaultEnvironment =
    jest.fn().mockImplementation(() => Promise.resolve({sid: 'ZExxx', build_sid: 'ZBxxx'}));
  const upload =
    jest.fn().mockImplementation((_: any, path: string) => {
      if (path.indexOf('map') === -1) {
        return Promise.resolve({sid: 'ZVxxx'});
      } else {
        return Promise.resolve({sid: 'ZVyyy'});
      }
    });
  const existingBuild = {sid: 'ZBxxx', asset_versions: [], function_versions: []};
  const getBuild =
    jest.fn().mockImplementation(() => Promise.resolve(existingBuild));
  const createBuild =
    jest.fn().mockImplementation(() => Promise.resolve({sid: 'ZByyy'}));
  const createDeployment =
    jest.fn().mockImplementation(() => Promise.resolve({sid: 'ZDxxx'}));

  beforeEach(() => {
    jest.clearAllMocks();

    ServiceClient.mockImplementation(() => ({
      getDefault: getDefaultService,
    }));
    EnvironmentClient.mockImplementation(() => ({
      getDefault: getDefaultEnvironment,
    }));
    AssetClient.mockImplementation(() => ({
      upload,
    }));
    BuildClient.mockImplementation(() => ({
      get: getBuild,
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
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('can only be'), expect.anything());
    expect(doRelease).not.toHaveBeenCalled();
  });

  it('should exit if incorrect command is provided', async () => {
    await releaseScript.default('foo');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('can only be'), expect.anything());
    expect(doRelease).not.toHaveBeenCalled();
  });

  it('should exit if custom is called without an argument', async () => {
    await releaseScript.default('custom');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Custom version bump'));
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

  it('should not fetch build if environment has no build_sid', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => true);

    EnvironmentClient.mockImplementation(() => ({
      getDefault: () => Promise.resolve({sid: 'ZExxx'}),
    }));

    await releaseScript.default('major');
    expect(getBuild).not.toHaveBeenCalled();

    checkFilesExist.mockRestore();
  });

  it('should get existing build if build_sid exists', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => true);

    await releaseScript.default('major');
    expect(getBuild).toHaveBeenCalledTimes(1);

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
