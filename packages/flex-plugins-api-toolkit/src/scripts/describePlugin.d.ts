import { ConfiguredPluginResourcePage, ConfiguredPluginsClient, PluginResource, PluginsClient, PluginVersionsClient, ReleaseResource, ReleasesClient } from 'flex-plugins-api-client';
import { Script } from '.';
import { DescribePluginVersion } from './describePluginVersion';
interface OptionalResources {
    plugin?: PluginResource;
    activeRelease?: ReleaseResource;
    configuredPlugins?: ConfiguredPluginResourcePage;
}
export interface DescribePluginOption {
    name: string;
    resources?: OptionalResources;
}
declare type PluginVersion = Omit<DescribePluginVersion, 'plugin'>;
export interface Plugin {
    sid: string;
    name: string;
    friendlyName: string;
    description: string;
    isArchived: boolean;
    dateCreated: string;
    dateUpdated: string;
}
export interface DescribePlugin extends Plugin {
    isActive: boolean;
    versions: PluginVersion[];
}
export declare type DescribePluginScript = Script<DescribePluginOption, DescribePlugin>;
/**
 * The .describePlugin script. This script describes a plugin
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describePlugin(pluginClient: PluginsClient, pluginVersionClient: PluginVersionsClient, configuredPluginsClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): DescribePluginScript;
export {};
