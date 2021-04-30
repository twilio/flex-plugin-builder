import { ConfiguredPluginResourcePage, ConfiguredPluginsClient, PluginVersionsClient, ReleaseResource, ReleasesClient } from 'flex-plugins-api-client';
import { ListResource, Page, ResourceNames, Script } from '.';
interface OptionalResources {
    configuredPlugins?: ConfiguredPluginResourcePage;
    activeRelease?: ReleaseResource;
}
export interface ListPluginVersionsOption extends Page {
    name: string;
    resources?: OptionalResources;
}
export interface ListPluginVersions {
    sid: string;
    pluginSid: string;
    version: string;
    url: string;
    changelog: string;
    isPrivate: boolean;
    isActive: boolean;
    dateCreated: string;
}
export declare type ListPluginVersionsResource = ListResource<ResourceNames.PluginVersions, ListPluginVersions>;
export declare type ListPluginVersionsScripts = Script<ListPluginVersionsOption, ListPluginVersionsResource>;
/**
 * The .listPluginVersions script. This script returns overall information about a PluginVersion
 * @param pluginVersionsClient        the Public API {@link PluginVersionsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listPluginVersions(pluginVersionsClient: PluginVersionsClient, configuredPluginsClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): ListPluginVersionsScripts;
export {};
