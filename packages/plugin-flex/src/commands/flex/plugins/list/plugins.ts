import { ListPlugins } from '@twilio/flex-plugins-api-client';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Lists the Flex Plugins
 */
export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListPlugins[]> {
  static topicName = 'flex:plugins:list:plugins';

  static description = createDescription(FlexPluginsListPlugins.topic.description, false);

  static flags = {
    ...InformationFlexPlugin.flags,
  };

  /**
   * @override
   */
  async getResource(): Promise<ListPlugins[]> {
    const result = await this.pluginsApiToolkit.listPlugins({});

    return result.plugins;
  }

  /**
   * @override
   */
  /* c8 ignore next */
  notFound(): void {
    this._logger.info(`!!No plugins where not found.!!`);
  }

  /**
   * @override
   */
  /* c8 ignore next */
  print(plugins: ListPlugins[]): void {
    const activePlugins = plugins.filter((p) => p.isActive);
    const inactivePlugins = plugins.filter((p) => !p.isActive);

    this.printHeader('Active Plugins');
    activePlugins.forEach(this._print.bind(this));
    this._logger.newline();
    this.printHeader('Inactive Plugins');
    inactivePlugins.forEach(this._print.bind(this));
  }

  /* c8 ignore next */
  private _print(plugin: ListPlugins) {
    this.printVersion(plugin.name);
    this.printPretty(plugin, 'isActive', 'name');
    this._logger.newline();
  }
}
