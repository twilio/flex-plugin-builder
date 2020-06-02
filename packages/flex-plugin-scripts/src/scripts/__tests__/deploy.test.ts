import { logger,  FlexPluginError, UserActionError } from 'flex-dev-utils';
import * as fsScript from 'flex-dev-utils/dist/fs';
import * as inquirer from 'flex-dev-utils/dist/inquirer';

import * as prints from '../../prints';
import * as deployScript from '../deploy';

jest.mock('../../clients/accounts');
jest.mock('../../clients/assets');
jest.mock('../../clients/services');
jest.mock('../../clients/configurations');
jest.mock('../../clients/environments');
jest.mock('../../clients/builds');
jest.mock('../../clients/deployments');
jest.mock('../../clients/pluginsApi');
jest.mock('../../prints/deploySuccessful');
jest.mock('../../prints/pluginsApiWarning');
jest.mock('inquirer');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/updateNotifier');
jest.mock('flex-dev-utils/dist/credentials', () => ({
  getCredential: jest.fn(),
}));
jest.mock('../../utils/runtime');
jest.mock('flex-dev-utils/dist/paths', () => ({
  app: {
    version: '1.0.0',
  },
  assetBaseUrlTemplate: 'template',
}));

// tslint:disable
const Runtime = require('../../utils/runtime').default;
const AccountClient = require('../../clients/accounts').default;
const AssetClient = require('../../clients/assets').default;
const BuildClient = require('../../clients/builds').default;
const DeploymentClient = require('../../clients/deployments').default;
const ConfigurationClient = require('../../clients/configurations').default;
const PluginsApiClient = require('../../clients/pluginsApi').default;
const fs = require('flex-dev-utils/dist/fs');
// tslint:enable

