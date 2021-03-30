import { ConfigurationResource, ConfigurationsClient, PluginServiceHTTPClient } from 'flex-plugins-api-client';

import archiveConfigurationScript from '../archiveConfiguration';

describe('ArchiveConfigurationScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const configurationsClient = new ConfigurationsClient(httpClient);

  const archive = jest.spyOn(configurationsClient, 'archive');

  const configuration: ConfigurationResource = {
    sid: 'FJ00000000000000000000000000000001',
    account_sid: 'AC00000000000000000000000000000000',
    name: 'some name',
    archived: true,
    description: '',
    date_created: '',
  };

  const script = archiveConfigurationScript(configurationsClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should archive configuration', async () => {
    archive.mockResolvedValue(configuration);

    const result = await script({ sid: configuration.sid });

    expect(archive).toHaveBeenCalledTimes(1);
    expect(archive).toHaveBeenCalledWith(configuration.sid);
    expect(result).toEqual({
      sid: configuration.sid,
      name: configuration.name,
      description: configuration.description,
      isArchived: configuration.archived,
      dateCreated: configuration.date_created,
    });
  });
});
