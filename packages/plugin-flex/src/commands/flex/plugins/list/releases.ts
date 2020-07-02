import { ListReleases } from 'flex-plugins-api-toolkit/dist/scripts';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListReleases[]> {
  static description = createDescription('Lists the releases on the account', false);

  async getResource() {
    return this.pluginsApiToolkit.listReleases({});
  }

  notFound() {
    this._logger.info(`!!No releases where not found.!!`);
  }

  print(releases: ListReleases[]) {
    releases.forEach((release) => {
      this.printVersion(release.sid);
      this.printPretty(release);
      this._logger.newline();
    });
  }
}
