import { PluginVersionResource, PluginVersionsClient, PluginServiceHTTPClient } from 'flex-plugins-api-client';

import archivePluginVersionScript from '../archivePluginVersion';

describe('ArchivePluginScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginVersionsClient = new PluginVersionsClient(httpClient);

  const archive = jest.spyOn(pluginVersionsClient, 'archive');

  const pluginVersion: PluginVersionResource = {
    sid: 'FV00000000000000000000000000000001',
    account_sid: 'AC00000000000000000000000000000000',
    plugin_sid: 'FP00000000000000000000000000000001',
    version: '1.0.0',
    plugin_url: 'https://twilio.com/plugin1',
    private: true,
    archived: true,
    changelog: '',
    date_created: '',
  };

  const script = archivePluginVersionScript(pluginVersionsClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should archive plugin', async () => {
    archive.mockResolvedValue(pluginVersion);

    const result = await script({ name: pluginVersion.plugin_sid, version: pluginVersion.version });

    expect(archive).toHaveBeenCalledTimes(1);
    expect(archive).toHaveBeenCalledWith(pluginVersion.plugin_sid, pluginVersion.version);
    expect(result).toEqual({
      sid: pluginVersion.sid,
      version: pluginVersion.version,
      url: pluginVersion.plugin_url,
      changelog: pluginVersion.changelog,
      isPrivate: pluginVersion.private,
      isArchived: pluginVersion.archived,
      dateCreated: pluginVersion.date_created,
    });
  });
});
