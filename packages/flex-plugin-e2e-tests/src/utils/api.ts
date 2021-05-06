import {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
  ConfiguredPluginsClient,
  ReleasesClient,
  PluginVersionResource,
  PluginResource,
  ReleaseResource,
  ConfigurationResource,
  ConfiguredPluginResourcePage,
} from 'flex-plugins-api-client';

const client = new PluginServiceHTTPClient(
  process.env.TWILIO_ACCOUNT_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string,
);
const pluginsClient = new PluginsClient(client);
const versionsClient = new PluginVersionsClient(client);
const configurationsClient = new ConfigurationsClient(client);
const configuredPluginsClient = new ConfiguredPluginsClient(client);
const releasesClient = new ReleasesClient(client);

const cleanup = async (): Promise<void> => {
  const resource = await configurationsClient.create({
    Name: 'E2E Test Cleanup',
    Description: 'Empty Configuration',
    Plugins: [],
  });
  await releasesClient.create({
    ConfigurationId: resource.sid,
  });
};

const getPluginVersion = async (name: string, version: string): Promise<PluginVersionResource> => {
  return versionsClient.get(name, version);
};

const getLatestPluginVersion = async (name: string): Promise<PluginVersionResource | null> => {
  try {
    return versionsClient.latest(name);
  } catch (e) {
    return null;
  }
};

const getPlugin = async (name: string): Promise<PluginResource> => {
  return pluginsClient.get(name);
};

const getActiveRelease = async (): Promise<ReleaseResource | null> => {
  return releasesClient.active();
};

const getConfiguration = async (sid: string): Promise<ConfigurationResource> => {
  return configurationsClient.get(sid);
};

const getActivePlugins = async (sid: string): Promise<ConfiguredPluginResourcePage> => {
  return configuredPluginsClient.list(sid);
};

export default {
  cleanup,
  getPluginVersion,
  getLatestPluginVersion,
  getPlugin,
  getActiveRelease,
  getConfiguration,
  getActivePlugins,
};
