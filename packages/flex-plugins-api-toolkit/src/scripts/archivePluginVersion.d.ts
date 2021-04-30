import { PluginVersionsClient } from 'flex-plugins-api-client';
import { Script, PluginVersion } from '.';
export interface ArchivePluginVersionOption {
    name: string;
    version: string;
}
export declare type ArchivePluginVersionScript = Script<ArchivePluginVersionOption, PluginVersion>;
/**
 * The .archivePluginVersion script. This script archives a plugin version
 * @param pluginVersionsClient        the Public API {@link PluginVersionsClient}
 */
export default function archivePluginVersion(pluginVersionsClient: PluginVersionsClient): ArchivePluginVersionScript;
