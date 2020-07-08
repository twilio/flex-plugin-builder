import { ListPluginVersions } from 'flex-plugins-api-toolkit/dist/scripts';
import { flags } from '@oclif/command';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

export default class FlexPluginsListPluginVersions extends InformationFlexPlugin<ListPluginVersions[]> {
  static description = createDescription('Lists the plugin versions on the account', false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      required: true,
      description: 'The plugin name to list its versions',
    }),
  };

  /**
   * @override
   */
  async getResource() {
    const result = await this.pluginsApiToolkit.listPluginVersions({ name: this._flags.name });

    return result.plugin_versions;
  }

  /**
   * @override
   */
  notFound() {
    this._logger.info(`!!Plugin **${this._flags.name}** was not found.!!`);
  }

  /**
   * @override
   */
  print(versions: ListPluginVersions[]) {
    const list = this.sortByActive(versions);

    this.printHeader('Plugin Name', this._flags.name);
    if (list.length) {
      this.printHeader('Plugin SID', list[0].pluginSid);
    }
    this._logger.newline();

    this.printHeader('Versions');
    list.forEach((version) => {
      this.printVersion(version.version, version.isActive ? '(Active)' : '');
      this.printPretty(version, 'isActive', 'pluginSid', 'version');
      this._logger.newline();
    });
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsListPluginVersions).flags;
  }
}
