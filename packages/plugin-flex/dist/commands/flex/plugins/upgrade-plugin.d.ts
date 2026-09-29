import { flags } from '@oclif/parser';
import { OutputFlags } from '@oclif/parser/lib/parse';
import FlexPlugin, { ConfigData, PkgCallback, SecureStorage } from '../../../sub-commands/flex-plugin';
interface ScriptsToRemove {
    name: string;
    it: string;
    pre?: string;
    post?: string;
}
export interface DependencyUpdates {
    remove: string[];
    deps: Record<string, string>;
    devDeps: Record<string, string>;
}
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
export default class FlexPluginsUpgradePlugin extends FlexPlugin {
    static topicName: string;
    static description: string;
    static flags: {
        'remove-legacy-plugin': flags.IBooleanFlag<boolean>;
        install: flags.IBooleanFlag<boolean>;
        beta: flags.IBooleanFlag<boolean>;
        dev: flags.IBooleanFlag<boolean>;
        nightly: flags.IBooleanFlag<boolean>;
        yarn: flags.IBooleanFlag<boolean>;
        yes: flags.IBooleanFlag<boolean>;
        'flex-ui-2.0': flags.IBooleanFlag<boolean>;
        json: flags.IBooleanFlag<boolean>;
        'clear-terminal': flags.IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    static packagesToRemove: string[];
    private static cracoConfigSha;
    private static packagesToRemoveFlexUI2;
    private static packageVersionsFlexUI2;
    _flags: OutputFlags<typeof FlexPluginsUpgradePlugin.flags>;
    private prints;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    init(): Promise<void>;
    /**
     * @override
     */
    doRun(): Promise<void>;
    /**
     * Upgrade from v1 to v4
     */
    upgradeFromV1(): Promise<void>;
    /**
     * Upgrade from v2 to v4
     */
    upgradeFromV2(): Promise<void>;
    /**
     * Upgrade from v3 to v4
     */
    upgradeFromV3(): Promise<void>;
    /**
     * Upgrades the packages to the latest version
     */
    upgradeToLatest(): Promise<void>;
    /**
     * Upgrades the packages to the latest version needed for flexui 2.0
     */
    upgradeToFlexUI2(flexUIVersion: string): Promise<void>;
    /**
     * Removes craco.config.js file
     */
    cleanupScaffold(): Promise<void>;
    /**
     * Updates the package json by removing the provided list and updating the version to the latest from the given list.
     * Provide the list as key:value. If value is *, then script will find the latest available version.
     * @param dependencies  the list of dependencies to modify - can also be used to update to the latest
     * @param custom        a custom callback for modifying package.json
     */
    updatePackageJson(dependencies: DependencyUpdates, custom?: PkgCallback): Promise<void>;
    /**
     * Removes scripts from the package.json
     * @param scripts the scripts remove
     */
    removePackageScripts(scripts: ScriptsToRemove[]): Promise<void>;
    /**
     * Cleans up node_modules and lockfiles
     */
    cleanupNodeModules(): Promise<void>;
    /**
     * Runs npm install if flag is set
     */
    npmInstall(): Promise<void>;
    /**
     * Removes the legacy plugin
     */
    removeLegacyPlugin(): Promise<void>;
    getDependencyUpdates(): DependencyUpdates;
    /**
     * Returns the dependencies which need to be removed and installed for the plugin
     * to be compatible with flex ui 2.0
     * @param flexUIVersion the flex ui version retrieved for 2.0
     */
    getDependencyUpdatesFlexUI2(flexUIVersion: string): DependencyUpdates;
    /**
     * Returns the flex-plugin-scripts version from the plugin
     */
    get pkgVersion(): number | undefined;
    /**
     * @override
     */
    getTopicName(): string;
}
export {};
