import { Plugin } from 'flex-plugins-api-toolkit';

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
  const getServerlessSid = jest.fn();
  const deleteEnvironment = jest.fn();
  const getEnvironment = jest.fn();

  const mockPluginsApiToolkit = (cmd: FlexPluginsArchivePlugin) => {
    // @ts-ignore
    jest.spyOn(cmd, 'flexConfigurationClient', 'get').mockReturnValue({ getServerlessSid });

    // @ts-ignore
    jest.spyOn(cmd, 'pluginsApiToolkit', 'get').mockReturnValue({ archivePlugin });

    // @ts-ignore
    jest.spyOn(cmd, 'serverlessClient', 'get').mockReturnValue({ deleteEnvironment, getEnvironment });
  };
  const createCmd = async () => createTest(FlexPluginsArchivePlugin)('--name', plugin.name);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should archive configuration', async () => {
    const cmd = await createCmd();
    archivePlugin.mockResolvedValue(plugin);
    mockPluginsApiToolkit(cmd);

    getServerlessSid.mockResolvedValue(serviceSid);
    getEnvironment.mockResolvedValue(environment);

    const result = await cmd.doArchive();

    expect(result).toEqual(plugin);
    expect(cmd.pluginsApiToolkit.archivePlugin).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsApiToolkit.archivePlugin).toHaveBeenCalledWith({ name: plugin.name });
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
