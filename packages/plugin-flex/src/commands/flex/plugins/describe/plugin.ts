import { flags } from '@oclif/command';
import { DescribePlugin } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Describe the Flex Plugin
 */
export default class FlexPluginsDescribePlugin extends InformationFlexPlugin<DescribePlugin> {
  static topicName = 'flex:plugins:describe:plugin';

  static description = createDescription(FlexPluginsDescribePlugin.topic.description, false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      description: FlexPluginsDescribePlugin.topic.flags.name,
      required: true,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsDescribePlugin.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsDescribePlugin)).flags;
  }

  /**
   * @override
   */
  async getResource(): Promise<DescribePlugin> {
    return this.pluginsApiToolkit.describePlugin({ name: this._flags.name });
  }

  /**
   * @override
   */
  /* c8 ignore next */
  notFound(): void {
    this._logger.info(`!!Plugin **${this._flags.name}** was not found.!!`);
  }

  /**
   * @override
   */
  /* c8 ignore next */
  print(plugin: DescribePlugin): void {
    this.printHeader('SID', plugin.sid);
    this.printHeader('Name', plugin.name);
    this.printHeader('Status', plugin.isActive);
    this.printHeader('Friendly Name', plugin.friendlyName);
    this.printHeader('Description', plugin.description);
    this.printHeader('Created', plugin.dateCreated);
    this.printHeader('Updated', plugin.dateUpdated);
    this._logger.newline();

    this.printHeader('Versions');
    this.sortByActive(plugin.versions).forEach((version) => {
      const isActive = version.isActive ? '(Active)' : '';
      this.printVersion(version.version, isActive);
      this.printPretty(version, 'isActive');
      this._logger.newline();
    });
  }
}
