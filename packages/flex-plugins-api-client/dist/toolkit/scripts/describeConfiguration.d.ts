import { ConfigurationsClient, ConfiguredPluginsClient, ReleaseResource, ReleasesClient } from '../../clients';
import { Script } from '.';
import { DeployPlugin } from './deploy';
interface OptionalResources {
    activeRelease?: ReleaseResource;
}
export interface DescribeConfigurationOption {
    sid: string;
    resources?: OptionalResources;
}
export interface ConfiguredPlugins extends DeployPlugin {
    phase: number;
}
export interface Configuration {
    sid: string;
    name: string;
    description: string;
    isArchived: boolean;
    dateCreated: string;
}
export interface DescribeConfiguration extends Configuration {
    isActive: boolean;
    plugins: ConfiguredPlugins[];
}
export declare type DescribeConfigurationScript = Script<DescribeConfigurationOption, DescribeConfiguration>;
/**
 * Internal method for returning configuration
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 */
export declare function internalDescribeConfiguration(configurationClient: ConfigurationsClient, configuredPluginClient: ConfiguredPluginsClient): (option: DescribeConfigurationOption, release: ReleaseResource | null) => Promise<DescribeConfiguration>;
/**
 * The .describeConfiguration script. This script describes a configuration.
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describeConfiguration(configurationClient: ConfigurationsClient, configuredPluginClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): DescribeConfigurationScript;
export {};
