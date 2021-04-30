import { ConfigurationsClient, ConfiguredPluginsClient, PluginsClient, PluginVersionsClient, ReleaseResource, ReleasesClient } from 'flex-plugins-api-client';
import { Script } from '.';
import { DescribeConfiguration } from './describeConfiguration';
interface OptionalResources {
    activeRelease?: ReleaseResource;
}
export interface DescribeReleaseOption {
    sid: string;
    resources?: OptionalResources;
}
interface Release {
    sid: string;
    configurationSid: string;
    isActive: boolean;
    dateCreated: string;
}
export interface DescribeRelease extends Release {
    configuration: DescribeConfiguration;
}
export declare type DescribeReleaseScript = Script<DescribeReleaseOption, DescribeRelease>;
/**
 * The .describeRelease script. This script describes a release.
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describeRelease(pluginClient: PluginsClient, pluginVersionClient: PluginVersionsClient, configurationClient: ConfigurationsClient, configuredPluginClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): DescribeReleaseScript;
export {};
