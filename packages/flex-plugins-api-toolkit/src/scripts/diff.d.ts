import { ConfigurationsClient, ConfiguredPluginsClient, PluginsClient, PluginVersionsClient, ReleasesClient } from 'flex-plugins-api-client';
import { Script } from '.';
import { ConfigurationsDiff } from '../tools/diff';
export interface DiffOption {
    resource: 'configuration';
    oldIdentifier: string;
    newIdentifier: string;
}
export interface Diff extends ConfigurationsDiff {
    oldSid: string;
    newSid: string;
    activeSid: string | undefined | null;
}
export declare type DiffScript = Script<DiffOption, Diff>;
/**
 * The .diff script. This script finds the diff between two resources
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function diff(pluginClient: PluginsClient, pluginVersionClient: PluginVersionsClient, configurationClient: ConfigurationsClient, configuredPluginClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): DiffScript;
