import { ConfigurationsClient } from 'flex-plugins-api-client';

import { Script, Configuration } from '.';

export interface ArchiveConfigurationOption {
  sid: string;
}

export type ArchiveConfigurationScript = Script<ArchiveConfigurationOption, Configuration>;

/**
 * The .archiveConfiguration script. This script archives a configuration
 * @param configurationsClient        the Public API {@link ConfigurationsClient}
 */
export default function archiveConfiguration(configurationsClient: ConfigurationsClient): ArchiveConfigurationScript {
  return async (options: ArchiveConfigurationOption) => {
    const configuration = await configurationsClient.archive(options.sid);

    return {
      sid: configuration.sid,
      name: configuration.name,
      description: configuration.description,
      isArchived: configuration.archived,
      dateCreated: configuration.date_created,
    };
  };
}
