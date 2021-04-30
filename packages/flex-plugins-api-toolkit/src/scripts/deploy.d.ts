import { PluginsClient, PluginVersionsClient } from 'flex-plugins-api-client';
import { Script } from '.';
export interface DeployOption {
    name: string;
    url: string;
    version: string;
    friendlyName?: string;
    description?: string;
    changelog?: string;
    isPrivate?: boolean;
}
export interface DeployPlugin {
    pluginSid: string;
    pluginVersionSid: string;
    name: string;
    version: string;
    url: string;
    friendlyName: string;
    description: string;
    changelog: string;
    isPrivate: boolean;
    isArchived: boolean;
}
export declare type DeployScript = Script<DeployOption, DeployPlugin>;
/**
 * The .deploy script. This script will upsert a Plugin and then creates a new PluginVersion
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 */
export default function deploy(pluginClient: PluginsClient, pluginVersionClient: PluginVersionsClient): DeployScript;
