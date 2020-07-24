import { flags } from '@oclif/command';
import { progress } from 'flex-plugins-utils-logger';
import { CreateConfigurationOption } from 'flex-plugins-api-toolkit';
import dayjs from 'dayjs';

import FlexPlugin, { FlexPluginFlags } from './flex-plugin';

export interface CreateConfigurationFlags extends FlexPluginFlags {
  new: boolean;
  name: string;
  plugin: string[];
  description?: string;
}

/**
 * Creates a Configuration
 */
export default abstract class CreateConfiguration extends FlexPlugin {
  public static flags = {
    ...FlexPlugin.flags,
    new: flags.boolean(),
    name: flags.string({
      default: dayjs().format('MMM D, YYYY'),
    }),
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
    return progress(`Creating configuration`, async () => this.createConfiguration(), false);
  }

  /**
   * Registers a configuration with Plugins API
   * @returns {Promise}
   */
  private async createConfiguration() {
    const option: CreateConfigurationOption = {
      name: this._flags.name,
      addPlugins: this._flags.plugin,
      description: this._flags.description || '',
    };
    if (!this._flags.new) {
      option.fromConfiguration = 'active';
    }

    return this.pluginsApiToolkit.createConfiguration(option);
  }

  get _flags(): CreateConfigurationFlags {
    return this.parse(CreateConfiguration).flags;
  }
}
