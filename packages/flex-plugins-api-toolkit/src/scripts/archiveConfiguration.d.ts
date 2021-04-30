import { ConfigurationsClient } from 'flex-plugins-api-client';
import { Script, Configuration } from '.';
export interface ArchiveConfigurationOption {
    sid: string;
}
export declare type ArchiveConfigurationScript = Script<ArchiveConfigurationOption, Configuration>;
/**
 * The .archiveConfiguration script. This script archives a configuration
 * @param configurationsClient        the Public API {@link ConfigurationsClient}
 */
export default function archiveConfiguration(configurationsClient: ConfigurationsClient): ArchiveConfigurationScript;
