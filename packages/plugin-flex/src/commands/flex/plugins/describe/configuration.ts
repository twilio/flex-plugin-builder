import { flags } from '@oclif/command';
import { DescribeConfiguration } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Describes the Flex Plugin Configuration
 */
export default class FlexPluginsDescribeConfiguration extends InformationFlexPlugin<DescribeConfiguration> {
  static topicName = 'flex:plugins:describe:configuration';

  static description = createDescription(FlexPluginsDescribeConfiguration.topic.description, false);

  static flags = {
    ...FlexPlugin.flags,
    sid: flags.string({
      description: FlexPluginsDescribeConfiguration.topic.flags.sid,
      required: true,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsDescribeConfiguration.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsDescribeConfiguration)).flags;
  }

  /**
   * @override
   */
  async getResource(): Promise<DescribeConfiguration> {
    return this.pluginsApiToolkit.describeConfiguration({ sid: this._flags.sid });
  }

  /**
   * @override
   */
  /* c8 ignore next */
  notFound(): void {
    this._logger.info(`!!Configuration **${this._flags.sid}** was not found.!!`);
  }

  /**
   * @override
   */
  /* c8 ignore next */
  print(configuration: DescribeConfiguration): void {
    this.printHeader('SID', configuration.sid);
    this.printHeader('Name', configuration.name);
    this.printHeader('Status', configuration.isActive);
    this.printHeader('Description', configuration.description);
    this.printHeader('Created', configuration.dateCreated);
    this._logger.newline();

    this.printHeader('Plugins');
    configuration.plugins.forEach((plugin) => {
      this.printVersion(plugin.name);
      this.printPretty(plugin, 'version', 'name');
      this._logger.newline();
    });
  }
}
