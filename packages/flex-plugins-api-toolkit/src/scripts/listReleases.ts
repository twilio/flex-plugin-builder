import { ReleasesClient } from 'flex-plugins-api-client';

import { ListResource, Page, ResourceNames, Script } from '.';

export type ListReleasesOption = Page;

export interface ListReleases {
  sid: string;
  configurationSid: string;
  dateCreated: string;
}

export type ListReleasesResource = ListResource<ResourceNames.Releases, ListReleases>;
export type ListReleasesScript = Script<ListReleasesOption, ListReleasesResource>;

/**
 * The .listReleases script. This script returns overall information about a Release
 * @param releaseClient the Public API {@link ReleasesClient}
 */
export default function listReleases(releaseClient: ReleasesClient): ListReleasesScript {
  return async (option) => {
    const result = await releaseClient.list(option.page);

    const releases = result.releases.map((release) => ({
      sid: release.sid,
      configurationSid: release.configuration_sid,
      dateCreated: release.date_created,
    }));

    return {
      releases,
      meta: result.meta,
    };
  };
}
