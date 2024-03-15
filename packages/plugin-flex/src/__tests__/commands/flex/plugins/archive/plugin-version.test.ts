import { PluginVersion } from '@twilio/flex-plugins-api-client';
import { TwilioApiError } from '@twilio/flex-dev-utils';

import createTest from '../../../../framework';
import FlexPluginsArchivePluginVersion from '../../../../../commands/flex/plugins/archive/plugin-version';

describe('Commands/Archive/FlexPluginsArchivePluginVersion', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const environment = { sid: 'ZE00000000000000000000000000000000' };
  const pluginName = 'plugin-name';
  const pluginVersion: PluginVersion = {
    sid: 'PV00000000000000000000000000000',
    version: '1.2.3',
    url: 'https://twilio.com/plugin',
    changelog: 'the-description',
    isArchived: true,
    isPrivate: false,
    dateCreated: '',
  };
  const archivePluginVersion = jest.fn();
  const describePluginVersion = jest.fn();
  const getServerlessSid = jest.fn();
  const getBuild = jest.fn();
  const createBuildAndDeploy = jest.fn();
  const deleteEnvironment = jest.fn();
  const getEnvironment = jest.fn();

  const mockPluginsApiToolkit = (cmd: FlexPluginsArchivePluginVersion) => {
    // @ts-ignore
    jest.spyOn(cmd, 'pluginsApiToolkit', 'get').mockReturnValue({ archivePluginVersion, describePluginVersion });

    // @ts-ignore
    jest.spyOn(cmd, 'flexConfigurationClient', 'get').mockReturnValue({ getServerlessSid });

    jest
      .spyOn(cmd, 'serverlessClient', 'get')
      // @ts-ignore
      .mockReturnValue({ getBuild, createBuildAndDeploy, getEnvironment, deleteEnvironment });
  };
  const createCmd = async () => {
    const cmd = await createTest(FlexPluginsArchivePluginVersion)(
      '--name',
      pluginName,
      '--version',
      pluginVersion.version,
    );
    await cmd.init();
    return cmd;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('doArchive', () => {
    const goodBuild = {
      serviceSid,
      dependencies: {
        abc: '123',
      },
      functionVersions: [
        {
          sid: 'FV000000000000000000000000000000',
        },
      ],
      assetVersions: [
        {
          sid: 'FV000000000000000000000000000001',
          path: `/plugins/${pluginName}/${pluginVersion.version}/bundle.js`,
        },
        {
          sid: 'FV000000000000000000000000000002',
          path: 'another-path',
        },
      ],
    };
    const badBuild = {
      assetVersions: [
        {
          sid: 'FV000000000000000000000000000001',
          path: 'some path',
        },
        {
          sid: 'FV000000000000000000000000000002',
          path: 'another-path',
        },
      ],
    };

    it('should fail to archive if archiving on plugins-api fails', async (done) => {
      const err = new Error('some message');

      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockRejectedValue(err);

      try {
        await cmd.doArchive();
      } catch (e) {
        expect(e.message).toEqual(err.message);
        expect(archivePluginVersion).toHaveBeenCalledTimes(1);
        expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(describePluginVersion).not.toHaveBeenCalled();
        done();
      }
    });

    it('should quit if already archived and no serviceSid is found', async (done) => {
      const err = new TwilioApiError(20400, 'Plugin version is already archived.', 400);

      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockRejectedValue(err);
      describePluginVersion.mockResolvedValue(pluginVersion);
      getServerlessSid.mockResolvedValue(null);

      try {
        await cmd.doArchive();
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioApiError);
        expect(archivePluginVersion).toHaveBeenCalledTimes(1);
        expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(describePluginVersion).toHaveBeenCalledTimes(1);
        expect(describePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(getServerlessSid).toHaveBeenCalledTimes(1);
        expect(getBuild).not.toHaveBeenCalled();
        done();
      }
    });

    it('should quit if already archived and no build is found', async (done) => {
      const err = new TwilioApiError(20400, 'Plugin version is already archived.', 400);

      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockRejectedValue(err);
      describePluginVersion.mockResolvedValue(pluginVersion);
      getServerlessSid.mockResolvedValue(serviceSid);
      getBuild.mockResolvedValue(null);

      try {
        await cmd.doArchive();
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioApiError);
        expect(archivePluginVersion).toHaveBeenCalledTimes(1);
        expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(describePluginVersion).toHaveBeenCalledTimes(1);
        expect(describePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(getServerlessSid).toHaveBeenCalledTimes(1);
        expect(getBuild).toHaveBeenCalledTimes(1);
        expect(getBuild).toHaveBeenCalledWith(serviceSid, pluginName);
        expect(createBuildAndDeploy).not.toHaveBeenCalled();
        done();
      }
    });

    it('should not delete serverless files if archiving on plugins api fails with 400', async () => {
      const err = new TwilioApiError(20400, 'Plugin version is part of an active release', 400);

      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      const pluginversion = { ...pluginVersion, isArchived: false };
      archivePluginVersion.mockRejectedValue(err);
      describePluginVersion.mockResolvedValue(pluginversion);

      const removeServerlessFilesSpy = jest.spyOn(cmd, 'removeServerlessFiles');
      await cmd.doArchive();
      expect(removeServerlessFilesSpy).not.toHaveBeenCalled();
    });

    it('should quit if already archived and files already removed', async (done) => {
      const err = new TwilioApiError(20400, 'Plugin version is already archived.', 400);

      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockRejectedValue(err);
      describePluginVersion.mockResolvedValue(pluginVersion);
      getServerlessSid.mockResolvedValue(serviceSid);
      getBuild.mockResolvedValue(badBuild);

      try {
        await cmd.doArchive();
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioApiError);
        expect(archivePluginVersion).toHaveBeenCalledTimes(1);
        expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(describePluginVersion).toHaveBeenCalledTimes(1);
        expect(describePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(getServerlessSid).toHaveBeenCalledTimes(1);
        expect(getBuild).toHaveBeenCalledTimes(1);
        expect(getBuild).toHaveBeenCalledWith(serviceSid, pluginName);
        expect(createBuildAndDeploy).not.toHaveBeenCalled();
        done();
      }
    });

    it('should clean up environment if there are no more asset and function versions', async () => {
      const build = {
        serviceSid,
        dependencies: {
          abc: '123',
        },
        functionVersions: [],
        assetVersions: [
          {
            sid: 'FV000000000000000000000000000001',
            path: `/plugins/${pluginName}/${pluginVersion.version}/bundle.js`,
          },
        ],
      };
      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockResolvedValue(pluginVersion);
      getServerlessSid.mockResolvedValue(serviceSid);
      getBuild.mockResolvedValue(build);
      getEnvironment.mockResolvedValue(environment);
      deleteEnvironment.mockResolvedValue(true);

      const result = await cmd.doArchive();

      expect(result).toEqual(pluginVersion);
      expect(archivePluginVersion).toHaveBeenCalledTimes(1);
      expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
      expect(describePluginVersion).not.toHaveBeenCalled();
      expect(getServerlessSid).toHaveBeenCalledTimes(1);
      expect(getBuild).toHaveBeenCalledTimes(1);
      expect(getBuild).toHaveBeenCalledWith(serviceSid, pluginName);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(deleteEnvironment).toHaveBeenCalledTimes(1);
      expect(deleteEnvironment).toHaveBeenCalledWith(serviceSid, environment.sid);
      expect(createBuildAndDeploy).not.toHaveBeenCalled();
    });

    it('should not clean up environment if there are no more asset versions but there are function versions', async () => {
      const build = {
        serviceSid,
        dependencies: {
          abc: '123',
        },
        functionVersions: [
          {
            sid: 'FV000000000000000000000000000000',
          },
        ],
        assetVersions: [
          {
            sid: 'FV000000000000000000000000000001',
            path: `/plugins/${pluginName}/${pluginVersion.version}/bundle.js`,
          },
        ],
      };
      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockResolvedValue(pluginVersion);
      getServerlessSid.mockResolvedValue(serviceSid);
      getBuild.mockResolvedValue(build);

      const result = await cmd.doArchive();

      expect(result).toEqual(pluginVersion);
      expect(archivePluginVersion).toHaveBeenCalledTimes(1);
      expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
      expect(describePluginVersion).not.toHaveBeenCalled();
      expect(getServerlessSid).toHaveBeenCalledTimes(1);
      expect(getBuild).toHaveBeenCalledTimes(1);
      expect(getBuild).toHaveBeenCalledWith(serviceSid, pluginName);
      expect(getEnvironment).not.toHaveBeenCalled();
      expect(deleteEnvironment).not.toHaveBeenCalled();
      expect(createBuildAndDeploy).toHaveBeenCalledTimes(1);
    });

    it('should archive configuration', async () => {
      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockResolvedValue(pluginVersion);
      getServerlessSid.mockResolvedValue(serviceSid);
      getBuild.mockResolvedValue(goodBuild);

      const result = await cmd.doArchive();

      expect(result).toEqual(pluginVersion);
      expect(archivePluginVersion).toHaveBeenCalledTimes(1);
      expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
      expect(describePluginVersion).not.toHaveBeenCalled();
      expect(getServerlessSid).toHaveBeenCalledTimes(1);
      expect(getBuild).toHaveBeenCalledTimes(1);
      expect(getBuild).toHaveBeenCalledWith(serviceSid, pluginName);
      expect(createBuildAndDeploy).toHaveBeenCalledTimes(1);
    });

    it('should fail to remove files on first attempt, but remove on the second attempt', async (done) => {
      const cmd = await createCmd();
      mockPluginsApiToolkit(cmd);

      archivePluginVersion.mockResolvedValue(pluginVersion);
      getServerlessSid.mockResolvedValue(null);

      try {
        // first call
        await cmd.doArchive();
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioApiError);

        getServerlessSid.mockResolvedValue(serviceSid);
        getBuild.mockResolvedValue(goodBuild);
        // second call
        const result = await cmd.doArchive();

        expect(result).toEqual(pluginVersion);
        expect(archivePluginVersion).toHaveBeenCalledTimes(2);
        expect(archivePluginVersion).toHaveBeenCalledWith({ name: pluginName, version: pluginVersion.version });
        expect(describePluginVersion).not.toHaveBeenCalled();
        expect(getServerlessSid).toHaveBeenCalledTimes(2);
        expect(getBuild).toHaveBeenCalledTimes(1);
        expect(getBuild).toHaveBeenCalledWith(serviceSid, pluginName);
        expect(createBuildAndDeploy).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });

  it('should get name', async () => {
    const cmd = await createCmd();

    expect(cmd.getName()).toContain(pluginName);
    expect(cmd.getName()).toContain(pluginVersion.version);
  });

  it('should get resource type', async () => {
    const cmd = await createCmd();

    expect(cmd.getResourceType()).toContain('Flex');
    expect(cmd.getResourceType()).toContain('Plugin Version');
  });
});
