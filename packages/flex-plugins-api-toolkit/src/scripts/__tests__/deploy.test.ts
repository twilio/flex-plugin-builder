import { PluginServiceHTTPClient, PluginsClient, PluginVersionsClient } from 'flex-plugins-api-client';

import deployScript, { DeployOption } from '../deploy';

describe('DeployScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginsClient = new PluginsClient(httpClient);
  const versionsClient = new PluginVersionsClient(httpClient);

  const upsert = jest.spyOn(pluginsClient, 'upsert');
  const create = jest.spyOn(versionsClient, 'create');

  const script = deployScript(pluginsClient, versionsClient);

  const requiredFields: DeployOption = {
    name: 'plugin-name',
    url: 'https://twilio.com',
    version: '1.2.3',
  };
  const optionalFields: Partial<DeployOption> = {
    friendlyName: 'the name',
    description: 'the description',
    changelog: 'changes',
    isPrivate: true,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should deploy a new version from required versions only', async () => {
    upsert.mockResolvedValue({
      sid: 'FP123',
      account_sid: 'AC123',
      unique_name: requiredFields.name,
      description: '',
      friendly_name: '',
      archived: false,
      date_created: 'some-date',
      date_updated: 'some-date',
    });
    create.mockResolvedValue({
      sid: 'FV123',
      account_sid: 'AC123',
      plugin_sid: 'FP123',
      plugin_url: requiredFields.url,
      version: requiredFields.version,
      private: false,
      archived: false,
      changelog: '',
      date_created: 'some-date',
    });

    const options = { ...requiredFields };
    const plugin = await script(options);

    expect(upsert).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(plugin.pluginSid).toEqual('FP123');
    expect(plugin.pluginVersionSid).toEqual('FV123');
    expect(plugin.name).toEqual(requiredFields.name);
    expect(plugin.version).toEqual(requiredFields.version);
    expect(plugin.url).toEqual(requiredFields.url);
    expect(plugin.friendlyName).toEqual('');
    expect(plugin.changelog).toEqual('');
    expect(plugin.description).toEqual('');
    expect(plugin.isPrivate).toEqual(false);
  });

  it('should deploy a new version from all options', async () => {
    upsert.mockResolvedValue({
      sid: 'FP123',
      account_sid: 'AC123',
      unique_name: requiredFields.name,
      description: optionalFields.description as string,
      friendly_name: optionalFields.friendlyName as string,
      archived: false,
      date_created: 'some-date',
      date_updated: 'some-date',
    });
    create.mockResolvedValue({
      sid: 'FV123',
      account_sid: 'AC123',
      plugin_sid: 'FP123',
      plugin_url: requiredFields.url,
      version: requiredFields.version,
      private: true,
      archived: false,
      changelog: optionalFields.changelog as string,
      date_created: 'some-date',
    });

    const options = { ...requiredFields, ...optionalFields };
    const plugin = await script(options);

    expect(upsert).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(plugin.pluginSid).toEqual('FP123');
    expect(plugin.pluginVersionSid).toEqual('FV123');
    expect(plugin.name).toEqual(options.name);
    expect(plugin.version).toEqual(options.version);
    expect(plugin.url).toEqual(options.url);
    expect(plugin.friendlyName).toEqual(options.friendlyName);
    expect(plugin.changelog).toEqual(options.changelog);
    expect(plugin.description).toEqual(options.description);
    expect(plugin.isPrivate).toEqual(true);
    expect(plugin.isArchived).toEqual(false);
  });
});
