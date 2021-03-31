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

export type ListConfigurationsResource = ListResource<ResourceNames.Configurations, ListConfigurations>;
export type ListConfigurationsScript = Script<ListConfigurationsOption, ListConfigurationsResource>;

/**
 * The .listConfigurations script. This script returns overall information about a Configuration
 * @param configurationsClient        the Public API {@link ConfigurationsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listConfigurations(
  configurationsClient: ConfigurationsClient,
  releasesClient: ReleasesClient,
): ListConfigurationsScript {
  return async (option) => {
    const resources = option.resources ? option.resources : ({} as OptionalResources);

    const [result, release] = await Promise.all([
      configurationsClient.list(option.page),
      resources.activeRelease ? Promise.resolve(resources.activeRelease) : releasesClient.active(),
    ]);

    const configurations = result.configurations.map((configuration) => ({
      sid: configuration.sid,
      name: configuration.name,
      description: configuration.description,
      isActive: Boolean(release && release.configuration_sid === configuration.sid),
      dateCreated: configuration.date_created,
    }));

    return {
      configurations,
      meta: result.meta,
    };
  };
}
