import * as releaseScript from '../release';

jest.mock('../../clients/assets');
jest.mock('../../clients/services');
jest.mock('../../clients/environments');
jest.mock('../../clients/builds');
jest.mock('../../clients/deployments');
jest.mock('../../utils/fs');
jest.mock('../../utils/paths', () => ({
  version: '1.0.0',
  assetBaseUrlTemplate: 'template',
}));

const AssetClient = require('../../clients/assets').default;
const ServiceClient = require('../../clients/services').default;
const EnvironmentClient = require('../../clients/environments').default;
const BuildClient = require('../../clients/builds').default;
const DeploymentClient = require('../../clients/deployments').default;
const logger  = require('../../utils/logger').default;
const fs = require('../../utils/fs');

describe('release', () => {
  // @ts-ignore
  const exit: jest.SpyInstance = jest.spyOn(process, 'exit').mockImplementation(() => {});
  const error: jest.SpyInstance = jest.spyOn(logger, 'error').mockImplementation(() => {});
  jest.spyOn(logger, 'warning').mockImplementation(() => {});
  jest.spyOn(logger, 'info').mockImplementation(() => {});
  jest.spyOn(logger, 'success').mockImplementation(() => {});
  jest.spyOn(logger, 'newline').mockImplementation(() => {});

  const readPackage = jest.spyOn(fs, 'readPackage').mockImplementation(() => ({
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
      upload: upload,
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
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => false);

    await releaseScript.default('major');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('2.0.0', {isPublic: false, overwrite: false});

    fileExists.mockRestore();
  });

  it('should bump minor', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => false);

    await releaseScript.default('minor');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('1.1.0', {isPublic: false, overwrite: false});

    fileExists.mockRestore();
  });

  it('should bump patch', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => false);

    await releaseScript.default('patch');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('1.0.1', {isPublic: false, overwrite: false});

    fileExists.mockRestore();
  });

  it('should bump custom', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => false);

    await releaseScript.default('custom', 'custom-version');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('custom-version', {isPublic: false, overwrite: false});

    fileExists.mockRestore();
  });

  it('should bump overwrite', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => false);

    await releaseScript.default('overwrite');

    expect(readPackage).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('1.0.0', {isPublic: false, overwrite: true});

    fileExists.mockRestore();
  });

  it('should run as public', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => false);

    await releaseScript.default('major', '--public');

    expect(doRelease).toHaveBeenCalledTimes(1);
    expect(doRelease).toHaveBeenCalledWith('2.0.0', {isPublic: true, overwrite: false});

    fileExists.mockRestore();
  });

  it('should not fetch build if environment has no build_sid', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => true);

    EnvironmentClient.mockImplementation(() => ({
      getDefault: () => Promise.resolve({sid: 'ZExxx'}),
    }));

    await releaseScript.default('major');
    expect(getBuild).not.toHaveBeenCalled();

    fileExists.mockRestore();
  });

  it('should get existing build if build_sid exists', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => true);

    await releaseScript.default('major');
    expect(getBuild).toHaveBeenCalledTimes(1);

    fileExists.mockRestore();
  });

  it('should quit if duplicate route is found', async (done) => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => true);
    const verifyPath = jest.spyOn(releaseScript, '_verifyPath').mockImplementation(() => false);

    try {
      await releaseScript.default('major');
    } catch (e) {
      done();
    }

    fileExists.mockRestore();
    verifyPath.mockRestore();
  });

  it('should not quit duplicate route is found but is overwrite', async () => {
    const fileExists = jest.spyOn(fs, 'checkFileExists').mockImplementation(() => true);
    const verifyPath = jest.spyOn(releaseScript, '_verifyPath').mockImplementation(() => false);

    await releaseScript.default('overwrite');

    fileExists.mockRestore();
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

