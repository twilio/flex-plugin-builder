import { ConfigurationsClient, ReleaseResource, ReleasesClient } from 'flex-plugins-api-client';
import { ListResource, Page, ResourceNames, Script } from '.';
interface OptionalResources {
    activeRelease?: ReleaseResource;
}
export interface ListConfigurationsOption extends Page {
    resources?: OptionalResources;
}
export interface ListConfigurations {
    sid: string;
    name: string;
    description: string;
    isActive: boolean;
    dateCreated: string;
}
export declare type ListConfigurationsResource = ListResource<ResourceNames.Configurations, ListConfigurations>;
export declare type ListConfigurationsScript = Script<ListConfigurationsOption, ListConfigurationsResource>;
/**
 * The .listConfigurations script. This script returns overall information about a Configuration
 * @param configurationsClient        the Public API {@link ConfigurationsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listConfigurations(configurationsClient: ConfigurationsClient, releasesClient: ReleasesClient): ListConfigurationsScript;
export {};
