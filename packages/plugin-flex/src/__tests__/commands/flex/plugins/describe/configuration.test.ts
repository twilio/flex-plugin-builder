import { DescribeConfiguration } from '@twilio/flex-plugins-api-client';

import createTest from '../../../../framework';
import FlexPluginsDescribeConfiguration from '../../../../../commands/flex/plugins/describe/configuration';

describe('Commands/Describe/FlexPluginsDescribeConfiguration', () => {
  const configuration: DescribeConfiguration = {
    sid: 'FJ00000000000000000000000000000',
    name: 'configuration-name',
    description: 'the-description',
    isActive: false,
    isArchived: false,
    plugins: [],
    dateCreated: '',
  };

  const describeConfiguration = jest.fn();

  const mockPluginsApiToolkit = (cmd: FlexPluginsDescribeConfiguration) => {
    // @ts-ignore
    jest.spyOn(cmd, 'pluginsApiToolkit', 'get').mockReturnValue({ describeConfiguration });
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDescribeConfiguration.hasOwnProperty('flags')).toEqual(true);
  });

  it('should call describeConfiguration from the toolkit', async () => {
    const cmd = await createTest(FlexPluginsDescribeConfiguration)('--sid', configuration.sid);

    describeConfiguration.mockResolvedValue(configuration);
    mockPluginsApiToolkit(cmd);

    const result = await cmd.getResource();
    expect(result).toEqual(configuration);
    expect(cmd.pluginsApiToolkit.describeConfiguration).toHaveBeenCalledTimes(1);
    expect(cmd.pluginsApiToolkit.describeConfiguration).toHaveBeenCalledWith({ sid: configuration.sid });
  });
});
