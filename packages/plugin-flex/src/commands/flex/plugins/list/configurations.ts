import { ListConfigurations } from 'flex-plugins-api-toolkit/dist/scripts';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import { listConfigurations as listConfigurationsDocs } from '../../../../commandDocs.json';

/**
 * Lists the Flex Plugin Configurations
 */
export default class FlexPluginsListConfigurations extends InformationFlexPlugin<ListConfigurations[]> {
  static description = createDescription(listConfigurationsDocs.description, false);

  static flags = {
    ...InformationFlexPlugin.flags,
  };

  /**
   * @override
   */
  async getResource() {
    const result = await this.pluginsApiToolkit.listConfigurations({});

    return result.configurations;
  }

  /**
   * @override
   */
  notFound() {
    this._logger.info(`!!No configurations where not found.!!`);
  }

  /**
   * @override
   */
  print(configurations: ListConfigurations[]) {
    const list = this.sortByActive(configurations);

    list.forEach((configuration) => {
      this.printVersion(configuration.name, configuration.isActive ? '(Active)' : '');
      this.printPretty(configuration, 'name', 'isActive');
      this._logger.newline();
    });
  }
}
