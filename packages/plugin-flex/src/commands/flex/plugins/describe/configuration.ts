import { flags } from '@oclif/command';
import { DescribeConfiguration } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsDescribeConfiguration extends InformationFlexPlugin<DescribeConfiguration> {
  static description = createDescription('Describes a release', false);

  static flags = {
    ...FlexPlugin.flags,
    version: flags.string({
      required: true,
      description: 'The configuration version to describe',
    }),
  };

  async getResource() {
    return this.pluginsApiToolkit.describeConfiguration({ version: this._flags.version });
  }

  notFound(): void {
    this._logger.info(`!!Configuration **${this._flags.version}** was not found.!!`);
  }

  get _flags() {
    return this.parse(FlexPluginsDescribeConfiguration).flags;
  }

  print(configuration: DescribeConfiguration): void {
    this.printHeader('SID', configuration.sid);
    this.printHeader('Version', configuration.version);
    this.printHeader('Status', configuration.isActive ? 'Active' : 'Inactive');
    this.printHeader('Description', configuration.description);
    this.printHeader('Created', this.parseDate(configuration.dateCreated));
    this._logger.newline();

    this.printHeader('Plugins');
    configuration.plugins.forEach((plugin) => {
      this.printVersion(plugin.name);
      this.printPretty(plugin, 'version', 'name');
      this._logger.newline();
    });
  }
}
