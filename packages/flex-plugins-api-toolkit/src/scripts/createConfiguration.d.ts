import { ConfigurationsClient, ConfiguredPluginsClient, PluginsClient, PluginVersionsClient, ReleasesClient } from 'flex-plugins-api-client';
import { DeployPlugin } from './deploy';
import { Script } from '.';
export interface InstalledPlugin extends DeployPlugin {
    phase: number;
}
export interface CreateConfigurationOption {
    name: string;
    addPlugins: string[];
    removePlugins?: string[];
    description?: string;
    fromConfiguration?: 'active' | string;
}
export interface CreateConfiguration {
    sid: string;
    name: string;
    description: string;
    plugins: InstalledPlugin[];
    dateCreated: string;
}
export declare type CreateConfigurationScript = Script<CreateConfigurationOption, CreateConfiguration>;
/**
 * The .createConfiguration script. This script will create a Configuration
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function createConfiguration(pluginClient: PluginsClient, pluginVersionClient: PluginVersionsClient, configurationClient: ConfigurationsClient, configuredPluginClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): CreateConfigurationScript;
