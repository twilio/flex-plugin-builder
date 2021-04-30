import { PluginsClient } from 'flex-plugins-api-client';
import { Script, Plugin } from '.';
export interface ArchivePluginOption {
    name: string;
}
export declare type ArchivePluginScript = Script<ArchivePluginOption, Plugin>;
/**
 * The .archivePlugin script. This script archives a plugin
 * @param pluginsClient        the Public API {@link PluginsClient}
 */
export default function archivePlugin(pluginsClient: PluginsClient): ArchivePluginScript;
