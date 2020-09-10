import semver from 'semver';
import packageJson from 'package-json';
import { progress } from 'flex-plugins-utils-logger';
import { flags } from '@oclif/parser';
import spawn from 'flex-plugins-utils-spawn';

import FlexPlugin, { ConfigData, PkgCallback, SecureStorage } from '../../../sub-commands/flex-plugin';
import { createDescription } from '../../../utils/general';
import { upgradePlugin as upgradePluginDoc } from '../../../commandDocs.json';
import { TwilioCliError } from '../../../exceptions';
import {
  calculateSha256,
  copyFile,
  fileExists,
  readFile,
  removeFile,
  writeFile,
  writeJSONFile,
} from '../../../utils/fs';

interface ScriptsToRemove {
  name: string;
  it: string;
  pre?: string;
  post?: string;
}

interface DependencyUpdates {
  remove: string[];
  deps: Record<string, string>;
  devDeps: Record<string, string>;
}

/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
export default class FlexPluginsUpgradePlugin extends FlexPlugin {
  static description = createDescription(upgradePluginDoc.description, false);

  static flags = {
    ...FlexPlugin.flags,
    install: flags.boolean({
      description: upgradePluginDoc.flags.install,
    }),
    beta: flags.boolean({
      description: upgradePluginDoc.flags.beta,
    }),
  };

  private static cracoConfigSha = '4a8ecfec7b70da88a0849b7b0163808b2cc46eee08c9ab599c8aa3525ff01546';

  private static pluginBuilderScripts = ['flex-plugin-scripts', 'flex-plugin'];

