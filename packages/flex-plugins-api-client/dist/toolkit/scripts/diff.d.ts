import { ConfigurationsClient, ConfiguredPluginsClient, ReleasesClient } from '../../clients';
import { Script } from '.';
import { ConfigurationsDiff } from '../tools/diff';
export interface DiffOption {
    resource: 'configuration';
    oldIdentifier: string;
    newIdentifier: string;
}
export interface Diff extends ConfigurationsDiff {
    oldSid: string;
    newSid: string;
    activeSid: string | undefined | null;
}
export declare type DiffScript = Script<DiffOption, Diff>;
/**
 * The .diff script. This script finds the diff between two resources
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function diff(configurationClient: ConfigurationsClient, configuredPluginClient: ConfiguredPluginsClient, releasesClient: ReleasesClient): DiffScript;
