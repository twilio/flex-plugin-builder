import { logger, FlexPluginError, UserActionError } from '@twilio/flex-dev-utils';
import * as fsScript from '@twilio/flex-dev-utils/dist/fs';
import * as questions from '@twilio/flex-dev-utils/dist/questions';

import * as prints from '../../prints';
import * as deployScript from '../deploy';

jest.mock('../../clients/accounts');
jest.mock('../../clients/assets');
jest.mock('../../clients/services');
jest.mock('../../clients/configurations');
jest.mock('../../clients/environments');
jest.mock('../../clients/builds');
jest.mock('../../clients/deployments');
jest.mock('../../prints/deploySuccessful');
jest.mock('@twilio/flex-dev-utils/dist/questions');
jest.mock('@twilio/flex-dev-utils/dist/fs');
jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('@twilio/flex-dev-utils/dist/updateNotifier');
jest.mock('@twilio/flex-dev-utils/dist/credentials', () => ({
  getCredential: () => ({
    username: 'username',
    password: 'password',
  }),
}));
jest.mock('../../utils/runtime');

/* eslint-disable */
const fs = require('@twilio/flex-dev-utils/dist/fs');
const Runtime = require('../../utils/runtime').default;
const AccountClient = require('../../clients/accounts').default;
const AssetClient = require('../../clients/assets').default;
const BuildClient = require('../../clients/builds').default;
const DeploymentClient = require('../../clients/deployments').default;
const ConfigurationClient = require('../../clients/configurations').default;
/* eslint-enable */
/* eslint-disable camelcase */

