import { flags } from '@oclif/command';
import { DescribePluginVersion } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsDescribePluginVersion extends InformationFlexPlugin<DescribePluginVersion> {
  static description = createDescription('Describes a plugin version', false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      required: true,
      description: 'The plugin name to describe',
    }),
    version: flags.string({
      required: true,
      description: 'The plugin version to describe',
    }),
  };

  async getResource() {
    const { name, version } = this._flags;
    return this.pluginsApiToolkit.describePluginVersion({ name, version });
  }

  notFound() {
    const { name, version } = this._flags;
    this._logger.info(`!!Plugin **${name}@${version}** was not found.!!`);
  }

  print(version: DescribePluginVersion) {
    this.printHeader('SID', version.sid);
    this.printHeader('Plugin SID', version.plugin.sid);
    this.printHeader('Name', version.plugin.name);
    this.printHeader('Version', version.version);
    this.printHeader('Friendly Name', version.plugin.friendlyName);
    this.printHeader('Description', version.plugin.description);
    this.printHeader('Status', version.isActive ? 'Active' : 'Inactive');
    this.printHeader('Url', version.url);
    this.printHeader('Changelog', version.changelog);
    this.printHeader('Private', version.isPrivate);
    this.printHeader('Created', this.parseDate(version.dateCreated));
  }

  get _flags() {
    return this.parse(FlexPluginsDescribePluginVersion).flags;
  }
}