describe('DeployScript', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const serviceSid = 'ZS00000000000000000000000000000000';
  const environmentSid = 'ZE00000000000000000000000000000000';
  const buildSid = 'ZB00000000000000000000000000000000';
  const deploymentSid = 'ZD00000000000000000000000000000000';
  const versionJSSid = 'ZV00000000000000000000000000000000';
  const versionMapSid = 'ZV00000000000000000000000000000001';
  const accountObject = {
    account_sid: accountSid,
    friendly_name: 'test-account',
  };

  (logger.colors as any).blue = jest.fn();
  const config = {
    account_sid: accountSid,
    serverless_service_sids: [serviceSid],
    ui_version: '1.19.0',
    ui_dependencies: {},
  };

  const getAccount = jest.fn().mockResolvedValue(accountObject);
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
  const getFlexUIVersion = jest.fn().mockResolvedValue(config);
  const getUIDependencies = jest.fn().mockResolvedValue(config);

  const runtime = {
    service: {
      sid: serviceSid,
      accountSid,
    },
    environment: {sid: environmentSid, build_sid: buildSid, domain_name: 'test.twil.io'},
    build: existingBuild,
  };
  Runtime.mockImplementation(() => runtime);

  beforeEach(() => {
    jest.clearAllMocks();

    AccountClient.mockImplementation(() => ({ get: getAccount }));
    AssetClient.mockImplementation(() => ({ upload }));
    BuildClient.mockImplementation(() => ({ create: createBuild }));
    DeploymentClient.mockImplementation(() => ({ create: createDeployment }));
    ConfigurationClient.mockImplementation(() => ({ registerSid, getFlexUIVersion, getUIDependencies }));
  });

  describe('default', () => {
    const doDeploy = jest.spyOn(deployScript, '_doDeploy').mockReturnThis();
    const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockReturnValue({
      version: '1.0.0',
      name: 'plugin-test',
    });

    const expectDoDeployCalled = (version: string, options: object) => {
      expect(doDeploy).toHaveBeenCalledTimes(1);
      expect(doDeploy).toHaveBeenCalledWith(version, options);
    };

    afterAll(() => {
      doDeploy.mockRestore();
      readPackageJson.mockRestore();
    });

    it.('should thrown an exception if no command is provided', async (done) => {
      try {
        await deployScript.default();
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('can only be');
        done();
      }

      expect(doDeploy).not.toHaveBeenCalled();
    });

    it('should throw an exception if incorrect command is provided', async (done) => {
      try {
        await deployScript.default('foo');
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('can only be');
        done();
      }

      expect(doDeploy).not.toHaveBeenCalled();
    });

    it('should throw an exception if custom version is called without an argument', async (done) => {
      try {
        await deployScript.default('version');
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('Custom version bump');
        done();
      }

      expect(doDeploy).not.toHaveBeenCalled();
    });

    it('should bump major', async () => {
      await deployScript.default('major');

      expectDoDeployCalled('2.0.0', {
        isPublic: false,
        overwrite: false,
        isPluginsPilot: false,
        disallowVersioning: false,
      });
    });

    it('should bump minor', async () => {
      await deployScript.default('minor');

      expectDoDeployCalled('1.1.0', {
        isPublic: false,
        overwrite: false,
        isPluginsPilot: false,
        disallowVersioning: false,
      });
    });

    it('should bump patch', async () => {
      await deployScript.default('patch');

      expectDoDeployCalled('1.0.1', {
        isPublic: false,
        overwrite: false,
        isPluginsPilot: false,
        disallowVersioning: false,
      });
    });

    it('should bump custom version', async () => {
      await deployScript.default('version', 'custom-version');

      expectDoDeployCalled('custom-version', {
        isPublic: false,
        overwrite: false,
        isPluginsPilot: false,
        disallowVersioning: false,
      });
    });

    it('should run as public', async () => {
      await deployScript.default('major', '--public');

      expectDoDeployCalled('2.0.0', {
        isPublic: true,
        overwrite: false,
        isPluginsPilot: false,
        disallowVersioning: false,
      });
    });

    it('should not allow version bumping', async () => {
      await deployScript.default('--disallow-versioning');

      expect(doDeploy).toHaveBeenCalledTimes(1);
      expect(doDeploy).toHaveBeenCalledWith('0.0.0', expect.any(Object));
    });

    it('should call run pilot program', async () => {
      await deployScript.default('major', '--pilot-plugins-api');

      expectDoDeployCalled('2.0.0', {
        isPublic: false,
        overwrite: false,
        isPluginsPilot: true,
        disallowVersioning: false,
      });
    });
  });

  describe('_doDeploy', () => {
    it('should quit if running the pilot program but not have the flag set', async (done) => {
      const options = {
        isPublic: true,
        overwrite: false,
        isPluginsPilot: true,
        disallowVersioning: false,
      };

      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const hasFlag = jest.fn().mockResolvedValue(false);
      PluginsApiClient.mockImplementation(() => ({ hasFlag }));

      try {
        await deployScript._doDeploy('1.0.0', options);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('is currently in Preview');
        done();
      }

      checkFilesExist.mockRestore();
    });

    it('should run if pilot feature enabled', async () => {
      const options = {
        isPublic: true,
        overwrite: false,
        isPluginsPilot: true,
        disallowVersioning: false,
      };

      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _getAccount = jest.spyOn(deployScript, '_getAccount').mockReturnThis();
      const hasFlag = jest.fn().mockResolvedValue(true);
      PluginsApiClient.mockImplementation(() => ({ hasFlag }));

      await deployScript._doDeploy('1.0.0', options);
      checkFilesExist.mockRestore();
      _getAccount.mockRestore();
    });

    it('should quit if build does not exist', async (done) => {
      const options = {
        isPublic: true,
        overwrite: false,
        isPluginsPilot: false,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(false);

      try {
        await deployScript._doDeploy('1.0.0', options);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('Could not find');
        done();
      }

      checkFilesExist.mockRestore();
    });

    it('should quit if duplicate route is found', async (done) => {
      const options = {
        isPublic: true,
        overwrite: false,
        isPluginsPilot: false,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(false);

      try {
        await deployScript._doDeploy('1.0.0', options);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('You already have a plugin');
        done();
      }

      checkFilesExist.mockRestore();
      verifyPath.mockRestore();
    });

    it('should deploy and write a success message', async () => {
      const options = {
        isPublic: true,
        overwrite: true,
        isPluginsPilot: false,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _getAccount = jest.spyOn(deployScript, '_getAccount').mockReturnThis();
      const _verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(true);
      const deploySuccessful = jest.spyOn(prints, 'deploySuccessful');

      await deployScript._doDeploy('1.0.0', options);

      expect(_getAccount).toHaveBeenCalledTimes(1);
      expect(deploySuccessful).toHaveBeenCalledTimes(1);

      checkFilesExist.mockRestore();
      _verifyPath.mockRestore();
      _getAccount.mockRestore();
    });
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

  describe('_verifyFlexUIConfiguration', () => {
    const dependencies = { react: '16.13.1', 'react-dom': '16.13.1' };

    it('should throw exception if unsupported flex-ui version is provided', async (done) => {
      try {
        await deployScript._verifyFlexUIConfiguration('1.18.0', {}, true);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        done();
      }
    });

    it('should ask for no confirmation if react version is correct', async () => {
      const confirm = jest.spyOn(inquirer, 'confirm');
      const getPackageVersion = jest
        .spyOn(fsScript, 'getPackageVersion')
        .mockReturnValue('16.13.1');

      await deployScript._verifyFlexUIConfiguration('^1', dependencies, true);

      expect(confirm).not.toHaveBeenCalled()
      expect(getPackageVersion).toHaveBeenCalledTimes(2);
    });

    it('should confirm to allow deployment if react version is mismatched', async () => {
      const confirm = jest.spyOn(inquirer, 'confirm').mockResolvedValue(true);
      const getPackageVersion = jest
        .spyOn(fsScript, 'getPackageVersion')
        .mockReturnValue('16.12.1');

      await deployScript._verifyFlexUIConfiguration('^1', dependencies, true);

      expect(confirm).toHaveBeenCalledTimes(1)
      expect(getPackageVersion).toHaveBeenCalledTimes(3);
    });

    it('should reject confirm to allow deployment if react version is mismatched', async (done) => {
      const confirm = jest.spyOn(inquirer, 'confirm').mockResolvedValue(false);
      const getPackageVersion = jest
        .spyOn(fsScript, 'getPackageVersion')
        .mockReturnValue('16.12.1');

      try {
        await deployScript._verifyFlexUIConfiguration('^1', dependencies, true);
      } catch (e) {
        expect(confirm).toHaveBeenCalledTimes(1)
        expect(getPackageVersion).toHaveBeenCalledTimes(3);
        expect(e).toBeInstanceOf(UserActionError);

        done();
      }
    });

    it('should not throw any exceptions', async () => {
      jest
        .spyOn(fsScript, 'getPackageVersion')
        .mockReturnValue('16.13.1');

      await deployScript._verifyFlexUIConfiguration('^1', dependencies, true);
      await deployScript._verifyFlexUIConfiguration('^1.1', dependencies, true);
      await deployScript._verifyFlexUIConfiguration('^1.19.0', dependencies, true);
      await deployScript._verifyFlexUIConfiguration('~1.19.0', dependencies, true);
      await deployScript._verifyFlexUIConfiguration('~1.19.1', dependencies, true);
      await deployScript._verifyFlexUIConfiguration('1.19.0', dependencies, true);
      await deployScript._verifyFlexUIConfiguration('1.19.1', dependencies, true);
      await deployScript._verifyFlexUIConfiguration('1.20.0', dependencies, true);
    });
  });

  describe('_getAccount', () => {
    it('should call api', async () => {
      // @ts-ignore
      await deployScript._getAccount(runtime, { username: accountSid });

      expect(AccountClient).toHaveBeenCalledTimes(1);
      expect(getAccount).toHaveBeenCalledTimes(1);
    });

    it('should return fake account', async () => {
      // @ts-ignore
      await deployScript._getAccount(runtime, { username: 'not-a-sid' });

      expect(AccountClient).toHaveBeenCalledTimes(1);
      expect(getAccount).not.toHaveBeenCalled();
    });
  });
});