  private prints;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, {});

    this.prints = this._prints.upgradePlugin;
  }

  /**
   * @override
   */
  async doRun() {
    await this.prints.upgradeNotification();

    if (this.pkgVersion === 1) {
      await this.upgradeFromV1();
      return;
    }

    if (this.pkgVersion === 2) {
      await this.upgradeFromV2();
      return;
    }

    if (this.pkgVersion === 3) {
      await this.upgradeFromV3();
      return;
    }

    this.prints.notAvailable(this.pkgVersion);
    this.exit(1);
  }

  /**
   * Upgrade from v1 to v4
   */
  async upgradeFromV1() {
    this.prints.scriptStarted('v1');

    const depsToAdd: DependencyUpdates = {
      remove: ['react-app-rewire-flex-plugin', 'react-app-rewired', 'react-scripts'],
      deps: {
        'flex-plugin': '*',
        'react-emotion': '9.2.6',
      },
      devDeps: {
        'flex-plugin-scripts': '*',
        '@twilio/flex-ui': '^1',
        'babel-polyfill': '*',
        enzyme: '*',
        'enzyme-adapter-react-16': '*',
      },
    };

    await this.cleanupScaffold();
    await this.updatePackageJson(depsToAdd, (pkg) => {
      pkg.scripts.bootstrap = 'flex-plugin check-start';
      pkg.scripts.postinstall = 'npm run bootstrap';
      delete pkg['config-overrides-path'];

      return pkg;
    });
    await this.removePackageScripts([
      { name: 'build', it: 'react-app-rewired build' },
      { name: 'eject', it: 'react-app-rewired eject' },
      { name: 'start', it: 'react-app-rewired start', pre: 'flex-check-start' },
      { name: 'test', it: 'react-app-rewired test --env=jsdom' },
    ]);
    await this.npmInstall();

    this.prints.scriptSucceeded(!this._flags.install);
  }

  /**
   * Upgrade from v2 to v4
   */
  async upgradeFromV2() {
    this.prints.scriptStarted('v2');

    const depsToAdd: DependencyUpdates = {
      remove: ['@craco/craco', 'craco-config-flex-plugin', 'core-j', 'react-test-renderer', 'react-scripts'],
      deps: {
        'flex-plugin': '*',
        'react-emotion': '9.2.6',
      },
      devDeps: {
        'flex-plugin-scripts': '*',
        '@twilio/flex-ui': '^1',
        'babel-polyfill': '*',
        enzyme: '*',
        'enzyme-adapter-react-16': '*',
      },
    };

    await this.cleanupScaffold();
    await this.updatePackageJson(depsToAdd, (pkg) => {
      pkg.scripts.bootstrap = 'flex-plugin check-start';
      pkg.scripts.postinstall = 'npm run bootstrap';
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
    await this.npmInstall();

    this.prints.scriptSucceeded(!this._flags.install);
  }

  /**
   * Upgrade from v3 to v4
   */
  async upgradeFromV3() {
    this.prints.scriptStarted('v3');

    const depsToAdd: DependencyUpdates = {
      remove: ['craco-config-flex-plugin', 'react-scripts', 'rimraf', 'flex-plugin-scripts'],
      deps: {
        'flex-plugin': '*',
      },
      devDeps: {
        'flex-plugin-scripts': '*',
        '@twilio/flex-ui': '^1',
      },
    };

    await this.cleanupScaffold();
    await this.updatePackageJson(depsToAdd);
    await this.removePackageScripts([
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
    await this.npmInstall();

    this.prints.scriptSucceeded(!this._flags.install);
  }

  /**
   * Removes craco.config.js file
   */
  async cleanupScaffold() {
    await progress('Cleaning up the scaffold', async () => {
      let warningLogged = false;

      if (fileExists(this.cwd, 'craco.config.js')) {
        const sha = await calculateSha256(this.cwd, 'craco.config.js');
        if (sha === FlexPluginsUpgradePlugin.cracoConfigSha) {
          removeFile(this.cwd, 'craco.config.js');
        } else {
          this.prints.cannotRemoveCraco(!warningLogged);
          warningLogged = true;
        }
      }

      const publicFiles = ['index.html', 'pluginsService.js', 'plugins.json', 'plugins.local.build.json'];
      publicFiles.forEach((file) => {
        if (fileExists(this.cwd, 'public', file)) {
          removeFile(this.cwd, 'public', file);
        }
      });

      copyFile(
        [require.resolve('create-flex-plugin'), '..', '..', 'templates', 'core', 'public', 'appConfig.example.js'],
        [this.cwd, 'public', 'appConfig.example.js'],
      );

      if (fileExists(this.cwd, 'public', 'appConfig.js')) {
        const newLines: string[] = [];
        const ignoreLines = [
          '// set to /plugins.json for local dev',
          '// set to /plugins.local.build.json for testing your build',
          '// set to "" for the default live plugin loader',
        ];
        readFile(this.cwd, 'public', 'appConfig.js')
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

        writeFile(newLines.join('\n'), this.cwd, 'public', 'appConfig.js');
      }
    });
  }

  /**
   * Updates the package json by removing the provided list and updating the version to the latest from the given list.
   * Provide the list as key:value. If value is *, then script will find the latest available version.
   * @param dependencies  the list of dependencies to modify - can also be used to update to the latest
   * @param custom        a custom callback for modifying package.json
   */
  async updatePackageJson(dependencies: DependencyUpdates, custom?: PkgCallback) {
    await progress('Updating package dependencies', async () => {
      const { pkg } = this;
      dependencies.remove.forEach((name) => delete pkg.dependencies[name]);
      dependencies.remove.forEach((name) => delete pkg.devDependencies[name]);
      const { beta } = this._flags;

      const addDep = async (deps: Record<string, string>, record: Record<string, string>) => {
        for (const dep in deps) {
          if (deps.hasOwnProperty(dep)) {
            // If we have provided a specific version, use that
            if (deps[dep] !== '*') {
              record[dep] = deps[dep];
              continue;
            }

            // Now find the latest
            const option =
              FlexPluginsUpgradePlugin.pluginBuilderScripts.includes(dep) && beta ? { version: 'next' } : {};
            const scriptPkg = await packageJson(dep, option);
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

      writeJSONFile(pkg, this.cwd, 'package.json');
    });
  }

  /**
   * Removes scripts from the package.json
   * @param scripts the scripts remove
   */
  async removePackageScripts(scripts: ScriptsToRemove[]) {
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

      writeJSONFile(pkg, this.cwd, 'package.json');
    });
  }

  /**
   * Runs npm install if flag is set
   */
  async npmInstall() {
    if (!this._flags.install) {
      return;
    }

    await progress('Installing dependencies', async () => {
      const { exitCode, stderr } = await spawn('npm', [
        'install',
        '--no-fund',
        '--no-audit',
        '--no-progress',
        '--silent',
      ]);
      if (exitCode || stderr) {
        this._logger.error(stderr);
        this.exit(1);
      }
    });
  }

  /**
   * Returns the flex-plugin-scripts version from the plugin
   */
  get pkgVersion() {
    const pkg =
      this.pkg.dependencies['flex-plugin-scripts'] ||
      this.pkg.devDependencies['flex-plugin-scripts'] ||
      this.pkg.dependencies['flex-plugin'] ||
      this.pkg.devDependencies['flex-plugin'];
    if (!pkg) {
      throw new TwilioCliError("Package 'flex-plugin-scripts' was not found");
    }

    return semver.coerce(pkg)?.major;
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsUpgradePlugin).flags;
  }
}
