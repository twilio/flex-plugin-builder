import { ReleasesClient } from 'flex-plugins-api-client';
import { Script } from '.';
export interface ReleaseOption {
    configurationSid: string;
}
export interface Release {
    releaseSid: string;
    configurationSid: string;
    dateCreated: string;
}
export declare type ReleaseScript = Script<ReleaseOption, Release>;
/**
 * The .release script. This script will create a new Release
 * @param releaseClient        the Public API {@link ReleasesClient}
 */
export default function release(releaseClient: ReleasesClient): (option: ReleaseOption) => Promise<Release>;
