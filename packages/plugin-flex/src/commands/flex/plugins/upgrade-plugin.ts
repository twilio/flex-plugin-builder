import semver from 'semver';
import packageJson from 'package-json';
import { progress } from 'flex-plugins-utils-logger';
import { flags } from '@oclif/parser';
import spawn from 'flex-plugins-utils-spawn';

import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
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

    if (this.pkgVersion === 3) {
      await this.upgradeFromV3();
      return;
    }

    this.prints.notAvailable(this.pkgVersion);
    this.exit(1);
  }

  /**
   * Upgrade from v3 to v4
   */
  async upgradeFromV3() {
    this.prints.scriptStarted();

    await this.cleanupScaffold();
    await this.updatePackageJson(
      ['craco-config-flex-plugin', 'react-scripts'],
      ['flex-plugin'],
      ['flex-plugin-scripts', '@twilio/flex-ui'],
    );
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
   * Updates the package json by removing the provided list and updating the version to the latest from the given list
   * @param remove  the list of dependencies to remove
   * @param addDeps     the list of dependencies to add - can also be used to update to the latest
   * @param addDevs     the list of devDependencies to add - can also be used to update to the latest
   */
  async updatePackageJson(remove: string[], addDeps: string[], addDevs: string[]) {
    await progress('Updating package dependencies', async () => {
      const { pkg } = this;
      remove.forEach((name) => delete pkg.dependencies[name]);

      const add = async (deps: string[], record: Record<string, string>) => {
        for (const dep of deps) {
          const option =
            FlexPluginsUpgradePlugin.pluginBuilderScripts.includes(dep) && this._flags.beta ? { version: 'next' } : {};
          const scriptPkg = await packageJson(dep, option);
          if (!scriptPkg) {
            this.prints.packageNotFound(dep);
            this.exit(1);
            return;
          }

          record[dep] = scriptPkg.version as string;
        }
      };
      await add(addDeps, pkg.dependencies);
      await add(addDevs, pkg.devDependencies);
      delete pkg.dependencies['flex-plugin-scripts'];

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
    let pluginScript = this.pkg.dependencies['flex-plugin-scripts'];
    if (!pluginScript) {
      pluginScript = this.pkg.devDependencies['flex-plugin-scripts'];
    }
    if (!pluginScript) {
      throw new TwilioCliError("Package 'flex-plugin-scripts' was not found");
    }

    return semver.coerce(pluginScript)?.major;
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsUpgradePlugin).flags;
  }
}
