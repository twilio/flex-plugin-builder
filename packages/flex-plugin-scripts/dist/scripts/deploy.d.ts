import { Credential } from '@twilio/flex-dev-utils';
import { UIDependencies, ServerlessBuild, ServerlessRuntime } from '../clients';
export interface Options {
    isPublic: boolean;
    overwrite: boolean;
    disallowVersioning: boolean;
}
export interface DeployResult {
    serviceSid: string;
    accountSid: string;
    environmentSid: string;
    domainName: string;
    isPublic: boolean;
    nextVersion: string;
    pluginUrl: string;
}
/**
 * Verifies the new plugin path does not have collision with existing paths of the deployed Runtime service.
 *
 * @param baseUrl   the baseURL of the file
 * @param build     the existing build
 */
export declare const _verifyPath: (baseUrl: string, build: ServerlessBuild) => boolean;
/**
 * Returns the default version of flex-ui dependency if uiDependency is empty
 * @param uiVersion the Flex UI version
 * @param uiDependencies   the provided ui dependency
 */
export declare const _getDefaultUIDependencies: (uiVersion: string, uiDependencies: UIDependencies) => UIDependencies;
/**
 * Validates Flex UI version requirement
 */
export declare const _verifyFlexUIConfiguration: () => Promise<void>;
/**
 * Returns the Account object only if credentials provided is AccountSid/AuthToken, otherwise returns a dummy data
 * @param runtime     the {@link Runtime}
 * @param credentials the {@link Credential}
 * @private
 */
export declare const _getAccount: (runtime: ServerlessRuntime, credentials: Credential) => Promise<{
    sid: string;
}>;
/**
 * The main deploy script. This script performs the following in order:
 * 1. Verifies bundle file exists, if not warns about running `npm run build` first
 * 2. Fetches the default Service and Environment from Serverless API
 * 3. Fetches existing Build
 * 4. Verifies the new bundle path does not collide with files in existing Build
 * 5. Creates a new Asset (and an AssetVersion), and uploads the file to S3 for both the bundle and source map
 * 6. Appends the new two files to existing Build's files and creates a new Build
 * 7. Creates a new deployment and sets the Environment build to the new Build.
 *
 * @param nextVersion   the next version of the bundle
 * @param options       options for this deploy
 */
export declare const _doDeploy: (nextVersion: string, options: Options) => Promise<DeployResult>;
declare const deploy: (...argv: string[]) => Promise<DeployResult>;
export default deploy;
