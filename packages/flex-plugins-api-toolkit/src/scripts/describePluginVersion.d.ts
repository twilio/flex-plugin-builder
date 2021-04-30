import { ConfiguredPluginsClient, PluginResource, PluginsClient, PluginVersionsClient, ReleaseResource, ReleasesClient } from 'flex-plugins-api-client';
import { Script } from '.';
import { Plugin } from './describePlugin';
interface OptionalResources {
    plugin?: PluginResource;
    activeRelease?: ReleaseResource;
}
export interface DescribePluginVersionOption {
    name: string;
    version: string;
    resources?: OptionalResources;
}
export interface PluginVersion {
    sid: string;
    version: string;
    url: string;
    changelog: string;
    isPrivate: boolean;
    isArchived: boolean;
    dateCreated: string;
}
export interface DescribePluginVersion extends PluginVersion {
    isActive: boolean;
    plugin: Plugin;
}
export declare type DescribePluginVersionScript = Script<DescribePluginVersionOption, DescribePluginVersion>;
/**
 * The .describePluginVersion script. This script describes a plugin version.
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describePluginVersion(pluginClient: PluginsClient, pluginVersionClient: PluginVersionsClient, configuredPluginClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): DescribePluginVersionScript;
export {};
