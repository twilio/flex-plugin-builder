import { ListPluginVersions } from 'flex-plugins-api-toolkit/dist/scripts';
import { flags } from '@oclif/command';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import { listPluginVersions as listPluginVersionsDocs } from '../../../../commandDocs.json';

/**
 * Lists the Flex Plugin Versions
 */
export default class FlexPluginsListPluginVersions extends InformationFlexPlugin<ListPluginVersions[]> {
  static description = createDescription(listPluginVersionsDocs.description, false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      description: listPluginVersionsDocs.flags.name,
      required: true,
    }),
  };

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
  /* istanbul ignore next */
  notFound(): void {
    this._logger.info(`!!Plugin **${this._flags.name}** was not found.!!`);
  }

  /**
   * @override
   */
  /* istanbul ignore next */
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

  /**
   * Parses the flags passed to this command
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsListPluginVersions.flags> {
    return this.parse(FlexPluginsListPluginVersions).flags;
  }
}
