import { PluginResource, PluginsClient, PluginServiceHTTPClient } from 'flex-plugins-api-client';

import archivePluginScript from '../archivePlugin';

describe('ArchivePluginScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginsClient = new PluginsClient(httpClient);

  const archive = jest.spyOn(pluginsClient, 'archive');

  const plugin: PluginResource = {
    sid: 'FP00000000000000000000000000000001',
    account_sid: 'AC00000000000000000000000000000000',
    unique_name: 'plugin1',
    friendly_name: '',
    description: '',
    archived: true,
    date_created: '',
    date_updated: '',
  };

  const script = archivePluginScript(pluginsClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should archive plugin', async () => {
    archive.mockResolvedValue(plugin);

    const result = await script({ name: plugin.unique_name });

    expect(archive).toHaveBeenCalledTimes(1);
    expect(archive).toHaveBeenCalledWith(plugin.unique_name);
    expect(result).toEqual({
      sid: plugin.sid,
      name: plugin.unique_name,
      friendlyName: plugin.friendly_name,
      description: plugin.description,
      isArchived: plugin.archived,
      dateCreated: plugin.date_created,
      dateUpdated: plugin.date_updated,
    });
  });
});