describe('DeployScript', () => {
  const paths = {
    app: {
      version: '1.0.0',
    },
    assetBaseUrlTemplate: 'template',
  };
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (logger.colors as any).blue = jest.fn();
  const config = {
    account_sid: accountSid,
    serverless_service_sids: [serviceSid],
    ui_version: '1.19.0',
    ui_dependencies: {},
  };

  const getAccount = jest.fn().mockResolvedValue(accountObject);
  const upload = jest.fn().mockImplementation(async (_, path: string) => {
    if (path.indexOf('map') === -1) {
      return Promise.resolve({ sid: versionMapSid });
    }
    return Promise.resolve({ sid: versionJSSid });
  });
  const existingBuild = { sid: buildSid, asset_versions: [], function_versions: [] };
  const createBuild = jest.fn().mockResolvedValue({ sid: buildSid });
  const createDeployment = jest.fn().mockResolvedValue({ sid: deploymentSid });
  const registerSid = jest.fn().mockResolvedValue(config);
  const getFlexUIVersion = jest.fn().mockResolvedValue(config.ui_version);
  const getUIDependencies = jest.fn().mockResolvedValue(config.ui_dependencies);

  const runtime = {
    service: {
      sid: serviceSid,
      accountSid,
    },
    environment: { sid: environmentSid, build_sid: buildSid, domain_name: 'test.twil.io' },
    build: existingBuild,
  };
  Runtime.mockImplementation(() => runtime);

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    jest.spyOn(fsScript, 'getPaths').mockReturnValue(paths);

    AccountClient.mockImplementation(() => ({ get: getAccount }));
    AssetClient.mockImplementation(() => ({ upload }));
    BuildClient.mockImplementation(() => ({ create: createBuild }));
    DeploymentClient.mockImplementation(() => ({ create: createDeployment }));
    ConfigurationClient.mockImplementation(() => ({ registerSid, getFlexUIVersion, getUIDependencies }));

    process.env = { ...OLD_ENV };
  });

  describe('default', () => {
    const doDeploy = jest.spyOn(deployScript, '_doDeploy').mockReturnThis();
    const readPackageJson = jest.spyOn(fs, 'readPackageJson').mockReturnValue({
      version: '1.0.0',
      name: 'plugin-test',
    });

    const expectDoDeployCalled = (version: string, options: deployScript.Options) => {
      expect(doDeploy).toHaveBeenCalledTimes(1);
      expect(doDeploy).toHaveBeenCalledWith(version, options);
    };

    afterAll(() => {
      doDeploy.mockRestore();
      readPackageJson.mockRestore();
    });

    it('should thrown an exception if no command is provided', async (done) => {
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
        disallowVersioning: false,
      });
    });

    it('should bump minor', async () => {
      await deployScript.default('minor');

      expectDoDeployCalled('1.1.0', {
        isPublic: false,
        overwrite: false,
        disallowVersioning: false,
      });
    });

    it('should bump patch', async () => {
      await deployScript.default('patch');

      expectDoDeployCalled('1.0.1', {
        isPublic: false,
        overwrite: false,
        disallowVersioning: false,
      });
    });

    it('should bump custom version', async () => {
      await deployScript.default('version', 'custom-version');

      expectDoDeployCalled('custom-version', {
        isPublic: false,
        overwrite: false,
        disallowVersioning: false,
      });
    });

    it('should run as public', async () => {
      await deployScript.default('major', '--public');

      expectDoDeployCalled('2.0.0', {
        isPublic: true,
        overwrite: false,
        disallowVersioning: false,
      });
    });

    it('should not allow version bumping', async () => {
      await deployScript.default('--disallow-versioning');

      expect(doDeploy).toHaveBeenCalledTimes(1);
      expect(doDeploy).toHaveBeenCalledWith('0.0.0', expect.any(Object));
    });
  });

  describe('_doDeploy', () => {
    it('should quit if build does not exist', async (done) => {
      const options = {
        isPublic: true,
        overwrite: false,
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

    it('should quit if duplicate route is found and in CI', async (done) => {
      process.env.CI = 'true';
      const options = {
        isPublic: true,
        overwrite: false,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(false);
      const _verifyFlexUIConfiguration = jest.spyOn(deployScript, '_verifyFlexUIConfiguration').mockResolvedValue();

      try {
        await deployScript._doDeploy('1.0.0', options);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('You already have a plugin');
        done();
      }

      checkFilesExist.mockRestore();
      _verifyPath.mockRestore();
      _verifyFlexUIConfiguration.mockRestore();
    });

    it('should quit if duplicate route is found and caller is not the CLI', async (done) => {
      process.env.CI = 'false';
      const options = {
        isPublic: true,
        overwrite: false,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(false);
      const _verifyFlexUIConfiguration = jest.spyOn(deployScript, '_verifyFlexUIConfiguration').mockResolvedValue();

      try {
        await deployScript._doDeploy('1.0.0', options);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('You already have a plugin');
        done();
      }

      checkFilesExist.mockRestore();
      _verifyPath.mockRestore();
      _verifyFlexUIConfiguration.mockRestore();
    });

    it('should return the existing asset if the caller is the CLI, duplicate route is found, user does not want to overwrite, and not in CI', async () => {
      process.env.CI = 'false';
      process.env.FLEX_PLUGINS_CLI = 'true';
      const options = {
        isPublic: true,
        overwrite: false,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _getAccount = jest.spyOn(deployScript, '_getAccount').mockReturnThis();
      const _verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(false);
      const _verifyFlexUIConfiguration = jest.spyOn(deployScript, '_verifyFlexUIConfiguration').mockResolvedValue();
      const deploySuccessful = jest.spyOn(prints, 'deploySuccessful');

      await deployScript._doDeploy('1.0.0', options);

      expect(_getAccount).toHaveBeenCalledTimes(0);
      expect(_verifyFlexUIConfiguration).not.toHaveBeenCalled();
      expect(deploySuccessful).toHaveBeenCalledTimes(0);

      checkFilesExist.mockRestore();
      _verifyPath.mockRestore();
      _getAccount.mockRestore();
      _verifyFlexUIConfiguration.mockRestore();
    });

    it('should overwrite the existing asset if the caller is the CLI, duplicate route is found, user does want to overwrite, and not in CI', async () => {
      process.env.CI = 'false';
      process.env.FLEX_PLUGINS_CLI = 'true';
      const options = {
        isPublic: true,
        overwrite: true,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _getAccount = jest.spyOn(deployScript, '_getAccount').mockReturnThis();
      const _verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(false);
      const _verifyFlexUIConfiguration = jest.spyOn(deployScript, '_verifyFlexUIConfiguration').mockResolvedValue();
      const deploySuccessful = jest.spyOn(prints, 'deploySuccessful');

      await deployScript._doDeploy('1.0.0', options);

      expect(_getAccount).toHaveBeenCalledTimes(1);
      expect(_verifyFlexUIConfiguration).not.toHaveBeenCalled();
      expect(deploySuccessful).toHaveBeenCalledTimes(1);

      checkFilesExist.mockRestore();
      _verifyPath.mockRestore();
      _getAccount.mockRestore();
      _verifyFlexUIConfiguration.mockRestore();
    });

    it('should deploy and write a success message', async () => {
      const options = {
        isPublic: true,
        overwrite: true,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _getAccount = jest.spyOn(deployScript, '_getAccount').mockReturnThis();
      const _verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(true);
      const _verifyFlexUIConfiguration = jest.spyOn(deployScript, '_verifyFlexUIConfiguration').mockResolvedValue();
      const deploySuccessful = jest.spyOn(prints, 'deploySuccessful');

      await deployScript._doDeploy('1.0.0', options);

      expect(_getAccount).toHaveBeenCalledTimes(1);
      expect(_verifyFlexUIConfiguration).toHaveBeenCalledTimes(1);
      expect(deploySuccessful).toHaveBeenCalledTimes(1);

      checkFilesExist.mockRestore();
      _verifyPath.mockRestore();
      _getAccount.mockRestore();
      _verifyFlexUIConfiguration.mockRestore();
    });

    it('should not verify ui configuration if the caller is the CLI', async () => {
      process.env.FLEX_PLUGINS_CLI = 'true';
      const options = {
        isPublic: true,
        overwrite: true,
        disallowVersioning: false,
      };
      const checkFilesExist = jest.spyOn(fs, 'checkFilesExist').mockReturnValue(true);
      const _getAccount = jest.spyOn(deployScript, '_getAccount').mockReturnThis();
      const _verifyPath = jest.spyOn(deployScript, '_verifyPath').mockReturnValue(true);
      const _verifyFlexUIConfiguration = jest.spyOn(deployScript, '_verifyFlexUIConfiguration').mockResolvedValue();
      const deploySuccessful = jest.spyOn(prints, 'deploySuccessful');

      await deployScript._doDeploy('1.0.0', options);

      expect(_getAccount).toHaveBeenCalledTimes(1);
      expect(_verifyFlexUIConfiguration).not.toHaveBeenCalled();
      expect(deploySuccessful).toHaveBeenCalledTimes(1);

      checkFilesExist.mockRestore();
      _verifyPath.mockRestore();
      _getAccount.mockRestore();
      _verifyFlexUIConfiguration.mockRestore();
    });
  });

  describe('_verifyPath', () => {
    it('should return be false if asset bundle path exists', () => {
      const build = {
        asset_versions: [{ path: '/baseUrl/bundle.js' }],
        function_versions: [],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be false if asset bundle sourcemap path exists', () => {
      const build = {
        asset_versions: [{ path: '/baseUrl/bundle.js.map' }],
        function_versions: [],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be false if function bundle sourcemap path exists', () => {
      const build = {
        asset_versions: [],
        function_versions: [{ path: '/baseUrl/bundle.js' }],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeFalsy();
    });

    it('should return be true', () => {
      const build = {
        asset_versions: [{ path: '/baseUrl/anotherBundle.js' }],
        function_versions: [{ path: '/baseUrl/yetAnotherBundle.js' }],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(deployScript._verifyPath('/baseUrl', build as any)).toBeTruthy();
    });
  });

  describe('_verifyFlexUIConfiguration', () => {
    const dependencies = { react: '16.13.1', 'react-dom': '16.13.1' };

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw exception if flex-ui < 1.19.0 and react versions are not 16.5.2', async (done) => {
      const getFlexUIVersion = jest.fn().mockResolvedValue('1.18.0');
      const getUIDependencies = jest.fn().mockResolvedValue(dependencies);
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      try {
        await deployScript._verifyFlexUIConfiguration();
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        done();
      }
    });

    it('should not throw exception if flex-ui is < 1.19.0 and react versions are 16.5.2', async () => {
      const flexUIDependencies = { react: '16.5.2', 'react-dom': '16.5.2' };
      const getFlexUIVersion = jest.fn().mockResolvedValue('1.18.0');
      const getUIDependencies = jest.fn().mockResolvedValue(flexUIDependencies);
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      const confirm = jest.spyOn(questions, 'confirm');
      const getPackageVersion = jest.spyOn(fsScript, 'getPackageVersion').mockReturnValue('16.5.2');

      await deployScript._verifyFlexUIConfiguration();

      expect(confirm).not.toHaveBeenCalled();
      expect(getPackageVersion).toHaveBeenCalledTimes(2);
    });

    it('should use default react', async () => {
      const getFlexUIVersion = jest.fn().mockResolvedValue('^1');
      const getUIDependencies = jest.fn().mockResolvedValue({});
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      const getPackageVersion = jest.spyOn(fsScript, 'getPackageVersion').mockReturnValue('16.5.2');
      await deployScript._verifyFlexUIConfiguration();
      expect(getPackageVersion).toHaveBeenCalledTimes(2);
    });

    it('should ask for confirmation if no react is set', async () => {
      const getFlexUIVersion = jest.fn().mockResolvedValue('^1');
      const getUIDependencies = jest.fn().mockResolvedValue({});
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      const confirm = jest.spyOn(questions, 'confirm').mockResolvedValue(true);
      const getPackageVersion = jest.spyOn(fsScript, 'getPackageVersion').mockReturnValue('16.13.1');
      await deployScript._verifyFlexUIConfiguration();

      expect(confirm).toHaveBeenCalled();
      expect(getPackageVersion).toHaveBeenCalledTimes(2);
    });

    it('should not ask for confirmation if react versions match', async () => {
      const getFlexUIVersion = jest.fn().mockResolvedValue('^1');
      const getUIDependencies = jest.fn().mockResolvedValue(dependencies);
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      const confirm = jest.spyOn(questions, 'confirm');
      const getPackageVersion = jest.spyOn(fsScript, 'getPackageVersion').mockReturnValue('16.13.1');

      await deployScript._verifyFlexUIConfiguration();

      expect(confirm).not.toHaveBeenCalled();
      expect(getPackageVersion).toHaveBeenCalledTimes(2);
    });

    it('should not ask for confirmation if react versions match using 1.n convention', async () => {
      const getFlexUIVersion = jest.fn().mockResolvedValue('1.n');
      const getUIDependencies = jest.fn().mockResolvedValue(dependencies);
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      const confirm = jest.spyOn(questions, 'confirm');
      const getPackageVersion = jest.spyOn(fsScript, 'getPackageVersion').mockReturnValue('16.13.1');

      await deployScript._verifyFlexUIConfiguration();

      expect(confirm).not.toHaveBeenCalled();
      expect(getPackageVersion).toHaveBeenCalledTimes(2);
    });

    it('should confirm to allow deployment if react version is mismatched', async () => {
      const getFlexUIVersion = jest.fn().mockResolvedValue('^1');
      const getUIDependencies = jest.fn().mockResolvedValue(dependencies);
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      const confirm = jest.spyOn(questions, 'confirm').mockResolvedValue(true);
      const getPackageVersion = jest.spyOn(fsScript, 'getPackageVersion').mockReturnValue('16.12.1');

      await deployScript._verifyFlexUIConfiguration();

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(getPackageVersion).toHaveBeenCalledTimes(2);
    });

    it('should reject confirm to allow deployment if react version is mismatched', async (done) => {
      const getFlexUIVersion = jest.fn().mockResolvedValue('^1');
      const getUIDependencies = jest.fn().mockResolvedValue(dependencies);
      ConfigurationClient.mockImplementation(() => ({ getFlexUIVersion, getUIDependencies }));

      const confirm = jest.spyOn(questions, 'confirm').mockResolvedValue(false);
      const getPackageVersion = jest.spyOn(fsScript, 'getPackageVersion').mockReturnValue('16.12.1');

      try {
        await deployScript._verifyFlexUIConfiguration();
      } catch (e) {
        expect(confirm).toHaveBeenCalledTimes(1);
        expect(getPackageVersion).toHaveBeenCalledTimes(2);
        expect(e).toBeInstanceOf(UserActionError);

        done();
      }
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

  describe('_getDefaultUIDependencies', () => {
    it('should return react 16.5.2', () => {
      const result = deployScript._getDefaultUIDependencies('1.27.0', {});
      expect(result.react).toEqual('16.5.2');
      expect(result['react-dom']).toEqual('16.5.2');
    });

    it('should return react 17.0.2', () => {
      const result = deployScript._getDefaultUIDependencies('2.0.0', {});
      expect(result.react).toEqual('17.0.2');
      expect(result['react-dom']).toEqual('17.0.2');
    });

    it('should return whatever passed', () => {
      const uiDeps = { react: '18.0.0', 'react-dom': '18.0.0' };
      const result = deployScript._getDefaultUIDependencies('1.27.0', uiDeps);
      expect(result).toEqual(uiDeps);
    });
  });
});
