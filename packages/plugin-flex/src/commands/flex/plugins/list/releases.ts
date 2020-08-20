import { ListReleases } from 'flex-plugins-api-toolkit/dist/scripts';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import { listReleases as listReleasesDocs } from '../../../../commandDocs.json';

/**
 * Lists the Flex Plugin Releases
 */
export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListReleases[]> {
  static description = createDescription(listReleasesDocs.description, false);

  /**
   * @override
   */
  async getResource() {
    const result = await this.pluginsApiToolkit.listReleases({});

    return result.releases;
  }

  /**
   * @override
   */
  notFound() {
    this._logger.info(`!!No releases where not found.!!`);
  }

  /**
   * @override
   */
  print(releases: ListReleases[]) {
    releases.forEach((release) => {
      this.printVersion(release.sid);
      this.printPretty(release);
      this._logger.newline();
    });
  }
}
