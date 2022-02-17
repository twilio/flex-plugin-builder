/* eslint-disable sonarjs/no-identical-functions */
import { join } from 'path';

import rimraf from 'rimraf';
import {
  checkAFileExists,
  readFileSync,
  writeFile,
  writeJSONFile,
  copyFile,
  removeFile,
  calculateSha256,
} from '@twilio/flex-dev-utils/dist/fs';
import packageJson from 'package-json';
import { flags } from '@oclif/parser';
import { TwilioApiError, TwilioCliError, progress, semver } from '@twilio/flex-dev-utils';
import { spawn } from '@twilio/flex-dev-utils/dist/spawn';
import { OutputFlags } from '@oclif/parser/lib/parse';

import FlexPlugin, { ConfigData, PkgCallback, SecureStorage } from '../../../sub-commands/flex-plugin';
import { createDescription, instanceOf } from '../../../utils/general';

const appConfig = 'appConfig.js';
const crackoConfig = 'craco.config.js';

const flexPluginScript = '@twilio/flex-plugin-scripts';
const flexPlugin = '@twilio/flex-plugin';

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

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
export default class FlexPluginsUpgradePlugin extends FlexPlugin {
  static topicName = 'flex:plugins:upgrade-plugin';

  static description = createDescription(FlexPluginsUpgradePlugin.topic.description, false);

  static flags = {
    ...baseFlags,
    'remove-legacy-plugin': flags.boolean({
      description: FlexPluginsUpgradePlugin.topic.flags.removeLegacyPlugin,
    }),
    install: flags.boolean({
      description: FlexPluginsUpgradePlugin.topic.flags.install,
    }),
    beta: flags.boolean({
      description: FlexPluginsUpgradePlugin.topic.flags.beta,
    }),
    dev: flags.boolean({
      description: FlexPluginsUpgradePlugin.topic.flags.dev,
    }),
    nightly: flags.boolean({
      description: FlexPluginsUpgradePlugin.topic.flags.nightly,
    }),
    yarn: flags.boolean({
      description: FlexPluginsUpgradePlugin.topic.flags.yarn,
    }),
    yes: flags.boolean({
      description: FlexPluginsUpgradePlugin.topic.flags.yes,
    }),
  };

  private static cracoConfigSha = '4a8ecfec7b70da88a0849b7b0163808b2cc46eee08c9ab599c8aa3525ff01546';

  private static pluginBuilderScripts = [flexPluginScript, flexPlugin];

  private static packagesToRemove = [
    flexPluginScript, // remove and then re-add
    'flex-plugin-scripts',
    'react-app-rewire-flex-plugin',
    'react-app-rewired',
    'react-scripts',
    'enzyme',
    'babel-polyfill',
    'enzyme-adapter-react-16',
    'react-emotion', // remove and then re-add
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
    flexPlugin,
  ];

