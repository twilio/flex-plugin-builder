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
} from '@twilio/flex-plugins-api-client';
import { PluginServiceHttpOption } from '@twilio/flex-plugins-api-client/dist/clients/client';
import { logger } from '@twilio/flex-dev-utils';

import { testParams } from '../core';
import * as serverlessApi from './serverless-api';

const options: PluginServiceHttpOption = {};
if (testParams.config.region) {
  // @ts-ignore
  options.region = testParams.config.region;
}

const client = new PluginServiceHTTPClient(
  testParams.secrets.api.accountSid,
  testParams.secrets.api.authToken,
  options,
);
const pluginsClient = new PluginsClient(client);
const versionsClient = new PluginVersionsClient(client);
const configurationsClient = new ConfigurationsClient(client);
const configuredPluginsClient = new ConfiguredPluginsClient(client);
const releasesClient = new ReleasesClient(client);

const cleanup = async (): Promise<void> => {
  logger.info('Cleaning up plugins-api');

  // Fetch active plugin - later we will clean archive every entry
  const activeRelease = await releasesClient.active();

  // Create empty release
  const resource = await configurationsClient.create({
    Name: 'E2E Test Cleanup',
    Description: 'Empty Configuration',
    Plugins: [],
  });
  await releasesClient.create({
    ConfigurationId: resource.sid,
  });

  // Now archive plugin versions
  if (activeRelease) {
    const list = await configuredPluginsClient.list(activeRelease.configuration_sid);
    for (const plugin of list.plugins) {
      await versionsClient.archive(plugin.plugin_sid, plugin.plugin_version_sid);
    }
  }

  // Remove serverless files
  const service = await serverlessApi.getServiceSid();
  await serverlessApi.deleteEnvironments(service.sid);
};

const getPluginVersion = async (name: string, version: string): Promise<PluginVersionResource> => {
  return versionsClient.get(name, version);
};

const getLatestPluginVersion = async (name: string): Promise<PluginVersionResource | null> => {
  try {
    return await versionsClient.latest(name);
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

const cleanPluginVersions = async (name: string): Promise<void> => {
  const plugin = await getPlugin(name);
  logger.info(`Cleaning up plugin versions for ${name}`, plugin);
  const versions = await versionsClient.list(plugin.sid);
  for (const version of versions.plugin_versions) {
    if (!version.archived) await versionsClient.archive(plugin.sid, version.sid);
  }
};

export default {
  cleanup,
  getPluginVersion,
  getLatestPluginVersion,
  getPlugin,
  getActiveRelease,
  getConfiguration,
  getActivePlugins,
  cleanPluginVersions,
};
