"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable sonarjs/no-identical-functions */
const path_1 = __importStar(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const fs_1 = require("@twilio/flex-dev-utils/dist/fs");
const parser_1 = require("@oclif/parser");
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const spawn_1 = require("@twilio/flex-dev-utils/dist/spawn");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const general_1 = require("../../../utils/general");
const appConfig = 'appConfig.js';
const crackoConfig = 'craco.config.js';
const flexUI = '@twilio/flex-ui';
const scopedFlexPluginScriptPackage = '@twilio/flex-plugin-scripts';
const flexPluginScriptPackage = 'flex-plugin-scripts';
const scopedFlexPluginPackage = '@twilio/flex-plugin';
const flexPluginPackage = 'flex-plugin';
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
class FlexPluginsUpgradePlugin extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, {});
        this.prints = this._prints.upgradePlugin;
    }
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsUpgradePlugin)).flags;
    }
    /**
     * @override
     */
    async doRun() {
        var _a;
        if (this.flexUIVersion >= 2 && !this._flags['flex-ui-2.0']) {
            throw new flex_dev_utils_1.TwilioCliError('Incomplete arguments passed. As your plugin is compatible with Flex UI 2.0, pass the argument --flex-ui-2.0 to upgrade it to use the latest version of cli compatible with Flex UI 2.0');
        }
        if (this._flags['remove-legacy-plugin']) {
            await this.removeLegacyPlugin();
            this.prints.removeLegacyPluginSucceeded(this.pkg.name);
            return;
        }
        await this.prints.upgradeNotification(this._flags.yes);
        const currentPkgVersion = this.pkgVersion;
        switch (currentPkgVersion) {
            case 1:
                await this.upgradeFromV1();
                break;
            case 2:
                await this.upgradeFromV2();
                break;
            case 3:
                await this.upgradeFromV3();
                break;
            default:
                await this.upgradeToLatest();
                break;
        }
        const files = await fs_1.findInFiles(/"flex-plugin"|'flex-plugin'/, path_1.default.join(this.cwd, 'src'));
        if (files && Object.keys(files).length) {
            this.prints.manualUpgrade(Object.keys(files));
            return;
        }
        const pkgJson = await flex_dev_utils_1.packages.getRegistryVersion(scopedFlexPluginScriptPackage, this._flags.beta ? 'beta' : 'latest');
        const latestVersion = pkgJson ? (_a = flex_dev_utils_1.semver.coerce(pkgJson.version)) === null || _a === void 0 ? void 0 : _a.major : 0;
        if (currentPkgVersion !== latestVersion) {
            await this.cleanupNodeModules();
        }
        if (this._flags['flex-ui-2.0']) {
            const flexUI2Version = await flex_dev_utils_1.packages.getLatestFlexUIVersion(2);
            await this.upgradeToFlexUI2(flexUI2Version);
            this.prints.flexUIUpdateSucceeded();
        }
        await this.npmInstall();
        this.prints.scriptSucceeded(!this._flags.install, flex_plugin_1.default.BUILDER_VERSION);
    }
    /**
     * Upgrade from v1 to v4
     */
    async upgradeFromV1() {
        this.prints.scriptStarted('v1');
        await this.cleanupScaffold();
        await this.updatePackageJson(this.getDependencyUpdates(), (pkg) => {
            delete pkg['config-overrides-path'];
            return pkg;
        });
        await this.removePackageScripts([
            { name: 'build', it: 'react-app-rewired build' },
            { name: 'eject', it: 'react-app-rewired eject' },
            { name: 'start', it: 'react-app-rewired start', pre: 'flex-check-start' },
            { name: 'test', it: 'react-app-rewired test --env=jsdom' },
        ]);
    }
    /**
     * Upgrade from v2 to v4
     */
    async upgradeFromV2() {
        this.prints.scriptStarted('v2');
        await this.cleanupScaffold();
        await this.updatePackageJson(this.getDependencyUpdates(), (pkg) => {
            delete pkg['config-overrides-path'];
            return pkg;
        });
        await this.removePackageScripts([
            { name: 'build', it: 'craco build' },
            { name: 'eject', it: 'craco eject' },
            { name: 'start', it: 'craco start', pre: 'npm run bootstrap' },
            { name: 'test', it: 'craco test --env=jsdom' },
            { name: 'coverage', it: 'craco test --env=jsdom --coverage --watchAll=false' },
        ]);
    }
    /**
     * Upgrade from v3 to v4
     */
    async upgradeFromV3() {
        this.prints.scriptStarted('v3');
        await this.cleanupScaffold();
        await this.updatePackageJson(this.getDependencyUpdates());
        await this.removePackageScripts([
            { name: 'bootstrap', it: 'flex-plugin check-start' },
            { name: 'build', it: 'flex-plugin build', pre: 'rimraf build && npm run bootstrap' },
            { name: 'clear', it: 'flex-plugin clear' },
            { name: 'deploy', it: 'flex-plugin deploy', pre: 'npm run build' },
            { name: 'eject', it: 'flex-plugin eject' },
            { name: 'info', it: 'flex-plugin info' },
            { name: 'list', it: 'flex-plugin list' },
            { name: 'remove', it: 'flex-plugin remove' },
            { name: 'start', it: 'flex-plugin start', pre: 'npm run bootstrap' },
            { name: 'test', it: 'flex-plugin test --env=jsdom' },
        ]);
    }
    /**
     * Upgrades the packages to the latest version
     */
    async upgradeToLatest() {
        this.prints.upgradeToLatest();
        await this.updatePackageJson(this.getDependencyUpdates());
    }
    /**
     * Upgrades the packages to the latest version needed for flexui 2.0
     */
    async upgradeToFlexUI2(flexUIVersion) {
        this.prints.upgradeToFlexUI2();
        await this.updatePackageJson(this.getDependencyUpdatesFlexUI2(flexUIVersion));
    }
    /**
     * Removes craco.config.js file
     */
    async cleanupScaffold() {
        await flex_dev_utils_1.progress('Cleaning up the scaffold', async () => {
            let warningLogged = false;
            if (fs_1.checkAFileExists(this.cwd, crackoConfig)) {
                const sha = await fs_1.calculateSha256(this.cwd, crackoConfig);
                if (sha === FlexPluginsUpgradePlugin.cracoConfigSha) {
                    fs_1.removeFile(this.cwd, crackoConfig);
                }
                else {
                    this.prints.cannotRemoveCraco(!warningLogged);
                    warningLogged = true;
                }
            }
            const publicFiles = ['index.html', 'pluginsService.js', 'plugins.json', 'plugins.local.build.json'];
            publicFiles.forEach((file) => {
                if (fs_1.checkAFileExists(this.cwd, 'public', file)) {
                    fs_1.removeFile(this.cwd, 'public', file);
                }
            });
            fs_1.copyFile([
                require.resolve('@twilio/create-flex-plugin'),
                '..',
                '..',
                'templates',
                'core',
                'public',
                'appConfig.example.js',
            ], [this.cwd, 'public', 'appConfig.example.js']);
            ['jest.config.js', 'webpack.config.js', 'webpack.dev.js'].forEach((file) => {
                fs_1.copyFile([require.resolve('@twilio/create-flex-plugin'), '..', '..', 'templates', 'core', file], [this.cwd, file]);
            });
            if (fs_1.checkAFileExists(this.cwd, 'public', appConfig)) {
                const newLines = [];
                const ignoreLines = [
                    '// set to /plugins.json for local dev',
                    '// set to /plugins.local.build.json for testing your build',
                    '// set to "" for the default live plugin loader',
                ];
                fs_1.readFileSync(this.cwd, 'public', appConfig)
                    .split('\n')
                    .forEach((line) => {
                    if (ignoreLines.includes(line) || line.startsWith('var pluginServiceUrl')) {
                        return;
                    }
                    newLines.push(line);
                });
                const index = newLines.findIndex((line) => line.indexOf('url: pluginServiceUrl') !== -1);
                if (index === -1) {
                    this.prints.updatePluginUrl(!warningLogged);
                }
                else {
                    newLines[index] = newLines[index].replace('url: pluginServiceUrl', "url: '/plugins'");
                }
                fs_1.writeFile(newLines.join('\n'), this.cwd, 'public', appConfig);
            }
        });
    }
    /**
     * Updates the package json by removing the provided list and updating the version to the latest from the given list.
     * Provide the list as key:value. If value is *, then script will find the latest available version.
     * @param dependencies  the list of dependencies to modify - can also be used to update to the latest
     * @param custom        a custom callback for modifying package.json
     */
    async updatePackageJson(dependencies, custom) {
        this._logger.debug('Updating package dependencies to', dependencies);
        await flex_dev_utils_1.progress('Updating package dependencies', async () => {
            const { pkg } = this;
            dependencies.remove.forEach((name) => delete pkg.dependencies[name]);
            dependencies.remove.forEach((name) => delete pkg.devDependencies[name]);
            const { beta } = this._flags;
            const addDep = async (deps, record) => {
                for (const dep in deps) {
                    if (deps.hasOwnProperty(dep)) {
                        const version = deps[dep];
                        this._logger.debug(`Adding dependency ${dep}@${version}`);
                        /*
                         * Conditional allows us to set the dep version from another field
                         * i.e. "react-dom": "react || 16.5.2"
                         * set react-dom value to the version of react, if exists, otherwise 16.5.2
                         */
                        const conditional = version.split('||').map((str) => str.trim());
                        if (conditional.length === 2) {
                            const match = conditional.find((str) => pkg.dependencies[str] || pkg.devDependencies[str]);
                            if (match) {
                                record[dep] = pkg.dependencies[match] || pkg.devDependencies[match];
                                continue;
                            }
                            const fallbackVersion = conditional.find((str) => flex_dev_utils_1.semver.valid(str));
                            if (fallbackVersion) {
                                record[dep] = fallbackVersion;
                                continue;
                            }
                        }
                        // If we have provided a specific version, use that
                        if (version !== '*') {
                            record[dep] = version;
                            continue;
                        }
                        // Now find the latest
                        const scriptPkg = await flex_dev_utils_1.packages.getRegistryVersion(dep, beta ? 'beta' : 'latest');
                        if (!scriptPkg) {
                            this.prints.packageNotFound(dep);
                            this.exit(1);
                            return;
                        }
                        record[dep] = scriptPkg.version;
                    }
                }
            };
            await addDep(dependencies.deps, pkg.dependencies);
            await addDep(dependencies.devDeps, pkg.devDependencies);
            if (custom) {
                custom(pkg);
            }
            delete pkg.browserslist;
            fs_1.writeJSONFile(pkg, this.cwd, 'package.json');
        });
    }
    /**
     * Removes scripts from the package.json
     * @param scripts the scripts remove
     */
    async removePackageScripts(scripts) {
        await flex_dev_utils_1.progress('Removing package scripts', async () => {
            const { pkg } = this;
            scripts.forEach((script) => {
                const hasScript = pkg.scripts[script.name] === script.it;
                const hasPre = pkg.scripts[`pre${script.name}`] === script.pre;
                const hasPost = pkg.scripts[`post${script.name}`] === script.post;
                if (hasScript && hasPre && hasPost) {
                    delete pkg.scripts[script.name];
                    delete pkg.scripts[`pre${script.name}`];
                    delete pkg.scripts[`post${script.name}`];
                }
                else if (pkg.scripts[script.name]) {
                    this.prints.warnNotRemoved(`Script {{${script.name}}} was not removed because it has been modified`);
                }
            });
            pkg.scripts.postinstall = 'flex-plugin pre-script-check';
            fs_1.writeJSONFile(pkg, this.cwd, 'package.json');
        });
    }
    /**
     * Cleans up node_modules and lockfiles
     */
    async cleanupNodeModules() {
        await flex_dev_utils_1.progress('Cleaning up node_modules and lock files', async () => {
            await rimraf_1.default.sync(path_1.join(this.cwd, 'node_modules'));
            await rimraf_1.default.sync(path_1.join(this.cwd, 'package-lock.json'));
            await rimraf_1.default.sync(path_1.join(this.cwd, 'yarn.lock'));
        });
    }
    /**
     * Runs npm install if flag is set
     */
    async npmInstall() {
        if (!this._flags.install) {
            return;
        }
        const cmd = this._flags.yarn ? 'yarn' : 'npm';
        await flex_dev_utils_1.progress(`Installing dependencies using ${cmd}`, async () => {
            const args = ['install'];
            if (this._flags.yarn) {
                args.push('--silent');
            }
            else {
                args.push('--quiet', '--no-fund', '--no-audit', '--no-progress', '--silent');
            }
            const { exitCode, stderr } = await spawn_1.spawn(cmd, args);
            if (exitCode || stderr) {
                this._logger.error(stderr);
                this.exit(1);
            }
        });
    }
    /**
     * Removes the legacy plugin
     */
    async removeLegacyPlugin() {
        const { name } = this.pkg;
        await this.prints.removeLegacyNotification(name, this._flags.yes);
        // Check plugin is already registered with plugins API
        try {
            await this.pluginsClient.get(name);
        }
        catch (e) {
            if (general_1.instanceOf(e, flex_dev_utils_1.TwilioApiError) && e.status === 404) {
                this.prints.warningPluginNotInAPI(name);
                this.exit(1);
                return;
            }
            throw e;
        }
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (!serviceSid) {
            return;
        }
        const hasLegacy = await this.serverlessClient.hasLegacy(serviceSid, name);
        if (!hasLegacy) {
            this.prints.noLegacyPluginFound(name);
            this.exit(0);
            return;
        }
        await flex_dev_utils_1.progress('Deleting your legacy plugin', async () => this.serverlessClient.removeLegacy(serviceSid, name), false);
    }
    getDependencyUpdates() {
        const react = 'react || 16.5.2';
        return {
            remove: FlexPluginsUpgradePlugin.packagesToRemove,
            deps: {
                react,
                'react-dom': react,
                [scopedFlexPluginPackage]: '*',
            },
            devDeps: {
                [scopedFlexPluginScriptPackage]: '*',
                [flexUI]: '^1',
                'react-test-renderer': react,
            },
        };
    }
    /**
     * Returns the dependencies which need to be removed and installed for the plugin
     * to be compatible with flex ui 2.0
     * @param flexUIVersion the flex ui version retrieved for 2.0
     */
    getDependencyUpdatesFlexUI2(flexUIVersion) {
        const packagesToRemove = [];
        const packagesToInstall = {};
        const { pkg } = this;
        // Find which packages must be removed and which counterpart must be installed in place of it
        Object.entries(FlexPluginsUpgradePlugin.packagesToRemoveFlexUI2).forEach(([remove, replace]) => {
            if (pkg.dependencies[remove]) {
                packagesToRemove.push(remove);
                packagesToInstall[replace] = FlexPluginsUpgradePlugin.packageVersionsFlexUI2[replace];
            }
        });
        // Find which packages must be upgraded
        Object.entries(FlexPluginsUpgradePlugin.packageVersionsFlexUI2).forEach(([dep, version]) => {
            if (pkg.dependencies[dep]) {
                packagesToInstall[dep] = version;
            }
        });
        return {
            remove: packagesToRemove,
            deps: packagesToInstall,
            devDeps: {
                [flexUI]: flexUIVersion,
                'react-test-renderer': '17.0.2',
            },
        };
    }
    /**
     * Returns the flex-plugin-scripts version from the plugin
     */
    get pkgVersion() {
        var _a;
        const pkg = this.pkg.dependencies[scopedFlexPluginScriptPackage] ||
            this.pkg.devDependencies[scopedFlexPluginScriptPackage] ||
            this.pkg.dependencies[flexPluginScriptPackage] ||
            this.pkg.devDependencies[flexPluginScriptPackage] ||
            this.pkg.dependencies[scopedFlexPluginPackage] ||
            this.pkg.devDependencies[scopedFlexPluginPackage] ||
            this.pkg.dependencies[flexPluginPackage] ||
            this.pkg.devDependencies[flexPluginPackage];
        if (!pkg) {
            throw new flex_dev_utils_1.TwilioCliError(`Package '${scopedFlexPluginScriptPackage}' was not found`);
        }
        return (_a = flex_dev_utils_1.semver.coerce(pkg)) === null || _a === void 0 ? void 0 : _a.major;
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsUpgradePlugin.topicName;
    }
}
exports.default = FlexPluginsUpgradePlugin;
FlexPluginsUpgradePlugin.topicName = 'flex:plugins:upgrade-plugin';
FlexPluginsUpgradePlugin.description = general_1.createDescription(FlexPluginsUpgradePlugin.topic.description, false);
FlexPluginsUpgradePlugin.flags = Object.assign(Object.assign({}, baseFlags), { 'remove-legacy-plugin': parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.removeLegacyPlugin,
    }), install: parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.install,
    }), beta: parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.beta,
    }), dev: parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.dev,
    }), nightly: parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.nightly,
    }), yarn: parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.yarn,
    }), yes: parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.yes,
    }), 'flex-ui-2.0': parser_1.flags.boolean({
        description: FlexPluginsUpgradePlugin.topic.flags.flexui2,
    }) });
