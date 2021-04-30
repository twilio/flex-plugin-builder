import { ReleasesClient } from 'flex-plugins-api-client';
import { ListResource, Page, ResourceNames, Script } from '.';
export declare type ListReleasesOption = Page;
export interface ListReleases {
    sid: string;
    configurationSid: string;
    dateCreated: string;
}
export declare type ListReleasesResource = ListResource<ResourceNames.Releases, ListReleases>;
export declare type ListReleasesScript = Script<ListReleasesOption, ListReleasesResource>;
/**
 * The .listReleases script. This script returns overall information about a Release
 * @param releaseClient the Public API {@link ReleasesClient}
 */
export default function listReleases(releaseClient: ReleasesClient): ListReleasesScript;
