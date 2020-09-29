import { flags } from '@oclif/command';
import { DescribePluginVersion } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import { describePluginVersion as describePluginVersionDocs } from '../../../../commandDocs.json';

/**
 * Describes Flex Plugin Version
 */
export default class FlexPluginsDescribePluginVersion extends InformationFlexPlugin<DescribePluginVersion> {
  static description = createDescription(describePluginVersionDocs.description, false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      description: describePluginVersionDocs.flags.name,
      required: true,
    }),
    version: flags.string({
      description: describePluginVersionDocs.flags.version,
      required: true,
    }),
  };

  /**
   * @override
   */
  async getResource() {
    const { name, version } = this._flags;
    return this.pluginsApiToolkit.describePluginVersion({ name, version });
  }

  /**
   * @override
   */
  notFound() {
    const { name, version } = this._flags;
    this._logger.info(`!!Plugin **${name}@${version}** was not found.!!`);
  }

  /**
   * @override
   */
  print(version: DescribePluginVersion) {
    this.printHeader('SID', version.sid);
    this.printHeader('Plugin SID', version.plugin.sid);
    this.printHeader('Name', version.plugin.name);
    this.printHeader('Version', version.version);
    this.printHeader('Friendly Name', version.plugin.friendlyName);
    this.printHeader('Description', version.plugin.description);
    this.printHeader('Status', version.isActive);
    this.printHeader('Url', version.url);
    this.printHeader('Changelog', version.changelog);
    this.printHeader('Private', version.isPrivate);
    this.printHeader('Created', version.dateCreated);
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsDescribePluginVersion).flags;
  }
}
