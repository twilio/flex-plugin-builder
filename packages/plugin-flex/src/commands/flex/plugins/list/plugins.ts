import { ListPlugins } from 'flex-plugins-api-toolkit/dist/scripts';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListPlugins[]> {
  static description = createDescription('Lists the plugins on the account', false);

  /**
   * @override
   */
  async getResource() {
    return this.pluginsApiToolkit.listPlugins({});
  }

  /**
   * @override
   */
  notFound() {
    this._logger.info(`!!No plugins where not found.!!`);
  }

  /**
   * @override
   */
  print(plugins: ListPlugins[]) {
    const activePlugins = plugins.filter((p) => p.isActive);
    const inactivePlugins = plugins.filter((p) => !p.isActive);

    this.printHeader('Active Plugins');
    activePlugins.forEach(this._print.bind(this));
    this._logger.newline();
    this.printHeader('Inactive Plugins');
    inactivePlugins.forEach(this._print.bind(this));
  }

  private _print(plugin: ListPlugins) {
    this.printVersion(plugin.name);
    this.printPretty(plugin, 'isActive', 'name');
    this._logger.newline();
  }
}
