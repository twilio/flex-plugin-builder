import { progress } from 'flex-plugins-utils-logger';
import { CreateConfigurationOption } from 'flex-plugins-api-toolkit';
import dayjs from 'dayjs';
import { IOptionFlag } from '@oclif/command/lib/flags';

import * as flags from '../utils/flags';
import FlexPlugin, { FlexPluginFlags } from './flex-plugin';
import { createConfiguration as createConfigurationDocs } from '../commandDocs.json';

type Required = { required: true };
type Multiple = { multiple: true };

export interface CreateConfigurationFlags extends FlexPluginFlags {
  new: boolean;
  name?: string;
  plugin?: string[];
  description?: string;
}

export const nameFlag = {
  description: createConfigurationDocs.flags.name,
  default: dayjs().format('MMM D, YYYY'),
  required: true,
  max: 100,
};

export const pluginFlag: Partial<IOptionFlag<string[]>> & Required & Multiple = {
  description: createConfigurationDocs.flags.plugin,
  multiple: true,
  required: true,
};

export const descriptionFlag = {
  description: createConfigurationDocs.flags.description,
  default: createConfigurationDocs.defaults.description,
  required: true,
  max: 500,
};

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Creates a Configuration
 */
export default abstract class CreateConfiguration extends FlexPlugin {
  static flags = {
    ...baseFlags,
    new: flags.boolean({
      description: createConfigurationDocs.flags.new,
    }),
    name: flags.string(nameFlag),
    plugin: flags.string(pluginFlag),
    description: flags.string(descriptionFlag),
  };

  /**
   * Performs the actual task of validating and creating configuration. This method is also usd by release script.
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
      name: this._flags.name as string,
      addPlugins: this._flags.plugin as string[],
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
