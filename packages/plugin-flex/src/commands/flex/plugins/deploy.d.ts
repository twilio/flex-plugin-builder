import { PluginVersionResource } from 'flex-plugins-api-client/dist/clients/pluginVersions';
import { ReleaseType } from 'semver';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';
import { PluginResource } from 'flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';
import * as flags from '../../../utils/flags';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
interface ValidatePlugin {
    currentVersion: string;
    nextVersion: string;
}
/**
 * Parses the version input
 * @param input
 */
export declare const parseVersionInput: (input: string) => string;
/**
 * Builds and then deploys the Flex Plugin
 */
export default class FlexPluginsDeploy extends FlexPlugin {
    static topicName: string;
    static description: string;
    static flags: {
        patch: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        minor: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        major: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        version: flags.IOptionFlag<string | undefined>;
        public: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        changelog: flags.IOptionFlag<string>;
        description: flags.IOptionFlag<string | undefined>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    private prints;
    private nextVersion?;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<void>;
    /**
     * Checks if there is already an uploaded asset with the same version and prompts user with an option to override if so
     * @returns {Promise<boolean>}
     */
    hasCollisionAndOverwrite(): Promise<boolean>;
    /**
     * Validates that the provided next plugin version is valid
     * @returns {Promise<void>}
     */
    validatePlugin(): Promise<ValidatePlugin>;
    /**
     * Registers a plugin with Plugins API
     * @returns {Promise}
     */
    registerPlugin(): Promise<PluginResource>;
    /**
     * Registers a Plugin Version
     * @param deployResult
     * @returns {Promise}
     */
    registerPluginVersion(deployResult: DeployResult): Promise<PluginVersionResource>;
    /**
     * Checks whether a Serverless instance exists or not. If not, will create one
     */
    checkServerlessInstance(): Promise<void>;
    /**
     * Checks to see if a legacy plugin exist
     */
    checkForLegacy(): Promise<void>;
    /**
     * Finds the version bump level
     * @returns {string}
     */
    get bumpLevel(): ReleaseType;
    /**
     * Parses the flags passed to this command
     */
    get _flags(): OutputFlags<typeof FlexPluginsDeploy.flags>;
    /**
     * @override
     */
    get checkCompatibility(): boolean;
}
export {};