FlexPluginsUpgradePlugin.packagesToRemove = [
    scopedFlexPluginScriptPackage,
    'react-app-rewire-flex-plugin',
    'react-app-rewired',
    'react-scripts',
    'enzyme',
    'babel-polyfill',
    'enzyme-adapter-react-16',
    'react-emotion',
    '@craco/craco',
    'craco-config-flex-plugin',
    'core-j',
    'react-test-renderer',
    'react-scripts',
    'rimraf',
    '@types/enzyme',
    '@types/jest',
    '@types/node',
    '@types/react',
    '@types/react-dom',
    '@types/react-redux',
    scopedFlexPluginPackage,
    flexPluginScriptPackage,
    flexPluginPackage,
];
FlexPluginsUpgradePlugin.cracoConfigSha = '4a8ecfec7b70da88a0849b7b0163808b2cc46eee08c9ab599c8aa3525ff01546';
FlexPluginsUpgradePlugin.packagesToRemoveFlexUI2 = {
    'react-router': 'react-router-dom',
    'react-router-redux': 'react-router-dom',
    emotion: '@emotion/css',
    'emotion-theming': '@emotion/react',
    'react-emotion': '@emotion/react',
    'create-emotion-styled': '@emotion/styled',
};
FlexPluginsUpgradePlugin.packageVersionsFlexUI2 = {
    react: '17.0.2',
    'react-dom': '17.0.2',
    'react-redux': '^7.2.2',
    redux: '^4.0.5',
    'react-router-dom': '^5.2.0',
    '@emotion/css': '^11.1.3',
    '@emotion/react': '^11.1.5',
    '@emotion/styled': '^11.1.5',
    '@material-ui/core': '^4.11.3',
};
//# sourceMappingURL=upgrade-plugin.js.map