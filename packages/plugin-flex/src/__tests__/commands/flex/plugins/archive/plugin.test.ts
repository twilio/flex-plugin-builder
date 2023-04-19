import { Plugin } from '@twilio/flex-plugins-api-client';
import { TwilioApiError, TwilioCliError } from '@twilio/flex-dev-utils';

import createTest from '../../../../framework';
import FlexPluginsArchivePlugin from '../../../../../commands/flex/plugins/archive/plugin';

describe('Commands/Archive/FlexPluginsArchivePlugin', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const environment = { sid: 'ZE00000000000000000000000000000000' };
  const plugin: Plugin = {
    sid: 'FP00000000000000000000000000000',
    name: 'plugin-name',
    friendlyName: 'plugin name',
    description: 'the-description',
    isArchived: false,
    dateCreated: '',
    dateUpdated: '',
  };
  const archivePlugin = jest.fn();
  const describePlugin = jest.fn();
  const getServerlessSid = jest.fn();
  const deleteEnvironment = jest.fn();
  const getEnvironment = jest.fn();

  const mockPluginsApiToolkit = (cmd: FlexPluginsArchivePlugin) => {
    // @ts-ignore
    jest.spyOn(cmd, 'flexConfigurationClient', 'get').mockReturnValue({ getServerlessSid });

    // @ts-ignore
    jest.spyOn(cmd, 'pluginsApiToolkit', 'get').mockReturnValue({ archivePlugin, describePlugin });

    // @ts-ignore
    jest.spyOn(cmd, 'serverlessClient', 'get').mockReturnValue({ deleteEnvironment, getEnvironment });
  };

  const createCmd = async () => {
    const cmd = await createTest(FlexPluginsArchivePlugin)('--name', plugin.name);
    await cmd.init();
    return cmd;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should archive configuration', async () => {
    const cmd = await createCmd();
    archivePlugin.mockResolvedValue(plugin);
    mockPluginsApiToolkit(cmd);

    getServerlessSid.mockResolvedValue(serviceSid);
    getEnvironment.mockResolvedValue(environment);
    deleteEnvironment.mockResolvedValue(true);

    const result = await cmd.doArchive();

    expect(result).toEqual(plugin);
    expect(cmd.pluginsApiToolkit.archivePlugin).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsApiToolkit.archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
    expect(cmd.serverlessClient.deleteEnvironment).toHaveBeenCalledTimes(1);
    expect(cmd.serverlessClient.deleteEnvironment).toHaveBeenCalledWith(serviceSid, environment.sid);
  });

  it('should quit if already archived and no serviceSid is found', async (done) => {
    const err = new TwilioApiError(20400, 'Plugin is already archived.', 400);

    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockRejectedValue(err);
    describePlugin.mockResolvedValue(plugin);
    getServerlessSid.mockResolvedValue(null);

    try {
      await cmd.doArchive();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioApiError);
      expect(archivePlugin).toHaveBeenCalledTimes(1);
      expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
      expect(archivePlugin).toHaveBeenCalledTimes(1);
      expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
      expect(getServerlessSid).toHaveBeenCalledTimes(1);
      done();
    }
  });

  it('should quit if archiving on the api fails', async (done) => {
    const err = new TwilioApiError(20400, 'message', 500);

    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockRejectedValue(err);

    try {
      await cmd.doArchive();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioApiError);
      expect(e.status).toEqual(500);
      expect(e.message).toEqual('message');
      expect(archivePlugin).toHaveBeenCalledTimes(1);
      expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
      expect(describePlugin).not.toHaveBeenCalled();
      done();
    }
  });

  it('should not delete ServerlessEnvironment if archiving on the api fails with 400', async () => {
    const err = new TwilioApiError(20400, 'Plugin is part of an active release', 400);
    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockRejectedValue(err);
    describePlugin.mockResolvedValue(plugin);

    const removeServerlessEnvironmentSpy = jest.spyOn(cmd, 'removeServerlessEnvironment');

    await cmd.doArchive();

    expect(removeServerlessEnvironmentSpy).not.toHaveBeenCalled();
  });

  it('should quit if already archived and no environment is found', async (done) => {
    const err = new TwilioApiError(20400, 'Plugin is already archived.', 400);

    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockRejectedValue(err);
    describePlugin.mockResolvedValue(plugin);
    getServerlessSid.mockResolvedValue(serviceSid);
    getEnvironment.mockResolvedValue(null);

    try {
      await cmd.doArchive();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioApiError);
      expect(archivePlugin).toHaveBeenCalledTimes(1);
      expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
      expect(archivePlugin).toHaveBeenCalledTimes(1);
      expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
      expect(getServerlessSid).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      done();
    }
  });

  it('should quit if archive on plugins API is successful but environment cleanup is not', async (done) => {
    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockResolvedValue(plugin);
    describePlugin.mockResolvedValue(plugin);
    getServerlessSid.mockResolvedValue(serviceSid);
    getEnvironment.mockResolvedValue(environment);
    deleteEnvironment.mockResolvedValue(false);

    try {
      await cmd.doArchive();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioCliError);
      expect(archivePlugin).toHaveBeenCalledTimes(1);
      expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
      expect(getServerlessSid).toHaveBeenCalledTimes(1);
      expect(getEnvironment).toHaveBeenCalledTimes(1);
      expect(deleteEnvironment).toHaveBeenCalledTimes(1);
      expect(deleteEnvironment).toHaveBeenCalledWith(serviceSid, environment.sid);
      done();
    }
  });

  it('should clean up environment if it still exists and plugin is already archived', async () => {
    const err = new TwilioApiError(20400, 'Plugin is already archived.', 400);

    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockRejectedValue(err);
    describePlugin.mockResolvedValue(plugin);
    getServerlessSid.mockResolvedValue(serviceSid);
    getEnvironment.mockResolvedValue(environment);
    deleteEnvironment.mockResolvedValue(true);

    const result = await cmd.doArchive();

    expect(result).toEqual(plugin);
    expect(archivePlugin).toHaveBeenCalledTimes(1);
    expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
    expect(getServerlessSid).toHaveBeenCalledTimes(1);
    expect(getEnvironment).toHaveBeenCalledTimes(1);
    expect(deleteEnvironment).toHaveBeenCalledTimes(1);
    expect(deleteEnvironment).toHaveBeenCalledWith(serviceSid, environment.sid);
  });

  it('should throw an if no environment is found and there plugin is already archive', async (done) => {
    const err = new TwilioApiError(20400, 'Plugin is already archived.', 400);

    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockRejectedValue(err);
    describePlugin.mockResolvedValue(plugin);
    getServerlessSid.mockResolvedValue(null);

    try {
      await cmd.doArchive();
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioApiError);
      expect(e.message).toContain('already archived');
      expect(archivePlugin).toHaveBeenCalledTimes(1);
      expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
      expect(getServerlessSid).toHaveBeenCalledTimes(1);
      expect(getEnvironment).not.toHaveBeenCalled();
      expect(deleteEnvironment).not.toHaveBeenCalled();

      done();
    }
  });

  it('should continue without without removing environment if service already removed from archiving versions', async () => {
    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockResolvedValue(plugin);
    describePlugin.mockResolvedValue(plugin);
    getServerlessSid.mockResolvedValue(null);

    await cmd.doArchive();
    expect(archivePlugin).toHaveBeenCalledTimes(1);
    expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
    expect(getServerlessSid).toHaveBeenCalledTimes(1);
    expect(getEnvironment).not.toHaveBeenCalled();
    expect(deleteEnvironment).not.toHaveBeenCalled();
  });

  it('should continue without without removing environment if environment already removed from archiving versions', async () => {
    const cmd = await createCmd();
    mockPluginsApiToolkit(cmd);

    archivePlugin.mockResolvedValue(plugin);
    describePlugin.mockResolvedValue(plugin);
    getServerlessSid.mockResolvedValue(serviceSid);
    getEnvironment.mockResolvedValue(null);

    await cmd.doArchive();
    expect(archivePlugin).toHaveBeenCalledTimes(1);
    expect(archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
    expect(getServerlessSid).toHaveBeenCalledTimes(1);
    expect(getEnvironment).toHaveBeenCalledTimes(1);
    expect(deleteEnvironment).not.toHaveBeenCalled();
  });

  it('should get name', async () => {
    const cmd = await createCmd();

    expect(cmd.getName()).toContain(plugin.name);
  });

  it('should get resource type', async () => {
    const cmd = await createCmd();

    expect(cmd.getResourceType()).toContain('Flex');
    expect(cmd.getResourceType()).toContain('Plugin');
  });
});
