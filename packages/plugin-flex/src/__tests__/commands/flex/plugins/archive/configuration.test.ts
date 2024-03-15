import { Configuration } from '@twilio/flex-plugins-api-client';

import createTest from '../../../../framework';
import FlexPluginsArchiveConfiguration from '../../../../../commands/flex/plugins/archive/configuration';

describe('Commands/Archive/FlexPluginsArchiveConfiguration', () => {
  const configuration: Configuration = {
    sid: 'FJ00000000000000000000000000000',
    name: 'configuration-name',
    description: 'the-description',
    isArchived: false,
    dateCreated: '',
  };
  const archiveConfiguration = jest.fn();

  const mockPluginsApiToolkit = (cmd: FlexPluginsArchiveConfiguration) => {
    // @ts-ignore
    jest.spyOn(cmd, 'pluginsApiToolkit', 'get').mockReturnValue({ archiveConfiguration });
  };
  const createCmd = async () => {
    const cmd = await createTest(FlexPluginsArchiveConfiguration)('--sid', configuration.sid);
    await cmd.init();
    return cmd;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should archive configuration', async () => {
    const cmd = await createCmd();
    archiveConfiguration.mockResolvedValue(configuration);
    mockPluginsApiToolkit(cmd);

    const result = await cmd.doArchive();

    expect(result).toEqual(configuration);
    expect(cmd.pluginsApiToolkit.archiveConfiguration).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsApiToolkit.archiveConfiguration).toHaveBeenCalledWith({ sid: configuration.sid });
  });

  it('should get name', async () => {
    const cmd = await createCmd();

    expect(cmd.getName()).toContain(configuration.sid);
  });

  it('should get resource type', async () => {
    const cmd = await createCmd();

    expect(cmd.getResourceType()).toContain('Flex');
    expect(cmd.getResourceType()).toContain('Configuration');
  });
});
