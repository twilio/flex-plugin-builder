import { PluginVersionResource } from '@twilio/flex-plugins-api-client/dist/clients/pluginVersions';
import { DeployResult } from '@twilio/flex-plugin-scripts/dist/scripts/deploy';
import { ReleaseType } from '@twilio/flex-dev-utils';
import { PluginResource, ValidateStatus } from '@twilio/flex-plugins-api-client';
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
        option: flags.IOptionFlag<string | undefined>;
        'bypass-validation': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginsDeploy.flags>;
    options: {
        fix: string;
        deploy: string;
    };
    private prints;
    private nextVersion?;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    init(): Promise<void>;
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
    registerPluginVersion(deployResult: DeployResult, validateStatus: ValidateStatus): Promise<PluginVersionResource>;
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
     * @override
     */
    get checkCompatibility(): boolean;
    /**
     * @override
     */
    getTopicName(): string;
}
export {};
