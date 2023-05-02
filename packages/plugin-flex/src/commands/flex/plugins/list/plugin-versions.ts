import { ListPluginVersions } from '@twilio/flex-plugins-api-client';
import { flags } from '@oclif/command';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

/**
 * Lists the Flex Plugin Versions
 */
export default class FlexPluginsListPluginVersions extends InformationFlexPlugin<ListPluginVersions[]> {
  static topicName = 'flex:plugins:list:plugin-versions';

  static description = createDescription(FlexPluginsListPluginVersions.topic.description, false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      description: FlexPluginsListPluginVersions.topic.flags.name,
      required: true,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsListPluginVersions.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsListPluginVersions)).flags;
  }

  /**
   * @override
   */
  async getResource(): Promise<ListPluginVersions[]> {
    const result = await this.pluginsApiToolkit.listPluginVersions({ name: this._flags.name });

    return result.plugin_versions;
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
  print(versions: ListPluginVersions[]): void {
    const list = this.sortByActive(versions);

    this.printHeader('Plugin Name', this._flags.name);
    if (list.length) {
      this.printHeader('Plugin SID', list[0].pluginSid);
    }
    this._logger.newline();

    this.printHeader('Versions');
    list.forEach((version) => {
      this.printVersion(version.version, version.isActive ? '(Active)' : '');
      this.printPretty(version, 'isActive', 'pluginSid', 'version');
      this._logger.newline();
    });
  }
}
