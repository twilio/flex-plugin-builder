import { PluginVersion } from 'flex-plugins-api-toolkit';

import createTest from '../../../../framework';
import FlexPluginsArchivePluginVersion from '../../../../../commands/flex/plugins/archive/plugin-version';

describe('Commands/Archive/FlexPluginsArchivePluginVersion', () => {
  const pluginName = 'plugin-name';
  const pluginVersion: PluginVersion = {
    sid: 'PV00000000000000000000000000000',
    version: '1.2.3',
    url: 'https://twilio.com/plugin',
    changelog: 'the-description',
    isArchived: false,
    isPrivate: false,
    dateCreated: '',
  };
  const archivePluginVersion = jest.fn();

  const mockPluginsApiToolkit = (cmd: FlexPluginsArchivePluginVersion) => {
    // @ts-ignore
    jest.spyOn(cmd, 'pluginsApiToolkit', 'get').mockReturnValue({ archivePluginVersion });
  };
  const createCmd = async () =>
    createTest(FlexPluginsArchivePluginVersion)('--name', pluginName, '--version', pluginVersion.version);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should archive configuration', async () => {
    const cmd = await createCmd();
    archivePluginVersion.mockResolvedValue(pluginVersion);
    mockPluginsApiToolkit(cmd);

    const result = await cmd.doArchive();

    expect(result).toEqual(pluginVersion);
    expect(cmd.pluginsApiToolkit.archivePluginVersion).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsApiToolkit.archivePluginVersion).toHaveBeenCalledWith({
      name: pluginName,
      version: pluginVersion.version,
    });
  });

  it('should get name', async () => {
    const cmd = await createCmd();

    expect(cmd.getName()).toContain(pluginName);
    expect(cmd.getName()).toContain(pluginVersion.version);
  });
});
