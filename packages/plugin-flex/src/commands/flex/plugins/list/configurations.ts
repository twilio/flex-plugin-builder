import { ListConfigurations } from 'flex-plugins-api-toolkit/dist/scripts';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

export default class FlexPluginsListConfigurations extends InformationFlexPlugin<ListConfigurations[]> {
  static description = createDescription('Lists the configurations on the account', false);

  /**
   * @override
   */
  async getResource() {
    return this.pluginsApiToolkit.listConfigurations({});
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
      this.printVersion(configuration.version, configuration.isActive ? '(Active)' : '');
      this.printPretty(configuration, 'version', 'isActive');
      this._logger.newline();
    });
  }
}
