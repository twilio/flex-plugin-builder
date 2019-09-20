import { logger } from 'flex-dev-utils';

import * as deployScript from '../deploy';

jest.mock('../../clients/assets');
jest.mock('../../clients/services');
jest.mock('../../clients/configurations');
jest.mock('../../clients/environments');
jest.mock('../../clients/builds');
jest.mock('../../clients/deployments');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/credentials', () => ({
  getCredential: jest.fn(),
}));
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
const ConfigurationClient = require('../../clients/configurations').default;
const fs = require('flex-dev-utils/dist/fs');
// tslint:enable

describe('deploy', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const serviceSid = 'ZS00000000000000000000000000000000';
  const environmentSid = 'ZE00000000000000000000000000000000';
  const buildSid = 'ZB00000000000000000000000000000000';
  const deploymentSid = 'ZD00000000000000000000000000000000';
  const versionJSSid = 'ZV00000000000000000000000000000000';
  const versionMapSid = 'ZV00000000000000000000000000000001';

  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  (logger.colors as any).blue = jest.fn();

  const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockImplementation(() => ({
    version: '1.0.0',
    name: 'plugin-test',
  }));
  const config = {account_sid: accountSid, serverless_service_sids: [serviceSid]};
  const doDeploy = jest.spyOn(deployScript, '_doDeploy');

  const upload = jest.fn()
    .mockImplementation((_: any, path: string) => {
      if (path.indexOf('map') === -1) {
        return Promise.resolve({sid: versionMapSid});
      } else {
        return Promise.resolve({sid: versionJSSid});
      }
    });
  const existingBuild = {sid: buildSid, asset_versions: [], function_versions: []};
  const createBuild = jest.fn().mockResolvedValue({sid: buildSid});
  const createDeployment = jest.fn().mockResolvedValue({sid: deploymentSid});
  const registerSid = jest.fn().mockResolvedValue(config);

  Runtime.mockImplementation(() => ({
    service: {sid: serviceSid},
    environment: {sid: environmentSid, build_sid: buildSid, domain_name: 'test.twil.io'},
    build: existingBuild,
  }));

  beforeEach(() => {
    jest.clearAllMocks();

    AssetClient.mockImplementation(() => ({ upload }));
    BuildClient.mockImplementation(() => ({ create: createBuild }));
    DeploymentClient.mockImplementation(() => ({ create: createDeployment }));
    ConfigurationClient.mockImplementation(() => ({ registerSid }));
  });

  it('should exit if no command is provided', async () => {
    await deployScript.default();

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('can only be'), expect.anything());
    expect(doDeploy).not.toHaveBeenCalled();
  });

  it('should exit if incorrect command is provided', async () => {
    await deployScript.default('foo');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('can only be'), expect.anything());
    expect(doDeploy).not.toHaveBeenCalled();
  });

  it('should exit if custom is called without an argument', async () => {
    await deployScript.default('custom');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Custom version bump'));
    expect(doDeploy).not.toHaveBeenCalled();
  });

  it('should bump major', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await deployScript.default('major');

    expect(doDeploy).toHaveBeenCalledTimes(1);
    expect(doDeploy).toHaveBeenCalledWith('2.0.0', {
      isPublic: false,
      overwrite: false,
      disallowVersioning: false,
    });

    checkFilesExist.mockRestore();
  });

  it('should bump minor', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await deployScript.default('minor');

    expect(doDeploy).toHaveBeenCalledTimes(1);
    expect(doDeploy).toHaveBeenCalledWith('1.1.0', {
      isPublic: false,
      overwrite: false,
      disallowVersioning: false,
    });

    checkFilesExist.mockRestore();
  });

  it('should bump patch', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await deployScript.default('patch');

    expect(doDeploy).toHaveBeenCalledTimes(1);
    expect(doDeploy).toHaveBeenCalledWith('1.0.1', {
      isPublic: false,
      overwrite: false,
      disallowVersioning: false,
    });

    checkFilesExist.mockRestore();
  });

  it('should bump custom', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await deployScript.default('custom', 'custom-version');

    expect(doDeploy).toHaveBeenCalledTimes(1);
    expect(doDeploy).toHaveBeenCalledWith('custom-version', {
      isPublic: false,
      overwrite: false,
      disallowVersioning: false,
    });

    checkFilesExist.mockRestore();
  });

  it('should bump overwrite', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await deployScript.default('overwrite');

    expect(readPackageJson).toHaveBeenCalledTimes(1);
    expect(doDeploy).toHaveBeenCalledTimes(1);
    expect(doDeploy).toHaveBeenCalledWith('1.0.0', {
      isPublic: false,
      overwrite: true,
      disallowVersioning: false,
    });

    checkFilesExist.mockRestore();
  });

  it('should run as public', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => false);

    await deployScript.default('major', '--public');

    expect(doDeploy).toHaveBeenCalledTimes(1);
    expect(doDeploy).toHaveBeenCalledWith('2.0.0', {
      isPublic: true,
      overwrite: false,
      disallowVersioning: false,
    });

    checkFilesExist.mockRestore();
  });

  it('should quit if duplicate route is found', async (done) => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => true);
    const verifyPath = jest.spyOn(deployScript, '_verifyPath').mockImplementation(() => false);

    try {
      await deployScript.default('major');
    } catch (e) {
      done();
    }

    checkFilesExist.mockRestore();
    verifyPath.mockRestore();
  });

  it('should not quit duplicate route is found but is overwrite', async () => {
    const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockImplementation(() => true);
    const verifyPath = jest.spyOn(deployScript, '_verifyPath').mockImplementation(() => false);

    await deployScript.default('overwrite');

    checkFilesExist.mockRestore();
    verifyPath.mockRestore();
  });

  describe('_verifyPath', () => {
    it('should return be false if asset bundle path exists', () => {
      const build = {
        asset_versions: [{path: '/baseUrl/bundle.js'}],
        function_versions: [],
      };

      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be false if asset bundle sourcemap path exists', () => {
      const build = {
        asset_versions: [{path: '/baseUrl/bundle.js.map'}],
        function_versions: [],
      };

      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be false if function bundle sourcemap path exists', () => {
      const build = {
        asset_versions: [],
        function_versions: [{path: '/baseUrl/bundle.js'}],
      };

      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be true', () => {
      const build = {
        asset_versions: [{path: '/baseUrl/anotherBundle.js'}],
        function_versions: [{path: '/baseUrl/yetAnotherBundle.js'}],
      };

      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeTruthy();
    });
  });
});
