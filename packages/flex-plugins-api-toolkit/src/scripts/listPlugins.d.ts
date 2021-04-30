import { ConfiguredPluginResourcePage, ConfiguredPluginsClient, PluginsClient, ReleaseResource, ReleasesClient } from 'flex-plugins-api-client';
import { ListResource, Page, ResourceNames, Script } from '.';
interface OptionalResources {
    activeRelease?: ReleaseResource;
    configuredPlugins?: ConfiguredPluginResourcePage;
}
export interface ListPluginsOption extends Page {
    resources?: OptionalResources;
}
export interface ListPlugins {
    sid: string;
    name: string;
    friendlyName: string;
    description: string;
    isActive: boolean;
    dateCreated: string;
    dateUpdated: string;
}
export declare type ListPluginsResource = ListResource<ResourceNames.Plugins, ListPlugins>;
export declare type ListPluginsScripts = Script<ListPluginsOption, ListPluginsResource>;
/**
 * The .listPlugins script. This script returns overall information about a Plugin
 * @param pluginsClient        the Public API {@link PluginsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listPlugins(pluginsClient: PluginsClient, configuredPluginsClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): ListPluginsScripts;
export {};
