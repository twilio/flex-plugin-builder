import { ListReleases } from 'flex-plugins-api-toolkit/dist/scripts';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import { listReleases as listReleasesDocs } from '../../../../commandDocs.json';

/**
 * Lists the Flex Plugin Releases
 */
export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListReleases[]> {
  static description = createDescription(listReleasesDocs.description, false);

  static flags = {
    ...InformationFlexPlugin.flags,
  };

  /**
   * @override
   */
  async getResource(): Promise<ListReleases[]> {
    const result = await this.pluginsApiToolkit.listReleases({});

    return result.releases;
  }

  /**
   * @override
   */
  notFound(): void {
    this._logger.info(`!!No releases where not found.!!`);
  }

  /**
   * @override
   */
  print(releases: ListReleases[]): void {
    releases.forEach((release) => {
      this.printVersion(release.sid);
      this.printPretty(release);
      this._logger.newline();
    });
  }
}
