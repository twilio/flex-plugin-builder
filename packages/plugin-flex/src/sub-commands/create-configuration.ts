import { flags } from '@oclif/command';
import { progress } from 'flex-plugins-utils-logger';
import semver from 'semver';
import { CreateConfigurationOption } from 'flex-plugins-api-toolkit';

import { TwilioCliError } from '../exceptions';
import FlexPlugin, { FlexPluginFlags } from './flex-plugin';

export interface CreateConfigurationFlags extends FlexPluginFlags {
  patch: boolean;
  minor: boolean;
  major: boolean;
  version?: string;
  new: boolean;
  plugin: string[];
  description?: string;
}

/**
 * Creates a Configuration
 */
export default abstract class CreateConfiguration extends FlexPlugin {
  public static flags = {
    ...FlexPlugin.flags,
    patch: flags.boolean({
      exclusive: ['minor', 'major', 'version'],
    }),
    minor: flags.boolean({
      exclusive: ['patch', 'major', 'version'],
    }),
    major: flags.boolean({
      exclusive: ['patch', 'minor', 'version'],
    }),
    version: flags.string({
      exclusive: ['patch', 'minor', 'major'],
    }),
    new: flags.boolean(),
    plugin: flags.string({
      multiple: true,
      required: true,
      description:
        'The plugin to install, formatted as pluginName@version. Use additional --plugin to provide other plugins to install',
    }),
    description: flags.string({
      description: 'The configuration description',
    }),
  };

  /**
   * Performs the actual task of validating and creating configuration. This method is also usd by release script.
   * @returns {Promise<T>}
   */
  protected async doCreateConfiguration() {
    const version = await progress('Validating configuration', async () => this.validateVersion(), false);
    return progress(`Creating configuration **v${version}**`, async () => this.createConfiguration(version), false);
  }

  /**
   * Validates that the provided next plugin version is valid
   * @returns {Promise<void>}
   */
  private async validateVersion() {
    const configuration = await this.configurationsClient.latest();
    const currentVersion = (configuration && configuration.version) || '0.0.0';
    const nextVersion = this._flags.version || (semver.inc(currentVersion, this.bumpLevel) as string);
    if (!semver.valid(nextVersion)) {
      throw new TwilioCliError(`${nextVersion} is not a valid semver`);
    }
    if (!semver.gt(nextVersion, currentVersion)) {
      throw new TwilioCliError(`The provided version ${nextVersion} must be greater than ${currentVersion}`);
    }

    return nextVersion;
  }

  /**
   * Registers a configuration with Plugins API
   * @returns {Promise}
   */
  private async createConfiguration(version: string) {
    const option: CreateConfigurationOption = {
      version,
      addPlugins: this._flags.plugin,
      description: this._flags.description || '',
    };
    if (!this._flags.new) {
      option.fromConfiguration = 'active';
    }

    return this.pluginsApiToolkit.createConfiguration(option);
  }

  /**
   * Finds the version bump level
   * @returns {string}
   */
  get bumpLevel() {
    if (this._flags.major) {
      return 'major';
    }

    if (this._flags.minor) {
      return 'minor';
    }

    return 'patch';
  }

  get _flags(): CreateConfigurationFlags {
    return this.parse(CreateConfiguration).flags;
  }
}
