import { ListConfigurations } from '@twilio/flex-plugins-api-client';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Lists the Flex Plugin Configurations
 */
export default class FlexPluginsListConfigurations extends InformationFlexPlugin<ListConfigurations[]> {
  static topicName = 'flex:plugins:list:configurations';

  static description = createDescription(FlexPluginsListConfigurations.topic.description, false);

  static flags = {
    ...InformationFlexPlugin.flags,
  };

  /**
   * @override
   */
  async getResource(): Promise<ListConfigurations[]> {
    const result = await this.pluginsApiToolkit.listConfigurations({});

    return result.configurations;
  }

  /**
   * @override
   */
  /* c8 ignore next */
  notFound(): void {
    this._logger.info(`!!No configurations where not found.!!`);
  }

  /**
   * @override
   */
  /* c8 ignore next */
  print(configurations: ListConfigurations[]): void {
    const list = this.sortByActive(configurations);

    list.forEach((configuration) => {
      this.printVersion(configuration.name, configuration.isActive ? '(Active)' : '');
      this.printPretty(configuration, 'name', 'isActive');
      this._logger.newline();
    });
  }
}
