import { flags } from '@oclif/command';
import { DescribePluginVersion } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Describes Flex Plugin Version
 */
export default class FlexPluginsDescribePluginVersion extends InformationFlexPlugin<DescribePluginVersion> {
  static topicName = 'flex:plugins:describe:plugin-version';

  static description = createDescription(FlexPluginsDescribePluginVersion.topic.description, false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      description: FlexPluginsDescribePluginVersion.topic.flags.name,
      required: true,
    }),
    version: flags.string({
      description: FlexPluginsDescribePluginVersion.topic.flags.version,
      required: true,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsDescribePluginVersion.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsDescribePluginVersion)).flags;
  }

  /**
   * @override
   */
  async getResource(): Promise<DescribePluginVersion> {
    const { name, version } = this._flags;
    return this.pluginsApiToolkit.describePluginVersion({ name, version });
  }

  /**
   * @override
   */
  /* c8 ignore next */
  notFound(): void {
    const { name, version } = this._flags;
    this._logger.info(`!!Plugin **${name}@${version}** was not found.!!`);
  }

  /**
   * @override
   */
  /* c8 ignore next */
  print(version: DescribePluginVersion): void {
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
}
