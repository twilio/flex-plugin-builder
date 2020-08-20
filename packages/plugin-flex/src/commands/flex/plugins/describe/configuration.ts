import { flags } from '@oclif/command';
import { DescribeConfiguration } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import { describeConfiguration as describeConfigurationDocs } from '../../../../commandDocs.json';

/**
 * Describes the Flex Plugin Configuration
 */
export default class FlexPluginsDescribeConfiguration extends InformationFlexPlugin<DescribeConfiguration> {
  static description = createDescription(describeConfigurationDocs.description, false);

  static flags = {
    ...FlexPlugin.flags,
    sid: flags.string({
      description: describeConfigurationDocs.flags.sid,
      required: true,
    }),
  };

  /**
   * @override
   */
  async getResource() {
    return this.pluginsApiToolkit.describeConfiguration({ sid: this._flags.sid });
  }

  /**
   * @override
   */
  notFound() {
    this._logger.info(`!!Configuration **${this._flags.sid}** was not found.!!`);
  }

  /**
   * @override
   */
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

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsDescribeConfiguration).flags;
  }
}
