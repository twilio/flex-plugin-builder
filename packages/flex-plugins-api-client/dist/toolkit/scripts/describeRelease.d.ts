import { ConfigurationsClient, ConfiguredPluginsClient, ReleaseResource, ReleasesClient } from '../../clients';
import { Script } from '.';
import { DescribeConfiguration } from './describeConfiguration';
interface OptionalResources {
    release?: ReleaseResource;
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
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describeRelease(configurationClient: ConfigurationsClient, configuredPluginClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): DescribeReleaseScript;
export {};
