/* eslint-disable camelcase */
import { CLIParseError } from '@oclif/parser/lib/errors';

import createTest, { getPrintMethod, mockGetPkg, mockGetter, mockPrintMethod } from '../../../framework';
import FlexPluginsDeploy, { parseVersionInput } from '../../../../commands/flex/plugins/deploy';
import { TwilioCliError } from '../../../../exceptions';
import ServerlessClient from '../../../../clients/ServerlessClient';

describe('Commands/FlexPluginsDeploy', () => {
  const serviceSid = 'ZS00000000000000000000000000000';
  const serviceSid2 = 'ZS00000000000000000000000000001';
  const defaultChangelog = 'sample changlog';
  const pkg = {
    name: 'test-package',
    description: 'the package json description',
  };
  const deployResult = {
    serviceSid,
    accountSid: 'AC00000000000000000000000000000',
    environmentSid: 'ZE00000000000000000000000000000',
    domainName: 'ruby-fox-123.twil.io',
    isPublic: false,
    nextVersion: '2.0.0',
    pluginUrl: 'https://ruby-fox-123.twil.io/plugin-url',
  };
  const pluginVersionResource = {
    sid: 'FV00000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000',
    plugin_sid: 'FP00000000000000000000000000000',
    version: deployResult.nextVersion,
    plugin_url: deployResult.pluginUrl,
    private: !deployResult.isPublic,
    changelog: 'the changelog',
    date_created: '2020',
  };
  const pluginResource = {
    sid: 'FP00000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000',
    unique_name: 'plugin-name',
    description: 'plugin description',
    friendly_name: 'plugin friendly name',
    date_created: '2020',
    date_updated: '2020',
  };

  const getServerlessSid = jest.fn();
  const hasLegacy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  const getCommand = async (...args: string[]) => {
    getServerlessSid.mockResolvedValue(null);
    hasLegacy.mockResolvedValue(false);

    const cmd = await createTest(FlexPluginsDeploy)('--changelog', defaultChangelog, ...args);

    jest.spyOn(cmd, 'builderVersion', 'get').mockReturnValue(4);
    jest.spyOn(cmd, 'isPluginFolder').mockReturnValue(true);
    jest.spyOn(cmd, 'doRun').mockReturnThis();

    mockGetPkg(cmd, pkg);
    mockGetter(cmd, 'flexConfigurationClient', { getServerlessSid });
    mockGetter(cmd, 'serverlessClient', { hasLegacy });

    await cmd.run();

    return cmd;
  };

  const getPluginVersionsCommand = async (changelog?: string) => {
    const args = [];
    if (changelog) {
      args.push('--changelog', changelog);
    }

    const cmd = await getCommand(...args);
    jest.spyOn(cmd.pluginVersionsClient, 'create').mockResolvedValue(pluginVersionResource);

    return cmd;
  };

  describe('parseVersionInput', () => {
    it('should parse semver', () => {
      ['1.0.0', '1.0.0-rc.1'].forEach((s) => expect(parseVersionInput(s)).toEqual(s));
    });

    it('should throw error if invalid semver', (done) => {
      try {
        parseVersionInput('not-a-semver');
      } catch (e) {
        expect(e instanceof CLIParseError).toEqual(true);
        expect(e.message).toContain('valid SemVer');
        done();
      }
    });

    it('should throw error version 0.0.0 is used', (done) => {
      try {
        parseVersionInput('0.0.0');
      } catch (e) {
        expect(e instanceof CLIParseError).toEqual(true);
        expect(e.message).toContain('cannot be');
        done();
      }
    });
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDeploy.hasOwnProperty('flags')).toEqual(true);
  });

  it('should get major bump level', async () => {
    const cmd = await getCommand('--major');

    expect(cmd.bumpLevel).toEqual('major');
  });

  it('should get minor bump level', async () => {
    const cmd = await getCommand('--minor');

    expect(cmd.bumpLevel).toEqual('minor');
  });

  it('should get patch bump level', async () => {
    const cmd = await getCommand('--patch');

    expect(cmd.bumpLevel).toEqual('patch');
  });

  it('should get patch bump level without any flags', async () => {
    const cmd = await getCommand();

    expect(cmd.bumpLevel).toEqual('patch');
  });

  it('should call registerPluginVersion without any changelog', async () => {
    const cmd = await getPluginVersionsCommand();
    const result = await cmd.registerPluginVersion(deployResult);

    expect(result).toEqual(pluginVersionResource);
    expect(cmd.pluginVersionsClient.create).toHaveBeenCalledTimes(1);
    expect(cmd.pluginVersionsClient.create).toHaveBeenCalledWith(pkg.name, {
      Version: deployResult.nextVersion,
      PluginUrl: deployResult.pluginUrl,
      Private: !deployResult.isPublic,
      Changelog: defaultChangelog,
    });
  });

  it('should call registerPluginVersion with changelog', async () => {
    const cmd = await getPluginVersionsCommand('the-changelog');

    const result = await cmd.registerPluginVersion(deployResult);

    expect(result).toEqual(pluginVersionResource);
    expect(cmd.pluginVersionsClient.create).toHaveBeenCalledTimes(1);
    expect(cmd.pluginVersionsClient.create).toHaveBeenCalledWith(pkg.name, {
      Version: deployResult.nextVersion,
      PluginUrl: deployResult.pluginUrl,
      Private: !deployResult.isPublic,
      Changelog: 'the-changelog',
    });
  });

  it('should call registerPlugin', async () => {
    const cmd = await getCommand();

    jest.spyOn(cmd.pluginsClient, 'upsert').mockResolvedValue(pluginResource);

    const result = await cmd.registerPlugin();

    expect(result).toEqual(pluginResource);
    expect(cmd.pluginsClient.upsert).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsClient.upsert).toHaveBeenCalledWith({
      UniqueName: pkg.name,
      FriendlyName: pkg.name,
      Description: '',
    });
  });

  it('should call registerPlugin with custom description', async () => {
    const cmd = await getCommand('--description', 'some description');

    jest.spyOn(cmd.pluginsClient, 'upsert').mockResolvedValue(pluginResource);
    const result = await cmd.registerPlugin();

    expect(result).toEqual(pluginResource);
    expect(cmd.pluginsClient.upsert).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsClient.upsert).toHaveBeenCalledWith({
      UniqueName: pkg.name,
      FriendlyName: pkg.name,
      Description: 'some description',
    });
  });

  it('should validate brand new plugin', async () => {
    const cmd = await getCommand();

    jest.spyOn(cmd.pluginsClient, 'get').mockRejectedValue(new TwilioCliError());
    jest.spyOn(cmd.pluginVersionsClient, 'latest');

    await cmd.validatePlugin();

    expect(cmd.pluginsClient.get).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsClient.get).toHaveBeenCalledWith(pkg.name);
    expect(cmd.pluginVersionsClient.latest).not.toHaveBeenCalled();

    // @ts-ignore
    const args = cmd.scriptArgs;
    expect(args[0]).toEqual('version');
    expect(args[1]).toEqual('0.0.1');
    expect(args[2]).toEqual('--pilot-plugins-api');
  });

  it('should validate plugin as a minor bump', async () => {
    const cmd = await getCommand('--minor');

    jest.spyOn(cmd.pluginsClient, 'get').mockResolvedValue(pluginResource);
    jest.spyOn(cmd.pluginVersionsClient, 'latest').mockResolvedValue(pluginVersionResource);
    await cmd.validatePlugin();

    expect(cmd.pluginsClient.get).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsClient.get).toHaveBeenCalledWith(pkg.name);
    expect(cmd.pluginVersionsClient.latest).toHaveBeenCalledTimes(1);
    expect(cmd.pluginVersionsClient.latest).toHaveBeenCalledWith(pkg.name);

    // @ts-ignore
    const args = cmd.scriptArgs;
    expect(args[0]).toEqual('version');
    expect(args[1]).toEqual('2.1.0');
    expect(args[2]).toEqual('--pilot-plugins-api');
  });

  it('should invalidate plugin because next version is smaller', async (done) => {
    const cmd = await getCommand('--version', '0.0.1');

    jest.spyOn(cmd.pluginsClient, 'get').mockResolvedValue(pluginResource);
    jest.spyOn(cmd.pluginVersionsClient, 'latest').mockResolvedValue(pluginVersionResource);

    try {
      await cmd.validatePlugin();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(e.message).toContain('version 0.0.1 must be greater than 2.0.0');
      expect(cmd.pluginsClient.get).toHaveBeenCalledTimes(1);
      expect(cmd.pluginsClient.get).toHaveBeenCalledWith(pkg.name);
      expect(cmd.pluginVersionsClient.latest).toHaveBeenCalledTimes(1);
      expect(cmd.pluginVersionsClient.latest).toHaveBeenCalledWith(pkg.name);

      done();
    }
  });

  it('should do nothing if no serviceSid is found', async () => {
    const cmd = await getCommand();

    getServerlessSid.mockResolvedValue(null);

    await cmd.checkForLegacy();

    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).not.toHaveBeenCalled();
  });

  it('should print nothing if no legacy plugin is found', async () => {
    const cmd = await getCommand();

    getServerlessSid.mockResolvedValue(serviceSid2);
    hasLegacy.mockResolvedValue(false);

    mockPrintMethod(cmd, 'warnHasLegacy');

    await cmd.checkForLegacy();

    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledWith(serviceSid2, pkg.name);
    expect(getPrintMethod(cmd, 'warnHasLegacy')).not.toHaveBeenCalled();
  });

  it('should print warning if legacy plugin found', async () => {
    const cmd = await getCommand();

    getServerlessSid.mockResolvedValue(serviceSid2);
    hasLegacy.mockResolvedValue(true);

    mockPrintMethod(cmd, 'warnHasLegacy');

    await cmd.checkForLegacy();

    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.hasLegacy).toHaveBeenCalledWith(serviceSid2, pkg.name);
    expect(getPrintMethod(cmd, 'warnHasLegacy')).toHaveBeenCalledTimes(1);
  });

  it('should do nothing if service already exists and has correct name', async () => {
    const cmd = await getCommand();

    getServerlessSid.mockResolvedValue(serviceSid);
    mockGetter(cmd, 'serverlessClient', {
      getService: jest.fn().mockResolvedValue({ friendlyName: ServerlessClient.NewService.friendlyName }),
      updateServiceName: jest.fn(),
      getOrCreateDefaultService: jest.fn(),
    });
    mockGetter(cmd, 'flexConfigurationClient', {
      getServerlessSid,
      unregisterServerlessSid: jest.fn(),
      registerServerlessSid: jest.fn(),
    });
    await cmd.checkServerlessInstance();

    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.getService).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.updateServiceName).not.toHaveBeenCalled();
    expect(cmd.serverlessClient.getOrCreateDefaultService).not.toHaveBeenCalled();
    expect(cmd.flexConfigurationClient.registerServerlessSid).not.toHaveBeenCalled();
    expect(cmd.flexConfigurationClient.unregisterServerlessSid).not.toHaveBeenCalled();
  });

  it('should do update service name', async () => {
    const cmd = await getCommand();

    getServerlessSid.mockResolvedValue(serviceSid);
    mockGetter(cmd, 'serverlessClient', {
      getService: jest.fn().mockResolvedValue({ friendlyName: 'something else' }),
      updateServiceName: jest.fn(),
      getOrCreateDefaultService: jest.fn(),
    });
    mockGetter(cmd, 'flexConfigurationClient', {
      getServerlessSid,
      unregisterServerlessSid: jest.fn(),
      registerServerlessSid: jest.fn(),
    });

    await cmd.checkServerlessInstance();

    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.getService).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.updateServiceName).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.getOrCreateDefaultService).not.toHaveBeenCalled();
    expect(cmd.flexConfigurationClient.registerServerlessSid).not.toHaveBeenCalled();
    expect(cmd.flexConfigurationClient.unregisterServerlessSid).not.toHaveBeenCalled();
  });

  it('should create new service', async () => {
    const cmd = await getCommand();

    getServerlessSid.mockResolvedValue(null);
    mockGetter(cmd, 'serverlessClient', {
      getService: jest.fn(),
      updateServiceName: jest.fn(),
      getOrCreateDefaultService: jest.fn().mockResolvedValue({ sid: serviceSid2 }),
    });
    mockGetter(cmd, 'flexConfigurationClient', {
      getServerlessSid,
      unregisterServerlessSid: jest.fn(),
      registerServerlessSid: jest.fn(),
    });

    await cmd.checkServerlessInstance();

    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.getService).not.toHaveBeenCalled();
    expect(cmd.serverlessClient.updateServiceName).not.toHaveBeenCalled();
    expect(cmd.serverlessClient.getOrCreateDefaultService).toHaveBeenCalledTimes(1);
    expect(cmd.flexConfigurationClient.registerServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.flexConfigurationClient.registerServerlessSid).toHaveBeenCalledWith(serviceSid2);
    expect(cmd.flexConfigurationClient.unregisterServerlessSid).not.toHaveBeenCalled();
  });

  it('should re-create new service', async () => {
    const cmd = await getCommand();

    mockGetter(cmd, 'serverlessClient', {
      getService: jest.fn().mockRejectedValue(new TwilioCliError()),
      updateServiceName: jest.fn(),
      getOrCreateDefaultService: jest.fn().mockResolvedValue({ sid: serviceSid2 }),
    });
    mockGetter(cmd, 'flexConfigurationClient', {
      getServerlessSid: jest.fn().mockResolvedValue(serviceSid),
      unregisterServerlessSid: jest.fn(),
      registerServerlessSid: jest.fn(),
    });
    await cmd.checkServerlessInstance();

    expect(cmd.flexConfigurationClient.getServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.getService).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.updateServiceName).not.toHaveBeenCalled();
    expect(cmd.serverlessClient.getOrCreateDefaultService).toHaveBeenCalledTimes(1);
    expect(cmd.flexConfigurationClient.registerServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.flexConfigurationClient.registerServerlessSid).toHaveBeenCalledWith(serviceSid2);
    expect(cmd.flexConfigurationClient.unregisterServerlessSid).toHaveBeenCalledTimes(1);
    expect(cmd.flexConfigurationClient.unregisterServerlessSid).toHaveBeenCalledWith(serviceSid);
  });

  it('should have compatibility set', async () => {
    const cmd = await getCommand();

    expect(cmd.checkCompatibility).toEqual(true);
  });
});