  // @ts-ignore
  private prints;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, {});

    this.prints = this._prints.upgradePlugin;
    this.parse(FlexPluginsUpgradePlugin);
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    if (this._flags['remove-legacy-plugin']) {
      await this.removeLegacyPlugin();
      this.prints.removeLegacyPluginSucceeded(this.pkg.name);
      return;
    }

    const pkgJson = await this.getLatestVersionOfDep(flexPluginScript, this._flags.beta);
    await this.prints.upgradeNotification(this._flags.yes, pkgJson.version as string);

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

    const latestVersion = pkgJson ? semver.coerce(pkgJson.version as string)?.major : 0;
    if (currentPkgVersion !== latestVersion) {
      await this.cleanupNodeModules();
    }

    await this.npmInstall();

    this.prints.scriptSucceeded(!this._flags.install);
  }

  /**
   * Upgrade from v1 to v4
   */
  async upgradeFromV1(): Promise<void> {
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
  async upgradeFromV2(): Promise<void> {
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
  async upgradeFromV3(): Promise<void> {
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
  async upgradeToLatest(): Promise<void> {
    this.prints.upgradeToLatest();

    await this.updatePackageJson(this.getDependencyUpdates());
  }

  /**
   * Removes craco.config.js file
   */
  async cleanupScaffold(): Promise<void> {
    await progress('Cleaning up the scaffold', async () => {
      let warningLogged = false;

      if (checkAFileExists(this.cwd, crackoConfig)) {
        const sha = await calculateSha256(this.cwd, crackoConfig);
        if (sha === FlexPluginsUpgradePlugin.cracoConfigSha) {
          removeFile(this.cwd, crackoConfig);
        } else {
          this.prints.cannotRemoveCraco(!warningLogged);
          warningLogged = true;
        }
      }

      const publicFiles = ['index.html', 'pluginsService.js', 'plugins.json', 'plugins.local.build.json'];
      publicFiles.forEach((file) => {
        if (checkAFileExists(this.cwd, 'public', file)) {
          removeFile(this.cwd, 'public', file);
        }
      });

      copyFile(
        [
          require.resolve('@twilio/create-flex-plugin'),
          '..',
          '..',
          'templates',
          'core',
          'public',
          'appConfig.example.js',
        ],
        [this.cwd, 'public', 'appConfig.example.js'],
      );
      ['jest.config.js', 'webpack.config.js', 'webpack.dev.js'].forEach((file) => {
        copyFile(
          [require.resolve('@twilio/create-flex-plugin'), '..', '..', 'templates', 'core', file],
          [this.cwd, file],
        );
      });

      if (checkAFileExists(this.cwd, 'public', appConfig)) {
        const newLines: string[] = [];
        const ignoreLines = [
          '// set to /plugins.json for local dev',
          '// set to /plugins.local.build.json for testing your build',
          '// set to "" for the default live plugin loader',
        ];
        readFileSync(this.cwd, 'public', appConfig)
          .split('\n')
          .forEach((line: string) => {
            if (ignoreLines.includes(line) || line.startsWith('var pluginServiceUrl')) {
              return;
            }

            newLines.push(line);
          });
        const index = newLines.findIndex((line) => line.indexOf('url: pluginServiceUrl') !== -1);
        if (index === -1) {
          this.prints.updatePluginUrl(!warningLogged);
        } else {
          newLines[index] = newLines[index].replace('url: pluginServiceUrl', "url: '/plugins'");
        }

        writeFile(newLines.join('\n'), this.cwd, 'public', appConfig);
      }
    });
  }

  /**
   * Updates the package json by removing the provided list and updating the version to the latest from the given list.
   * Provide the list as key:value. If value is *, then script will find the latest available version.
   * @param dependencies  the list of dependencies to modify - can also be used to update to the latest
   * @param custom        a custom callback for modifying package.json
   */
  async updatePackageJson(dependencies: DependencyUpdates, custom?: PkgCallback): Promise<void> {
    this._logger.debug('Updating package dependencies to', dependencies);

    await progress('Updating package dependencies', async () => {
      const { pkg } = this;
      dependencies.remove.forEach((name) => delete pkg.dependencies[name]);
      dependencies.remove.forEach((name) => delete pkg.devDependencies[name]);
      const { beta } = this._flags;

      const addDep = async (deps: Record<string, string>, record: Record<string, string>) => {
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

              const fallbackVersion = conditional.find((str) => semver.valid(str));
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
            const scriptPkg = await this.getLatestVersionOfDep(dep, beta);
            if (!scriptPkg) {
              this.prints.packageNotFound(dep);
              this.exit(1);
              return;
            }

            record[dep] = scriptPkg.version as string;
          }
        }
      };
      await addDep(dependencies.deps, pkg.dependencies);
      await addDep(dependencies.devDeps, pkg.devDependencies);
      if (custom) {
        custom(pkg);
      }
      delete pkg.browserslist;

      writeJSONFile(pkg, this.cwd, 'package.json');
    });
  }

  /**
   * Removes scripts from the package.json
   * @param scripts the scripts remove
   */
  async removePackageScripts(scripts: ScriptsToRemove[]): Promise<void> {
    await progress('Removing package scripts', async () => {
      const { pkg } = this;
      scripts.forEach((script) => {
        const hasScript = pkg.scripts[script.name] === script.it;
        const hasPre = pkg.scripts[`pre${script.name}`] === script.pre;
        const hasPost = pkg.scripts[`post${script.name}`] === script.post;
        if (hasScript && hasPre && hasPost) {
          delete pkg.scripts[script.name];
          delete pkg.scripts[`pre${script.name}`];
          delete pkg.scripts[`post${script.name}`];
        } else if (pkg.scripts[script.name]) {
          this.prints.warnNotRemoved(`Script {{${script.name}}} was not removed because it has been modified`);
        }
      });
      pkg.scripts.postinstall = 'flex-plugin pre-script-check';

      writeJSONFile(pkg, this.cwd, 'package.json');
    });
  }

  /**
   * Cleans up node_modules and lockfiles
   */
  async cleanupNodeModules(): Promise<void> {
    await progress('Cleaning up node_modules and lock files', async () => {
      await rimraf.sync(join(this.cwd, 'node_modules'));
      await rimraf.sync(join(this.cwd, 'package-lock.json'));
      await rimraf.sync(join(this.cwd, 'yarn.lock'));
    });
  }

  /**
   * Runs npm install if flag is set
   */
  async npmInstall(): Promise<void> {
    if (!this._flags.install) {
      return;
    }
    const cmd = this._flags.yarn ? 'yarn' : 'npm';

    await progress(`Installing dependencies using ${cmd}`, async () => {
      const args = ['install'];
      if (this._flags.yarn) {
        args.push('--silent');
      } else {
        args.push('--quiet', '--no-fund', '--no-audit', '--no-progress', '--silent');
      }

      const { exitCode, stderr } = await spawn(cmd, args);
      if (exitCode || stderr) {
        this._logger.error(stderr);
        this.exit(1);
      }
    });
  }

  /**
   * Removes the legacy plugin
   */
  async removeLegacyPlugin(): Promise<void> {
    const { name } = this.pkg;
    await this.prints.removeLegacyNotification(name, this._flags.yes);

    // Check plugin is already registered with plugins API
    try {
      await this.pluginsClient.get(name);
    } catch (e) {
      if (instanceOf(e, TwilioApiError) && e.status === 404) {
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

    await progress(
      'Deleting your legacy plugin',
      async () => this.serverlessClient.removeLegacy(serviceSid, name),
      false,
    );
  }

  getDependencyUpdates(): DependencyUpdates {
    const react = 'react || 16.5.2';
    return {
      remove: FlexPluginsUpgradePlugin.packagesToRemove,
      deps: {
        [flexPluginScript]: '*',
        react,
        'react-dom': react,
        'react-emotion': '9.2.12',
      },
      devDeps: {
        '@twilio/flex-ui': '^1',
        'react-test-renderer': react,
      },
    };
  }

  /**
   * Returns the latest version of a package
   * @param dep the package to check
   * @param isBeta  whether to check beta tag
   */
  async getLatestVersionOfDep(dep: string, isBeta: boolean): Promise<packageJson.AbbreviatedMetadata> {
    const option = FlexPluginsUpgradePlugin.pluginBuilderScripts.includes(dep) && isBeta ? { version: 'beta' } : {};
    return packageJson(dep, option);
  }

  /**
   * Returns the flex-plugin-scripts version from the plugin
   */
  get pkgVersion(): number | undefined {
    const pkg =
      this.pkg.dependencies['flex-plugin-scripts'] ||
      this.pkg.devDependencies['flex-plugin-scripts'] ||
      this.pkg.devDependencies[flexPluginScript] ||
      this.pkg.dependencies[flexPluginScript] ||
      this.pkg.dependencies[flexPlugin] ||
      this.pkg.devDependencies[flexPlugin];
    if (!pkg) {
      throw new TwilioCliError(`Package '${flexPluginScript}' was not found`);
    }

    return semver.coerce(pkg)?.major;
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags(): OutputFlags<typeof FlexPluginsUpgradePlugin.flags> {
    return this.parse(FlexPluginsUpgradePlugin).flags;
  }
}
